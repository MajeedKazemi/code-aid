import { Configuration, OpenAIApi } from "openai";

import env from "./env";

const configuration = new Configuration({
    apiKey: env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);
