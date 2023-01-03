import env from "../utils/env";

export const authRefresh = () =>
    fetch(env.API_URL + "/api/auth/refreshToken", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });

export const authLogin = (username: string, password: string) =>
    fetch(env.API_URL + "/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

export const authLogout = (token: string | null | undefined) =>
    fetch(env.API_URL + "/api/auth/logout", {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

export const authSignup = (
    username: string,
    password: string,
    firstName: string,
    lastName: string
) =>
    fetch(env.API_URL + "/api/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            firstName,
            lastName,
            username,
            password,
        }),
    });

export const apiGenerateCodex = (
    token: string | null | undefined,
    description: string,
    context: string
) =>
    fetch(env.API_URL + "/api/codex/generate", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            description: description,
            type: "block",
            context: context,
        }),
    });

export const apiAnswerQuestion = (
    token: string | null | undefined,
    question: string
) =>
    fetch(env.API_URL + "/api/codex/answer-question", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            question: question,
        }),
    });

export const apiAnswerQuestionFromCode = (
    token: string | null | undefined,
    question: string,
    code: string
) =>
    fetch(env.API_URL + "/api/codex/answer-question-from-code", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            question: question,
            code: code,
        }),
    });

export const apiAnswerQuestionV2 = (
    token: string | null | undefined,
    question: string
) =>
    fetch(env.API_URL + "/api/codex/answer-question-v2", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            question: question,
        }),
    });

export const apiExplainCode = (
    token: string | null | undefined,
    code: string
) =>
    fetch(env.API_URL + "/api/codex/explain-code", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            code: code,
        }),
    });
