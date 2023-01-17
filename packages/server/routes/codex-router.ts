import express from "express";
import { v4 as uuid } from "uuid";

import { ResponseModel } from "../models/response";
import { IUser, UserModel } from "../models/user";
import { openai } from "../utils/codex";
import { verifyUser } from "../utils/strategy";

export const codexRouter = express.Router();

codexRouter.post("/explain-code", verifyUser, async (req, res, next) => {
    const { code } = req.body;
    const userId = (req.user as IUser)._id;

    if (code !== undefined) {
        const promptExplainSteps = explainCodeStepsPrompt(code);
        const promptShortExplain = explainCodeShortPrompt(code);

        const expStepsRes = await openai.createCompletion({
            model: "code-davinci-002",
            prompt: promptExplainSteps.prompt,
            temperature: 0.3,
            max_tokens: 500,
            stop: promptExplainSteps.stopTokens,
            user: userId,
        });

        const expShortRes = await openai.createCompletion({
            model: "code-davinci-002",
            prompt: promptShortExplain.prompt,
            temperature: 0.3,
            max_tokens: 500,
            stop: promptShortExplain.stopTokens,
            user: userId,
        });

        const curUser = await UserModel.findById(userId);

        if (
            expStepsRes.data.choices &&
            expStepsRes.data.choices?.length > 0 &&
            expShortRes.data.choices &&
            expShortRes.data.choices?.length > 0
        ) {
            let expSteps = expStepsRes.data.choices[0].text?.trim();
            const steps = expSteps
                ? expSteps
                      .split("\n")
                      .map((it: string) => it.replace(/\/\/ \d+\.\s/, ""))
                : [];
            const explanation = expShortRes.data.choices[0].text?.trim();

            if (curUser) {
                const response = new ResponseModel({
                    type: "explain-code",
                    data: {
                        code,
                        explanation,
                        steps,
                    },
                });

                const savedResponse = await response.save();
                curUser.responses.push(savedResponse);
                curUser.canUseToolbox = false;
                await curUser.save();

                res.json({
                    id: savedResponse.id,
                    code,
                    explanation,
                    steps,
                    success: true,
                });
            }
        } else {
            res.json({
                success: false,
            });
        }
    }
});

codexRouter.post("/answer-question", verifyUser, async (req, res, next) => {
    const { question } = req.body;
    const userId = (req.user as IUser)._id;

    if (question !== undefined) {
        const prompt = answerQuestionPrompt(question);

        const result = await openai.createCompletion({
            model: "code-davinci-002",
            prompt: prompt.prompt,
            temperature: 0.3,
            max_tokens: 500,
            stop: prompt.stopTokens,
            user: userId,
        });

        const curUser = await UserModel.findById(userId);

        if (result.data.choices && result.data.choices?.length > 0) {
            const answer = result.data.choices[0].text?.trim() || "";
            const query = [
                `// [question]: ${question}`,
                `// [answer]: ${answer}`,
            ].join("\n");

            if (curUser) {
                const response = new ResponseModel({
                    type: "question-answer",
                    data: {
                        query,
                        question,
                        answer,
                    },
                });

                const savedResponse = await response.save();
                curUser.responses.push(savedResponse);
                curUser.canUseToolbox = false;
                await curUser.save();

                res.json({
                    query,
                    id: savedResponse.id,
                    question,
                    answer,
                    success: true,
                });
            }
        } else {
            res.json({
                success: false,
            });
        }
    }
});

codexRouter.post(
    "/reply-answer-question",
    verifyUser,
    async (req, res, next) => {
        const { id, prevQuestions, question } = req.body;
        const userId = (req.user as IUser)._id;

        if (question !== undefined) {
            const prompt = replyAnswerQuestionPrompt(prevQuestions, question);

            const result = await openai.createCompletion({
                model: "code-davinci-002",
                prompt: prompt.prompt,
                temperature: 0.3,
                max_tokens: 500,
                stop: prompt.stopTokens,
                user: userId,
            });

            if (result.data.choices && result.data.choices?.length > 0) {
                const answer = result.data.choices[0].text?.trim() || "";
                const query = [
                    ...prevQuestions.split("\n"),
                    `// [follow-up-question]: ${question}`,
                    `// [follow-up-answer]: ${answer}`,
                ].join("\n");
                const curResponse = await ResponseModel.findById(id);
                const curUser = await UserModel.findById(userId);

                const followUpId = uuid();

                if (curResponse && curUser) {
                    curResponse.followUps.push({
                        time: new Date(),
                        query,
                        id: followUpId,
                        question,
                        answer,
                    });

                    curResponse.save();

                    curUser.canUseToolbox = false;
                    await curUser.save();

                    res.json({
                        query,
                        id: followUpId,
                        question,
                        answer,
                        success: true,
                    });
                }
            } else {
                res.json({
                    success: false,
                });
            }
        }
    }
);

codexRouter.post("/break-down-task", verifyUser, async (req, res, next) => {
    const { task } = req.body;
    const userId = (req.user as IUser)._id;

    if (task !== undefined) {
        const prompt = breakDownTaskPrompt(task);

        const result = await openai.createCompletion({
            model: "code-davinci-002",
            prompt: prompt.prompt,
            temperature: 0.3,
            max_tokens: 500,
            stop: prompt.stopTokens,
            user: userId,
        });

        const curUser = await UserModel.findById(userId);

        if (result.data.choices && result.data.choices?.length > 0) {
            const answer = result.data.choices[0].text?.trim();
            const steps = answer
                ? ("// 1. " + answer)
                      .split("\n")
                      .map((it: string) => it.replace(/\/\/ \d+\.\s/, ""))
                : [];

            if (curUser) {
                const response = new ResponseModel({
                    type: "break-down-steps",
                    data: {
                        task,
                        steps,
                    },
                });

                const savedResponse = await response.save();
                curUser.responses.push(savedResponse);
                curUser.canUseToolbox = false;
                await curUser.save();

                res.json({
                    id: savedResponse.id,
                    task,
                    steps,
                    success: true,
                });
            }
        } else {
            res.json({
                success: false,
            });
        }
    }
});

codexRouter.post("/question-from-code", verifyUser, async (req, res, next) => {
    const { question, code } = req.body;
    const userId = (req.user as IUser)._id;

    if (question !== undefined && code !== undefined) {
        const prompt = questionFromCodePrompt(code, question);

        const result = await openai.createCompletion({
            model: "code-davinci-002",
            prompt: prompt.prompt,
            temperature: 0.3,
            max_tokens: 500,
            stop: prompt.stopTokens,
            user: userId,
        });

        const curUser = await UserModel.findById(userId);

        if (result.data.choices && result.data.choices?.length > 0) {
            const answer = result.data.choices[0].text?.trim() || "";

            if (curUser) {
                const response = new ResponseModel({
                    type: "question-from-code",
                    data: {
                        code,
                        question,
                        answer,
                    },
                });

                const savedResponse = await response.save();
                curUser.responses.push(savedResponse);
                curUser.canUseToolbox = false;
                await curUser.save();

                res.json({
                    id: savedResponse.id,
                    code,
                    question,
                    answer,
                    success: true,
                });
            }
        } else {
            res.json({
                success: false,
            });
        }
    }
});

codexRouter.post("/help-fix-code", verifyUser, async (req, res, next) => {
    const { code, intention } = req.body;
    const userId = (req.user as IUser)._id;

    if (code !== undefined) {
        const prompt = helpFixCodePromptV2(code, intention);

        const result = await openai.createCompletion({
            model: "code-davinci-002",
            prompt: prompt.prompt,
            temperature: 0.4,
            max_tokens: 2000,
            stop: prompt.stopTokens,
            user: userId,
        });

        const curUser = await UserModel.findById(userId);

        if (result.data.choices && result.data.choices?.length > 0) {
            const answer = result.data.choices[0].text?.trim() || "";
            const changes = answer.split("// [changes]:")[1];
            const fixes = (
                changes?.split("\n").filter((it) => it !== "") || []
            ).map((it) => {
                return it
                    .replace(/\/\/ \d+\.\s/, "")
                    .replace("[your-code]: ", "")
                    .replace("[fixed-code]: ", "-> ")
                    .trim();
            });

            if (curUser) {
                const response = new ResponseModel({
                    type: "help-fix-code",
                    data: {
                        code,
                        intention,
                        fixes,
                    },
                });
                const savedResponse = await response.save();
                curUser.responses.push(savedResponse);
                curUser.canUseToolbox = false;
                await curUser.save();

                res.json({
                    id: savedResponse.id,
                    code,
                    intention,
                    fixes,
                    success: true,
                });
            }
        } else {
            res.json({
                success: false,
            });
        }
    }
});

codexRouter.post(
    "/keyword-usage-example",
    verifyUser,
    async (req, res, next) => {
        const { keyword } = req.body;
        const userId = (req.user as IUser)._id;

        if (keyword !== undefined) {
            const prompt = generateExampleCodePrompt(keyword);

            const result = await openai.createCompletion({
                model: "code-davinci-002",
                prompt: prompt.prompt,
                temperature: 0.3,
                max_tokens: 500,
                stop: prompt.stopTokens,
                user: userId,
            });

            const curUser = await UserModel.findById(userId);

            if (result.data.choices && result.data.choices?.length > 0) {
                const answer = result.data.choices[0].text?.trim() || "";

                const [code, description] = answer.split(
                    "// [short-explanation]: "
                );

                if (curUser) {
                    const response = new ResponseModel({
                        type: "keyword-example",
                        data: {
                            keyword,
                            code,
                            description,
                        },
                    });

                    const savedResponse = await response.save();
                    curUser.responses.push(savedResponse);
                    curUser.canUseToolbox = false;
                    await curUser.save();

                    res.json({
                        id: savedResponse.id,
                        keyword,
                        code,
                        description,
                        success: true,
                    });
                }
            } else {
                res.json({
                    success: false,
                });
            }
        }
    }
);

codexRouter.post("/explain-code-hover", verifyUser, async (req, res, next) => {
    const { code } = req.body;
    const userId = (req.user as IUser)._id;

    if (code !== undefined) {
        const promptHoverExplain = explainCodeHoverPrompt(code);
        const promptSummaryExplain = explainCodeShortPrompt(code);

        const expHoverRes = await openai.createCompletion({
            model: "code-davinci-002",
            prompt: promptHoverExplain.prompt,
            temperature: 0.3,
            max_tokens: 2000,
            stop: promptHoverExplain.stopTokens,
            user: userId,
        });

        const expShortRes = await openai.createCompletion({
            model: "code-davinci-002",
            prompt: promptSummaryExplain.prompt,
            temperature: 0.3,
            max_tokens: 500,
            stop: promptSummaryExplain.stopTokens,
            user: userId,
        });

        const curUser = await UserModel.findById(userId);

        if (
            expHoverRes.data.choices &&
            expHoverRes.data.choices?.length > 0 &&
            expShortRes.data.choices &&
            expShortRes.data.choices?.length > 0
        ) {
            const explanation = expShortRes.data.choices[0].text?.trim();
            const annotatedCode =
                expHoverRes.data.choices[0].text?.trim() || "";

            const annotatedCodeLines = new Array<{
                code: string;
                explanation: string | null;
            }>();

            annotatedCode.split("\n").forEach((line) => {
                const parts = line.split("// [explain]:");

                if (parts.length == 2) {
                    annotatedCodeLines.push({
                        code: parts[0],
                        explanation: parts[1],
                    });
                } else {
                    annotatedCodeLines.push({
                        code: line,
                        explanation: null,
                    });
                }
            });

            if (curUser) {
                const response = new ResponseModel({
                    type: "explain-code-hover",
                    data: {
                        code,
                        explanation,
                        annotatedCode: annotatedCodeLines,
                    },
                });

                const savedResponse = await response.save();
                curUser.responses.push(savedResponse);
                curUser.canUseToolbox = false;
                await curUser.save();

                res.json({
                    id: savedResponse.id,
                    code,
                    explanation,
                    annotatedCode: annotatedCodeLines,
                    success: true,
                });
            }
        } else {
            res.json({
                success: false,
            });
        }
    }
});

const helpFixCodePromptV2 = (code: string, intention: string) => {
    return {
        prompt: [
            `<|endoftext|>// blank .c help fix given code. all fixes should be written in plain english without any code. Use the following format:`,
            `// [your-code]:`,
            `void invest(double* principal, double rate) { 
    principal = &principal * rate;
    
    return principal;
}`,
            `// [intention]: a function that takes in a pointer to a double and multiplies it by a rate`,
            `// [fixed-code]:`,
            `void invest(double* principal, double rate) {
    *principal = *principal * rate;
            }`,
            `// [changes]:`,
            `// 1. [your-code]: The pointer \`principal\` is not properly dereferenced (the \`&\` returns the address of a variable, not the value). [fixed-code]: This is fixed by adding the asterisk \`*\` before \`principal\`.`,
            `// 2. [your-code]: The pointer \`principal\` is not properly dereferenced when assigning the value to itself. [fixed-code]: This is fixed by adding the asterisk \`*\` before \`principal\`.`,
            `// 3. [your-code]: The function returns the value of \`principal\`, however, the function should return \`void\`. [fixed-code]: This is fixed by removing the return statement.`,
            `// [end]`,
            ``,
            ``,
            `// [your-code]:`,
            `void invest(double *principal, double rate) {
    principal *= rate;
}`,
            `// [intention]: a function that takes in a pointer to a double and multiplies it by a rate`,
            `// [fixed-code]:`,
            `void invest(double *principal, double rate) {
    *principal *= rate; // [fixed]: dereference the pointer to get the value
}`,
            `// [changes]:`,
            `// 1. [your-code]: The pointer \`principal\` is not properly dereferenced. [fixed-code]: This is fixed by adding the asterisk \`*\` before \`principal\`.`,
            `// [end]`,
            ``,
            ``,
            `// [your-code]:`,
            `void fib(int *fib_seq_ptr, int count) {
    int a[count];
    a[0] = 0;
    if (count == 1) return;
    a[1] = 1;
    if (count == 2) return;
    for (int i=2; i < count; i++) {
        a[i] = a[i-1] + a[i-2];
    }
}`,
            `// [intention]: a function that generates fibonacci sequence using dynamic memory allocation size of count. the values should be returned through a pointer parameter passed in as the first argument.`,
            `// [fixed-code]:`,
            `void fib(int *fib_seq_ptr, int count) {
    int *a = (int *)malloc(count * sizeof(int));
    a[0] = 0;
    if (count == 1) return;
    a[1] = 1;
    if (count == 2) return;
    for (int i=2; i < count; i++) {
        a[i] = a[i-1] + a[i-2];
    }
    for (int i=0; i < count; i++) {
        fib_seq_ptr[i] = a[i];
    }
    free(a);
}`,
            `// [changes]:`,
            `// 1. [your-code]: The array \`a\` is not dynamically allocated. [fixed-code]: This is fixed by using \`malloc()\` and \`sizeof()\` to allocate memory for \`a\`.`,
            `// 2. [your-code]: The values of \`a\` are not returned through the pointer parameter \`fib_seq_ptr\`. [fixed-code]: This is fixed by copying the values of \`a\` to \`fib_seq_ptr\`.`,
            `// [end]`,
            ``,
            ``,
            `// [your-code]:`,
            `int sum_card(int **score_card, int size) {
    int sum = 0;

    for (int i = 0; i < size; i++) {
        sum += (score_card[i]);
    }

    return sum;
}`,
            `// [intention]: sum the values pointed to by the elements of score_card and return it`,
            `// [fixed-code]:`,
            `int sum_card(int **score_card, int size) {
    int sum = 0;

    for (int i = 0; i < size; i++) {
        sum += (*score_card[i]);
    }   

    return sum;
}`,
            `// [changes]:`,
            `// 1. [your-code]: The values pointed to by the elements of \`score_card\` are not dereferenced. [fixed-code]: This is fixed by adding \`*\` before \`score_card[i]\`.`,
            `// [end]`,
            ``,
            ``,
            `// [your-code]:`,
            `int truncate(char s[], int n) {
    int retval = strlen(s);
    
    if (n > strlen(s))
        return 0;

    retval -= strlen(s);

    return retval;
}

int main(int argc, char **argv) {
    if (argc != 3) {
        fprintf(stderr, "Usage: truncate number string\\n");
        exit(1);
    }
    int amt = strtol(argv[1], NULL, 10);

    char *target = argv[2];

    int soln_val = truncate(target, amt);
    printf("%d %s\\n", soln_val, target);

    return 0;
}`,
            `// [intention]: write a function that truncates a string to a given length and returns the number of characters that were removed`,
            `// [fixed-code]:`,
            `int truncate(char s[], int n) {
    int retval = strlen(s);

    if (n > strlen(s))
        return 0;

    s[n] = '\\0';    
    retval -= strlen(s);

    return retval;
}

int main(int argc, char **argv) {
    if (argc != 3) {
        fprintf(stderr, "Usage: truncate number string\\n");
        exit(1);
    }
    int amt = strtol(argv[1], NULL, 10);

    char *target = argv[2];

    int soln_val = truncate(target, amt);
    printf("%d %s\\n", soln_val, target);

    return 0;
}`,
            `// [changes]:`,
            `// 1. [your-code]: The string is not properly terminated with a null character. [fixed-code]: This is fixed by adding \`\\0\` to the end of the string.`,
            `// [end]`,
            ``,
            ``,
            `// [your-code]:`,
            `int **split_array(const int *s, int length) {

    int *result = malloc(sizeof(int) * 2);
    result[0] = malloc(sizeof(int) * (length) / 2));
    result[1] = malloc(sizeof(int) * (length / 2));
    
    for (int i=0; i<length; i++){
        if (i % 2 == 0) {
            *result[0][i / 2] = s[i];
        } else {
            *result[1][i / 2] = s[i];
        }
    }
    
    return result;
}`,
            `// [intention]: Split an array into two arrays of odd and even indices. do not allocate any more memory than necessary. Return a pointer to the array of two arrays.`,
            `// [fixed-code]:`,
            `int **split_array(const int *s, int length) {

    int **result = malloc(sizeof(int*) * 2);
    result[0] = malloc(sizeof(int) * (length) / 2));
    result[1] = malloc(sizeof(int) * (length / 2));

    for (int i=0; i<length; i++){
        if (i % 2 == 0) {
            result[0][i / 2] = s[i];
        } else {
            result[1][i / 2] = s[i];
        }
    }

    return result;
}`,
            `// [changes]:`,
            `// 1. [your-code]: The array \`result\` is allocated with \`sizeof(int)\`, however an array of pointers is being returned. [fixed-code]: This is fixed by allocating \`sizeof(int*)\` instead.`,
            `// 2. [your-code]: The values of \`s\` are not properly copied into the arrays. [fixed-code]: This is fixed by removing the \`*\` before \`result[0][i / 2]\` and \`result[1][i / 2]\`.`,
            `// [end]`,
            ``,
            ``,
            `// [your-code]:`,
            `${code}`,
            `// [intention]: ${intention}`,
            `// [fixed-code]:`,
            ``,
        ].join("\n"),
        stopTokens: ["// [end]"],
    };
};

const explainCodeHoverPrompt = (code: string) => {
    return {
        prompt: [
            `<|endoftext|>// blank .c help fix given code. all fixes should be written in plain english without any code. Use the following format:`,
            `// [code]:`,
            `#include <stdio.h>
#include <stdlib.h>

/*
    * This function interprets score_card as an array of pointers with size elements.
    * Return the sum of the values pointed to by the elements of score_card.
    */
int sum_card(int **score_card, int size) {
    // TODO: write the body of sum_card according to its description.
}


/*
    * NOTE: don't change the main function!
    * The command line arguments are a sequence of integers that will be
    * used to initialize the array score_card.
    *
    * Sample usage:
    * $ gcc -Wall -std=gnu99 -g -o score_card score_card.c
    * $ ./score_card 10 -3 4
    * Sum: 11
    */
int main(int argc, char **argv) {
    int size = argc - 1;
    int *score_card[size];

    for (int i = 0; i < size; i++) {
        // NOTE: We haven't covered malloc yet, so don't worry about this line.
        score_card[i] = malloc(sizeof(int));
        *(score_card[i]) = strtol(argv[i + 1], NULL, 10);
    }

    printf("Sum: %d\\n", sum_card(score_card, size));

    return 0;
}`,
            `// [annotated code]: annotate the above code with comments that explain what each line does.`,
            `#include <stdio.h> // [explain]: stdio.h includes basic input and output functions like \`printf\`, \`scanf\`, etc.
#include <stdlib.h> // [explain]: stdlib.h includes functions like \`malloc\`, \`free\`, etc.

/*
    * This function interprets score_card as an array of pointers with size elements.
    * Return the sum of the values pointed to by the elements of score_card.
    */
int sum_card(int **score_card, int size) { // [explain]: the \`sum_card\` function takes in an array of pointers and the size of the array
    // TODO: write the body of sum_card according to its description.
}


/*
    * NOTE: don't change the main function!
    * The command line arguments are a sequence of integers that will be
    * used to initialize the array score_card.
    *
    * Sample usage:
    * $ gcc -Wall -std=gnu99 -g -o score_card score_card.c
    * $ ./score_card 10 -3 4
    * Sum: 11
    */
int main(int argc, char **argv) { // [explain]: the main starts the program. \`argc\` is the number of command line arguments, and \`argv\` is an array of strings containing the command line arguments
    int size = argc - 1; // [explain]: the size of the array is the number of command line arguments minus 1
    int *score_card[size]; // [explain]: the array is initialized as an array of pointers (each element is a pointer to an integer) with a fixed size

    for (int i = 0; i < size; i++) { // [explain]: iterates through each element of the array
        // NOTE: We haven't covered malloc yet, so don't worry about this line.
        score_card[i] = malloc(sizeof(int)); // [explain]: allocates memory for an integer and stores the address of the integer in the array
        *(score_card[i]) = strtol(argv[i + 1], NULL, 10); // [explain]: converts the command line argument in \`argv\` to an integer and stores it in the memory allocated for the integer
    }

    printf("Sum: %d\\n", sum_card(score_card, size)); // [explain]: prints the sum of the integers in the array

    return 0; // [explain]: returns 0 to indicate that the program ran successfully
}`,
            `// [end]`,
            ``,
            ``,
            `// [code]:`,
            `#include <stdio.h>
#include <stdlib.h>

/* Return a pointer to an array of two dynamically allocated arrays of ints.
   The first array contains the elements of the input array s that are
   at even indices.  The second array contains the elements of the input
   array that are at odd indices.

   Do not allocate any more memory than necessary.
*/
int **split_array(const int *s, int length) {

   int **result = malloc(sizeof(int *) * 2);
   result[0] = malloc(sizeof(int) * ((length - 1) / 2 + 1));
   result[1] = malloc(sizeof(int) * (length / 2));

   for (int i=0; i<length; i++){
       if (i % 2 == 0) {
            //printf("%d, %d\\n",i, (i%2));
            result[0][i / 2] = s[i];
       } else {
            result[1][i / 2] = s[i];
       }
   }
   return result;
}

/* Return a pointer to an array of size ints.
   - strs is an array of strings where each element is the string
     representation of an integer.
   - size is the size of the array
 */

int *build_array(char **strs, int size) {
    int* arr = malloc(sizeof(int) * size);
    for (int i=0; i<size; i++) {
        arr[i] = strtol(strs[i], NULL, 10);
    }
    return arr;
}


int main(int argc, char **argv) {
    /* Replace the comments in the next two lines with the appropriate
       arguments.  Do not add any additional lines of code to the main
       function.
     */
    int *full_array = build_array(&argv[1], argc - 1);
    int **result = split_array(full_array, argc - 1);

    printf("Original array:\\n");
    for (int i = 0; i < argc - 1; i++) {
        printf("%d ", full_array[i]);
    }
    printf("\\n");

    printf("result[0]:\\n");
    for (int i = 0; i < argc / 2; i++) {
        printf("%d ", result[0][i]);
    }
    printf("\\n");

    printf("result[1]:\\n");
    for (int i = 0; i < (argc - 1) / 2; i++) {
        printf("%d ", result[1][i]);
    }
    printf("\\n");
    free(full_array);
    free(result[0]);
    free(result[1]);
    free(result);
    return 0;
}`,
            `// [annotated code]: annotate the above code with comments that explain what each line does.`,
            `#include <stdio.h> // [explain]: stdio.h includes functions like \`printf\`, \`scanf\`, etc.
#include <stdlib.h> // [explain]: stdlib.h includes functions like \`malloc\`, \`free\`, etc.

/* Return a pointer to an array of two dynamically allocated arrays of ints.
   The first array contains the elements of the input array s that are
   at even indices.  The second array contains the elements of the input
   array that are at odd indices.

   Do not allocate any more memory than necessary.
*/
int **split_array(const int *s, int length) { // [explain]: \`split_array\` takes an array of integers and the length of the array as arguments

   int **result = malloc(sizeof(int *) * 2); // [explain]: \`result\` is a pointer to an array of two pointers to integers (a two-dimensional array)
   result[0] = malloc(sizeof(int) * ((length - 1) / 2 + 1)); // [explain]: \`result[0]\` is a pointer to an array of integers with a size of half the length of the input array rounded up
   result[1] = malloc(sizeof(int) * (length / 2)); // [explain]: \`result[1]\` is a pointer to an array of integers with a size of half the length of the input array rounded down

   for (int i=0; i<length; i++){ // [explain]: iterates through each element of the input array
       if (i % 2 == 0) { // [explain]: checks if the index is even
            //printf("%d, %d\\n",i, (i%2)); // [explain]: prints the index and the remainder of the index divided by 2
            result[0][i / 2] = s[i]; // [explain]: stores the element of the input array at index \`i\` in the array pointed to by \`result[0]\` at index \`i / 2\`
       } else { // [explain]: if the index is odd
            result[1][i / 2] = s[i]; // [explain]: stores the element of the input array at index \`i\` in the array pointed to by \`result[1]\` at index \`i / 2\`
       }
   }
   return result; // [explain]: returns the pointer to the two-dimensional array
}

/* Return a pointer to an array of size ints.
   - strs is an array of strings where each element is the string
     representation of an integer.
   - size is the size of the array
 */

int *build_array(char **strs, int size) { // [explain]: \`build_array\` takes an array of strings and the size of the array as arguments
    int* arr = malloc(sizeof(int) * size); // [explain]: \`arr\` is a pointer to an array of integers with a size of \`size\`
    for (int i=0; i<size; i++) { // [explain]: iterates through each element of the input array
        arr[i] = strtol(strs[i], NULL, 10); // [explain]: stores the integer representation of the string at index \`i\` in the array pointed to by \`arr\` at index \`i\`
    }
    return arr; // [explain]: returns the pointer to the array
}


int main(int argc, char **argv) { // [explain]: \`main\` takes the number of command line arguments and an array of strings as arguments
    /* Replace the comments in the next two lines with the appropriate
       arguments.  Do not add any additional lines of code to the main
       function.
     */
    int *full_array = build_array(&argv[1], argc - 1); // [explain]: \`full_array\` is a pointer to an array of integers with a size of \`argc - 1\`
    int **result = split_array(full_array, argc - 1); // [explain]: \`result\` is a pointer to an array of two pointers to integers (a two-dimensional array)

    printf("Original array:\\n"); // [explain]: prints the string "Original array:"
    for (int i = 0; i < argc - 1; i++) { // [explain]: iterates through each element of the input array
        printf("%d ", full_array[i]); // [explain]: prints the element of the input array at index \`i\`
    }
    printf("\\n"); // [explain]: prints a newline

    printf("result[0]:\\n"); // [explain]: prints the string "result[0]:"
    for (int i = 0; i < argc / 2; i++) { // [explain]: iterates through each element of the input array
        printf("%d ", result[0][i]); // [explain]: prints the element of the array pointed to by \`result[0]\` at index \`i\`
    }
    printf("\\n"); // [explain]: prints a newline

    printf("result[1]:\\n"); // [explain]: prints the string "result[1]:"
    for (int i = 0; i < (argc - 1) / 2; i++) { // [explain]: iterates through each element of the input array
        printf("%d ", result[1][i]); // [explain]: prints the element of the array pointed to by \`result[1]\` at index \`i\`
    }
    printf("\\n"); // [explain]: prints a newline
    free(full_array); // [explain]: frees the memory allocated to \`full_array\`
    free(result[0]); // [explain]: frees the memory allocated to \`result[0]\` (the first element of the two-dimensional array)
    free(result[1]); // [explain]: frees the memory allocated to \`result[1]\` (the second element of the two-dimensional array)
    free(result); // [explain]: frees the memory allocated to \`result\` (the two-dimensional array)
    return 0; // [explain]: returns 0 to the operating system, indicating that the program ran successfully
}`,
            `// [end]`,
            ``,
            ``,
            `// [code]:`,
            `${code}`,
            `// [annotated code]: annotate the above code with comments that explain what each line does.`,
            ``,
        ].join("\n"),
        stopTokens: ["// [end]", `// [annotated code]:`, `// [code]:`],
    };
};

const helpFixCodePrompt = (code: string, intention: string, error: string) => {
    return {
        prompt: [
            `<|endoftext|>// blank .c help fix given code. all fixes should be written in plain english without any code. Use the following format:`,
            `// [code]:`,
            `void invest(double *principal, double rate) {
    principal *= rate;
}`,
            `// [intention]: I want to write a void function invest that takes your money and multiplies it by the rate`,
            `// [error]: segmenation fault`,
            `// [annotated-code]: annotate the incorrect lines of the above code with potential fixes`,
            `void invest(double *principal, double rate) {
                principal *= rate; // [fix]: 1. \`principal\` is a pointer to a double, so you need to dereference it before accessing or modifying the value it points to
            }`,
            `// [end]`,
            ``,
            ``,
            `// [code]:`,
            `void fib(int *fib_seq_ptr, int count) {

    int a[count];
    a[0] = 0;
    if (count == 1) return;
    a[1] = 1;
    if (count == 2) return;
    for (int i=2; i < count; i++) {
        a[i] = a[i-1] + a[i-2];
    }
}`,
            `// [intention]: a function that generates fibonacci sequence using dynamic memory allocation size of count. the values should be returned through a pointer parameter passed in as the first argument.`,
            `// [error]: segmentation fault`,
            `// [annotated-code]: annotate the incorrect lines of the above code with potential fixes`,
            `void fib(int *arr, int count) { // [fix]: 1. the function should take a pointer to an array of integers as its first argument
    arr = malloc(count); // [fix]: 1. malloc receives the number of bytes to allocate, so you need to multiply \`count\` by the size of an integer, 2. you need to cast the result of malloc to an integer pointer as \`malloc\` returns a pointer
    arr[0] = 0; // [fix]: 1. dereference \`arr\` before accessing its elements
    if (count == 1) return;
    arr[1] = 1; // [fix]: 1. dereference \`arr\` before accessing its elements
    if (count == 2) return;
    for (int i=2; i < count; i++) {
        arr[i] = arr[i-1] + arr[i-2]; // [fix]: 1. dereference \`arr\` before accessing or setting its elements
    }
}`,
            `// [end]`,
            ``,
            ``,
            `// [code]:`,
            `int sum_card(int **score_card, int size) {
    int sum = 0;

    for (int i = 0; i < size; i++) {
        sum += (score_card[i]);
    }

    return sum;
}`,
            `// [intention]: sum the values pointed to by the elements of score_card and return it`,
            `// [error]: N/A`,
            `// [annotated-code]: annotate the incorrect lines of the above code with potential fixes`,
            `int sum_card(int **score_card, int size) {
    int sum = 0;

    for (int i = 0; i < size; i++) {
        sum += (score_card[i]); // [fix]: 1. \`score_card\` is a pointer to an array of pointers, so you need to dereference it before you can access its elements
    }

    return sum;
}`,
            `// [end]`,
            ``,
            ``,
            `// [code]:`,
            `int truncate(char s[], int n) {
    int retval = strlen(s);
    
    if (n > strlen(s))
        return 0;

    retval -= strlen(s);

    return retval;
}

int main(int argc, char **argv) {
    if (argc != 3) {
        fprintf(stderr, "Usage: truncate number string\\n");
        exit(1);
    }
    int amt = strtol(argv[1], NULL, 10);

    char *target = argv[2];

    int soln_val = truncate(target, amt);
    printf("%d %s\\n", soln_val, target);

    return 0;
}`,
            `// [intention]: write a function that truncates a string to a given length and returns the number of characters that were removed`,
            `// [error]: N/A`,
            `// [annotated-code]: annotate the incorrect lines of the above code with potential fixes`,
            `int truncate(char s[], int n) { // [fix]: 1. the truncate function is called with a pointer to a string as its first argument, so \`s\` should be a pointer to a character
    int retval = strlen(s);
    
    if (n > strlen(s))
        return 0;

    retval -= strlen(s); // [fix]: 1. before you get the length of \`s\`, you need to terminate the string at the \`n\`th character with a null byte (\`\\0\`)

    return retval;
}

int main(int argc, char **argv) {
    if (argc != 3) {
        fprintf(stderr, "Usage: truncate number string\\n");
        exit(1);
    }
    int amt = strtol(argv[1], NULL, 10);

    char *target = argv[2];

    int soln_val = truncate(target, amt);
    printf("%d %s\\n", soln_val, target);

    return 0;
}`,
            `// [end]`,
            ``,
            ``,
            `// [code]:`,
            `${code}`,
            `// [intention]: ${intention}`,
            `// [error]: ${error ? error : "N/A"}`,
            `// [annotated-code]: annotate the incorrect lines of the above code with potential fixes`,
            ``,
        ].join("\n"),
        stopTokens: ["// [end]"],
    };
};

const breakDownTaskPrompt = (task: string) => {
    return {
        prompt: [
            `<|endoftext|>// blank .c task step-by-step break-down. all answers should be written in plain english without any code. Use the following format:`,
            `// [task]: how can I use scanf to read a string and an integer in the same line?`,
            `// [step-by-step]:`,
            `// 1. define the variables you want to read: \`char str[100]\` and \`int num\``,
            `// 2. use \`scanf\` to read the string and the integer. the format string should be \`"%s %d"\``,
            `// 3. use the variables \`str\` and \`num\` in your code`,
            `// [end]`,
            ``,
            ``,
            `// [task]: how can I use sockets to create a connection to a server?`,
            `// [step-by-step]:`,
            `// 1. use the \`socket\` function to create a socket. \`socket\` has three parameters: the first is the address family (use \`AF_INET\` for IPv4), the second is the type of socket (use \`SOCK_STREAM\` for TCP), and the third is the protocol (use \`0\` for the default protocol). the function returns a socket descriptor (which is an integer that identifies the socket).`,
            `// 2. use the \`connect\` function to connect to the server. \`connect\` has three parameters: the first is the socket descriptor, the second is a pointer to a \`struct sockaddr_in\` that contains the address of the server, and the third is the size of the \`struct sockaddr_in\`. the function returns 0 if successful.`,
            `// 3. use the \`send\` function to send data to the server. \`send\` has four parameters: the first is the socket descriptor, the second is a pointer to the data to send, the third is the size of the data, and the fourth is the flags (use \`0\` for the default flags). the function returns the number of bytes sent.`,
            `// [end]`,
            ``,
            ``,
            `// [task]: I want to pass an int pointer to a function as an array, and the function to dynamically allocate memory for the array. how can I do that?`,
            `// [step-by-step]:`,
            `// 1. The function definition should take a pointer to an int pointer as its parameter (\`int **arr\`).`,
            `// 2. Use \`malloc\` to allocate memory using \`sizeof(int)\` times the size of the array.`,
            `// 3. The \`malloc\` function returns a pointer to the allocated memory which should be assigned to the pointer passed to the function (\`*arr = malloc()\`).`,
            `// [end]`,
            ``,
            ``,
            `// [task]: ${task}`,
            `// [step-by-step]:`,
            `// 1. `,
        ].join("\n"),
        stopTokens: ["// [end]", "// [step-by-step]:", "// [task]:"],
    };
};

const explainCodeShortPrompt = (code: string) => {
    return {
        prompt: [
            `<|endoftext|>// blank .c programming file.`,
            `// [code]:`,
            `for (i = 0; i < iterations; i++) {`,
            `    int n = fork();`,
            `    if (n < 0) {`,
            `        perror("fork");`,
            `        exit(1);`,
            `    }`,
            `    printf("ppid = %d, pid = %d, i = %d\\n", getppid(), getpid(), i);`,
            `}`,
            `// [explanation]: explain the gist of the above code in plain english:`,
            `// [answer]: for each new process that is successfully forked, prints 0 in the child process and the child's PID in the parent process.`,
            `// [end-explanation]`,
            ``,
            ``,
            `// [code]:`,
            `char *copy(char *dest, const char *src, int capacity) {`,
            `    dest[0] = '\\0';`,
            `    for (int i = 0; i < capacity - 1; i++) {`,
            `        dest[i] = src[i];`,
            `        if (src[i] == '\\0') {`,
            `            break;`,
            `        }`,
            `    }`,
            ``,
            `    dest[capacity - 1] = '\\0';`,
            ``,
            `    return dest;`,
            `}`,
            `// [explanation]: explain the gist of the above code in plain english:`,
            `// [answer]: for each character in the src string, copy it to the dest string until the end of the src string (detected by a null character) or until the dest string is full (detected by the capacity parameter).`,
            `// [end-explanation]`,
            ``,
            ``,
            `// [code]:`,
            `struct sigaction sa;`,
            `sa.sa_handler = timeout;`,
            `sa.sa_flags = 0;`,
            `sigemptyset(&sa.sa_mask);`,
            `sigaction(SIGPROF, &sa, NULL);`,
            `// [explanation]: explain the gist of the above code in plain english:`,
            `// [answer]: \`sigemptyset\` empties the signal set \`sa.sa_mask\` so that no signals are blocked. \`sigaction\` sets the signal handler for the \`SIGPROF\` signal (which is sent when a process uses too much CPU time) to the \`timeout\` function.`,
            `// [end-explanation]`,
            ``,
            ``,
            `// [code]: ${code}`,
            `// [explanation]: explain what the code above does in plain english and steps:`,
            `// [answer]: `,
        ].join("\n"),
        stopTokens: [`// [end-explanation]`],
    };
};

const explainCodeStepsPrompt = (code: string) => {
    return {
        prompt: [
            `<|endoftext|>// blank .c programming file.`,
            `// [code]:`,
            `for (i = 0; i < iterations; i++) {`,
            `    int n = fork();`,
            `    if (n < 0) {`,
            `        perror("fork");`,
            `        exit(1);`,
            `    }`,
            `    printf("ppid = %d, pid = %d, i = %d\\n", getppid(), getpid(), i);`,
            `}`,
            `// [explanation]: explain what the code above does in plain english and steps:`,
            `// 1. create a for loop that iterates from 0 to \`iterations - 1\``,
            `// 2. create a child process using the \`fork\` function`,
            `// 3. if the child process is created successfully, print the parent process id, child process id, and the current iteration`,
            `// 4. otherwise, print an error message and exit the program`,
            `// [end-explanation]`,
            ``,
            ``,
            `// [code]:`,
            `char *copy(char *dest, const char *src, int capacity) {`,
            `    dest[0] = '\\0';`,
            `    for (int i = 0; i < capacity - 1; i++) {`,
            `        dest[i] = src[i];`,
            `        if (src[i] == '\\0') {`,
            `            break;`,
            `        }`,
            `    }`,
            ``,
            `    dest[capacity - 1] = '\\0';`,
            ``,
            `    return dest;`,
            `}`,
            `// [explanation]: explain what the code above does in plain english and steps:`,
            `// 1. create a function that takes a destination string, a source string, and a capacity`,
            `// 2. set the first character of the destination string to the null character`,
            `// 3. create a for loop that iterates from 0 to \`capacity - 2\``,
            `// 4. set the current character of the destination string to the current character of the source string`,
            `// 5. if the current character of the source string is the null character, break out of the loop`,
            `// 6. set the last character of the destination string to the null character`,
            `// 7. return the destination string`,
            `// [end-explanation]`,
            ``,
            ``,
            `// [code]:`,
            `for (i = 0; i < iterations; i++) {`,
            `    int n = fork();`,
            `    if (n < 0) {`,
            `        perror("fork");`,
            `        exit(1);`,
            `    }`,
            `    printf("ppid = %d, pid = %d, i = %d\\n", getppid(), getpid(), i);`,
            `}`,
            `// [explanation]: explain what the code above does in plain english and steps:`,
            `// 1. loop for \`iterations\` times`,
            `// 2. create a child process using the \`fork\` function`,
            `// 3. the \`fork\` function returns 0 in the child process and the child process id in the parent process, and -1 if an error occurs`,
            `// 4. if the child process is created successfully, print the parent process id, child process id, and the current iteration`,
            `// 5. otherwise, print an error message and exit the program`,
            `// [end-explanation]`,
            ``,
            ``,
            `// [code]: ${code}`,
            `// [explanation]: explain what the code above does in plain english and steps:`,
            `// 1. `,
        ].join("\n"),
        stopTokens: [`// [end-explanation]`],
    };
};

const generateExampleCodePrompt = (keyword: string) => {
    return {
        prompt: [
            `<|endoftext|>// blank .c provide example codes for keywords:`,
            `// [prompt]: generate a simple c programming example that uses "fork" and shows its different usages:`,
            `#include <stdio.h>`,
            `#include <unistd.h>`,
            ``,
            `int main() {`,
            `    int pid = fork();`,
            ``,
            `    if (pid == 0) {`,
            `        printf("Child process: pid = %d", getpid());`,
            `    } else {`,
            `        printf("Parent process: pid = %d", getpid());`,
            `    }`,
            ``,
            `    return 0;`,
            `}`,
            `// [short-explanation]: This code uses the \`fork()\` function to create a new process. The parent process and the child process both execute the code after the \`fork()\` call, but they have different process IDs. The if statement checks the value of pid to determine whether the current process is the parent or the child, and the printf function is used to print out the process ID of the current process.`,
            `// [end]`,
            ``,
            ``,
            `// [prompt]: generate a simple c programming example that uses "signal" and shows its different usages:`,
            `#include <stdio.h>`,
            `#include <signal.h>`,
            `#include <unistd.h>`,
            ``,
            `void signal_handler(int signum) {`,
            `    printf("Received signal %d", signum);`,
            `}`,
            ``,
            `int main() {`,
            `    signal(SIGINT, signal_handler);`,
            `    printf("Press Ctrl+C to send a signal");`,
            `    while(1)`,
            `    {`,
            `        sleep(1);`,
            `    }`,
            `    return 0;`,
            `}`,
            `// [short-explanation]: This code uses the \`signal()\` function to register a signal handler for the SIGINT signal (filed when the user presses Ctrl+C). The signal handler is a function that is called when the signal is received. The while loop is used to keep the program running until the user presses Ctrl+C.`,
            ``,
            ``,
            `// [prompt]: generate a simple c programming example that uses "scanf" and shows its different usages:`,
            `#include <stdio.h>`,
            ``,
            `int main() {`,
            `    int age;`,
            `    char name[50];`,
            `    printf("Enter your name: ");`,
            `    scanf("%s", name);`,
            `    printf("Enter your age: ");`,
            `    scanf("%d", &age);`,
            `    printf("Your name is: %s", name);`,
            `    printf("Your age is: %d", age);`,
            ``,
            `    return 0;`,
            `}`,
            `// [short-explanation]: This code uses the \`scanf()\` function to read input from the user. The scanf function takes a format string and a list of variables as arguments. The \`%s\` format specifier is used to read a string, and the \`%d\` format specifier is used to read an integer. The \`age\` and \`name\` variables are passed by reference to the scanf function using the \`&\` operator. The scanf function updates the value of the variables when it reads input from the user.`,
            ``,
            ``,
            `// [prompt]: generate a comprehensive c programming example that uses "${keyword}" and shows its different usages:`,
            ``,
        ].join("\n"),
        stopTokens: ["// [end]", "// [prompt]"],
    };
};

const answerQuestionPrompt = (question: string) => {
    return {
        prompt: [
            `<|endoftext|>// blank .c question / answer file. all answers should be written in plain english without any code.  use the following format:`,
            `// [question]: what does the ** operator do?`,
            `// [answer]: The \`**\` operator is used to access the value of a pointer that points to a pointer such as when defining a function that receives a pointer to an array of pointers. For example: \`int **array\`. To access the value of the pointer, use the \`*\` operator before the identifier like this: \`*array\` (this is the same as \`array[0]\`). To access the value of the variable that the pointer points to, use the \`*\` operator after the identifier like this: \`*array[0]\`.`,
            ``,
            ``,
            `// [question]: how to write a function that takes an argument and modifies it?`,
            `// [answer]: When calling the function, pass the variable by reference using the \`&\` operator. Declare the function parameter as a pointer using the \`*\` operator like this: \`void my_function(int *a)\`. Note that you should dereference the pointer inside the function using the \`*\` operator to get or set the value of the variable.`,
            ``,
            ``,
            `// [question]: I have an array of pointers, how can I access elements of the array?`,
            `// [answer]: If the array is defined as \`int **array\`, then you can access the value of each element using the \`*\` operator before the identifier like this: \`*array[i]\`.`,
            ``,
            ``,
            `// [question]: How can I use the scanf function?`,
            `// [answer]: First declare the variables that you want to get from the user. Then use the \`scanf\` function with the different format specifiers to get the values from the user. Strings: \`%s\`, Integers: \`%d\`, Floats: \`%f\`, and Characters: \`%c\`. For example: \`scanf("%s %d", &string, &number)\`.`,
            ``,
            ``,
            `// [question]: write a function sum_card which takes an array of pointers to integers, and returns the sum of the integers being pointed to.`,
            `// [answer]: Here are a few hints on how to write this code: The function takes the array using the \`int **array\` syntax (an array of pointers). To access the value of each element, use the \`*\` operator before the identifier like this: \`*array[i]\`.`,
            ``,
            ``,
            `// [question]: how can I write a void function that takes a value and multiplies it by another value?`,
            `// [answer]: To call the function, pass the variable by reference using the \`&\` operator. To declare the function parameter as a pointer using the \`*\` operator like this: \`void my_function(int *a)\`. Note that you should dereference the pointer inside the function using the \`*\` operator to get or set the value of the variable.`,
            ``,
            ``,
            `// [question]: ${question} (in plain english)`,
            `// [answer]: `,
        ].join("\n"),
        stopTokens: ["// [question]:", "// [answer]", "// "],
    };
};

const replyAnswerQuestionPrompt = (
    prevQuestions: string,
    newQuestion: string
) => {
    return {
        prompt: [
            `<|endoftext|>// blank .c question / answer file. all answers should be written in plain english without any code.  use the following format:`,
            `// [question]: How can I use the scanf function?`,
            `// [answer]: First declare the variables that you want to get from the user. Then use the \`scanf\` function with the different format specifiers to get the values from the user. Strings: \`%s\`, Integers: \`%d\`, Floats: \`%f\`, and Characters: \`%c\`. For example: \`scanf("%s %d", &string, &number)\`.`,
            `// [follow-up-question]: what are the parameters of the scanf function?`,
            `// [follow-up-answer]: The scanf function takes (1) a format string (like \`"%s %d"\`), and (2) a list of variables (like \`&string, &number\`).`,
            `// [end]`,
            ``,
            ``,
            `// [question]: how to write a function that takes an argument and modifies it?`,
            `// [answer]: When calling the function, pass the variable by reference using the \`&\` operator. Declare the function parameter as a pointer using the \`*\` operator like this: \`void my_function(int *a)\`. Note that you should dereference the pointer inside the function using the \`*\` operator to get or set the value of the variable.`,
            `// [follow-up-question]: how can I pass an array to such a function?`,
            `// [follow-up-answer]: When calling the function, pass the array by reference using the \`&\` operator. Declare the function parameter as a pointer to a pointer using the \`**\` operator like this: \`void my_function(int **a)\`. Similar to the previous question, you should dereference the pointer inside the function using the \`*\` operator to get or set the value of the variable.`,
            `// [end]`,
            ``,
            ``,
            `// [question]: how can I manually concatenate two dynamically allocated strings?`,
            `// [answer]: Here are the steps to do this: (1) use the \`strlen\` function to get the length of each string, (2) use the \`malloc\` function to allocate memory for the concatenated string, (3) use the \`strcat\` function to concatenate the two strings, and (4) return the pointer to the concatenated string.`,
            `// [follow-up-question]: and how to do it without using the \`strcat\` function?`,
            `// [follow-up-answer]: Do the same thing, but use a for loop to go through each character of the second string and copy it to the end of the first string. then add a null terminator to the end of the first string.`,
            `// [follow-up-question]: How can I get the length of a string without using the \`strlen\` function?`,
            `// [follow-up-answer]: You have to go through each character of the string and count them before you reach the null terminator (\`'\\0'\`).`,
            `// [end]`,
            ``,
            ``,
            ...prevQuestions.split("\n"),
            `// [follow-up-question]: ${newQuestion} (in plain english)`,
            `// [follow-up-answer]: `,
        ].join("\n"),
        stopTokens: [
            "// [end]",
            "// [follow-up-question]",
            "// [follow-up-answer]",
            "// ",
        ],
    };
};

const questionFromCodePrompt = (code: string, question: string) => {
    return {
        prompt: [
            `<|endoftext|>// blank .c ask questions from code snippets. all answers should be written in plain english without any code. Use the following format:`,
            `// [code]:`,
            `unsigned long fsize(char* file)`,
            `{`,
            `    FILE f = fopen(file, "r");`,
            `    fseek(0, f, SEEK_END);`,
            `    long len = long(ftell(f));`,
            `    fclose(f);`,

            `    return len;`,
            `}`,
            `// [question]: how can I fix the error in this code?`,
            `// [answer]: there are multiple issues: (1) \`fopen\` returns a \`FILE*\` not a \`FILE\`, (2) \`fseek\` takes the file as the first parameter and the offset as the second parameter, and (3) \`long\` is not a type, instead use \`unsigned long\`.`,
            `// [end]`,
            ``,
            ``,
            `// [code]:`,
            `char tmp[16];`,
            `scanf("%s", tmp);`,
            ``,
            `int isDigit = 0;`,
            `int j=0;`,
            `while(j<strlen(tmp) && isDigit == 0){`,
            `    if(tmp[j] > 57 && tmp[j] < 48)`,
            `    isDigit = 0;`,
            `    else`,
            `    isDigit = 1;`,
            `    j++;`,
            `}`,
            `// [question]: I want to check if a string is a number with this code. I must check that all the chars in the string are integer, but the while returns always isDigit = 1. I don't know why that if doesn't work`,
            `// [answer]: instead of using ASCII codes, you can check if \`tmp[j]\` is between \`0\` and \`9\` using \`tmp[j] >= '0' && tmp[j] <= '9'\`. You could also use \`isdigit\` from \`<ctype.h>\`, or \`atoi\` from \`<stdlib.h>\`, or \`isnumber\` from \`<math.h>\`.`,
            `// [end]`,
            ``,
            ``,
            `// [code]:`,
            `#include <stdio.h>`,
            `#include <math.h>`,
            `int main(void)`,
            `{`,
            `    double x = 0.5;`,
            `    double result = sqrt(x);`,
            `    printf("The square root of %lf is %lf\\n", x, result);`,
            `    return 0;`,
            `}`,
            `// [question]: Why am I getting "undefined reference to sqrt" error even though I include math.h header?`,
            `// [answer]: The math library must be linked to the program. You can do this by adding \`-lm\` to the end of the command line. For example, \`gcc -o myprog myprog.c -lm\`.`,
            `// [end]`,
            ``,
            ``,
            `// [code]:`,
            `${code}`,
            `// [question]: ${question} (in plain english)`,
            `// [answer]: `,
        ].join("\n"),
        stopTokens: ["// [end]", "// [question]:", "// [code]:"],
    };
};
