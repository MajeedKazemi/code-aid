import { diffFixedCodeParser, rawFixedCodeParser } from "./shared/parsers";

// the process:
// 1. format and clean the code + remove any existing comments
// 2. generate the [fixed-code] from the provided [code] and [intended-behavior]
// 3. generate [diff-code] by comparing the [fixed-code] to the original [code], and tagging each line with [fixed] if it was changed
// 4. generate [pseudo-code] from the [fixed-code] for the user to read.
// produces [fixed-code] as c code
export const mainFixCode = (behavior: string, code: string) => {
    return {
        prompt: `[code]:
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

    if (count > 0) {
        (*arr)[0] = 0;
    }

    if (count > 1) {
        (*arr)[1] = 1;
    }
    
    for (int i = 2; i < count; i++) {
        (*arr)[i] = (*arr)[i - 1] + (*arr)[i - 2];
    }
}
[STOP-end-fixed-code-STOP]


[code]:
${code}
[intended-behavior]: ${behavior}
[fixed-code]:
`,
        stop: ["[STOP-end-fixed-code-STOP]"],
        model: "code-davinci-002",
        temperature: 0.1,
        max_tokens: 2000,
        parser: (resTxt: string) => rawFixedCodeParser(resTxt),
        raw: (resTxt: string) => `[code]:
${code}
[intended-behavior]: ${behavior}
[fixed-code]:
${resTxt}`,
    };
};

// receives a code, behavior, and fixed code, and annotates the lines that were fixed
export const mainDiffFixedCode = (
    labeledOriginalCode: string,
    labeledFixedCode: string,
    behavior: string
) => {
    return {
        prompt: `[intended-behavior]: implement split_array (odd and even)
[fixed-code]:
int **split_array(const int *s, int length) {
    int **arr = malloc(sizeof(int *) * 2); // [fixed]

    arr[0] = malloc(sizeof(int) * (length / 2)); // [fixed]
    arr[1] = malloc(sizeof(int) * (length / 2 + (length % 2))); // [fixed]
    for (int i = 0; i < length; i++) { // [fixed]
        if (i % 2 == 0) { // [fixed]
            arr[0][i / 2] = s[i]; // [fixed]
        } else { // [fixed]
            arr[1][i / 2] = s[i]; // [fixed]
        } // [fixed]
    } // [fixed]
    return arr; // [fixed]
}
[end-fixed-code]
[original-code]:
int **split_array(const int *s, int length) {
    // [added]

    // [added]
    // [added]
    // [added]
        // [added]
            // [added]
        // [added]
            // [added]
        // [added]
    // [added]
    // [added]
}
[end-original-code]
show all the lines of [original-code] (do not show any of the lines from [fixed-code]), and for each line in [original-code] that is tagged with [modified] or [added], explain in mostly *plain English* all the required changes to make [original-code] match the above [fixed-code]
[explained-original-code]:
int **split_array(const int *s, int length) {
    // [added-reason]: allocate memory for the array of pointers

    // [added-reason]: allocate memory for the first array (size = length / 2)
    // [added-reason]: allocate memory for the second array (size = length / 2 + length % 2)
    // [added-reason]: iterate through the input array
        // [added-reason]: if the index is even, copy the element to the first array
            // [added-reason]: calculate the index of the element in the first array
        // [added-reason]: if the index is odd, copy the element to the second array
            // [added-reason]: calculate the index of the element in the second array
        // [added-reason]: if the index is odd, copy the element to the second array
    // [added-reason]: return the array of pointers
}
[end-explained-original-code]
[high-level-explanation-of-changes]: The code was modified to allocate memory for two arrays - one for the even indices and one for the odd indices - and iterate through the input array and copy the elements to the respective arrays. The size of the arrays was calculated to be the length of the input array divided by two for the first array, and the length of the input array divided by two plus the remainder of the division (length % 2) for the second array.
[STOP-end-diff-fixed-code-STOP]


[intended-behavior]: take in an int n, and generates the first n elements of the Fibonacci sequence.
[fixed-code]:
void fib(int **arr, int count) {
    *arr = malloc(count * sizeof(int));

    if (count < 2) { // [fixed]
        return; // [fixed]
    } // [fixed]
    (*arr)[0] = 0; // [fixed]
    (*arr)[1] = 1; // [fixed]

    for (int i = 2; i < count; i++) {
        (*arr)[i] = (*arr)[i - 1] + (*arr)[i - 2]; // [fixed]
    }
}
[end-fixed-code]
[original-code]:
void fib(int **arr, int count) {
    *arr = malloc(count * sizeof(int));

    // [added]
        // [added]
    // [added]
    // [added]
    *arr[0] = 0; // [modified]
    *arr[1] = 1; // [modified]

    for (int i = 2; i < count; i++) {
        *arr[i] = *arr[i - 1] + *arr[i - 2]; // [modified]
    }
    return arr; // [modified]
}
[end-original-code]
show all the lines of [original-code] (do not show any of the lines from [fixed-code]), and for each line in [original-code] that is tagged with [modified] or [added], explain in mostly *plain English* all the required changes to make [original-code] match the above [fixed-code]
[explained-original-code]:
void fib(int **arr, int count) {
    *arr = malloc(count * sizeof(int));

    // [added-reason]: add code to check if count is less than 2
        // [added-reason]: return from the function
    // [added-reason]: end the if statement

    *arr[0] = 0; // [modified-reason]: fix operator precedence by first using parenthesis to dereference \`arr\`, then access element [0] of the dereferenced \`arr\`.
    *arr[1] = 1; // [modified-reason]: fix operator precedence by first using parenthesis to dereference \`arr\`, then access element [1] of the dereferenced \`arr\`.
    
    for (int i = 2; i < count; i++) {
        *arr[i] = *arr[i - 1] + *arr[i - 2]; // [modified-reason]: fix operator precedence by first using parenthesis to dereference \`arr\`, then access element [i] of the dereferenced \`arr\`.
    }
    return arr; // [modified-reason]: the function should not return the array \`arr\`, but instead update the array \`arr\` in place. no return statement is needed.
}
[end-explained-original-code]
[high-level-explanation-of-changes]: your original code has a logical issue in which it does not assign the first and second elements of the array to 0 and 1, respectively, if the count of elements was not 0 or 1. This is because your original code does not check if the count is greater than 0 or 1 before assigning the elements. To fix this, add checks to make sure the count is greater than 0 and 1 before assigning the array elements to 0 and 1, respectively. Additionally, operator precedence should be fixed when accessing \`arr\` by using parentheses around the dereferenced array, before accessing the element of the array. Finally, the function should not return the array \`arr\`, but instead update the array \`arr\` in place. 
[STOP-end-diff-fixed-code-STOP]


[intended-behavior]: ${behavior}
[fixed-code]:
${labeledFixedCode}
[end-fixed-code]
[original-code]:
${labeledOriginalCode}
[end-original-code]
show all the lines of [original-code] (do not show any of the lines from [fixed-code]), and for each line in [original-code] that is tagged with [modified] or [added], explain in mostly *plain English* all the required changes to make [original-code] match the above [fixed-code]
[explained-original-code]:
`,
        stop: ["[STOP-end-diff-fixed-code-STOP]"],
        model: "code-davinci-002",
        temperature: 0.1,
        max_tokens: 2500,
        parser: (resTxt: string) => diffFixedCodeParser(resTxt),
        raw: (resTxt: string) => `[code]:
${labeledOriginalCode}
[intended-behavior]: ${behavior}
[fixed-code]:
${labeledFixedCode}
[explained-fixed-lines]:
${resTxt}`,
    };
};

export const verifyIntendedBehavior = (code: string) => {
    return {
        prompt: `
[code]:
${code}
[prompt]: below, write a concise summary of what the above [code] does in "plain English" (include inputs/output if is a function)
[description]:`,
        stop: ["\n"],
        model: "text-davinci-003",
        temperature: 0.3,
        max_tokens: 512,
    };
};
