// this API will generate a pseudo-code with detailed explanation for a given C code snippet

const codeToPseudocodePrompt = (code: string) => {
    return {
        prompt: `<|endoftext|>// generate pseudo-code from c language code
// [code]:
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
// [pseudo-code]:
DEFINE [split_array(s, length)] -> RETURNS [pointer to int pointer] // [explain]: define the \`split_array\` function that takes an array of integers (as a pointer) and the length of the array and returns a pointer to an array of pointers to integers (a two-dimensional array).
    SET [result] <- [mallloc [size of int pointer] * 2] // [explain]: allocate memory for two pointers to integers using \`malloc\` and \`sizeof\` (make sure to define result as a pointer to an array of pointers to integers).

    SET [result[0]] <- CALL [mallloc] WITH [size of int] * ([length - 1] / 2 + 1) // [explain]: allocate memory for the first array of integers using \`malloc\` and \`sizeof\` (the length of the array is calculated by dividing the length of the original array by 2 and adding 1 if the original array length is odd).
    SET [result[1]] <- CALL [mallloc] WITH [size of int] * [length / 2] // [explain]: allocate memory for the second array of integers using \`malloc\` and \`sizeof\` (the length of the array is calculated by dividing the length of the original array by 2).

    FOR [i] <- [0] TO [length] DO: // [explain]: loop through the original array using \`i\` as the iterator.
        IF [i % 2 == 0] THEN: // [explain]: check if the iterator is even.
            CALL [printf] WITH [format string: %d, %d] [i] [i % 2] // [explain]: print the value of the iterator and the value of the iterator modulo 2 using the \`printf\` and the \`%d\` format specifier.
            SET [result[0][i / 2]] <- [s[i]] // [explain]: set the value of the current element in the first array to the value of the current element in the original array.
        ELSE: // [explain]: if the iterator is odd.
            SET [result[1][i / 2]] <- [s[i]] // [explain]: set the value of the current element in the second array to the value of the current element in the original array.
        ENDIF
    ENDFOR

    RETURN [result] // [explain]: return \`result\` (the pointer to the two-dimensional array).
ENDDEFINE
// [end-pseudo-code]


// [code]:
void read_bitmap_metadata(FILE *image, int *pixel_array_offset, int *width, int *height) {
    // Pixel array offset
    fseek(image, 10, SEEK_SET);
    if (fread(pixel_array_offset, 4, 1, image) == 0) {
        perror("fread");
        exit(1);
    }

    // Image width and height
    fseek(image, 18, SEEK_SET);
    if (fread(width, 4, 1, image) == 0) {
        perror("fread");
        exit(1);
    }
    if (fread(height, 4, 1, image) == 0) {
        perror("fread");
        exit(1);
    }
}
// [pseudo-code]:
DEFINE [read_bitmap_metadata(image, pixel_array_offset, width, height)] -> RETURNS [void] // [explain]: define the \`read_bitmap_metadata\` function that takes a pointer to a file, a pointer to an integer, and two pointers to integers and returns nothing.
    CALL [fseek] WITH [image] [10] [SEEK_SET] // [explain]: move the file pointer to the 10th byte of the file using the \`fseek\` function and the \`SEEK_SET\` constant (which moves the file pointer to the specified offset from the beginning of the file).
    IF CALL [fread] WITH [pixel_array_offset] [4] [1] [image] THEN: // [explain]: read 4 bytes from the file into the \`pixel_array_offset\` variable using the \`fread\` function.
        CALL [perror] WITH [fread] // [explain]: print the error message for the last system call using the \`perror\` function.
        CALL [exit] WITH [1] // [explain]: exit the program with a status code of 1 using the \`exit\` function.
    ENDIF

    CALL [fseek] WITH [image] [18] [SEEK_SET] // [explain]: move the file pointer to the 18th byte of the file using the \`fseek\` function and the \`SEEK_SET\` constant (which moves the file pointer to the specified offset from the beginning of the file).
    IF CALL [fread] WITH [width] [4] [1] [image] THEN: // [explain]: read 4 bytes from the file into the \`width\` variable using the \`fread\` function.
        CALL [perror] WITH [fread] // [explain]: print the error message for the last system call using the \`perror\` function.
        CALL [exit] WITH [1] // [explain]: exit the program with a status code of 1 using the \`exit\` function.
    ENDIF

    IF CALL [fread] WITH [height] [4] [1] [image] THEN: // [explain]: read 4 bytes from the file into the \`height\` variable using the \`fread\` function.
        CALL [perror] WITH [fread] // [explain]: print the error message for the last system call using the \`perror\` function.
        CALL [exit] WITH [1] // [explain]: exit the program with a status code of 1 using the \`exit\` function.
    ENDIF
ENDDEFINE
// [end-pseudo-code]


// [code]:
#include <stdbool.h>
int main()
{
    bool arr[2] = { true, false };
    return 0;
}
// [pseudo-code]:
INCLUDE [stdbool.h] // [explain]: include the \`stdbool.h\` header file that allows the usage of the \`bool\` type along with \`true\` and \`false\` constants.
DEFINE [main] -> RETURNS [int] // [explain]: define the \`main\` function that takes no arguments and returns an integer.
    SET [arr] <- { [true], [false] } // [explain]: create an array of booleans with two elements.
    RETURN [0] // [explain]: return 0.
ENDDEFINE
// [end-pseudo-code]


// [code]:
void fib(int **arr, int n) {
    *arr = (int *)malloc(n * sizeof(int));
    (*arr)[0] = 0;
    (*arr)[1] = 1;
    
    for (int i = 2; i < n; i++) {
        (*arr)[i] = (*arr)[i - 1] + (*arr)[i - 2];
    }
}
// [pseudo-code]:
DEFINE [fib(arr, n)] -> RETURNS [void] // [explain]: define the \`fib\` function that takes a pointer to a pointer to an integer and an integer and returns nothing.
    SET [arr] <- CALL [malloc] WITH [n] * [size of int] // [explain]: allocate memory for the array of integers using \`malloc\` and \`sizeof\` (make sure to dereference \`arr\` to get the pointer to the array of integers, and cast the result of \`malloc\` to an integer pointer).
    SET [arr[0]] <- [0] // [explain]: set the first element of the array to 0 (make sure to dereference \`arr\` before indexing to get the pointer to the array of integers).
    SET [arr[1]] <- [1] // [explain]: set the second element of the array to 1 (make sure to dereference \`arr\` before indexing to get the pointer to the array of integers).

    FOR [i] <- [2] TO [n] DO: // [explain]: loop through the array using \`i\` as the iterator.
        SET [arr[i]] <- [arr[i - 1]] + [arr[i - 2]] // [explain]: set the current element of the array to the sum of the previous two elements of the array (make sure to dereference \`arr\` before indexing to get the pointer to the array of integers).
    ENDFOR
ENDDEFINE
// [end-pseudo-code]


// [code]: ${code}
// [pseudo-code]:
`,
        stopTokens: ["// [end-psuedo-code]"],
    };
};
