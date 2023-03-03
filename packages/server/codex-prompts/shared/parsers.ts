import {
    IParsedAskQuestionResponse,
    IParsedExplainCodeResponse,
    IParsedPseudoCodeResponse,
} from "../../sockets/socket-handler";

export const genericParser = (r: string) => {
    let obj: any = {};
    const stack: string[] = [];
    const lines = ("[answer]:" + r).split("\n");

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith("[answer]:")) {
            obj.answer = line.replace("[answer]:", "").trim();
        } else if (line.startsWith("[c-library-functions]:")) {
            obj.cLibraryFunctions = [];
            obj.cLibraryFunctions.push({
                name: "",
                description: "",
                include: "",
                proto: "",
            });
            stack.push("c-library-functions");
        } else if (line.startsWith("[end-c-library-functions]")) {
            stack.pop();
        } else if (
            stack[stack.length - 1] === "c-library-functions" &&
            line.match(/^\[function-\d+\]:.*$/)
        ) {
            const index = parseInt(line.match(/^\[function-(\d+)\]:/)![1]) - 1;

            if (obj.cLibraryFunctions[index] === undefined)
                obj.cLibraryFunctions[index] = {
                    name: "",
                    description: "",
                    include: "",
                    proto: "",
                };

            line.replace(/^\[function-\d+\]:/, "")
                .trim()
                .split(" <> ")
                .forEach((l) => {
                    if (l.startsWith("[name]:")) {
                        obj.cLibraryFunctions[index].name = l
                            .replace("[name]:", "")
                            .trim()
                            .replace(/<>/g, "");
                    } else if (l.startsWith("[description]:")) {
                        obj.cLibraryFunctions[index].description = l
                            .replace("[description]:", "")
                            .trim()
                            .replace(/<>/g, "");
                    } else if (l.startsWith("[include]:")) {
                        obj.cLibraryFunctions[index].include = l
                            .replace("[include]:", "")
                            .trim()
                            .replace(/<>/g, "");
                    } else if (l.startsWith("[prototype]:")) {
                        obj.cLibraryFunctions[index].proto = l
                            .replace("[prototype]:", "")
                            .trim()
                            .replace(/<>/g, "");
                    }
                });
        } else if (line.startsWith("[code]:")) {
            obj.rawCode = "";
            stack.push("code");
        } else if (line.startsWith("[end-code]")) {
            stack.pop();
            obj.rawCode = obj.rawCode!.trim();
        } else if (
            stack[stack.length - 1] === "code" &&
            line[i - 1] !== "[code]:"
        ) {
            obj.rawCode += line + "\n";
        }
    }

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
                    code,
                    explanation,
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
    const lines = ("[explanation]:" + r).split("\n");

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith("[explanation]:")) {
            obj.explanation = line.replace("[explanation]:", "").trim();
        } else if (line.startsWith("[c-library-functions]:")) {
            obj.cLibraryFunctions = [];
            obj.cLibraryFunctions.push({
                name: "",
                description: "",
                include: "",
                proto: "",
            });
            stack.push("c-library-functions");
        } else if (line.startsWith("[end-c-library-functions]")) {
            stack.pop();
        } else if (
            stack[stack.length - 1] === "c-library-functions" &&
            line.match(/^\[function-\d+\]:.*$/)
        ) {
            const index = parseInt(line.match(/^\[function-(\d+)\]:/)![1]) - 1;

            if (obj.cLibraryFunctions[index] === undefined)
                obj.cLibraryFunctions[index] = {
                    name: "",
                    description: "",
                    include: "",
                    proto: "",
                };

            line.replace(/^\[function-\d+\]:/, "")
                .trim()
                .split(" <> ")
                .forEach((l) => {
                    if (l.startsWith("[name]:")) {
                        obj.cLibraryFunctions[index].name = l
                            .replace("[name]:", "")
                            .trim()
                            .replace(/<>/g, "");
                    } else if (l.startsWith("[description]:")) {
                        obj.cLibraryFunctions[index].description = l
                            .replace("[description]:", "")
                            .trim()
                            .replace(/<>/g, "");
                    } else if (l.startsWith("[include]:")) {
                        obj.cLibraryFunctions[index].include = l
                            .replace("[include]:", "")
                            .trim()
                            .replace(/<>/g, "");
                    } else if (l.startsWith("[prototype]:")) {
                        obj.cLibraryFunctions[index].proto = l
                            .replace("[prototype]:", "")
                            .trim()
                            .replace(/<>/g, "");
                    }
                });
        } else if (line.startsWith("[annotated-code]:")) {
            obj.lines = [];
            stack.push("annotated-code");
        } else if (line.startsWith("[end-annotated-code]")) {
            stack.pop();
        } else if (stack[stack.length - 1] === "annotated-code") {
            const [code, explanation] = line.split(" // ");

            obj.lines.push({
                code,
                explanation,
            });
        }
    }

    return obj as IParsedExplainCodeResponse;
};

export const testParser = () => {
    const test1 = ` The \`scanf()\` function is used to read input from the standard input stream (stdin). It takes a format string and a list of arguments as parameters. The format string contains the format specifiers that indicate the type of input to be read. The arguments are the variables in which the input will be stored.

For example, the following code reads an integer and a string from the standard input stream:

[c-library-functions]:
[function-1]: [name]: scanf <> [description]: reads input from the standard input stream <> [include]: stdio.h <> [prototype]: int scanf(const char *format, ...)
[end-c-library-functions]
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
[c-library-functions]: that are used in the above code
[function-1]: [name]: write <> [description]: writes to a file descriptor <> [include]: unistd.h <> [prototype]: ssize_t write(int fd, const void *buf, size_t count)
[function-2]: [name]: rand <> [description]: generates a random number <> [include]: stdlib.h <> [prototype]: int rand(void)
[function-3]: [name]: strlen <> [description]: gets the length of a string <> [include]: string.h <> [prototype]: size_t strlen(const char *s)
[end-c-library-functions]
[end-explain-code]`;

    console.log(explainCodeParser(test3));
};
