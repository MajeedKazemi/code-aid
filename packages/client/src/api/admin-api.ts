import env from "../utils/env";

export const apiGetActiveUsers = (
    token: string | null | undefined,
    hours: number
) =>
    fetch(env.API_URL + `/api/admin/active-users/${hours}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

export const apiGetRecentResponses = (
    token: string | null | undefined,
    limit: number
) =>
    fetch(env.API_URL + `/api/admin/recent-responses/${limit}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

export const apiGetResponseCount = (token: string | null | undefined) =>
    fetch(env.API_URL + `/api/admin/response-count`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

export const apiGetResponseAverage = (token: string | null | undefined) =>
    fetch(env.API_URL + `/api/admin/response-average`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

export const apiGetRecentResponsesWithPositiveFeedback = (
    token: string | null | undefined
) =>
    fetch(env.API_URL + `/api/admin/recent-positive-feedback`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

export const apiGetRecentResponsesWithNegativeFeedback = (
    token: string | null | undefined
) =>
    fetch(env.API_URL + `/api/admin/recent-negative-feedback`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

export const apiGetResponseCountHistogram = (
    token: string | null | undefined
) =>
    fetch(env.API_URL + `/api/admin/response-count-histogram`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
