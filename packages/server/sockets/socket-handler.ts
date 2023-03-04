import * as http from "http";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";

import {
    mainAskFromCode,
    replyAskFromCode,
    suggestAskFromCode,
} from "../codex-prompts/ask-from-code-prompt";
import {
    mainAskQuestion,
    replyAskQuestion,
    suggestAskQuestion,
} from "../codex-prompts/ask-question-prompt";
import { codeToPseudocode } from "../codex-prompts/code-to-pseudocode";
import {
    mainExplainCode,
    replyExplainCode,
    suggestExplainCode,
} from "../codex-prompts/explain-code-prompt";
import { formatCode, removeComments } from "../codex-prompts/shared/agents";
import {
    mainWriteCode,
    replyWriteCode,
    suggestWriteCode,
} from "../codex-prompts/write-code-prompt";
import { ResponseModel } from "../models/response";
import { IUser, UserModel } from "../models/user";
import { openai } from "../utils/codex";
import env from "../utils/env";

export let socket: Server;

export const initializeSocket = (server: http.Server) => {
    socket = new Server(server, {
        cors: {
            origin: env.WHITELISTED_DOMAINS.split(",").map((d) => d.trim()),
            credentials: true,
        },
    });

    socket.use((socket: Socket, next) => {
        // Upgrade the request to get the bearer token from the header
        const req = socket.request as any;
        const token = req._query.token;

        if (!token) {
            return next(new Error("Authorization header not found"));
        }

        jwt.verify(token, env.JWT_SECRET, (err: any, decoded: any) => {
            if (err) {
                return next(err);
            } else {
                UserModel.findById(decoded._id, (err: any, user: any) => {
                    if (err) {
                        return next(err);
                    } else if (user) {
                        req.user = user;

                        return next();
                    } else {
                        return next(new Error("User doesn't exist"));
                    }
                });

                socket.on("codex", async ({ from, type, id, data, userId }) => {
                    const user = (await UserModel.findById(userId)) as IUser;

                    switch (type) {
                        case "ask-question":
                            askQuestion(from, id, data.question, user);

                            break;

                        case "ask-question-reply":
                            askQuestionReply(
                                from,
                                id,
                                data.mainId,
                                data.question,
                                user
                            );

                            break;

                        case "ask-question-from-code":
                            askQuestionFromCode(
                                from,
                                id,
                                data.question,
                                data.code,
                                user
                            );

                            break;

                        case "ask-question-from-code-reply":
                            askQuestionFromCodeReply(
                                from,
                                id,
                                data.mainId,
                                data.question,
                                user
                            );

                            break;

                        case "explain-code":
                            explainCode(from, id, data.code, user);

                            break;

                        case "explain-code-reply":
                            explainCodeReply(
                                from,
                                id,
                                data.mainId,
                                data.question,
                                user
                            );

                            break;

                        case "write-code":
                            writeCode(from, id, data.question, user);

                            break;

                        case "write-code-reply":
                            writeCodeReply(
                                from,
                                id,
                                data.mainId,
                                data.question,
                                user
                            );

                            break;

                        // case "help-fix-code":
                        //     helpFixCodeSocket(
                        //         from,
                        //         componentId,
                        //         data.code,
                        //         data.intendedBehavior
                        //     );

                        //     break;

                        // case "generate-man-page":
                        //     generateManPageSocket(
                        //         from,
                        //         componentId,
                        //         data.function
                        //     );

                        //     break;
                    }
                });
            }
        });
    });

    socket.on("connection", (socket: any) => {
        console.log(
            `Socket connected with user ${socket.request.user?.username}`
        );
    });

    socket.on("disconnect", (reason: string) => {
        console.log(`Disconnected from Socket.IO server: ${reason}`);
    });

    socket.on("error", (err: Error) => {
        console.error(`Socket.IO error: ${err.message}`);
    });
};

// the same interface should be used on the client side
// TODO: add a shared package to lerna to share interfaces between client and server

interface IParsedResponse {}

export interface IParsedAskQuestionResponse {
    answer?: string;
    cLibraryFunctions?: Array<{
        name: string;
        description: string;
        include: string;
        proto: string;
    }>;
    rawCode?: string;
}

export interface IParsedExplainCodeResponse {
    explanation?: string;
    lines?: Array<{
        code: string;
        explanation: string;
    }>;
    cLibraryFunctions?: Array<{
        name: string;
        description: string;
        include: string;
        proto: string;
    }>;
}

export interface IParsedPseudoCodeResponse {
    pseudoCode?: Array<{
        title: string;
        lines: Array<{
            code: string;
            explanation: string;
        }>;
    }>;
}

interface IParsedSuggestedQuestionsResponse {
    suggestions?: Array<string>;
}

interface IResponse {
    mask: () => IResponse;
}

class IAskQuestionResponse implements IResponse {
    raw?: string;
    answer?: string;
    cLibraryFunctions?: Array<{
        name: string;
        description: string;
        include: string;
        proto: string;
    }>;
    rawCode?: string;
    codeLinesCount?: number;
    codeParts?: Array<{
        title: string;
        lines: Array<{
            code: string;
            explanation: string;
        }>;
    }>;
    suggestions?: Array<string>;

    mask() {
        return {
            answer: this.answer,
            cLibraryFunctions: this.cLibraryFunctions,
            codeLinesCount: this.codeLinesCount,
            codeParts: this.codeParts,
            suggestions: this.suggestions,
        } as IAskQuestionResponse;
    }
}

class IExplainCodeResponse implements IResponse {
    raw?: string;
    explanation?: string;
    cLibraryFunctions?: Array<{
        name: string;
        description: string;
        include: string;
        proto: string;
    }>;
    lines?: Array<{
        code: string;
        explanation: string;
    }>;
    suggestions?: Array<string>;

    mask() {
        return {
            explanation: this.explanation,
            cLibraryFunctions: this.cLibraryFunctions,
            lines: this.lines,
            suggestions: this.suggestions,
        } as IExplainCodeResponse;
    }
}

async function explainCode(
    from: string,
    responseId: string,
    code: string,
    user: IUser
) {
    const mainPrompt = mainExplainCode(formatCode(removeComments(code)));

    let res = new IExplainCodeResponse();

    await codexStreamReader(
        from,
        responseId,
        mainPrompt,
        (text: string, parsed: IParsedExplainCodeResponse) => {
            res.raw = text;
            res.explanation = parsed.explanation;
            res.cLibraryFunctions = parsed.cLibraryFunctions;
            res.lines = parsed.lines;

            return res;
        }
    );

    if (res.lines && res.lines.length > 0) {
        const suggestPrompt = suggestExplainCode(
            JSON.stringify(res.lines, null, 4)
        );

        res = await codexStreamReader(
            from,
            responseId,
            suggestPrompt,
            (text: string, parsed: IParsedSuggestedQuestionsResponse) => {
                res.suggestions = parsed.suggestions;

                return res;
            }
        );
    }

    // update db: store response for user
    const response = await ResponseModel.findById(responseId);

    if (response) {
        response.data = {
            ...response.data,
            code,
            response: res.mask(),
            raw: mainPrompt.raw(res.raw || ""),
        };

        response.finished = true;

        await response.save();
    }

    // TODO: check if this line is needed!
    // user.responses.push(savedResponse);
    // user.generating = false;
    // user.canUseToolbox = false;

    await user.save();

    // notify client: finished
    socket.to(from).emit("codex", {
        type: "done",
        componentId: responseId,
    });
}

async function writeCode(
    from: string,
    responseId: string,
    question: string,
    user: IUser
) {
    const mainPrompt = mainWriteCode(question);

    let res = new IAskQuestionResponse();

    await codexStreamReader(
        from,
        responseId,
        mainPrompt,
        (text: string, parsed: IParsedAskQuestionResponse) => {
            res.raw = text;
            res.answer = parsed.answer;
            res.cLibraryFunctions = parsed.cLibraryFunctions;
            res.rawCode = parsed.rawCode;

            if (parsed.rawCode) {
                res.codeLinesCount = parsed.rawCode.split("\n").length - 1 || 0;
            }

            return res;
        }
    );

    if (res.rawCode) {
        const pseudoPrompt = codeToPseudocode(res.rawCode);

        res = await codexStreamReader(
            from,
            responseId,
            pseudoPrompt,
            (text: string, parsed: IParsedPseudoCodeResponse) => {
                res.codeParts = parsed.pseudoCode;

                return res;
            }
        );
    }

    const suggestPrompt = suggestAskQuestion(
        question,
        JSON.stringify(res, null, 4)
    );

    res = await codexStreamReader(
        from,
        responseId,
        suggestPrompt,
        (text: string, parsed: IParsedSuggestedQuestionsResponse) => {
            res.suggestions = parsed.suggestions;

            return res;
        }
    );

    // update db: store response for user
    const response = await ResponseModel.findById(responseId);

    if (response) {
        response.data = {
            ...response.data,
            question,
            response: res.mask(),
            raw: mainPrompt.raw(res.raw || ""),
        };

        response.finished = true;

        await response.save();
    }

    // TODO: check if this line is needed!
    // user.responses.push(savedResponse);
    // user.generating = false;
    // user.canUseToolbox = false;

    await user.save();

    // notify client: finished
    socket.to(from).emit("codex", {
        type: "done",
        componentId: responseId,
    });
}

async function askQuestion(
    from: string,
    responseId: string,
    question: string,
    user: IUser
) {
    const mainPrompt = mainAskQuestion(question);

    let res = new IAskQuestionResponse();

    await codexStreamReader(
        from,
        responseId,
        mainPrompt,
        (text: string, parsed: IParsedAskQuestionResponse) => {
            res.raw = text;
            res.answer = parsed.answer;
            res.cLibraryFunctions = parsed.cLibraryFunctions;
            res.rawCode = parsed.rawCode;

            if (parsed.rawCode) {
                res.codeLinesCount = parsed.rawCode.split("\n").length - 1 || 0;
            }

            return res;
        }
    );

    if (res.rawCode) {
        const pseudoPrompt = codeToPseudocode(res.rawCode);

        res = await codexStreamReader(
            from,
            responseId,
            pseudoPrompt,
            (text: string, parsed: IParsedPseudoCodeResponse) => {
                res.codeParts = parsed.pseudoCode;

                return res;
            }
        );
    }

    const suggestPrompt = suggestAskQuestion(
        question,
        JSON.stringify(res, null, 4)
    );

    res = await codexStreamReader(
        from,
        responseId,
        suggestPrompt,
        (text: string, parsed: IParsedSuggestedQuestionsResponse) => {
            res.suggestions = parsed.suggestions;

            return res;
        }
    );

    // update db: store response for user
    const response = await ResponseModel.findById(responseId);

    if (response) {
        response.data = {
            ...response.data,
            question,
            response: res.mask(),
            raw: mainPrompt.raw(res.raw || ""),
        };

        response.finished = true;

        await response.save();
    }

    // TODO: check if this line is needed!
    // user.responses.push(savedResponse);
    // user.generating = false;
    // user.canUseToolbox = false;

    await user.save();

    // notify client: finished
    socket.to(from).emit("codex", {
        type: "done",
        componentId: responseId,
    });
}

async function askQuestionReply(
    from: string,
    replyId: string,
    responseId: string,
    question: string,
    user: IUser
) {
    const r = await ResponseModel.findById(responseId);

    if (r) {
        const replyPrompt = replyAskQuestion(
            [
                r.data.raw,
                ...r.followUps
                    .filter((fu) => fu.raw && fu.raw.length > 0)
                    .map((fu) => fu.raw),
            ],
            question
        );

        let res = new IAskQuestionResponse();

        await codexStreamReader(
            from,
            replyId,
            replyPrompt,
            (text: string, parsed: IParsedAskQuestionResponse) => {
                res.raw = text;
                res.answer = parsed.answer;
                res.cLibraryFunctions = parsed.cLibraryFunctions;
                res.rawCode = parsed.rawCode;

                if (parsed.rawCode) {
                    res.codeLinesCount =
                        parsed.rawCode.split("\n").length - 1 || 0;
                }

                return res;
            }
        );

        if (res.rawCode) {
            const pseudoPrompt = codeToPseudocode(res.rawCode);

            res = await codexStreamReader(
                from,
                replyId,
                pseudoPrompt,
                (text: string, parsed: IParsedPseudoCodeResponse) => {
                    res.codeParts = parsed.pseudoCode;

                    return res;
                }
            );
        }

        const suggestPrompt = suggestAskQuestion(
            question,
            JSON.stringify(res, null, 4)
        );

        res = await codexStreamReader(
            from,
            replyId,
            suggestPrompt,
            (text: string, parsed: IParsedSuggestedQuestionsResponse) => {
                res.suggestions = parsed.suggestions;

                return res;
            }
        );

        const followUps = r.followUps;

        const followUpIndex = followUps.findIndex((f) => f.id === replyId);

        if (followUpIndex !== -1) {
            followUps[followUpIndex] = {
                ...followUps[followUpIndex],
                time: new Date(),
                raw: replyPrompt.raw(res.raw || ""),
                question,
                response: res.mask(),
                finished: true,
            };
        }

        r.followUps = followUps;
        r.save();

        // user.canUseToolbox = false;
        await user.save();

        // notify client: finished
        socket.to(from).emit("codex", {
            type: "done",
            componentId: replyId,
        });
    }
}

async function writeCodeReply(
    from: string,
    replyId: string,
    responseId: string,
    question: string,
    user: IUser
) {
    const r = await ResponseModel.findById(responseId);

    if (r) {
        const replyPrompt = replyWriteCode(
            [
                r.data.raw,
                ...r.followUps
                    .filter((fu) => fu.raw && fu.raw.length > 0)
                    .map((fu) => fu.raw),
            ],
            question
        );

        let res = new IAskQuestionResponse();

        await codexStreamReader(
            from,
            replyId,
            replyPrompt,
            (text: string, parsed: IParsedAskQuestionResponse) => {
                res.raw = text;
                res.answer = parsed.answer;
                res.cLibraryFunctions = parsed.cLibraryFunctions;
                res.rawCode = parsed.rawCode;

                if (parsed.rawCode) {
                    res.codeLinesCount =
                        parsed.rawCode.split("\n").length - 1 || 0;
                }

                return res;
            }
        );

        if (res.rawCode) {
            const pseudoPrompt = codeToPseudocode(res.rawCode);

            res = await codexStreamReader(
                from,
                replyId,
                pseudoPrompt,
                (text: string, parsed: IParsedPseudoCodeResponse) => {
                    res.codeParts = parsed.pseudoCode;

                    return res;
                }
            );
        }

        const suggestPrompt = suggestWriteCode(
            question,
            JSON.stringify(res, null, 4)
        );

        res = await codexStreamReader(
            from,
            replyId,
            suggestPrompt,
            (text: string, parsed: IParsedSuggestedQuestionsResponse) => {
                res.suggestions = parsed.suggestions;

                return res;
            }
        );

        const followUps = r.followUps;

        const followUpIndex = followUps.findIndex((f) => f.id === replyId);

        if (followUpIndex !== -1) {
            followUps[followUpIndex] = {
                ...followUps[followUpIndex],
                time: new Date(),
                raw: replyPrompt.raw(res.raw || ""),
                question,
                response: res.mask(),
                finished: true,
            };
        }

        r.followUps = followUps;
        r.save();

        // user.canUseToolbox = false;
        await user.save();

        // notify client: finished
        socket.to(from).emit("codex", {
            type: "done",
            componentId: replyId,
        });
    }
}

async function askQuestionFromCodeReply(
    from: string,
    replyId: string,
    responseId: string,
    question: string,
    user: IUser
) {
    const r = await ResponseModel.findById(responseId);

    if (r) {
        const replyPrompt = replyAskFromCode(
            r?.data.code,
            [
                r.data.raw,
                ...r.followUps
                    .filter((fu) => fu.raw && fu.raw.length > 0)
                    .map((fu) => fu.raw),
            ],
            question
        );

        let res = new IAskQuestionResponse();

        await codexStreamReader(
            from,
            replyId,
            replyPrompt,
            (text: string, parsed: IParsedAskQuestionResponse) => {
                res.raw = text;
                res.answer = parsed.answer;
                res.cLibraryFunctions = parsed.cLibraryFunctions;
                res.rawCode = parsed.rawCode;

                if (parsed.rawCode) {
                    res.codeLinesCount =
                        parsed.rawCode.split("\n").length - 1 || 0;
                }

                return res;
            }
        );

        if (res.rawCode) {
            const pseudoPrompt = codeToPseudocode(res.rawCode);

            res = await codexStreamReader(
                from,
                replyId,
                pseudoPrompt,
                (text: string, parsed: IParsedPseudoCodeResponse) => {
                    res.codeParts = parsed.pseudoCode;

                    return res;
                }
            );
        }

        const suggestPrompt = suggestAskFromCode(
            r?.data.code,
            question,
            JSON.stringify(res, null, 4)
        );

        res = await codexStreamReader(
            from,
            replyId,
            suggestPrompt,
            (text: string, parsed: IParsedSuggestedQuestionsResponse) => {
                res.suggestions = parsed.suggestions;

                return res;
            }
        );

        const followUps = r.followUps;

        const followUpIndex = followUps.findIndex((f) => f.id === replyId);

        if (followUpIndex !== -1) {
            followUps[followUpIndex] = {
                ...followUps[followUpIndex],
                time: new Date(),
                raw: replyPrompt.raw(res.raw || ""),
                question,
                response: res.mask(),
                finished: true,
            };
        }

        r.followUps = followUps;
        r.save();

        // user.canUseToolbox = false;
        await user.save();

        // notify client: finished
        socket.to(from).emit("codex", {
            type: "done",
            componentId: replyId,
        });
    }
}

async function explainCodeReply(
    from: string,
    replyId: string,
    responseId: string,
    question: string,
    user: IUser
) {
    const r = await ResponseModel.findById(responseId);

    if (r) {
        const replyPrompt = replyExplainCode(
            r?.data.code,
            r.followUps
                .filter((fu) => fu.raw && fu.raw.length > 0)
                .map((fu) => fu.raw || ""),
            question
        );

        let res = new IAskQuestionResponse();

        await codexStreamReader(
            from,
            replyId,
            replyPrompt,
            (text: string, parsed: IParsedAskQuestionResponse) => {
                res.raw = text;
                res.answer = parsed.answer;
                res.cLibraryFunctions = parsed.cLibraryFunctions;
                res.rawCode = parsed.rawCode;

                if (parsed.rawCode) {
                    res.codeLinesCount =
                        parsed.rawCode.split("\n").length - 1 || 0;
                }

                return res;
            }
        );

        if (res.rawCode) {
            const pseudoPrompt = codeToPseudocode(res.rawCode);

            res = await codexStreamReader(
                from,
                replyId,
                pseudoPrompt,
                (text: string, parsed: IParsedPseudoCodeResponse) => {
                    res.codeParts = parsed.pseudoCode;

                    return res;
                }
            );
        }

        const suggestPrompt = suggestExplainCode(JSON.stringify(res, null, 4));

        res = await codexStreamReader(
            from,
            replyId,
            suggestPrompt,
            (text: string, parsed: IParsedSuggestedQuestionsResponse) => {
                res.suggestions = parsed.suggestions;

                return res;
            }
        );

        const followUps = r.followUps;

        const followUpIndex = followUps.findIndex((f) => f.id === replyId);

        if (followUpIndex !== -1) {
            followUps[followUpIndex] = {
                ...followUps[followUpIndex],
                time: new Date(),
                raw: replyPrompt.raw(res.raw || ""),
                question,
                response: res.mask(),
                finished: true,
            };
        }

        r.followUps = followUps;
        r.save();

        // user.canUseToolbox = false;
        await user.save();

        // notify client: finished
        socket.to(from).emit("codex", {
            type: "done",
            componentId: replyId,
        });
    }
}

async function askQuestionFromCode(
    from: string,
    responseId: string,
    question: string,
    code: string,
    user: IUser
) {
    const mainPrompt = mainAskFromCode(question, code);

    let res = new IAskQuestionResponse();

    await codexStreamReader(
        from,
        responseId,
        mainPrompt,
        (text: string, parsed: IParsedAskQuestionResponse) => {
            res.raw = text;
            res.answer = parsed.answer;
            res.cLibraryFunctions = parsed.cLibraryFunctions;
            res.rawCode = parsed.rawCode;

            if (parsed.rawCode) {
                res.codeLinesCount = parsed.rawCode.split("\n").length - 1 || 0;
            }

            return res;
        }
    );

    if (res.rawCode) {
        const pseudoPrompt = codeToPseudocode(res.rawCode);

        res = await codexStreamReader(
            from,
            responseId,
            pseudoPrompt,
            (text: string, parsed: IParsedPseudoCodeResponse) => {
                res.codeParts = parsed.pseudoCode;

                return res;
            }
        );
    }

    const suggestPrompt = suggestAskFromCode(
        code,
        question,
        JSON.stringify(res, null, 4)
    );

    res = await codexStreamReader(
        from,
        responseId,
        suggestPrompt,
        (text: string, parsed: IParsedSuggestedQuestionsResponse) => {
            res.suggestions = parsed.suggestions;

            return res;
        }
    );

    const response = await ResponseModel.findById(responseId);

    if (response) {
        response.data = {
            ...response.data,
            question,
            code,
            response: res.mask(),
            raw: mainPrompt.raw(res.raw || ""),
        };

        response.finished = true;

        await response.save();
    }

    // user.responses.push(savedResponse);
    // user.canUseToolbox = false;

    await user.save();

    // notify client: finished
    socket.to(from).emit("codex", {
        type: "done",
        componentId: responseId,
    });
}

const codexStreamReader = async (
    from: string,
    componentId: string,
    prompt: {
        model: string;
        prompt: string;
        max_tokens: number;
        temperature: number;
        parser: (response: string) => any;
    },
    filler: (text: string, next: IParsedResponse) => IResponse
) =>
    new Promise<IResponse>(async (resolve, reject) => {
        let resTxt = "";

        try {
            const res: any = await openai.createCompletion(
                {
                    model: prompt.model,
                    prompt: prompt.prompt,
                    max_tokens: prompt.max_tokens,
                    temperature: prompt.temperature,
                    stream: true,
                },
                { responseType: "stream" }
            );

            res.data.on("data", (data: any) => {
                const lines = data
                    .toString()
                    .split("\n")
                    .filter((line: string) => line.trim() !== "");

                for (const line of lines) {
                    const message = line.replace(/^data: /, "");

                    if (message === "[DONE]") {
                        resolve(filler(resTxt, prompt.parser(resTxt)));

                        return;
                    }
                    try {
                        resTxt += JSON.parse(message).choices[0].text;

                        socket.to(from).emit("codex", {
                            type: "response",
                            componentId,
                            data: filler(resTxt, prompt.parser(resTxt)).mask(),
                            from,
                        });
                    } catch (error) {
                        console.error(
                            "Could not JSON parse stream message",
                            message,
                            error
                        );
                    }
                }
            });
        } catch (error: any) {
            reject(error);
        }
    });
