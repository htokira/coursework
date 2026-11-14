import initialAnalyses from "../data/analyses.json";

export interface Modification {
    id: string;
    type: "copy_move" | "splicing" | "retouching" | "inpainting";
    label: string;
    confidence: number;
    description: string;

    region: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

export interface AnalysisRecord {
    id: string;
    userEmail: string;
    fileName: string;
    imageUrl: string;
    fileSize: number;
    width: number;
    height: number;
    createdAt: string;
    status: "completed";

    result: {
        verdict: "authentic" | "suspicious" | "modified";
        suspiciousScore: number;
        conclusion: string;
        modifications: Modification[];
    };
}

const STORAGE_KEY = "image_forensics_analyses";
const PENDING_IMAGE_KEY = "image_forensics_pending_image";

export interface PendingImage {
    fileName: string;
    imageUrl: string;
    fileSize: number;
    width: number;
    height: number;
}

function getDatabase(): AnalysisRecord[] {
    if (typeof window === "undefined") return [];

    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(initialAnalyses)
        );

        return initialAnalyses as AnalysisRecord[];
    }

    try {
        const parsed = JSON.parse(data);

        if (!Array.isArray(parsed)) {
            throw new Error("Invalid analyses data");
        }

        return parsed as AnalysisRecord[];
    } catch {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(initialAnalyses)
        );

        return initialAnalyses as AnalysisRecord[];
    }
}

function saveDatabase(analyses: AnalysisRecord[]) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(analyses)
    );
}

export function getAnalyses(userEmail: string): AnalysisRecord[] {
    return getDatabase()
        .filter((item) => item.userEmail === userEmail)
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );
}

export function getAnalysisById(
    id: string,
    userEmail: string
): AnalysisRecord | null {
    return getDatabase().find(
        (item) =>
            item.id === id &&
            item.userEmail === userEmail
    ) ?? null;
}

export function deleteAnalysis(
    id: string,
    userEmail: string
): void {
    const analyses = getDatabase();

    const updated = analyses.filter(
        (item) =>
            !(item.id === id && item.userEmail === userEmail)
    );

    saveDatabase(updated);
}

export function savePendingImage(image: PendingImage): void {
    localStorage.setItem(
        PENDING_IMAGE_KEY,
        JSON.stringify(image)
    );
}

export function getPendingImage(): PendingImage | null {
    const data = localStorage.getItem(PENDING_IMAGE_KEY);

    if (!data) return null;

    try {
        return JSON.parse(data) as PendingImage;
    } catch {
        localStorage.removeItem(PENDING_IMAGE_KEY);
        return null;
    }
}

export function clearPendingImage(): void {
    localStorage.removeItem(PENDING_IMAGE_KEY);
}


export function runDemoAnalysis(
    image: PendingImage,
    userEmail: string
): AnalysisRecord {
    const scenarios = [
        {
            verdict: "suspicious" as const,
            suspiciousScore: 76,
            conclusion:
                "Виявлено можливі ознаки копіювання та переміщення фрагментів зображення. Додатково зафіксовано локальні зміни текстури.",
            modifications: [
                {
                    id: "m-1",
                    type: "copy_move" as const,
                    label: "Копіювання та переміщення",
                    confidence: 91,
                    description:
                        "Виявлено ділянку з ознаками дублювання фрагмента зображення.",
                    region: {
                        x: 55,
                        y: 25,
                        width: 23,
                        height: 28,
                    },
                },
                {
                    id: "m-2",
                    type: "retouching" as const,
                    label: "Ретушування",
                    confidence: 68,
                    description:
                        "Виявлено локальні зміни текстури та деталей.",
                    region: {
                        x: 15,
                        y: 58,
                        width: 19,
                        height: 17,
                    },
                },
            ],
        },
        {
            verdict: "modified" as const,
            suspiciousScore: 93,
            conclusion:
                "Виявлено декілька областей із високими демонстраційними показниками підозрілості. Можливе поєднання фрагментів різного походження та штучне відновлення окремих ділянок.",
            modifications: [
                {
                    id: "m-3",
                    type: "splicing" as const,
                    label: "Монтаж зображення",
                    confidence: 96,
                    description:
                        "Виявлено область із ознаками поєднання фрагментів різних джерел.",
                    region: {
                        x: 38,
                        y: 15,
                        width: 34,
                        height: 34,
                    },
                },
                {
                    id: "m-4",
                    type: "inpainting" as const,
                    label: "Відновлення області",
                    confidence: 84,
                    description:
                        "Виявлено ділянку з ознаками штучного заповнення.",
                    region: {
                        x: 67,
                        y: 60,
                        width: 19,
                        height: 21,
                    },
                },
            ],
        },
        {
            verdict: "authentic" as const,
            suspiciousScore: 9,
            conclusion:
                "У межах демонстраційного дослідження не виявлено виражених ознак модифікації. Водночас відсутність таких ознак не підтверджує автентичність зображення.",
            modifications: [],
        },
    ];

    const hash = image.fileName
        .split("")
        .reduce((sum, char) => sum + char.charCodeAt(0), 0);

    const scenario = scenarios[hash % scenarios.length];

    const record: AnalysisRecord = {
        id: crypto.randomUUID(),
        userEmail,

        fileName: image.fileName,
        imageUrl: image.imageUrl,
        fileSize: image.fileSize,
        width: image.width,
        height: image.height,

        createdAt: new Date().toISOString(),
        status: "completed",

        result: {
            verdict: scenario.verdict,
            suspiciousScore: scenario.suspiciousScore,
            conclusion: scenario.conclusion,
            modifications: scenario.modifications,
        },
    };

    const analyses = getDatabase();

    analyses.push(record);
    saveDatabase(analyses);

    clearPendingImage();

    return record;
}