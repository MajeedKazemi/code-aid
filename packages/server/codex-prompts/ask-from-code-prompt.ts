import { genericParser } from "./shared/parsers";

export const mainAskFromCode = (question: string, code: string) => {
    return {
        prompt: `<|endoftext|>// for each provided [code] and asked [question] (which is asked about the [code]), provide a thorough [answer] (single-paragraph) and a list of [c-library-functions] that are relevant to the [answer]. if needed, also provide a [code] example with a [code-title] and end it with [end-code]. each response should end with [end-question-answer].

[code]:
nice code you got over there :)
[question]: what is the meaning of life?
[answer]: the question or the provided code are irrelevant to C Programming.
[end-question]
        

[code]:
typedef struct user {
    char name[MAX_NAME];
    char profile_pic[MAX_NAME];  // This is a *filename*, not the file contents.
    struct post *first_post;
    struct user *friends[MAX_FRIENDS];
    struct user *next;
} User;

int create_user(const char *name, User **user_ptr_add) {
    if(strlen(name) > 33){
        return -2;
    }

    while((*user_ptr_add)->next != NULL){
        if (strcmp((**user_ptr_add).name, name) == 0){
            return -1;
        }
        *user_ptr_add = (*user_ptr_add)->next;
    }

    User *add = malloc(sizeof(User));
    strcpy(add->name, name);

    (*user_ptr_add)->next = add;
    return -1;
}
[question]: why is there a segmenation fault?
[answer]: The code is prone to a segmentation fault because of the way \`user_ptr_add\` is used in \`while ((*user_ptr_add)->next != NULL)\` and \`*user_ptr_add = (*user_ptr_add)->next\`. In particular, the code uses \`*user_ptr_add\` to traverse the linked list of User structures, but the while loop does not check if \`*user_ptr_add\` is NULL before accessing its fields. Fix this by checking if \`*user_ptr_add\` is not NULL before accessing its fields.
[code]:
[code-title]: fixed while loop
while ((*user_ptr_add) != NULL && (*user_ptr_add)->next != NULL)
[end-code]
[end-question-answer]


[code]:
void fib(int **pt, int n) {
    *pt = malloc(sizeof(int) * n);
    int *heap_pt = *pt;
    for (int i = 0; i < n ; i++) {
      if (i == 0) {
        heap_pt[0] = 0;
      } else if (i == 1) {
        heap_pt[1] = 1;
      } else {
        heap_pt[i] = heap_pt[i-1] + heap_pt[i-2];
      }
    }
}
[question]: is *heap_pt pointing to the first element of an array?
[answer]: Yes, \`heap_pt\` is pointing to the first element of an array. In this code, \`pt\` is a double pointer to an integer, and \`heap_pt\` is a single pointer to an integer. \`malloc\` is used to allocate memory dynamically on the heap and the returned pointer is stored in \`*pt\`. Then \`heap_pt\` is assigned the value of \`*pt\`, so \`heap_pt\` is pointing to the first element of the dynamically allocated array. In the for loop, the Fibonacci sequence is calculated and stored in the dynamically allocated memory, starting from the first element, which \`heap_pt\` is pointing to.
[end-question-answer]


[code]:
unsigned long fsize(char* file) {
    FILE f = fopen(file, "r");
    fseek(0, f, SEEK_END);
    long len = long(ftell(f));
    fclose(f);

    return len;
}
[question]: what's wrong with this code?
[answer]: The code contains a number of issues that would prevent it from working as intended: 1. The \`FILE\` type should be a pointer, but it is being declared as a value in the line \`FILE f = fopen(file, "r");\`. 2. The \`fseek\` function takes the file pointer as its first argument and the offset as its second argument, but the arguments are being passed in the opposite order in the line \`fseek(0, f, SEEK_END);\`. 3. \`long\` is not a valid type in C, instead \`long int\` should be used.
[code]:
[code-title]: fixed code
unsigned long fsize(char* file) {
    FILE *f = fopen(file, "r");
    fseek(f, 0, SEEK_END);
    long int len = ftell(f);
    fclose(f);

    return len;
}
[end-code]
[c-library-functions]: fopen, fseek, ftell, fclose
[end-question-answer]


[code]:
${code}
[question]: ${question}
[answer]:`,
        stop: ["[end-question-answer]"],
        model: "text-davinci-003",
        temperature: 0.05,
        max_tokens: 1024,
        parser: (resTxt: string) => genericParser(resTxt),
        raw: (resTxt: string) => `[code]:
${code}
[question]: ${question}
[answer]:${resTxt}`,
    };
};

export const suggestAskFromCode = (
    code: string,
    question: string,
    answer: string
) => {
    return {
        prompt: `[code]:
${code}
[question]: ${question}
[answer]:
${answer}
[suggested-questions]: generate three follow-up questions related to C programming and the above [code] and [question]?
1.`,
        stop: [`4.`],
        model: "text-davinci-003",
        temperature: 0.3,
        max_tokens: 3500,
        parser: (output: string) => {
            return {
                suggestions: output
                    .split("\n")
                    .map((line) => line.trim().replace(/^(\d+\.)\s*/, "")),
            };
        },
    };
};

export const replyAskFromCode = (
    code: string,
    prevResponses: string[] | undefined,
    newQuestion: string
) => {
    let thread = `[code]:\n${code}\n`;

    if (prevResponses !== undefined && prevResponses.length != 0) {
        for (let i = 0; i < prevResponses.length; i++) {
            let lines = prevResponses[i].split("\n");

            let startWithQuestion = lines.filter((line) =>
                line.startsWith("[question]:")
            );

            if (startWithQuestion.length > 0) {
                let question = startWithQuestion[0].replace("[question]: ", "");
                let answer = lines
                    .filter((line) => line.startsWith("[answer]:"))[0]
                    .replace("[answer]: ", "");

                thread += `[question]: ${question}\n[answer]: ${answer}\n[end-question-answer]\n\n`;
            } else {
                let followUpQuestion = lines
                    .filter((line) =>
                        line.startsWith("[follow-up-question]:")
                    )[0]
                    .replace("[follow-up-question]: ", "");

                let followUpAnswer = lines
                    .filter((line) => line.startsWith("[answer]:"))[0]
                    .replace("[answer]: ", "");

                thread += `[follow-up-question]: ${followUpQuestion}\n${followUpAnswer}\n[end-question-answer]\n\n`;
            }
        }
    }

    return {
        prompt: `<|endoftext|>// for each asked [question], provide a thorough [answer] (single-paragraph) and a list of [c-library-functions] that are relevant to the [answer]. if needed, also provide a [code] example with a [code-title] and end it with [end-code]. each response should end with [end-question-answer].

[code]:
unsigned long fsize(char* file) {
    FILE f = fopen(file, "r");
    fseek(0, f, SEEK_END);
    long len = long(ftell(f));
    fclose(f);

    return len;
}
[question]: what's wrong with this code?
[answer]: The code contains a number of issues that would prevent it from working as intended: 1. The \`FILE\` type should be a pointer, but it is being declared as a value in the line \`FILE f = fopen(file, "r");\`. 2. The \`fseek\` function takes the file pointer as its first argument and the offset as its second argument, but the arguments are being passed in the opposite order in the line \`fseek(0, f, SEEK_END);\`. 3. \`long\` is not a valid type in C, instead \`long int\` should be used.
[code]:
[code-title]: fixed code
unsigned long fsize(char* file) {
    FILE *f = fopen(file, \"r\");
    fseek(f, 0, SEEK_END);
    long int len = ftell(f);
    fclose(f);
    
    return len;
}
[end-code]
[follow-up-question]: how can I use fseek and ftell properly?
[answer]: Here's the prototype of the \`fseek\` function: \`int fseek(FILE *stream, long int offset, int whence);\`. The first argument is the file pointer, the second argument is the offset, and the third argument is the position from which the offset is measured. The third argument can be one of the following values: 1. \`SEEK_SET\` - the offset is measured from the beginning of the file 2. \`SEEK_CUR\` - the offset is measured from the current position in the file 3. \`SEEK_END\` - the offset is measured from the end of the file Here's the prototype of the \`ftell\` function: \`long int ftell(FILE *stream);\`. The \`ftell\` function returns the current position in the file, which is measured in bytes from the beginning of the file. Below is an example of how to use \`fseek\` and \`ftell\` to get the length of a file:
[code]:
[code-title]: example usage of fseek and ftell
#include <stdio.h>
int main() {
    FILE *f = fopen("test.txt", "r");
    fseek(f, 0, SEEK_END);
    long int len = ftell(f);
    fseek(f, 0, SEEK_SET);
    char *buf = (char *) malloc(len);
    fread(buf, 1, len, f);
    fclose(f);
    printf("%s", buf);
    free(buf);
    return 0;
}
[end-code]
[c-library-functions]: fopen, fseek, ftell, fread, fclose, malloc, free
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
