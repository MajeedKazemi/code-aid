import { spawn } from "child_process";
import * as Diff from "diff";
import * as beautify from "js-beautify";

// note: 1. remove comments, 2. format code

export const removeComments = (code: string) =>
    code
        .replace(/\/\/.*?\n/g, "") // single line comments
        .replace(/\/\*[\s\S]*?\*\//g, ""); // multi-line comments

export const formatCCode = (code: string): Promise<string> =>
    new Promise((resolve, reject) => {
        const clangFormat = spawn("clang-format", [
            "-style={BasedOnStyle: Google, ColumnLimit: 160, IndentWidth: 4}",
        ]);

        clangFormat.stdin.write(code);
        clangFormat.stdin.end();

        let formattedCode = "";

        clangFormat.stdout.on("data", (data) => {
            formattedCode += data.toString();
        });

        clangFormat.stderr.on("data", (data) => {
            reject(data.toString());
        });

        clangFormat.on("close", (code: number) => {
            if (code === 0) {
                resolve(formattedCode);
            } else {
                reject(`clang-format exited with code ${code}`);
            }
        });
    });

export const formatCode = (code: string) => {
    let formattedCode = beautify.js(code, {
        indent_size: 4,
        indent_char: " ",
        preserve_newlines: true,
        brace_style: "collapse",
        keep_array_indentation: false,
        space_before_conditional: false,
        unescape_strings: false,
        end_with_newline: false,
        comma_first: false,
        break_chained_methods: false,
        indent_empty_lines: false,
        max_preserve_newlines: 1,
    });

    // loop through the formattedCode and remove empty lines between #include lines

    let formattedCodeLines = formattedCode.split("\n");
    let formattedCodeLinesNoEmptyLines = [];

    let i = 0;

    while (i < formattedCodeLines.length) {
        if (
            formattedCodeLines[i].startsWith("#include") &&
            formattedCodeLines[i + 1].trim() === ""
        ) {
            formattedCodeLinesNoEmptyLines.push(formattedCodeLines[i]);
            i += 2;
        } else {
            formattedCodeLinesNoEmptyLines.push(formattedCodeLines[i]);
            i++;
        }
    }

    return formattedCodeLinesNoEmptyLines.join("\n").trim();
};

export const labelModifiedLines = (
    oldCode: string,
    newCode: string,
    label: string = "modified"
) => {
    const diff = Diff.diffLines(oldCode, newCode);
    let annotatedCode = "";

    diff.forEach((part) => {
        if (part.added) {
            const lines = part.value.split("\n");
            lines.forEach((line) => {
                if (line.trim() !== "") {
                    annotatedCode += `${line} // [${label}]\n`;
                }
            });
        } else if (part.removed) {
            // do nothing for removed lines
        } else {
            annotatedCode += part.value; // no change, copy line as is
        }
    });

    return annotatedCode;
};

export const testDiffs = () => {
    let c1 = `void fib(int **arr, int count) {
    *arr = malloc(count * sizeof(int));
    
    if (count == 0) {
        *arr[0] = 0;
    } else if (count == 1) {
        *arr[0] = 0;
        *arr[1] = 1;
    }

    for (int i = 2; i < count; i++) {
        *arr[i] = *arr[i - 1] + *arr[i - 2];
    }

    return arr;
}`;

    let c1_fixed = `void fib(int **arr, int count) {
    *arr = malloc(count * sizeof(int));

    if (count > 0) {
        (*arr)[0] = 0;
    }

    if (count > 1) {
        (*arr)[1] = 1;
    }
    
    for (int i = 2; i < count; i++) {
        (*arr)[i] = (*arr)[i - 1] + (*arr)[i - 2];
    }
}`;

    let c2 = `int populate_array(int sin, int *sin_arr) {
    for (int i = 8; i >= 0; i--) {
        if (sin != 0) {
            sin_arr[i] = sin % 10;
            sin = sin / 10;
        }

        else {
            return 1;
        }
    }
    return 0;
}`;

    let c2_fixed = `int populate_array(int sin, int *sin_arr) {
    int num_digits = 0;

    while (sin != 0) {
        if (num_digits > 8) {
            return 1;
        }

        sin_arr[num_digits] = sin % 10;
        sin = sin / 10;
        num_digits++;
    }

    if (num_digits != 9) {
        return 1;
    }
    return 0;
}`;

    let c3 = `int make_post(const User *author, User *target, char *contents) {
    if (author == NULL || target == NULL) { //check whether either User pointer is NULL
        return 2;
    }
    
    for (int i = 0; i < MAX_FRIENDS; i++) {
        if (author->friends[i] == target) { // check whether they are friends, then add posts to them
            Post *post = malloc(sizeof(Post));
            strcpy(post->author, author->name);
            strcpy(post->contents, contents);
            *post->date = time(NULL);
            post->next = target->first_post;
            target->first_post = post;
            return 0;
        }
    }
    return 1;
}`;

    let c3_fixed = `int make_post(const User *author, User *target, char *contents) {
    if (author == NULL || target == NULL) {
        return 2;
    }

    for (int i = 0; i < MAX_FRIENDS; i++) {
        if (author->friends[i] == target) {
            Post *post = malloc(sizeof(Post));
            strcpy(post->author, author->name);
            strcpy(post->contents, contents);
            post->date = time(NULL);
            post->next = target->first_post;
            target->first_post = post;
            return 0;
        }
    }
    return 1;
}`;

    let c4 = `#include <stdio.h>

int main() {

    int error;
    FILE *scores_file;

    scores_file = fopen("high scores.txt", "w");

    error = fclose(scores_file);
    if (error != 0) {
        fprintf(stderr, "fclose failed\n");
        return 1;
    }

    return 0;
}`;

    let c4_fixed = `#include <stdio.h>

int main() {

    int error;
    FILE *scores_file;

    scores_file = fopen("../RELATIVE_PATH/high scores.txt", "r");

    error = fclose(scores_file);
    if (error != 0) {
        fprintf(stderr, "fclose failed\n");
        return 1;
    }

    return 0;
}`;

    console.log("c1:");
    console.log(labelModifiedLines(c1, c1_fixed));
    console.log("\n\n\n");
    console.log("c2:");
    console.log(labelModifiedLines(c2, c2_fixed));
    console.log("\n\n\n");
    console.log("c3:");
    console.log(labelModifiedLines(c3, c3_fixed));
    console.log("\n\n\n");
    console.log("c4:");
    console.log(labelModifiedLines(c4, c4_fixed));
    console.log("\n\n\n");
};
