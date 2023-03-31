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
            "-style={BasedOnStyle: Google, ColumnLimit: 160, IndentWidth: 4, AllowShortFunctionsOnASingleLine: Empty}",
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
                    annotatedCode += `${line} // [modified]\n`;
                }
            });
        } else if (part.removed) {
            // do nothing for removed lines
            const lines = part.value.split("\n");

            lines.forEach((line) => {
                if (line.trim() !== "") {
                    annotatedCode += `${line} // [added]\n`;
                }
            });
        } else {
            annotatedCode += part.value; // no change, copy line as is
        }
    });

    return annotatedCode.trim();
};

export const labelOriginalCode = (newCode: string, oldCode: string) => {
    const diff = Diff.diffLines(oldCode, newCode);
    let annotatedCode = "";

    for (const part of diff) {
        if (part.added) {
            const lines = part.value.split("\n");

            for (const line of lines) {
                if (line.trim() !== "") {
                    annotatedCode += `${line} // [modified]\n`;
                }
            }
        } else if (part.removed) {
            const lines = part.value.split("\n");

            for (const line of lines) {
                if (line.trim() !== "" && line.trim() !== "\n") {
                    // count spaces before the line

                    annotatedCode += `${keepSpacesBeforeLine(
                        line
                    )}// [added]\n`;
                } else {
                    // console.log("line is empty");
                }
            }
        } else {
            annotatedCode += part.value; // no change, copy line as is
        }
    }

    // go through each line of annotatedCode
    // if a line has // [added] and the line after it is // [modified] -> delete the // [added] part
    let finalAnnotatedCode = "";
    let lines = annotatedCode.split("\n");
    for (const [index, line] of lines.entries()) {
        if (
            index + 1 < lines.length &&
            line.includes("// [added]") &&
            lines[index + 1].includes("// [modified]")
        ) {
            // do nothing
            // console.log("");
        } else {
            finalAnnotatedCode += line + "\n";
        }
    }

    // lines = finalAnnotatedCode.split("\n");
    // finalAnnotatedCode = "";
    // // this time go through each line of annotatedCode
    // // for consecutive lines with // [added] just keep the first one
    // for (const [index, line] of lines.entries()) {
    //     if (
    //         index + 1 < lines.length &&
    //         line.includes("// [added]") &&
    //         lines[index + 1].includes("// [added]")
    //     ) {
    //         // do nothing
    //         console.log("");
    //     } else {
    //         finalAnnotatedCode += line + "\n";
    //     }
    // }

    return finalAnnotatedCode.trim();
};

export const labelFixedCode = (oldCode: string, newCode: string) => {
    const diff = Diff.diffLines(oldCode, newCode);
    let annotatedCode = "";

    for (const part of diff) {
        if (part.added) {
            const lines = part.value.split("\n");
            lines.forEach((line) => {
                if (line.trim() !== "") {
                    annotatedCode += `${line} // [fixed]\n`;
                }
            });
        } else if (part.removed) {
            // do nothing for removed lines
        } else {
            annotatedCode += part.value; // no change, copy line as is
        }
    }

    return annotatedCode;
};

const keepSpacesBeforeLine = (line: string) => {
    let spaces = 0;
    for (const char of line) {
        if (char === " ") {
            spaces++;
        } else {
            break;
        }
    }

    return " ".repeat(spaces);
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

    let c5 = `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

#define MAXLINE 256

#define SUCCESS "Password verified\n"
#define INVALID "Invalid password\n"
#define NO_USER "No such user\n"

int main(void) {
    char user_id[MAXLINE];
    char password[MAXLINE];

    if (fgets(user_id, MAXLINE, stdin) == NULL) {
        perror("fgets");
        exit(1);
    }
    if (fgets(password, MAXLINE, stdin) == NULL) {
        perror("fgets");
        exit(1);
    }

    return 0;
}`;

    let c5_fixed = `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

#define MAXLINE 256

#define SUCCESS "Password verified\n"
#define INVALID "Invalid password\n"
#define NO_USER "No such user\n"

int main(void) {
    char user_id[MAXLINE];
    char password[MAXLINE];

    if (fgets(user_id, MAXLINE, stdin) == NULL) {
        perror("fgets");
        exit(1);
    }
    if (fgets(password, MAXLINE, stdin) == NULL) {
        perror("fgets");
        exit(1);
    }

    // TODO: Check the password
    int fd[2];
    if (pipe(fd) == -1) {
        perror("pipe");
        exit(1);
    }

    pid_t pid = fork();
    if (pid == -1) {
        perror("fork");
        exit(1);
    }

    if (pid == 0) {
        // Child process
        close(fd[0]);
        dup2(fd[1], STDOUT_FILENO);
        execl("/usr/bin/passwd", "passwd", user_id, NULL);
        perror("execl");
        exit(1);
    } else {
        // Parent process
        close(fd[1]);
        dup2(fd[0], STDIN_FILENO);
        char buf[MAXLINE];
        if (fgets(buf, MAXLINE, stdin) == NULL) {
            perror("fgets");
            exit(1);
        }
        if (strcmp(buf, password) == 0) {
            printf(SUCCESS);
        } else {
            printf(INVALID);
        }
    }

    return 0;
}`;

    let c6 = `void fib(int **arr, int count) {
    *arr = malloc(count * sizeof(int));

    *arr[0] = 0;
    *arr[1] = 1;

    for (int i = 2; i < count; i++) {
        *arr[i] = *arr[i - 1] + *arr[i - 2];
    }
    return arr;
}`;

    let c6_fixed = `void fib(int **arr, int count) {
    *arr = malloc(count * sizeof(int));

    if (count < 2) {
        return;
    }
    
    (*arr)[0] = 0;
    (*arr)[1] = 1;

    for (int i = 2; i < count; i++) {
        (*arr)[i] = (*arr)[i - 1] + (*arr)[i - 2];
    }
}`;

    let c7 = `int **split_array(const int *s, int length) {

}`;

    let c7_fixed = `int **split_array(const int *s, int length) {
    int **arr = malloc(sizeof(int *) * 2);

    arr[0] = malloc(sizeof(int) * (length / 2));
    arr[1] = malloc(sizeof(int) * (length / 2 + (length % 2)));
    
    for (int i = 0; i < length; i++) {
        if (i % 2 == 0) {
            arr[0][i / 2] = s[i];
        } else {
            arr[1][i / 2] = s[i];
        }
    }
    
    return arr;
}`;

    // console.log(labelFixedCode(c6, c6_fixed));
    // console.log(labelOriginalCode(c6, c6_fixed));

    // console.log(labelFixedCode(c7, c7_fixed));
    // console.log(labelOriginalCode(c7, c7_fixed));

    // console.log("\n\n\n");

    // console.log(labelFixedCode(c4, c4_fixed));
    // console.log(labelOriginalCode(c4, c4_fixed));

    // console.log("\n\n\n");

    // console.log(labelFixedCode(c3, c3_fixed));
    // console.log(labelOriginalCode(c3, c3_fixed));

    // console.log("\n\n\n");

    // console.log(labelFixedCode(c2, c2_fixed));
    // console.log(labelOriginalCode(c2, c2_fixed));

    // console.log("\n\n\n");

    // console.log(labelFixedCode(c1, c1_fixed));
    // console.log(labelOriginalCode(c1, c1_fixed));

    // console.log("\n\n\n");

    // console.log("c1:");
    // console.log(labelModifiedLines(c1, c1_fixed));
    // console.log("\n\n\n");
    // console.log("c2:");
    // console.log(labelModifiedLines(c2, c2_fixed));
    // console.log("\n\n\n");
    // console.log("c3:");
    // console.log(labelModifiedLines(c3, c3_fixed));
    // console.log("\n\n\n");
    // console.log("c4:");
    // console.log(labelModifiedLines(c4, c4_fixed));
    // console.log("\n\n\n");
};
