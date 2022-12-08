import express from "express";

import { IUser } from "../models/user";
import { openai } from "../utils/codex";
import { verifyUser } from "../utils/strategy";

export const codexRouter = express.Router();

codexRouter.post("/generate", verifyUser, async (req, res, next) => {
    const { description, type, context } = req.body;
    const userId = (req.user as IUser)._id;

    if (description !== undefined && type !== undefined) {
        const prompt = [
            `<|endoftext|># blank Python3 file. Each Command corresponds to a short Python code snippet.`,
            `# Command: say hello world\nprint("hello world")`,
            ``,
            `# Command: ask the user for their name\nname = input("What is your name? ")`,
            ``,
            `# Command: ask the user to enter a number\nnumber = int(input("Enter a number: "))`,
            ``,
            `# Command: generate a random number\nimport random\nnumber = random.randint(0, 100)`,
            ``,
            `# Command: check if the number is greater than 50\nif number > 50:\n    print("The number is greater than 50")`,
            ``,
            `# Command: check if roll is even\nif roll % 2 == 0:\n    print("The roll is even")`,
            ``,
            `${context && context.length > 0 ? "# Context:" + context : ""}`,
            `# Command: ${
                context && context.length > 0
                    ? "use the above code as context and  "
                    : ""
            }${description.trim()}\n`,
        ].join("\n");

        const result = await openai.createCompletion({
            model: "code-davinci-002",
            prompt: prompt,
            temperature: 0.1,
            max_tokens: 500,
            stop: ["# Command:"],
            user: userId,
        });

        if (result.data.choices && result.data.choices?.length > 0) {
            const code = result.data.choices[0].text?.trim();

            res.json({
                code: code ? `# Instructions: ${description}\n` + code : "",
                success: true,
            });
        } else {
            res.json({
                success: false,
            });
        }
    }
});
