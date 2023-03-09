import { genericParser, suggestionsParser } from "./shared/parsers";

export const mainAskQuestion = (question: string) => {
    return {
        prompt: `<|endoftext|>// for each asked [question], provide a thorough [answer] (single-paragraph) and a list of [c-library-functions] that are relevant to the [answer]. if needed, also provide a [code] example with a [code-title] and end it with [end-code]. each response should end with [end-question-answer].

[question]: what is the meaning of life?
[answer]: this question is irrelevant to C Programming.
[end-question-answer]


[question]: how can I read from a file?
[answer]: You can use the \`fopen()\` function to open a file and store the file pointer in a variable (like \`FILE *fp\`). The \`fopen()\` function takes two arguments: the filename and the mode. The mode can be \`r\` for reading, \`w\` for writing, \`a\` for appending, \`r+\` for both reading and writing, and \`w+\` for both reading and writing. Then, you can use the \`fgets()\` function to read a line from the file. The \`fgets()\` takes a buffer (as a char array), the size of the buffer, and the file pointer as arguments. The \`fgets()\` function returns the buffer if successful, and returns NULL if an error occurs, therefore, it could be used in a while loop to read the file line by line. When you are done reading the file, you can use the \`fclose()\` function to close the file.
[c-library-functions]: fopen, fgets, fclose
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
[end-question-answer]


[question]: is it possible to initialize a boolean and reassign its value for use later in a program?
[answer]: Yes, it is possible to initialize a boolean and reassign its value in C programming. However, there is no built-in boolean type in C, so a boolean-like behavior can be achieved using the \`_Bool\` or \`bool\` type from \`<stdbool.h>\` in C99 and later versions of the language, or by using integer constants such as 0 (representing false) and 1 (representing true).
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
[end-question-answer]


[question]: ${question}
[answer]:`,
        stop: ["[end-question-answer]"],
        model: "text-davinci-003",
        temperature: 0.05,
        max_tokens: 2048,
        parser: (resTxt: string) => genericParser(resTxt),
        raw: (resTxt: string) => `[question]: ${question}
[answer]:${resTxt}`,
    };
};

export const replyAskQuestion = (
    prevResponses: string[],
    newQuestion: string
) => {
    let thread = "";

    if (prevResponses.length === 0) {
        console.error("prevQuery is empty");
    }

    const firstQuestion = prevResponses[0]
        .split("\n")[0]
        .replace("[question]: ", "");
    const firstAnswer = prevResponses[0]
        .split("\n")[1]
        .replace("[answer]: ", "");

    thread += `[question]: ${firstQuestion}\n[answer]: ${firstAnswer}\n[end-question-answer]\n\n`;

    for (let i = 1; i < prevResponses.length; i++) {
        let lines = prevResponses[i].split("\n");

        let question = lines
            .filter((line) => line.startsWith("[follow-up-question]:"))[0]
            .replace("[follow-up-question]:", "");
        let answer = lines.filter((line) => line.startsWith("[answer]:"))[0];

        thread += `[follow-up-question]: ${question}\n${answer}\n[end-question-answer]\n\n`;
    }

    return {
        prompt: `<|endoftext|>// for each asked [question], provide a thorough [answer] (single-paragraph) and a list of [c-library-functions] that are relevant to the [answer]. if needed, also provide a [code] example with a [code-title] and end it with [end-code]. each response should end with [end-question-answer].

[question]: how can I read from a file?
[answer]: You can use the \`fopen()\` function to open a file and store the file pointer in a variable (like \`FILE *fp\`). The \`fopen()\` function takes two arguments: the filename and the mode. The mode can be \`r\` for reading, \`w\` for writing, \`a\` for appending, \`r+\` for both reading and writing, and \`w+\` for both reading and writing. Then, you can use the \`fgets()\` function to read a line from the file. The \`fgets()\` takes a buffer (as a char array), the size of the buffer, and the file pointer as arguments. The \`fgets()\` function returns the buffer if successful, and returns NULL if an error occurs, therefore, it could be used in a while loop to read the file line by line. When you are done reading the file, you can use the \`fclose()\` function to close the file.
[end-question-answer]


[follow-up-question]: I don't want to use fgets, is there another way to read a file?
[answer]: Yes, there are multiple other options: 1. the \`getc()\` function allows you to read a character by character like this: \`c = getc(fp)\` in which \`fp\` is the file pointer and \`c\` is the read character (as an \`int\` value which can be casted to a \`char\`). 2. the \`fscanf()\` function allows you to read formatted input from a file like this: \`fscanf(fp, "%d %s %f", &i, str, &f)\` in which \`fp\` is the file pointer, \`i\` is an \`int\` variable, \`str\` is a \`char\` array, and \`f\` is a \`float\` variable. 3. the \`fread()\` function allows you to read a block of data from a file like this: \`fread(ptr, size, nitems, fp)\` in which \`ptr\` is a pointer to a block of memory with a minimum size of \`size * nitems\` bytes, \`size\` is the size in bytes of each item to be read, \`nitems\` is the number of items, and \`fp\` is the file pointer.
[c-library-functions]: getc, fscanf, fread
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
[end-question-answer]


${thread}
[follow-up-question]: ${newQuestion}
[answer]:`,
        stop: ["[end-question-answer]"],
        model: "text-davinci-003",
        temperature: 0.15,
        max_tokens: 1024,
        parser: (resTxt: string) => genericParser(resTxt),
        raw: (resTxt: string) => `[follow-up-question]: ${newQuestion}
[answer]:${resTxt}`,
    };
};

export const suggestAskQuestion = (question: string, answer: string) => {
    return {
        prompt: `[question]: ${question}
[answer]:
${answer}
[follow-up-questions]: based on the above [question] and [answer], generate three separate and different follow-up questions:
1.`,
        stop: ["4."],
        model: "text-davinci-003",
        temperature: 0.3,
        max_tokens: 3000,
        parser: (output: string) => suggestionsParser(output),
    };
};
