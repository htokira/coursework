"use client";

import { useState, type SyntheticEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, register } from "../services/authService";

interface AuthFormProps {
    mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
    const router = useRouter();

    const isRegister = mode === "register";

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Заповніть усі обов'язкові поля.");
            return;
        }

        if (isRegister && !name.trim()) {
            setError("Введіть своє ім'я.");
            return;
        }

        if (password.length < 8) {
            setError("Пароль повинен містити щонайменше 8 символів.");
            return;
        }

        if (isRegister && password !== confirmPassword) {
            setError("Паролі не збігаються.");
            return;
        }

        try {
            if (isRegister) {
                register(name.trim(), email.trim(), password);
            } else {
                login(email.trim(), password);
            }

            router.push("/");
            router.refresh();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Сталася невідома помилка.");
            }
        }
    };

    return (
        <div className="auth-card">
            <Link href="/">
                <span className="auth-title">IMAGE MODIFICATION DETECTION</span>
            </Link>

            <div className="auth-heading">
                <h1>
                    {isRegister ? "Створення облікового запису" : "З поверненням!"}
                </h1>

                <p>
                    {isRegister
                        ? "Заповніть форму, щоб розпочати роботу із системою."
                        : "Увійдіть, щоб продовжити роботу із системою."}
                </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                {isRegister && (
                    <div className="form-group">
                        <label htmlFor="name">Ім'я</label>

                        <input
                            id="name"
                            type="text"
                            placeholder="Ваше ім'я"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            autoComplete="name"
                            required
                        />
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="email">Електронна пошта</label>

                    <input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Пароль</label>

                    <input
                        id="password"
                        type="password"
                        placeholder="Не менше 8 символів"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete={isRegister ? "new-password" : "current-password"}
                        required
                        minLength={8}
                    />
                </div>

                {isRegister && (
                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            Підтвердження пароля
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Повторіть пароль"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
                            autoComplete="new-password"
                            required
                        />
                    </div>
                )}

                {error && (
                    <div className="auth-error" role="alert">
                        {error}
                    </div>
                )}

                <button type="submit" className="auth-submit">
                    {isRegister ? "Зареєструватися" : "Увійти"}
                </button>
            </form>

            <div className="auth-switch">
                {isRegister ? (
                    <>
                        Уже маєте обліковий запис?{" "}
                        <Link href="/login">Увійти</Link>
                    </>
                ) : (
                    <>
                        Ще не маєте облікового запису?{" "}
                        <Link href="/register">Зареєструватися</Link>
                    </>
                )}
            </div>
        </div>
    );
}