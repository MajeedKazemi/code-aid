import {
    explainCodeParser,
    genericParser,
    suggestionsParser,
} from "./shared/parsers";

export const mainExplainCode = (code: string) => {
    return {
        prompt: `<|endoftext|> provide a short overall [explanation] for the given code, and then display [annotated-code] where you explain each line of code. Use the following two examples as a format:
[code]:
nice code you got over there :)
[explanation]: this is not a C program! please enter a C program so that I can explain it to you.
[end-explain-code]


[code]:
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <sys/socket.h>

#include "socket.h"

void write_random_pieces(int soc, const char *message, int times) {
    char piece[MAXCHARS];
    int message_len = strlen(message);
    int total_bytes = times * message_len;
    int current_byte = 0;

    while (current_byte < total_bytes) {
        int piece_size = rand() % (MAXCHARS - MINCHARS + 1) + MINCHARS;
        int bytes_left = total_bytes - current_byte;
        if (piece_size > bytes_left) {
            piece_size = bytes_left;
        }

        for (int i = 0; i < piece_size; i++) {
            piece[i] = message[(current_byte + i) % message_len];
        }
        write(soc, piece, piece_size);
        current_byte += piece_size;
    }
}
[explanation]: This code defines a function that generates a random message by repeatedly writing pieces of the input message to a socket with random piece sizes. It selects a random piece size between \`MINCHARS\` and \`MAXCHARS\` and writes that many characters to the socket until the total number of bytes sent is equal to the length of the input message multiplied by \`times\`. If the random piece size is larger than the number of bytes remaining to be sent, the function adjusts the piece size to ensure that the entire message is sent. The function uses modulo arithmetic to loop back to the beginning of the message when the end is reached.
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
[c-library-functions]:
[function-1]: [name]: write <> [description]: writes to a file descriptor <> [include]: unistd.h <> [prototype]: ssize_t write(int fd, const void *buf, size_t count)
[function-2]: [name]: rand <> [description]: generates a random number <> [include]: stdlib.h <> [prototype]: int rand(void)
[function-3]: [name]: strlen <> [description]: gets the length of a string <> [include]: string.h <> [prototype]: size_t strlen(const char *s)
[end-c-library-functions]
[end-explain-code]


[code]:
${code}
[explanation]:`,
        stop: ["[end-explain-code]"],
        model: "text-davinci-003",
        temperature: 0.1,
        max_tokens: 1536,
        parser: (resTxt: string) => explainCodeParser(resTxt),
        raw: (resTxt: string) => `[code]:
${code}
[annotated-code]:
${resTxt}`,
    };
};

// it could potentially have another follow-up method which is, on each hoverable explanation, include a button to ask a question about that line of code (and its surrounding context).
// but at the end of the day, this is something else, and should be a separate prompt.

// replyExplainCode could simply be very similar to askQuestionFromCode

export const replyExplainCode = (
    code: string,
    prevResponses: string[],
    newQuestion: string
) => {
    let thread = "";

    if (prevResponses.length === 0) {
        console.error("prevQuery is empty");
    }

    thread += `[annotated-code]:\n${code}\n`;

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
                .filter((line) => line.startsWith("[follow-up-question]:"))[0]
                .replace("[follow-up-question]: ", "");

            let followUpAnswer = lines
                .filter((line) => line.startsWith("[answer]:"))[0]
                .replace("[answer]: ", "");

            thread += `[follow-up-question]: ${followUpQuestion}\n${followUpAnswer}\n[end-question-answer]\n\n`;
        }
    }

    return {
        prompt: `[annotated-code]:
void read_bitmap_metadata(FILE *image, int *pixel_array_offset, int *width, int *height) { // the function takes four arguments: a file pointer, and three pointers to integers
    fseek(image, 10, SEEK_SET); // sets the file pointer to the 10th byte in the file
    if (fread(pixel_array_offset, 4, 1, image) == 0) { // reads 4 bytes from the file and stores them in the \`pixel_array_offset\` pointer
        perror("fread"); // prints an error message if the read fails
        exit(1); // exits the program
    }

    fseek(image, 18, SEEK_SET); // sets the file pointer to the 18th byte in the file
    if (fread(width, 4, 1, image) == 0) { // reads 4 bytes from the file and stores them in the \`width\` pointer
        perror("fread"); // prints an error message if the read fails
        exit(1); // exits the program
    }
    if (fread(height, 4, 1, image) == 0) { // reads 4 bytes from the file and stores them in the \`height\` pointer
        perror("fread"); // prints an error message if the read fails
        exit(1); // exits the program
    }
}
[question]: what does SEEK_SET do?
[answer]: \`SEEK_SET\` is a constant defined in the \`stdio.h\` header file that specifies the reference position used by the \`fseek()\` function to set the file position indicator. Specifically, \`SEEK_SET\` sets the position relative to the beginning of the file. In the provided code, \`fseek()\` is used to set the file pointer to a specific position in the file (10 and 18 bytes from the beginning of the file, respectively), so that the appropriate data can be read from the file using \`fread()\`.
[end-question-answer]


[follow-up-question]: show me an example of different ways to use \`fseek()\` to set the file position indicator
[answer]: \`fseek()\` can be used with three different constants to set the file position indicator to different positions in the file. The constants are \`SEEK_SET\`, \`SEEK_CUR\`, and \`SEEK_END\`. \`SEEK_SET\` sets the position relative to the beginning of the file, \`SEEK_CUR\` sets the position relative to the current position of the file position indicator, and \`SEEK_END\` sets the position relative to the end of the file.
[code]:
[code-title]: reading file contents using fseek and ftell
#include <stdio.h>
#include <stdlib.h>

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
[c-library-functions]:
[function-1]: [name]: fopen <> [description]: opens a file given a filename and a mode <> [include]: stdio.h <> [prototype]: FILE *fopen(const char *filename, const char *mode)
[function-2]: [name]: fseek <> [description]: sets the file position indicator for the stream to a new position <> [include]: stdio.h <> [prototype]: int fseek(FILE *stream, long int offset, int whence)
[function-3]: [name]: ftell <> [description]: gets the current value of the file position indicator for the stream <> [include]: stdio.h <> [prototype]: long int ftell(FILE *stream)
[function-4]: [name]: fread <> [description]: reads data from a stream into an array <> [include]: stdio.h <> [prototype]: size_t fread(void *ptr, size_t size, size_t nmemb, FILE *stream)
[end-c-library-functions]
[end-question-answer]


${thread}
[follow-up-question]: ${newQuestion}
[answer]:`,
        stop: ["[end-question-answer]"],
        model: "text-davinci-003",
        temperature: 0.15,
        max_tokens: 1536,
        parser: (resTxt: string) => genericParser(resTxt),
        raw: (resTxt: string) => `[follow-up-question]: ${newQuestion}
[answer]:${resTxt}`,
    };
};

// suggestions: again, something about the code that might be interesting to ask about
export const suggestExplainCode = (code: string) => {
    return {
        prompt: `[annotated-code]:
${code}
[follow-up-questions]: based on the above [annotated-code], generate three separate and different follow-up questions to ask about the code:
1.`,
        stop: ["4."],
        model: "text-davinci-003",
        temperature: 0.3,
        max_tokens: 512,
        parser: (output: string) => suggestionsParser(output),
    };
};