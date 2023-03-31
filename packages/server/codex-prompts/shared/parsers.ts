import {
    IParsedAskQuestionResponse,
    IParsedExplainCodeResponse,
    IParsedExplainedDiffCodeResponse,
    IParsedFixedCodeResponse,
    IParsedPseudoCodeResponse,
} from "../../sockets/socket-handler";
import { getManPage } from "../static-man-pages";

export const genericParser = (r: string) => {
    let obj: any = {};
    const stack: string[] = [];
    const lines = ("[answer]:" + r).split("\n");

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith("[answer]:")) {
            obj.answer = line.replace("[answer]:", "").trim();
        } else if (line.startsWith("[c-library-functions]:")) {
            obj.cLibraryFunctions = line
                .replace("[c-library-functions]:", "")
                .split(",")
                .map((name: string) => {
                    const functionName = name.trim();

                    return {
                        name: functionName,
                        data: getManPage(functionName),
                    };
                })
                .filter((f: any) => f.data);
        } else if (line.startsWith("[code]:")) {
            obj.rawCode = "";
            stack.push("code");
        } else if (line.startsWith("[end-code]")) {
            stack.pop();
            obj.rawCode = obj.rawCode?.trim();
        } else if (
            stack[stack.length - 1] === "code" &&
            line[i - 1] !== "[code]:"
        ) {
            obj.rawCode += line + "\n";
        }
    }

    obj.rawCode = obj.rawCode?.trim();

    return obj as IParsedAskQuestionResponse;
};

export const pseudocodeParser = (r: string) => {
    const obj: any = {
        pseudoCode: [
            {
                title: "",
                lines: [],
            },
        ],
    };

    for (let i = 0; i < r.split("\n").length; i++) {
        const line = r.split("\n")[i];

        if (line.startsWith("[code-title]:")) {
            obj.pseudoCode.push({
                title: line.replace("[code-title]:", "").trim(),
                lines: [],
            });
        } else if (line == "[end-pseudo-code]") {
            continue;
        } else {
            const [code, explanation] = line.split(" // ");

            if (obj.pseudoCode.length != 0) {
                obj.pseudoCode[obj.pseudoCode.length - 1].lines.push({
                    code: code.trimEnd(),
                    explanation: explanation?.trimEnd(),
                });
            }
        }
    }

    return obj as IParsedPseudoCodeResponse;
};

export const suggestionsParser = (r: string) => {
    return {
        suggestions: r
            .split("\n")
            .map((line) => line.trim().replace(/^(\d+\.)\s*/, "")),
    };
};

export const explainCodeParser = (r: string) => {
    const obj: any = {};
    const stack: string[] = [];
    const lines = r.trim().split("\n");

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith("[explanation]:")) {
            obj.explanation = line.replace("[explanation]:", "").trim();
        } else if (line.startsWith("[c-library-functions]:")) {
            obj.cLibraryFunctions = line
                .replace("[c-library-functions]:", "")
                .split(",")
                .map((name: string) => {
                    const functionName = name.trim();

                    return {
                        name: functionName,
                        data: getManPage(functionName),
                    };
                })
                .filter((f: any) => f.data);
        } else if (line.startsWith("[annotated-code]:")) {
            obj.lines = [];
            stack.push("annotated-code");
        } else if (line.startsWith("[end-annotated-code]")) {
            stack.pop();
        } else if (stack[stack.length - 1] === "annotated-code") {
            const [code, explanation] = line.split(" // ");

            obj.lines.push({
                code: code.trimEnd(),
                explanation: explanation?.trimEnd(),
            });
        }
    }

    return obj as IParsedExplainCodeResponse;
};

export const diffFixedCodeParser = (txt: string) => {
    const r = `[explained-original-code]:\n${txt}`;

    const obj: any = {
        rawExplainedLines: "",
        explanation: "",
    };

    const lines = r.split("\n");

    let inLineByLineExplanation = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith("[explained-original-code]")) {
            inLineByLineExplanation = true;
            continue;
        } else if (line.startsWith("[end-explained-original-code]")) {
            inLineByLineExplanation = false;
            continue;
        } else if (inLineByLineExplanation) {
            obj.rawExplainedLines += line + "\n";
        } else if (line.startsWith("[high-level-explanation-of-changes]")) {
            obj.explanation = line.replace(
                "[high-level-explanation-of-changes]: ",
                ""
            );
        }
    }

    obj.rawExplainedLines = obj.rawExplainedLines.trim();

    obj.lines = obj.rawExplainedLines.split("\n").map((line: string) => {
        let splitter = " // [modified-reason]: ";

        if (line.includes("// [added-reason]: ")) {
            splitter = " // [added-reason]: ";
        }

        const [code, explanation] = line.split(splitter);

        return {
            code,
            explanation,
        };
    });

    return obj as IParsedExplainedDiffCodeResponse;
};

export const rawFixedCodeParser = (r: string) => {
    const obj: any = {
        rawFixedCode: r,
    };

    // remove [end-fixed-code] from the end of the file

    if (r.endsWith("\n[end-fixed-code]")) {
        obj.rawFixedCode = r.replace("\n[end-fixed-code]", "");
    }

    return obj as IParsedFixedCodeResponse;
};

export const testParser = () => {
    const test1 = ` The \`scanf()\` function is used to read input from the standard input stream (stdin). It takes a format string and a list of arguments as parameters. The format string contains the format specifiers that indicate the type of input to be read. The arguments are the variables in which the input will be stored.

For example, the following code reads an integer and a string from the standard input stream:

[c-library-functions]: scanf
[code]:
[code-title]: read an integer and a string using scanf
#include <stdio.h>

int main() {
    int num;
    char str[100];
    scanf("%d %s", &num, str);
    printf("You entered %d and %s\n", num, str);
    return 0;
}

[code-title]: function that multiplies a number by 2 
void multiplyBy2(int *num) {
    *num *= 2;
}
[end-code]
[end-question-answer]`;
    // console.log(genericParser(test1));

    let test2 = `[code-title]: define the structure of a node that contains the data and a pointer to the next node.
STRUCT node: // define the \`node\` struct with the following fields:
    data: [INT] // the \`data\` field as an integer.
    next: [node POINTER] // the \`next\` field as a pointer to a \`node\` struct.

[code-title]: create a head node that points to the first node in the list.
head: [node POINTER] <- NULL // create a \`node\` pointer called \`head\` and initialize it to \`NULL\`.

[code-title]: dynamically allocate memory for a new node
new_node: [node POINTER] <- CAST [node POINTER] (CALL \`malloc\` (size=CALL \`sizeof\` (type=[node]))) // allocate memory for a \`node\` struct using \`malloc\` and \`sizeof\` and cast it to a \`node\` pointer.

[code-title]: initialize the data and next fields of the new node
new_node.data <- 1 // set the \`data\` field of \`new_node\` to 1.
new_node.next <- NULL // set the \`next\` field of \`new_node\` to \`NULL\`.`;

    // console.log(pseudocodeParser(test2));

    const test3 = ` This code defines a function that generates a random message by repeatedly writing pieces of the input message to a socket with random piece sizes. It selects a random piece size between \`MINCHARS\` and \`MAXCHARS\` and writes that many characters to the socket until the total number of bytes sent is equal to the length of the input message multiplied by \`times\`. If the random piece size is larger than the number of bytes remaining to be sent, the function adjusts the piece size to ensure that the entire message is sent. The function uses modulo arithmetic to loop back to the beginning of the message when the end is reached.
[annotated-code]:
#include <stdio.h> // \`stdio.h\` is needed for \`printf()\`
#include <stdlib.h> // \`stdlib.h\` is needed for \`rand()\`
#include <string.h> // \`string.h\` is needed for \`strlen()\`
#include <unistd.h> // \`unistd.h\` is needed for \`write()\`
#include <arpa/inet.h> // \`arpa/inet.h\` is needed for \`inet_addr()\`
#include <netdb.h> // \`netdb.h\` is needed for \`gethostbyname()\`
#include <sys/socket.h> // \`sys/socket.h\` is needed for \`socket()\`

#include "socket.h" // \`socket.h\` is probably a local header file that contains the function declaration for the \`write_random_pieces()\` function below

void write_random_pieces(int soc, const char *message, int times) { // the function takes three arguments: a socket, a string, and an integer
    char piece[MAXCHARS]; // declares a character array of size \`MAXCHARS\` to store the message
    int message_len = strlen(message); // stores the length of the message in \`message_len\`
    int total_bytes = times * message_len; // stores the total number of bytes to be sent in \`total_bytes\`
    int current_byte = 0; // stores the number of bytes that have been sent in \`current_byte\`

    while (current_byte < total_bytes) { // iterates until all the bytes have been sent
        int piece_size = rand() % (MAXCHARS - MINCHARS + 1) + MINCHARS; // generates a random number between \`MINCHARS\` and \`MAXCHARS\` to determine the size of the message to be sent
        int bytes_left = total_bytes - current_byte; // stores the number of bytes left to be sent in a variable
        if (piece_size > bytes_left) { // if the size of the message to be sent is greater than the number of bytes left to be sent (which can happen if the random number generated is close to \`MAXCHARS\`)
            piece_size = bytes_left; // sets the size of the message to be sent to the number of bytes left to be sent
        }

        for (int i = 0; i < piece_size; i++) { // iterates through each character in the message to be sent to the socket
            piece[i] = message[(current_byte + i) % message_len]; // sets the character in the message to be sent to the socket to the character in the original message at the same position
        }
        write(soc, piece, piece_size); // sends the message to the socket
        current_byte += piece_size; // increments the number of bytes that have been sent
    }
}
[end-annotated-code]
[c-library-functions]: write, rand, strlen
[end-explain-code]`;

    // console.log(explainCodeParser(test3));

    const test4 = `[code]:
void fib(int **arr, int count) {
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
}
[intended-behavior]: take in an int n, and generates the first n elements of the Fibonacci sequence.
[fixed-code]:
void fib(int **arr, int count) {
    *arr = malloc(count * sizeof(int));

    if (count > 0) { // [fixed]
        (*arr)[0] = 0; // [fixed]
    } // [fixed]

    if (count > 1) { // [fixed]
        (*arr)[1] = 1; // [fixed]
    } // [fixed]
    
    for (int i = 2; i < count; i++) {
        (*arr)[i] = (*arr)[i - 1] + (*arr)[i - 2]; // [fixed]
    }
}
[explained-fixed-lines]: for each line that is tagged with [fixed], compare it to the original [code], and provide the [change-reason] as an explanation of what was wrong in the original [code] and how it was fixed in [fixed-code].
void fib(int **arr, int count) {
    *arr = malloc(count * sizeof(int));

    if (count > 0) { // [change-reason]: your code has a logical issue: if count != 0, first array element will not be 0.
        (*arr)[0] = 0; // [change-reason]: fix operator precedence by first using parenthesis to dereference \`arr\`, then access element [0] of the dereferenced \`arr\`.
    }

    if (count > 1) { // [change-reason]: your code has a logical issue: if count != 1, second array element will not be 1.
        (*arr)[1] = 1; // [change-reason]: fix operator precedence by first using parenthesis to dereference \`arr\`, then access element [1] of the dereferenced \`arr\`.
    }
    
    for (int i = 2; i < count; i++) {
        (*arr)[i] = (*arr)[i - 1] + (*arr)[i - 2]; // [change-reason]: fix operator precedence by first using parenthesis to dereference \`arr\`, then access element [i] of the dereferenced \`arr\`.
    }
}
[end-explained-fixed-lines]
[high-level-explanation-of-changes]: The original code had a logical issue in which it would not assign the first and second elements of the array to 0 and 1, respectively, if the count of elements was not 0 or 1. This was because the original code did not check if the count was greater than 0 or 1 before assigning the elements. To fix this, checks were added to make sure the count was greater than 0 and 1 before assigning the array elements to 0 and 1, respectively. Additionally, operator precedence was fixed by using parentheses around the dereference of the array before accessing elements 0 and 1. Finally, operator precedence was also fixed for the calculation of the Fibonacci sequence by wrapping parentheses around the dereference of the array before accessing the array elements.
[end-diff-fixed-code]`;

    console.log(diffFixedCodeParser(test4));
};
