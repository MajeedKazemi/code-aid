import env from "../utils/env";

export const apiGetActiveUsers = (token: string | null | undefined) =>
    fetch(env.API_URL + `/api/admin/active-users`, {
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

export const apiGetResponseTypeHistogram = (token: string | null | undefined) =>
    fetch(env.API_URL + `/api/admin/type-count-histogram`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

export const apiGetLastWeekHistogram = (token: string | null | undefined) =>
    fetch(env.API_URL + `/api/admin/last-week-histogram`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

export const apiGetAverageRatingByType = (token: string | null | undefined) =>
    fetch(env.API_URL + `/api/admin/average-rating-type`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

export const apiGetNewRandomResponseToAnalyze = (
    token: string | null | undefined,
    type: string | null,
    tag: string | null,
    timePeriod: string | null
) =>
    fetch(env.API_URL + `/api/admin/get-random-response-to-analyze`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            type,
            tag,
            timePeriod,
        }),
    });

export const apiSetResponseAnalysis = (
    token: string | null | undefined,
    responseId: string,
    likertScales: {
        relevance: number | null;
        correctness: number | null;
        helpfulness: number | null;
        directness: number | null;
    },
    notes: string
) =>
    fetch(env.API_URL + `/api/admin/set-response-analysis`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            responseId,
            likertScales,
            notes,
        }),
    });

export const apiGetLatestAnalyzedResponses = (
    token: string | null | undefined,
    skipCount: number
) =>
    fetch(
        env.API_URL + `/api/admin/get-latest-analyzed-responses/${skipCount}`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

export const apiGetResponse = (token: string | null | undefined, id: string) =>
    fetch(env.API_URL + `/api/admin/get-response/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

export const apiGetAnalyzedCount = (token: string | null | undefined) =>
    fetch(env.API_URL + `/api/admin/get-analyzed-count`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

export const apiGetAnalyzedResponsesRawData = (
    token: string | null | undefined
) =>
    fetch(env.API_URL + `/api/admin/get-analyzed-responses-raw-data`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

export const apiGetAllResponsesRawData = (token: string | null | undefined) =>
    fetch(env.API_URL + `/api/admin/get-all-responses-raw-data`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

export const apiGetStudentUsage = (token: string | null | undefined) =>
    fetch(env.API_URL + `/api/admin/get-student-usage-data`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

export const apiGetAllStudentData = (token: string | null | undefined) =>
    fetch(env.API_URL + `/api/admin/get-all-student-data`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
