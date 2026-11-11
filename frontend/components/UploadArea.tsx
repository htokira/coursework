import Image from 'next/image';
import uploadIcon from '../public/upload.png'
import noteIcon from '../public/note.png'

export default function UploadArea() {
    return (
        <section className="upload-section">
            <div className="upload-area">
                <div className="upload-icon">
                    <Image
                        src={uploadIcon}
                        alt="Upload icon"
                        placeholder="blur"/>
                </div>

                <h2>Завантажте зображення для аналізу</h2>

                <p className="upload-description">
                    Перетягніть файл у цю область або скористайтеся
                    кнопкою нижче, щоб обрати його зі свого пристрою.
                </p>

                <button type="button" className="upload-button" disabled>
                    Обрати зображення
                </button>

                <div className="upload-formats">
                    <span>JPG</span>
                    <span>JPEG</span>
                    <span>PNG</span>
                </div>
            </div>

            <div className="upload-note">
                <div className="upload-note-icon">
                    <Image
                        src={noteIcon}
                        alt="Note icon"
                        placeholder="blur"/>
                </div>

                <p>
                    Після завантаження зображення можна буде
                    переглянути його характеристики та розпочати
                    процес аналізу.
                </p>
            </div>
        </section>
    );
}