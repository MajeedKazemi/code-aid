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
                ? ("1." + expSteps)
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
                curUser.save();

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
                curUser.save();

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
        const { prevQuestions, question } = req.body;
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
                const answer = result.data.choices[0].text?.trim();

                // get previous one (ID should be sent through API)
                // update model with new data (append whole data to array)
                // return just this one

                res.json({
                    query: [
                        ...prevQuestions.split("\n"),
                        `// [follow-up-question]: ${question}`,
                        `// [follow-up-answer]: ${answer}`,
                    ].join("\n"),
                    id: uuid(),
                    question: question,
                    answer: answer ? answer : "",
                    success: true,
                });
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
                curUser.save();

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
            temperature: 0.1,
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
                curUser.save();

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
            ``,
            `int main()`,
            `{`,
            `    for(int i=0;i<100;i++)`,
            `    {`,
            `        int count=0;`,
            `        printf("%d ",++count);`,
            `    }`,
            `    return 0;`,
            `}`,
            `// [question]: if I declare a variable inside a for loop, will it be be created multiple times?`,
            `// [answer]: yes, \`count\` is created each time the body of the loop is executed, and it is destroyed when execution of the body ends (denoted by \`}\`). By "created" and "destroyed," I mean that the memory is reserved for it and is released, and that the initialization is performed with the reservation.`,
            `// [end]`,
            ``,
            ``,
            `// [code]:`,
            `#include <stdio.h>
#include <math.h>
int main(void)
{
    double x = 0.5;
    double result = sqrt(x);
    printf("The square root of %lf is %lf\n", x, result);
    return 0;
}`,
            `// [question]: Why am I getting "undefined reference to sqrt" error even though I include math.h header?`,
            `// [answer]: The math library must be linked to the program. You can do this by adding \`-lm\` to the end of the command line. For example, \`gcc -o myprog myprog.c -lm\`.`,
            `// [end]`,
            ``,
            ``,
            `// [code]:`,
            `${code}`,
            `// [question]: ${question}`,
            `// [answer]: `,
        ].join("\n"),
        stopTokens: ["// [end]", "// [question]:", "// [code]:"],
    };
};

const breakDownTaskPrompt = (task: string) => {
    return {
        prompt: [
            `<|endoftext|>// blank .c task step-by-step break-down. all answers should be written in plain english without any code. Use the following format:`,
            `// [task]: how can I use the fread function?`,
            `// [step-by-step]:`,
            `// 1. use the \`fopen\` function to open the file. \`fopen\` has two parameters: the first is the name of the file, and the second is the mode. the mode can be \`"r"\` for read, \`"w"\` for write, or \`"a"\` for append. the function returns a pointer to the file.`,
            `// 2. use the \`fread\` function to read the file. \`fread\` has three parameters: the first is a pointer to the file, the second is the size of each element, and the third is the number of elements to read. the function returns the number of elements read.`,
            `// 3. to read the entire file, use a while loop to keep reading until the function returns 0 (reached the end of the file).`,
            `// 4. use the \`fclose\` function to close the file. \`fclose\` has one parameter: the pointer to the file. the function returns 0 if successful.`,
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
            `// [task]: generate code that manually concatenates two dynamically allocated strings?`,
            `// [step-by-step]:`,
            `// I am not supposed to give you the answer to this question, but I will break it down into steps so you can figure it out yourself:`,
            `// 1. use the \`strlen\` function to get the length of the first string. \`strlen\` has one parameter: the pointer to the string. the function returns the length of the string.`,
            `// 2. use the \`strlen\` function to get the length of the second string.`,
            `// 3. use the \`malloc\` function to allocate memory for the new string. \`malloc\` has one parameter: the size of the memory to allocate. the function returns a pointer to the allocated memory.`,
            `// 4. use the \`memcpy\` function to copy the first string to the new string. \`memcpy\` has three parameters: the first is the pointer to the destination, the second is the pointer to the source, and the third is the size of the memory to copy. the function returns a pointer to the destination.`,
            `// 5. use the \`memcpy\` function again to copy the second string to the new string.`,
            `// 6. use the \`free\` function to free the memory allocated for the first string. \`free\` has one parameter: the pointer to the memory to free. the function returns nothing.`,
            `// 7. use the \`free\` function to free the memory allocated for the second string.`,
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

const replyAnswerQuestionPrompt = (
    prevQuestions: string,
    newQuestion: string
) => {
    return {
        prompt: [
            `<|endoftext|>// blank .c question / answer file. all answers should be written in plain english without any code.  use the following format:`,
            `// [question]: how can I use the fread function?`,
            `// [answer]: 1. open the file using the \`fopen\` function. 2. use the \`fread\` function to read the file. 3. close the file using the \`fclose\` function.`,
            `// [follow-up-question]: what are the parameters of the fread function?`,
            `// [follow-up-answer]: the fread function takes 4 parameters: a pointer to the buffer (where the read data will be stored), the size of each element, the number of elements to read, and a pointer to the file. like this: \`fread(buffer, sizeof(char), 100, file)\`.`,
            `// [end]`,
            ``,
            ``,
            `// [question]: how can I use sockets to create a connection to a server?`,
            `// [answer]: 1. create a socket using the \`socket\` function. 2. connect to the server using the \`connect\` function. 3. send and receive data using the \`send\` and \`recv\` functions. 4. close the socket using the \`close\` function.`,
            `// [follow-up-question]: explain how can I create a socket?`,
            `// [follow-up-answer]: include the \`sys/socket.h\` header file, then use the \`socket\` function to create a socket. the \`socket\` function takes 3 parameters: the address family (use \`AF_INET\` for IPv4), the socket type (use \`SOCK_STREAM\` for TCP), and the protocol (use \`0\` for the default protocol). like this: \`socket(AF_INET, SOCK_STREAM, 0)\`.`,
            `// [end]`,
            ``,
            ``,
            `// [question]: how can I manually concatenate two dynamically allocated strings?`,
            `// [answer]: 1. use the \`strlen\` function to get the length of each string. 2. use the \`malloc\` function to allocate memory for the concatenated string. 3. use the \`strcat\` function to concatenate the two strings. 4. return the pointer to the concatenated string.`,
            `// [follow-up-question]: and how to do it without using the \`strcat\` function?`,
            `// [follow-up-answer]: do the same thing, but use a for loop to go through each character of the second string and copy it to the end of the first string. then add a null terminator to the end of the first string. like this: \`for (i = 0; i < strlen(s2); i++) { s1[strlen(s1) + i] = s2[i]; } s1[strlen(s1) + i] = '\0';\`.`,
            `// [follow-up-question]: how can I get the length of a string without using the \`strlen\` function?`,
            `// [follow-up-answer]: you have to go through each character of the string and count them before you reach the null terminator (\`'\0'\`). like this: \`for (i = 0; s[i] != '\0'; i++) { } return i;\`.`,
            `// [end]`,
            ``,
            ``,
            ...prevQuestions.split("\n"),
            `// [follow-up-question]: ${newQuestion}`,
            `// [follow-up-answer]: `,
        ].join("\n"),
        stopTokens: [
            "// [end]",
            "// [follow-up-question]",
            "// [follow-up-answer]",
        ],
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
            `    printf("ppid = %d, pid = %d, i = %d\n", getppid(), getpid(), i);`,
            `}`,
            `// [explanation]: explain the gist of the above code in plain english:`,
            `// [answer]: for each new process that is successfully forked, prints 0 in the child process and the child's PID in the parent process.`,
            `// [end-explanation]`,
            ``,
            ``,
            `// [code]:`,
            `char *copy(char *dest, const char *src, int capacity) {`,
            `    dest[0] = '\0';`,
            `    for (int i = 0; i < capacity - 1; i++) {`,
            `        dest[i] = src[i];`,
            `        if (src[i] == '\0') {`,
            `            break;`,
            `        }`,
            `    }`,
            ``,
            `    dest[capacity - 1] = '\0';`,
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
            `    printf("ppid = %d, pid = %d, i = %d\n", getppid(), getpid(), i);`,
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
            `    dest[0] = '\0';`,
            `    for (int i = 0; i < capacity - 1; i++) {`,
            `        dest[i] = src[i];`,
            `        if (src[i] == '\0') {`,
            `            break;`,
            `        }`,
            `    }`,
            ``,
            `    dest[capacity - 1] = '\0';`,
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
            `    printf("ppid = %d, pid = %d, i = %d\n", getppid(), getpid(), i);`,
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

const answerQuestionPromptV3 = (question: string) => {
    return {
        prompt: [
            `<|endoftext|>// blank .c question / answer file. all answers should be written in plain english without any code.  use the following format:`,
            `// [question]: what does the ** operator do?`,
            `// [answer]: the \`**\` operator is used to access the value of a pointer that points to a pointer.`,
            `// [for-example]: for example, if \`int x = 5;\` and \`int *ptr = &x;\`, then \`*ptr\` would be the value of \`x\`, and \`**ptr\` would be the value of \`x\`.`,
            `// [end]`,
            ``,
            ``,
            `// [question]: what does the & operator do?`,
            `// [answer]: the \`&\` operator could be used to get the memory address of a variable, or to pass a variable by reference to a function.`,
            `// [for-example]: for example, in \`int x = 5;\`, \`&x\` would be the memory address of \`x\`.`,
            `// [end]`,
            ``,
            ``,
            `// [question]: how can I pass a pointer to a function?`,
            `// [answer]: declare the function parameter as a pointer using the \`*\` operator, then pass the variable using the "address of" operator \`&\`.`,
            `// [for-example]: for example, if \`int x = 5;\`, then \`void my_function(int *ptr) { ... }\` would be a function that takes a pointer to an integer, and \`my_function(&x);\` would pass the memory address of \`x\` to the function.`,
            `// [end]`,
            ``,
            ``,
            `// [question]: I have an array of pointers and a size variable, how can I access each element of the array?`,
            `// [answer]: use a for loop that iterates from 0 to size-1, and use the \`*\` operator to dereference and access the value of each element like this: \`*array[i]\``,
            `// [for-example]: for example, in \`int *array[5];\`, \`array[0]\` would be the address of the first element, and \`*array[0]\` would be the value of the first element.`,
            `// [end]`,
            ``,
            ``,
            `// [question]: how can I dynamically allocate memory for an array of n elements and update the value of each element?`,
            `// [answer]: create a pointer to an integer and set it to \`malloc\` the size of the array (can use sizeof(int) to get the size of an integer). then use a for loop to iterate from 0 to n-1 and use the \`*\` operator to update the value of each element like this: \`*array[i] = new_value\``,
            `// [for-example]: for example, in \`int *array = malloc(n * sizeof(int));\`, \`array[0]\` would be the address of the first element, and \`*array[0] = 5;\` would update the value of the first element to 5.`,
            `// [end]`,
            ``,
            ``,
            `// [question]: how can I get both a string and a number from the user in the same line?`,
            `// [answer]: use the \`scanf\` function with the \`%s\` and \`%d\` format specifiers to get the string and number from the user. the \`&\` operator is used to pass the variable by reference to the \`scanf\` function. For example: \`scanf("%s %d", &string, &number)\``,
            `// [for-example]: for example, if \`char text[100];\` and \`int number;\`, then \`scanf("%s %d", &text, &number);\` would get the string and number from the user.`,
            `// [end]`,
            ``,
            ``,
            `// [question]: ${question}`,
            `// [answer]: `,
        ].join("\n"),
        stopTokens: ["// [question]:"],
    };
};

const answerQuestionPromptV2 = (question: string) => {
    return {
        prompt: [
            `<|endoftext|>// blank .c question / answer file. each [question] is followed by an [answer] with natural language explanation (and almost no code), a [example] that uses some of the concepts and code in the question. the [end] token indicates the end of the [answer] and [example].`,
            `// [question]: what does the ** operator do?`,
            `// [answer]:`,
            `// the \`**\` operator is used to access the value of a pointer that points to a pointer.`,
            `// [example]:`,
            `int a = 5; // declare variable \`a\` and set it to \`5\``,
            `int *b = &a; // declare pointer \`b\` and set it to the memory address of \`a\``,
            `int **c = &b; // declare pointer \`c\` and set it to the memory address of \`b\``,
            `printf("%d", **c); // print the value of \`a\``,
            `// [end]`,
            ``,
            ``,
            `// [question]: what does the & operator do?`,
            `// [answer]:`,
            `// The \`&\` operator could be used to:`,
            `// 1. Perform a bitwise AND operation on two numbers. For instance, \`0b1010 & 0b0011\` becomes \`0b0010\`.`,
            `// 2. To get the memory address of a variable, or to pass a variable by reference to a function.`,
            `// [example]:`,
            `int a = 5; // declare variable \`a\` and set it to 5`,
            `int *b = &a; // declare pointer \`b\` and set it to the memory address of \`a\``,
            `scanf("%d", &a); // pass the variable \`a\` by reference to the \`scanf\` function that will update the value of \`a\``,
            `scanf("%d", b); // pass the pointer \`b\` to the \`scanf\` function that will update the value of \`a\``,
            `// [end]`,
            ``,
            ``,
            `// [question]: how can I pass a pointer to a function?`,
            `// [answer]:`,
            `// declare the function parameter as a pointer using the \`*\` operator (like this: \`int *a\`), then pass the variable using the "address of" operator \`&\` like this: \`my_function(&a)\``,
            `// [example]:`,
            `void my_function(int *a) { // declare the function parameter as a pointer using the \`*\` operator: \`int *a\``,
            `    *a = 5; // update the value of the variable that the pointer points to. here, the \`*\` operator is used to dereference the pointer and access the value of the variable`,
            `}`,
            `int a = 0; // declare variable \`a\` and set it to 0`,
            `my_function(&a); // pass the variable \`a\` by reference to the \`my_function\` function`,
            `printf("%d", a); // print the value of \`a\``,
            `// [end]`,
            ``,
            ``,
            `// [question]: I have an array of pointers and a size variable, how can I access each element of the array?`,
            `// [answer]:`,
            `// use a for loop that iterates from 0 to size-1, and use the \`*\` operator to dereference and access the value of each element like this: \`*array[i]\``,
            `// [example]:`,
            `int **array = malloc(sizeof(int*) * 3); // allocate memory for an array of 3 pointers`,
            `for (int i = 0; i < 3; i++) {`,
            `    array[i] = malloc(sizeof(int) * 3); // allocate memory for each pointer in the array`,
            `}`,
            `for (int i = 0; i < 3; i++) {`,
            `    for (int j = 0; j < 3; j++) {`,
            `        *array[i][j] = 5; // update the value of each element in the array. using the \`*\` operator before the identifier dereferences the pointer and accesses the value of the variable`,
            `    }`,
            `}`,
            `// [end]`,
            ``,
            ``,
            `// [question]: how can I get both a string and a number from the user in the same line?`,
            `// [answer]:`,
            `// use the \`scanf\` function with the \`%s\` and \`%d\` format specifiers to get the string and number from the user. the \`&\` operator is used to pass the variable by reference to the \`scanf\` function. For example: \`scanf("%s %d", &string, &number)\``,
            `// [example]:`,
            `char text[100]; // declare a variable called \`text\` that can hold up to 100 characters`,
            `int number; // declare an integer called \`number\``,
            `scanf("%s %d", &text, &number); // get the text and number from the user`,
            `printf("%s %d", text, number); // print the text and number`,
            `// [end]`,
            ``,
            ``,
            `// [question]: how can I dynamically allocate memory for an array of n elements and update the value of each element?`,
            `// [answer]:`,
            `// 1. use the \`malloc\` function to allocate memory for the array.`,
            `// 2. use a for loop to iterate from 0 to n-1 and use the \`*\` operator to dereference and update the value of each element.`,
            `// [example]:`,
            `int n = 5; // declare a variable called \`n\` and set it to 5`,
            `int *array = malloc(sizeof(int) * n); // allocate memory for an array of n integers`,
            `for (int i = 0; i < n; i++) {`,
            `    *array[i] = 5; // update the value of each element in the array. using the \`*\` operator before the identifier dereferences the pointer and accesses the value of the variable`,
            `}`,
            `// [end]`,
            ``,
            ``,
            `// [question]: ${question}`,
            `// [answer]: `,
        ].join("\n"),
        stopTokens: ["// [question]:"],
    };
};

const answerQuestionPrompt = (question: string) => {
    return {
        prompt: [
            `<|endoftext|>// blank .c question / answer file. all answers should be written in plain english without any code.  use the following format:`,
            `// [question]: what does the ** operator do?`,
            `// [answer]: the \`**\` operator is used to access the value of a pointer that points to a pointer.`,
            ``,
            ``,
            `// [question]: what does the & operator do?`,
            `// [answer]: the \`&\` operator could be used to get the memory address of a variable, or to pass a variable by reference to a function.`,
            ``,
            ``,
            `// [question]: how can I pass a pointer to a function?`,
            `// [answer]: declare the function parameter as a pointer using the \`*\` operator, then pass the variable using the "address of" operator \`&\`.`,
            ``,
            ``,
            `// [question]: I have an array of pointers and a size variable, how can I access each element of the array?`,
            `// [answer]: use a for loop that iterates from 0 to size-1, and use the \`*\` operator to dereference and access the value of each element like this: \`*array[i]\``,
            ``,
            ``,
            `// [question]: how can I dynamically allocate memory for an array of n elements and update the value of each element?`,
            `// [answer]: create a pointer to an integer and set it to \`malloc\` the size of the array (can use sizeof(int) to get the size of an integer). then use a for loop to iterate from 0 to n-1 and use the \`*\` operator to update the value of each element like this: \`*array[i] = new_value\``,
            ``,
            ``,
            `// [question]: how can I get both a string and a number from the user in the same line?`,
            `// [answer]: use the \`scanf\` function with the \`%s\` and \`%d\` format specifiers to get the string and number from the user. the \`&\` operator is used to pass the variable by reference to the \`scanf\` function. For example: \`scanf("%s %d", &string, &number)\``,
            ``,
            ``,
            `// [question]: how can I define a function void fib(...) that takes parameter n and generates the first n values in the Fibonacci sequence. The values should be stored in a dynamically-allocated array composed of exactly the correct number of integers. The values should be returned through a pointer parameter passed in as the first argument.`,
            `// [answer]: 1. to pass a pointer to a function, declare the function parameter as a pointer using the \`*\` operator, then pass the variable using the "address of" operator \`&\`. 2. to dynamically allocate memory for an array of n elements, create a pointer to an integer and set it to \`malloc\` the size of the array (can use \`sizeof(int)\` to get the size of an integer). 3. then use a for loop to iterate from 0 to n-1 and use the \`*\` operator to set the value of each element like this: \`*array[i] = new_value\`. 4. to set the pointer parameter, you should dereference the pointer and set it to the array pointer like this: \`*return_pointer = array\`.`,
            ``,
            ``,
            `// [question]: how can I write an integer (in binary) to a file?`,
            `// [answer]: 1. open the file using the \`fopen\` function. 2. use the \`fprintf\` function to write the integer to the file. use the \`%d\` format specifier to write the integer in decimal, or the \`%b\` format specifier to write the integer in binary. 3. close the file using the \`fclose\` function.`,
            ``,
            ``,
            `// [question]: ${question} (use plain english, without too much code)`,
            `// [answer]: `,
        ].join("\n"),
        stopTokens: ["// [question]:", "// [answer]"],
    };
};
