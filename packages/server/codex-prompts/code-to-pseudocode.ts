import { ChatCompletionRequestMessage } from "openai";

import { pseudocodeParser } from "./shared/parsers";

export const codeToPseudocode = (code: string) => {
    const messages: Array<ChatCompletionRequestMessage> = [
        {
            role: "system",
            content: `generate pseudo-code from c language code. add an explanation of that line of code after each line. keep all the lines that start with "[code-title]":`,
        },
        {
            role: "user",
            content: `[code]:
[code-title]: define struct
struct node {
    int data;
    struct node *next;
};

[code-title]: initialize a 2D array
*arr = (int *)malloc(n * sizeof(int));

[code-title]: dereference double pointer
(*arr)[0] = 0;

[code-title]: initialize new node
new_node->data = 1;
new_node->next = NULL;`,
        },
        {
            role: "assistant",
            content: `[pseudo-code]:
[code-title]: define struct
STRUCT node:
    data as int
    next as pointer to node

[code-title]: initialize a 2D array
set arr to 'malloc' for n ints // use \`malloc\` and \`sizeof\` to allocate memory for \`n\` integers -> cast it to an int pointer -> set it to \`arr\`.

[code-title]: dereference double pointer
set arr[0] to 0 // dereference \`arr\` (use parenthesis for operator precedence) -> index element \`[0]\` -> set to \`0\`.

[code-title]: initialize new node
set field data of new_node to 1
set field next of new_node to NULL
[end-pseudo-code]`,
        },
        {
            role: "user",
            content: `[code]:
[code-title]: initialize values
#include <stdbool.h>

char[] s =  "hello";
int[] r = {1,2,3,4,5};
int[] r2 = int[10];
bool arr[2] = { true, false };`,
        },
        {
            role: "assistant",
            content: `[pseudo-code]:
[code-title]: initialize values
include stdbool // include \`stdbool.h\` to use: \`bool\` (type), \`true\` and \`false\` (constants).

set s to "hello"
set r to {1, 2, 3, 4, 5}
init r2 as int array of size 10
set arr as bool array to { true, false } // use the \`bool\` type (from \`stdbool.h\`) to initialize an array with two boolean values: \`true\` and \`false\`.
[end-pseudo-code]`,
        },
        {
            role: "user",
            content: `[code]:
[code-title]: read bitmap metadata
# include <stdio.h>
# include <stdlib.h>
# include <unistd.h>

void read_bitmap_metadata(FILE *image, int *pixel_array_offset) {
    fseek(image, 10, SEEK_SET);

    while (fread(pixel_array_offset, 4, 1, image) != 0) {
        printf("fread: %d\\n", *pixel_array_offset);
    }

    // fork a child process
    pid_t pid = fork();

    if (pid == 0) {
        // child process
        printf("child process\\n");
        exit(0);
    }
}`,
        },
        {
            role: "assistant",
            content: `[pseudo-code]:
[code-title]: read bitmap metadata
include stdio // include \`stdio.h\` to use: \`FILE\` (type), \`fseek\` (function), \`fread\` (function), \`printf\` (function).
include stdlib // include \`stdlib.h\` to use: \`malloc\` (function), \`free\` (function).
include unistd // include \`unistd.h\` to use: \`pid_t\` (type), \`fork\` (function), \`exit\` (function).

FUNCTION read_bitmap_metadata(image, pixel_array_offset) -> void: // define the \`read_bitmap_metadata\` function that receives \`image\` as a \`FILE\` pointer and \`pixel_array_offset\` as an \`int\` pointer and returns \`void\`.
    fseek image to 10 bytes // use the \`fseek\` function with \`SEEK_SET\` to move the file pointer of \`image\` to the \`10\`th byte of the file.
    
    WHILE fread from image into pixel_array_offset != 0: // repeatedly use \`fread\` to read \`4\` bytes from the file into the \`pixel_array_offset\` variable -> check if the result is \`0\` (end of file).
        printf "fread: {pixel_array_offset}" // use \`printf\` to print the value of \`pixel_array_offset\` as a decimal (using the \`%d\` format specifier).
    
    [ fork a child process ]
    set pid to fork // use the \`fork\` function to create a child process -> set the result to \`pid\` (of type \`pid_t\`).

    IF pid == 0: // check if the result of \`fork\` is \`0\` which means that the current process is the child process.
        [ child process ]
        printf "child process" // use \`printf\` to print the string \`"child process"\`.
        exit with status 0 // use \`exit\` function to exit the child process with a status code of \`0\`.
[end-pseudo-code]`,
        },
        {
            role: "user",
            content: `[code]:
${code}`,
        },
    ];
    return {
        messages,
        stop: ["[end-pseudo-code]"],
        model: "gpt-3.5-turbo",
        temperature: 0.25,
        max_tokens: 1024,
        parser: (resTxt: string) => pseudocodeParser(resTxt),
        raw: (resTxt: string) => `[code]:\n${code}\n${resTxt}`,
    };
};
