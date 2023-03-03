import { pseudocodeParser } from "./shared/parsers";

export const codeToPseudocode = (code: string) => {
    return {
        prompt: `<|endoftext|>// generate pseudo-code from c language code. keep all the lines that start with "// title".
[code]:
char[] s = "hello";
int[] r = {1,2,3,4,5};
int[] r2 = int[10];
[pseudo-code]:
s: [CHAR ARRAY] <- "hello" // create a character array called \`s\` and initialize it with the fixed string \`hello\`.
r: [INT ARRAY] <- {1, 2, 3, 4, 5} // create an integer array called \`r\` and initialize it with the values 1, 2, 3, 4, and 5.
r2: [INT ARRAY] <- [INT ARRAY](size=10) // create an integer array called \`r2\` with a size of 10 (uninitialized, compiler will initialize it with 0).
[end-pseudo-code]


[code]:
[code-title]: define the structure of a node that contains the data and a pointer to the next node.
struct node {
    int data;
    struct node *next;
};

[code-title]: create a head node that points to the first node in the list.
struct node *head = NULL;

[code-title]: dynamically allocate memory for a new node
struct node *new_node = (struct node *)malloc(sizeof(struct node));

[code-title]: initialize the data and next fields of the new node
new_node->data = 1;
new_node->next = NULL;
[pseudo-code]:
[code-title]: define the structure of a node that contains the data and a pointer to the next node.
STRUCT node: // define the \`node\` struct with the following fields:
    data: [INT] // the \`data\` field as an integer.
    next: [node POINTER] // the \`next\` field as a pointer to a \`node\` struct.

[code-title]: create a head node that points to the first node in the list.
head: [node POINTER] <- NULL // create a \`node\` pointer called \`head\` and initialize it to \`NULL\`.

[code-title]: dynamically allocate memory for a new node
new_node: [node POINTER] <- CAST [node POINTER] (CALL \`malloc\` (size=CALL \`sizeof\` (type=[node]))) // allocate memory for a \`node\` struct using \`malloc\` and \`sizeof\` and cast it to a \`node\` pointer.

[code-title]: initialize the data and next fields of the new node
new_node.data <- 1 // set the \`data\` field of \`new_node\` to 1.
new_node.next <- NULL // set the \`next\` field of \`new_node\` to \`NULL\`.
[end-pseudo-code]

[code]:
void read_bitmap_metadata(FILE *image, int *pixel_array_offset, int *width, int *height) {
    fseek(image, 10, SEEK_SET);

    if (fread(pixel_array_offset, 4, 1, image) == 0) {
        perror("fread");
        exit(1);
    }
}
[pseudo-code]:
FUNCTION read_bitmap_metadata(image: [FILE POINTER], pixel_array_offset: [INT POINTER], width: [INT POINTER], height: [INT POINTER]) -> [VOID]: // define the \`read_bitmap_metadata\` function that takes a pointer to a file, a pointer to an integer, and two pointers to integers and returns nothing.
    CALL \`fseek\` (file=image, offset=10, whence=SEEK_SET) // move the file pointer to the 10th byte of the file using the \`fseek\` function and the \`SEEK_SET\` constant (which moves the file pointer to the specified offset from the beginning of the file).

    IF CALL \`fread\` (ptr=pixel_array_offset, size=4, nmemb=1, stream=image): // read 4 bytes from the file into the \`pixel_array_offset\` variable using the \`fread\` function.
        CALL \`perror\` (s="fread") // print the error message for the last system call using the \`perror\` function.
        CALL \`exit\` (status=1) // exit the program with a status code of 1 using the \`exit\` function.
[end-pseudo-code]


[code]:
[code-title]: define bool array
#include <stdbool.h>
bool arr[2] = { true, false };
[pseudo-code]:
[code-title]: define bool array
INCLUDE \`stdbool.h\` // include the \`stdbool.h\` header file that allows the usage of the \`bool\` type along with \`true\` and \`false\` constants.
arr: [BOOL ARRAY](size=2) <- { true, false } // create an array called \`arr\` with a size of 2 and initialize it with the values \`true\` and \`false\`.
[end-pseudo-code]


[code]:
[code-title]: initialize a 2D array
*arr = (int *)malloc(n * sizeof(int));
[code-title]: dereference double pointer
(*arr)[0] = 0;
[pseudo-code]:
[code-title]: initialize a 2D array
DEREF arr <- CALL \`malloc\` (size=n * CALL \`sizeof\` (type=[INT])) // allocate memory for an array of integers using \`malloc\` and \`sizeof\` and set the pointer to the array to the pointer to the pointer to the array of integers. 
[code-title]: dereference double pointer
DEREF arr[0] <- 0 // set the first element of the array to 0 (make sure to dereference \`arr\` before indexing to get the pointer to the array of integers).
[end-pseudo-code]


[code]:
${code}
[pseudo-code]:
`,
        stop: ["[end-pseudo-code]"],
        model: "text-davinci-003",
        temperature: 0.25,
        max_tokens: 1500,
        parser: (resTxt: string) => pseudocodeParser(resTxt),
        raw: (resTxt: string) => `[code]:
${code}
[pseudo-code]:
${resTxt}`,
    };
};

// old pseudo-code version:
/*
`[code]:
int **split_array(const int *s, int length) {

    int **result = malloc(sizeof(int *) * 2);
    result[0] = malloc(sizeof(int) * ((length - 1) / 2 + 1));
    result[1] = malloc(sizeof(int) * (length / 2));
    
    for (int i=0; i<length; i++){
        if (i % 2 == 0) {
                printf("%d, %d\\n",i, (i%2));
                result[0][i / 2] = s[i];
        } else {
                result[1][i / 2] = s[i];
        }
    }

    return result;
}
[pseudo-code]:
DEFINE [split_array(s, length)] -> RETURNS [pointer to int pointer] // define the \`split_array\` function that takes an array of integers (as a pointer) and the length of the array and returns a pointer to an array of pointers to integers (a two-dimensional array).
    SET [result] <- [mallloc [size of int pointer] * 2] // allocate memory for two pointers to integers using \`malloc\` and \`sizeof\` (make sure to define result as a pointer to an array of pointers to integers).

    SET [result[0]] <- CALL [mallloc] WITH [size of int] * ([length - 1] / 2 + 1) // allocate memory for the first array of integers using \`malloc\` and \`sizeof\` (the length of the array is calculated by dividing the length of the original array by 2 and adding 1 if the original array length is odd).
    SET [result[1]] <- CALL [mallloc] WITH [size of int] * [length / 2] // allocate memory for the second array of integers using \`malloc\` and \`sizeof\` (the length of the array is calculated by dividing the length of the original array by 2).

    FOR [i] <- [0] TO [length] DO: // loop through the original array using \`i\` as the iterator.
        IF [i % 2 == 0] THEN: // check if the iterator is even.
            CALL [printf] WITH [format string: %d, %d] [i] [i % 2] // print the value of the iterator and the value of the iterator modulo 2 using the \`printf\` and the \`%d\` format specifier.
            SET [result[0][i / 2]] <- [s[i]] // set the value of the current element in the first array to the value of the current element in the original array.
        ELSE: // if the iterator is odd.
            SET [result[1][i / 2]] <- [s[i]] // set the value of the current element in the second array to the value of the current element in the original array.
        ENDIF
    ENDFOR

    RETURN [result] // return \`result\` (the pointer to the two-dimensional array).
ENDDEFINE
[end-pseudo-code]


[code]:
void read_bitmap_metadata(FILE *image, int *pixel_array_offset, int *width, int *height) {
    // Pixel array offset
    fseek(image, 10, SEEK_SET);
    if (fread(pixel_array_offset, 4, 1, image) == 0) {
        perror("fread");
        exit(1);
    }
}
[pseudo-code]:
DEFINE [read_bitmap_metadata(image, pixel_array_offset, width, height)] -> RETURNS [void] // define the \`read_bitmap_metadata\` function that takes a pointer to a file, a pointer to an integer, and two pointers to integers and returns nothing.
    CALL [fseek] WITH [image] [10] [SEEK_SET] // move the file pointer to the 10th byte of the file using the \`fseek\` function and the \`SEEK_SET\` constant (which moves the file pointer to the specified offset from the beginning of the file).
    IF CALL [fread] WITH [pixel_array_offset] [4] [1] [image] THEN: // read 4 bytes from the file into the \`pixel_array_offset\` variable using the \`fread\` function.
        CALL [perror] WITH [fread] // print the error message for the last system call using the \`perror\` function.
        CALL [exit] WITH [1] // exit the program with a status code of 1 using the \`exit\` function.
    ENDIF
ENDDEFINE
[end-pseudo-code]


[code]:
#include <stdbool.h>
int main()
{
    bool arr[2] = { true, false };
    return 0;
}
[pseudo-code]:
INCLUDE [stdbool.h] // include the \`stdbool.h\` header file that allows the usage of the \`bool\` type along with \`true\` and \`false\` constants.
DEFINE [main] -> RETURNS [int] // define the \`main\` function that takes no arguments and returns an integer.
    SET [arr] <- { [true], [false] } // create an array of booleans with two elements.
    RETURN [0] // return 0 (indicates that the main program has finished successfully).
ENDDEFINE
[end-pseudo-code]


[code]:
void fib(int **arr, int n) {
    *arr = (int *)malloc(n * sizeof(int));
    (*arr)[0] = 0;
    (*arr)[1] = 1;
    
    for (int i = 2; i < n; i++) {
        (*arr)[i] = (*arr)[i - 1] + (*arr)[i - 2];
    }
}
[pseudo-code]:
DEFINE [fib(arr, n)] -> RETURNS [void] // define the \`fib\` function that takes a pointer to a pointer to an integer and an integer and returns nothing.
    SET [arr] <- CALL [malloc] WITH [n] * [size of int] // allocate memory for the array of integers using \`malloc\` and \`sizeof\` (make sure to dereference \`arr\` to get the pointer to the array of integers, and cast the result of \`malloc\` to an integer pointer).
    SET [arr[0]] <- [0] // set the first element of the array to 0 (make sure to dereference \`arr\` before indexing to get the pointer to the array of integers).
    SET [arr[1]] <- [1] // set the second element of the array to 1 (make sure to dereference \`arr\` before indexing to get the pointer to the array of integers).

    FOR [i] <- [2] TO [n] DO: // loop through the array using \`i\` as the iterator.
        SET [arr[i]] <- [arr[i - 1]] + [arr[i - 2]] // set the current element of the array to the sum of the previous two elements of the array (make sure to dereference \`arr\` before indexing to get the pointer to the array of integers).
    ENDFOR
ENDDEFINE
[end-pseudo-code]`
*/

// [code]:
// int **split_array(const int *s, int length) {
//     int **result = malloc(sizeof(int *) * 2);
//     result[0] = malloc(sizeof(int) * ((length - 1) / 2 + 1));
//     result[1] = malloc(sizeof(int) * (length / 2));

//     for (int i=0; i<length; i++){
//         if (i % 2 == 0) {
//                 printf("%d, %d\\n",i, (i%2));
//                 result[0][i / 2] = s[i];
//         } else {
//                 result[1][i / 2] = s[i];
//         }
//     }

//     return result;
// }
// [pseudo-code]:
// FUNCTION split_array(s: [INT POINTER], length: [INT]) -> [INT DOUBLE POINTER]: // define the \`split_array\` function that takes an array of integers (as a pointer) and the length of the array and returns a pointer to an array of pointers to integers (a two-dimensional array).
//     result: [INT DOUBLE POINTER] <- CALL \`malloc\` (size=CALL \`sizeof\` (type=[INT POINTER]) * 2) // allocate memory for two pointers to integers using \`malloc\` and \`sizeof\` (make sure to define result as a pointer to an array of pointers to integers).

//     result[0] <- CALL \`malloc\` (size=CALL \`sizeof\` (type=[INT]) * ((length - 1) / 2 + 1) // allocate memory for the first array of integers using \`malloc\` and \`sizeof\` (the length of the array is calculated by dividing the length of the original array by 2 and adding 1 if the original array length is odd).
//     result[1] <- CALL \`malloc\` (size=CALL \`sizeof\` (type=[INT]) * (length / 2)) // allocate memory for the second array of integers using \`malloc\` and \`sizeof\` (the length of the array is calculated by dividing the length of the original array by 2).

//     FOR (i <- 0) TO (length - 1): // loop through the original array using \`i\` as the iterator.
//         IF i % 2 == 0: // check if the iterator is even.
//             CALL \`printf\` (format=[%d, %d\\n], vals=[i, (i%2)]) // print the value of the iterator and the value of the iterator modulo 2 using the \`printf\` and the \`%d\` format specifier.
//             result[0][i / 2] <- s[i] // set the value of the current element in the first array to the value of the current element in the original array.
//         ELSE: // if the iterator is odd.
//             result[1][i / 2] <- s[i] // set the value of the current element in the second array to the value of the current element in the original array.

//     RETURN result // return \`result\` (the pointer to the two-dimensional array).
// [end-pseudo-code]
