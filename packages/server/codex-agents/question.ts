const mainAskQuestionV2 = (question: string) => {
    return {
        prompt: `<|endoftext|>// blank .c question / answer file. use the following format:
// [question]: what is the meaning of life?
// [detailed-answer]: (in the context of C Programming)
{
    "answer": "this question is irrelevent to C programming"
}
// [end-question-answer]


// [question]: how can I read from a file?
// [detailed-answer]: (in the context of C Programming)
{
    "answer": "You can use the \`fopen()\` function to open a file and store the file pointer in a variable (like \`FILE *fp\`). Then, you can use the \`fscanf()\` function to read from the file. You can also use the \`fgets()\` function to read a line from the file. You can use the \`fclose()\` function to close the file.",
    "c-library-functions": [
        {
            "name": "fopen",
            "description": "opens a file given a filename and a mode",
            "include": "stdio.h",
            "prototype": "FILE *fopen(const char *filename, const char *mode)"
        },
        {
            "name": "fscanf",
            "description": "reads formatted input from a file",
            "include": "stdio.h",
            "prototype": "int fscanf(FILE *stream, const char *format, ...)"
        },
        {
            "name": "fgets",
            "description": "reads a line from a file",
            "include": "stdio.h",
            "prototype": "char *fgets(char *str, int n, FILE *stream)"
        },
        {
            "name": "fclose",
            "description": "closes a file",
            "include": "stdio.h",
            "prototype": "int fclose(FILE *stream)"
        }
    ]
    "example-code-title": "read a file line by line",
    "example-code":
"FILE *file;
char line[100];

file = fopen(\\"file.txt\\", \\"r\\");
if (file == NULL) {
    printf(\\"Error opening file!\n\\");
    return 1;
}

while (fgets(line, 100, file) != NULL) {
    printf(\\"%s\\", line);
}

fclose(file);"
}
// [end-question-answer]


// [question]: is it possible to initialize a boolean and reassign its value for use later in a program?
// [detailed-answer]: (in the context of C Programming)
{
    "answer": "Yes, it is possible to initialize a boolean and reassign its value in C programming. However, there is no built-in boolean type in C, so a boolean-like behavior can be achieved using the \`_Bool\` or \`bool\` type from \`<stdbool.h>\` in C99 and later versions of the language, or by using integer constants such as 0 (representing false) and 1 (representing true).",
    "c-library-functions": [
        {
            "name": "bool",
            "description": "header file that defines the \`_Bool\` and \`bool\` types",
            "include": "stdbool.h",
            "prototype": "bool"
        }
    ],
    "example-code-title": "initialize a boolean and reassign its value",
    "example-code":
"#include <stdbool.h>
#include <stdio.h>

int main() {
  bool flag = false;
  printf("Flag is initially %d\n", flag);
  
  flag = true;
  printf("Flag is now %d\n", flag);
  
  return 0;
}"
}
// [end-question-answer]


// [question]: ${question}
// [detailed-answer]: (in the context of C Programming)
`,
        stopTokens: [
            "// [end-question-answer]",
            "// [question]:",
            "// [detailed-answer]:",
        ],
    };
};

const suggestAskQuestionV2 = (question: string, answer: string) => {
    return {
        prompt: `[question]: ${question}
[answer]: ${answer}
[follow-up-questions]: generate three follow-up questions related to C programming and the topics mentioned in the above [question] and [answer]:
1.`,
        stopTokens: [`4.`],
    };
};

const replyAskQuestionV2 = (prevThread: string, newQuestion: string) => {
    return {
        prompt: `// [question]: how can I concatenate two dynamically allocated strings?
// [detail-answer]: (in the context of C Programming)
{
    "answer": "You can use the \`strcat()\` function from the \`<string.h>\` library to concatenate two dynamically allocated strings. The \`strcat()\` function takes two arguments: the first argument is the destination string, and the second argument is the string to be appended to the destination string. The \`strcat()\` function returns a pointer to the destination string.",
    "c-library-functions": [
        {
            "name": "strcat",
            "description": "appends a string to another string",
            "include": "string.h",
            "prototype": "char *strcat(char *dest, const char *src)"
        }
    ],
    "example-code-title": "concatenate two dynamically allocated strings",
    "example-code":
"#include <stdio.h>
#include <string.h>

int main() {
    char *str1 = malloc(100);
    char *str2 = malloc(100);

    strcpy(str1, \\"Hello \\");
    strcpy(str2, \\"World!\\");

    strcat(str1, str2);
    printf(\\"%s\\", str1);
  
    return 0;
}"
}
// [follow-up-question]: how can I manually do this without using stract?
// [detail-answer]: (in the context of C Programming)
{
    "answer": "You can manually concatenate two dynamically allocated strings by using a for loop to go through each character of the second string and copy it to the end of the first string. Then, you can add a null terminator to the end of the first string.",
    "example-code-title": "concatenate two dynamically allocated strings manually",
    "example-code":
"#include <stdio.h>
#include <string.h>

int main() {
    char *str1 = malloc(100);
    char *str2 = malloc(100);

    strcpy(str1, \\"Hello \\");
    strcpy(str2, \\"World!\\");

    int i = 0;
    while (str2[i] != \\"\\"0) {
        str1[strlen(str1)] = str2[i];
        i++;
    }
    str1[strlen(str1)] = \\"\\"0;
    printf(\\"%s\\", str1);

    return 0;
}"
}
// [end-question-answer]


${prevThread}
// [follow-up-question]: ${newQuestion}
// [detail-answer]: (in the context of C Programming)
`,

        stopTokens: [`// [end-question-answer]`],
    };
};
