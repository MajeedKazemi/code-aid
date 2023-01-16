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
            question,
        }),
    });

export const apiReplyAnswerQuestion = (
    token: string | null | undefined,
    id: string,
    prevQuestions: string,
    question: string
) =>
    fetch(env.API_URL + "/api/codex/reply-answer-question", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            id,
            prevQuestions,
            question,
        }),
    });

export const apiBreakDownTask = (
    token: string | null | undefined,
    task: string
) =>
    fetch(env.API_URL + "/api/codex/break-down-task", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            task,
        }),
    });

export const apiHelpFixCode = (
    token: string | null | undefined,
    code: string
) =>
    fetch(env.API_URL + "/api/codex/help-fix-code", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            code,
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
            code,
        }),
    });

export const apiExplainCodeHover = (
    token: string | null | undefined,
    code: string
) =>
    fetch(env.API_URL + "/api/codex/explain-code-hover", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            code,
        }),
    });

export const apiQuestionFromCode = (
    token: string | null | undefined,
    code: string,
    question: string
) =>
    fetch(env.API_URL + "/api/codex/question-from-code", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            code,
            question,
        }),
    });

export const apiKeywordUsageExample = (
    token: string | null | undefined,
    keyword: string
) =>
    fetch(env.API_URL + "/api/codex/keyword-usage-example", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            keyword,
        }),
    });

export const apiRecentResponses = (token: string | null | undefined) =>
    fetch(env.API_URL + "/api/responses/latest", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

export const apiSetFeedback = (
    token: string | null | undefined,
    responseId: string,
    followUpId: string | null,
    rating: number,
    reason: string
) =>
    fetch(env.API_URL + "/api/responses/set-feedback", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            followUpId,
            responseId,
            rating,
            reason,
        }),
    });

export const apiCheckCanUseToolbox = (token: string | null | undefined) =>
    fetch(env.API_URL + "/api/responses/can-use-toolbox", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
