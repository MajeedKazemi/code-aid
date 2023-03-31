import { ChatCompletionRequestMessage } from "openai";

import { genericParser, suggestionsParser } from "./shared/parsers";

export const mainAskQuestion = (question: string) => {
    const messages: Array<ChatCompletionRequestMessage> = [
        {
            role: "system",
            content:
                "for each asked [question], provide a thorough [answer] (single-paragraph) and a list of [c-library-functions] that are relevant to the [answer]. to display multi-line code, start it with the [code] tag, followed by a [code-title] and end it with [end-code]. each response should end with [end-question-answer].",
        },
        {
            role: "user",
            content: `[question]: what is the meaning of life?`,
        },
        {
            role: "assistant",
            content: `[answer]: this question is irrelevant to C Programming.
[STOP-end-question-answer-STOP]`,
        },
        {
            role: "user",
            content: `[question]: how can I read from a file?`,
        },
        {
            role: "assistant",
            content: `[answer]: You can use the \`fopen()\` function to open a file and store the file pointer in a variable (like \`FILE *fp\`). The \`fopen()\` function takes two arguments: the filename and the mode. The mode can be \`r\` for reading, \`w\` for writing, \`a\` for appending, \`r+\` for both reading and writing, and \`w+\` for both reading and writing. Then, you can use the \`fgets()\` function to read a line from the file. The \`fgets()\` takes a buffer (as a char array), the size of the buffer, and the file pointer as arguments. The \`fgets()\` function returns the buffer if successful, and returns NULL if an error occurs, therefore, it could be used in a while loop to read the file line by line. When you are done reading the file, you can use the \`fclose()\` function to close the file. Here is an example of how to read a file line by line using \`fgets()\`:
[code]:
[code-title]: read a file line by line using fgets
FILE *file;
char line[100];

file = fopen("file.txt", "r");
while (fgets(line, sizeof(line), file)) {
    printf("%s", line);
}
fclose(file);
[end-code]
[c-library-functions]: fopen, fgets, fclose
[STOP-end-question-answer-STOP]`,
        },
        {
            role: "user",
            content: `[question]: is it possible to initialize a boolean and reassign its value for use later in a program?`,
        },
        {
            role: "assistant",
            content: `[answer]: Yes, it is possible to initialize a boolean and reassign its value in C programming. However, there is no built-in boolean type in C, so a boolean-like behavior can be achieved using the \`_Bool\` or \`bool\` type from \`<stdbool.h>\` in C99 and later versions of the language, or by using integer constants such as 0 (representing false) and 1 (representing true). Here is an example of how to initialize a boolean and reassign its value:
[code]:
[code-title]: initialize a boolean and reassign its value
#include <stdbool.h>
#include <stdio.h>

int main() {
    bool flag = false;
    flag = true;
    printf("%d", flag);
    return 0;
}
[end-code]
[c-library-functions]: printf
[STOP-end-question-answer-STOP]`,
        },
        {
            role: "user",
            content: `[question]: ${question}`,
        },
    ];

    return {
        messages,
        stop: ["[STOP-end-question-answer-STOP]"],
        model: "gpt-3.5-turbo",
        temperature: 0.05,
        max_tokens: 2048,
        parser: (resTxt: string) => genericParser(resTxt),
        raw: (resTxt: string) => `[question]: ${question}\n${resTxt}`,
    };
};

export const replyAskQuestion = (
    prevResponses: string[] | undefined,
    newQuestion: string
) => {
    const messages: Array<ChatCompletionRequestMessage> = [
        {
            role: "system",
            content:
                "for each asked [question], provide a thorough [answer] (single-paragraph). [answer] should not include multi-line codes. instead, to display multi-line code, start it with the [code] tag, followed by a [code-title] and end it with [end-code]. and then list of [c-library-functions] that are relevant to the [answer]. finally, each response should end with [end-question-answer].",
        },
        {
            role: "user",
            content: `[question]: how can I read from a file?`,
        },
        {
            role: "assistant",
            content: `[answer]: You can use the \`fopen()\` function to open a file and store the file pointer in a variable (like \`FILE *fp\`). The \`fopen()\` function takes two arguments: the filename and the mode. The mode can be \`r\` for reading, \`w\` for writing, \`a\` for appending, \`r+\` for both reading and writing, and \`w+\` for both reading and writing. Then, you can use the \`fgets()\` function to read a line from the file. The \`fgets()\` takes a buffer (as a char array), the size of the buffer, and the file pointer as arguments. The \`fgets()\` function returns the buffer if successful, and returns NULL if an error occurs, therefore, it could be used in a while loop to read the file line by line. When you are done reading the file, you can use the \`fclose()\` function to close the file.
[STOP-end-question-answer-STOP]`,
        },
        {
            role: "user",
            content: `[follow-up-question]: I don't want to use fgets, is there another way to read a file?`,
        },
        {
            role: "assistant",
            content: `[answer]: Yes, there are multiple other options: 1. the \`getc()\` function allows you to read a character by character like this: \`c = getc(fp)\` in which \`fp\` is the file pointer and \`c\` is the read character (as an \`int\` value which can be casted to a \`char\`). 2. the \`fscanf()\` function allows you to read formatted input from a file like this: \`fscanf(fp, "%d %s %f", &i, str, &f)\` in which \`fp\` is the file pointer, \`i\` is an \`int\` variable, \`str\` is a \`char\` array, and \`f\` is a \`float\` variable. 3. the \`fread()\` function allows you to read a block of data from a file like this: \`fread(ptr, size, nitems, fp)\` in which \`ptr\` is a pointer to a block of memory with a minimum size of \`size * nitems\` bytes, \`size\` is the size in bytes of each item to be read, \`nitems\` is the number of items, and \`fp\` is the file pointer. Here is an example of how to read a file using \`fscanf()\`:
[code]:
[code-title]: read a file using fscanf
FILE *file;
int i;
char str[100];
float f;

file = fopen("file.txt", "r");
fscanf(file, "%d %s %f", &i, str, &f);
fclose(file);
[end-code]
[c-library-functions]: getc, fscanf, fread
[STOP-end-question-answer-STOP]`,
        },
    ];

    if (prevResponses && prevResponses.length !== 0) {
        const firstQuestion = prevResponses[0]
            .split("\n")[0]
            .replace("[question]: ", "");
        const firstAnswer = prevResponses[0]
            .split("\n")[1]
            .replace("[answer]: ", "");

        messages.push(
            {
                role: "user",
                content: `[question]: ${firstQuestion}`,
            },
            {
                role: "assistant",
                content: `[answer]: ${firstAnswer}\n[end-question-answer]`,
            }
        );

        for (let i = 1; i < prevResponses.length; i++) {
            if (prevResponses[i]) {
                let lines = prevResponses[i].split("\n");

                let question = lines
                    .filter((line) =>
                        line.startsWith("[follow-up-question]:")
                    )[0]
                    .replace("[follow-up-question]:", "");
                let answer = lines.filter((line) =>
                    line.startsWith("[answer]:")
                )[0];

                messages.push(
                    {
                        role: "user",
                        content: `[follow-up-question]: ${question}`,
                    },
                    {
                        role: "assistant",
                        content: `[answer]: ${answer}\n[end-question-answer]`,
                    }
                );
            }
        }
    }

    messages.push({
        role: "user",
        content: `[follow-up-question]: ${newQuestion}`,
    });

    return {
        messages,
        stop: ["[STOP-end-question-answer-STOP]"],
        model: "gpt-3.5-turbo",
        temperature: 0.15,
        max_tokens: 1024,
        parser: (resTxt: string) => genericParser(resTxt),
        raw: (resTxt: string) =>
            `[follow-up-question]: ${newQuestion}\n${resTxt}`,
    };
};

export const suggestAskQuestion = (question: string, answer: string) => {
    const messages: Array<ChatCompletionRequestMessage> = [
        {
            role: "system",
            content:
                "based on the provided [question] and [answer], generate three separate single-line (short, max 100 chars) follow-up questions that are thought provoking and help students learn about c programming deeply around the topic of the [question]:",
        },
        {
            role: "user",
            content: `[question]: ${question}
[answer]:
${answer}
[follow-up-questions]: based on the provided [question] and [answer], generate three separate single-line (short, max 100 chars) follow-up questions that are thought provoking and help students learn about c programming deeply around the topic of the [question]:
1.`,
        },
    ];

    return {
        messages,
        stop: ["4."],
        model: "gpt-3.5-turbo",
        temperature: 0.3,
        max_tokens: 500,
        parser: (output: string) => suggestionsParser(output),
    };
};
