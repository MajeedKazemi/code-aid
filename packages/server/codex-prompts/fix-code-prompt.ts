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
[end-fixed-code]


[code]:
${code}
[intended-behavior]: ${behavior}
[fixed-code]:
`,
        stop: ["[end-fixed-code]"],
        model: "text-davinci-003",
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
[end-diff-fixed-code]


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
[end-diff-fixed-code]


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
        stop: ["[end-diff-fixed-code]"],
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

// export const mainFixedPseudoCode = (diffCode: string) => {
//     return {
//         prompt: `[code]:
// void fib(int **arr, int count) {
//     *arr = malloc(count * sizeof(int));

//     if (count > 0) { // [change-reason]: your code has a logical issue: if count != 0, first array element will not be 0.
//         (*arr)[0] = 0; // [change-reason]: fix operator precedence by first using parenthesis to dereference \`arr\`, then access element [0] of the dereferenced \`arr\`.
//     }

//     if (count > 1) { // [change-reason]: your code has a logical issue: if count != 1, second array element will not be 1.
//         (*arr)[1] = 1; // [change-reason]: fix operator precedence by first using parenthesis to dereference \`arr\`, then access element [1] of the dereferenced \`arr\`.
//     }

//     for (int i = 2; i < count; i++) {
//         (*arr)[i] = (*arr)[i - 1] + (*arr)[i - 2]; // [change-reason]: fix operator precedence by first using parenthesis to dereference \`arr\`, then access element [i] of the dereferenced \`arr\`.
//     }
// }
// [psuedo-code]: copy the lines that do not include [change-reason], however for those lines that do, use a pseudo-code instead and do not reveal the syntax for those lines
// void fib(int **arr, int count) {
//     *arr = malloc(count * sizeof(int));

//     IF count > 0: // [change-reason]: your code has a logical issue: if count != 0, first array element will not be 0.
//         arr[0] ← 0 // [change-reason]: fix operator precedence by first using parenthesis to dereference \`arr\`, then access element [0] of the dereferenced \`arr\`.
//     END IF

//     IF count > 1: // [change-reason]: your code has a logical issue: if count != 1, second array element will not be 1.
//         arr[1] ← 1 // [change-reason]: fix operator precedence by first using parenthesis to dereference \`arr\`, then access element [1] of the dereferenced \`arr\`.
//     END IF

//     for (int i = 2; i < count; i++) {
//         arr[i] ← arr[i - 1] + arr[i - 2] // [change-reason]: fix operator precedence by first using parenthesis to dereference \`arr\`, then access element [i] of the dereferenced \`arr\`.
//     END FOR
// }
// [end-psuedo-code]
// `,
//     };
// };

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

export const replyHelpFixCodeV2 = (prevThread: string, question: string) => {
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
void fib(int **arr, int count) {
    *arr = malloc(count * sizeof(int));
    if (count < 2) { // [change-reason]: your code has a logical issue: if count > 2, first 2 array elements will not be 0 and 1.
        return; // [change-reason]: your code has a logical issue: if count > 2, first 2 array elements will not be 0 and 1.
    }

    (*arr)[0] = 0; // [change-reason]: your code has a operator precedence problem: use parenthesis to first, dereference \`arr\`, then access the first element of the dereferenced \`arr\`.
    (*arr)[1] = 1; // [change-reason]: your code has a operator precedence problem: use parenthesis to first, dereference \`arr\`, then access the first element of the dereferenced \`arr\`.
    for (int i = 2; i < count; i++) {
        (*arr)[i] = (*arr)[i - 1] + (*arr)[i - 2]; // [change-reason]: your code has a operator precedence problem: use parenthesis to first, dereference \`arr\`, then access the first element of the dereferenced \`arr\`.
    }
}
[follow-up-question]: is there another way to fix this code?
[detail-answer]: Yes, you can dereference \`arr\` once and store it in a local variable: \`int *a = *arr;\`. Then, you can use \`a\` instead of \`*arr\` in the for loop like this: \`a[i] = a[i - 1] + a[i - 2];\`. 

${prevThread}
// [follow-up-question]: ${question}
// [detail-answer]: (in the context of C Programming)
`,

        stopTokens: [`// [end-question-answer]`],
    };
};

// chain: send it to diff agent -> send diff to llm to explain changes on those lines [1]
// in parallel: send diff (without // [change-reason]: comments) to code-to-pseudocode agent [2]
// then use [1] and [2] to generate the final output: show the pseudocode, highlight the lines that were changed, and include detailed explanations for each change

// export const mainHelpFixCodeV2 = (code: string, behavior: string) => {
//     return {
//         prompt: `<|endoftext|>// blank .c fix the provided c programming codes based on the intended behavior. add a comment after each new or changed line.
// [code]:
// void fib(int **arr, int count) {
//     *arr = malloc(count * sizeof(int));

//     if (count == 0) {
//         *arr[0] = 0;
//     } else if (count == 1) {
//         *arr[0] = 0;
//         *arr[1] = 1;
//     }

//     for (int i = 2; i < count; i++) {
//         *arr[i] = *arr[i - 1] + *arr[i - 2];
//     }

//     return arr;
// }
// [intended-behavior]: take in an int n, and generates the first n elements of the Fibonacci sequence.
// [fixed-code]:
// void fib(int **arr, int count) {
//     *arr = malloc(count * sizeof(int));

//     if (count < 2) { // added
//         return; // added
//     } // added

//     (*arr)[0] = 0; // changed
//     (*arr)[1] = 1; // changed

//     for (int i = 2; i < count; i++)
//         (*arr)[i] = (*arr)[i - 1] + (*arr)[i - 2]; // changed
//     }
// }

// // [end-help-fix-code]

// // [code]:
// ${code}
// // [intended-behavior]: ${behavior}
// // [response]: write the fixed version of [your-code] based on the [intended-behavior] -> then explain the issues and line numbers in [your-code] that were fixed (as a JSON object):
// `,
//         stopTokens: ["// [end-help-fix-code]", "// [response]:"],
//     };
// };

/*

export const replyHelpFixCodeV2 = (prevThread: string, question: string) => {
    return {
        prompt: `// [question]: how can I concatenate two dynamically allocated strings?


${prevThread}
// [follow-up-question]: ${question}
// [detail-answer]: (in the context of C Programming)
`,

        stopTokens: [`// [end-question-answer]`],
    };
};
*/

/*
`[code]:
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
    if (count < 2) { // [fixed]
        return; // [fixed]
    }

    (*arr)[0] = 0; // [fixed]
    (*arr)[1] = 1; // [fixed]
    for (int i = 2; i < count; i++) {
        (*arr)[i] = (*arr)[i - 1] + (*arr)[i - 2]; // [fixed]
    }
}
[explained-fixed-lines]: for each line that is tagged with [fixed] compared to the original [code] provide the [change-reason] as an explanation of what was wrong in the original [code] and how it was fixed.
void fib(int **arr, int count) {
    *arr = malloc(count * sizeof(int));
    if (count < 2) { // [change-reason]: your code has a logical issue: if count > 2, first 2 array elements will not be 0 and 1.
        return; // [change-reason]: your code has a logical issue: if count > 2, first 2 array elements will not be 0 and 1.
    }

    (*arr)[0] = 0; // [change-reason]: your code has a operator precedence problem: use parenthesis to first, dereference \`arr\`, then access the first element of the dereferenced \`arr\`.
    (*arr)[1] = 1; // [change-reason]: your code has a operator precedence problem: use parenthesis to first, dereference \`arr\`, then access the first element of the dereferenced \`arr\`.
    for (int i = 2; i < count; i++) {
        (*arr)[i] = (*arr)[i - 1] + (*arr)[i - 2]; // [change-reason]: your code has a operator precedence problem: use parenthesis to first, dereference \`arr\`, then access the first element of the dereferenced \`arr\`.
    }
}
[end-explained-fixed-lines]



[code]:
int populate_array(int sin, int *sin_arr) {
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
}
[intended-behavior]: For this assignment, you are required to write (and use) two helper functions. (These helper functions are to be implemented in the file sin_helpers.c. The main function is in validate_sin.c.) The first helper function is named populate_array. It takes an integer and an integer array as its arguments, and returns an integer. This function's job is to populate the given integer array so that it contains the 9 digits of the given integer, in the same order as in the integer. Hint: use % 10 and / 10 to calculate the digits. The function must return 0 when it completes successfully, and 1 if the given integer is not 9 digits.
[fixed-code]:
int populate_array(int sin, int *sin_arr) {
    int num_digits = 0; // [change-reason]: your code is missing a variable to keep track of the number of digits that have been processed.

    while (sin != 0) { // [change-reason]: instead of a \`for\` loop, use a \`while\` loop to keep iterating until all digits are processed.
        if (num_digits > 8) { // [change-reason]: your code should return 1 if the number of digits is greater than 9.
            return 1;
        }
        sin_arr[num_digits] = sin % 10; // [change-reason]: with the new \`while\` loop, you should use \`num_digits\` to access the next element in the array.
        sin = sin / 10; // [change-reason]: this has been moved to the end of the loop.
        num_digits++; // [change-reason]: with the new \`while\` loop, you should increment \`num_digits\` after processing the current digit.
    }
    if (num_digits != 9) { // [change-reason]: your code should return 1 if the number of digits is not 9.
        return 1; // [change-reason]: your code should return 1 if the number of digits is not 9.
    } // [change-reason]: your code should return 1 if the number of digits is not 9.
    return 0;
}
[end-fixed-code]


[code]:
int make_post(const User *author, User *target, char *contents) {
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
}
[intended-behavior]: Make a new post from 'author' to the 'target' user,\n * containing the given contents, IF the users are friends.\n *\n * Insert the new post at the *front* of the user's list of posts.\n *\n * 'contents' is a pointer to heap-allocated memory - you do not need\n * to allocate more memory to store the contents of the post.\n *\n * Return:\n *   - 0 on success\n *   - 1 if users exist but are not friends\n *   - 2 if either User pointer is NULL
[fixed-code]:
int make_post(const User *author, User *target, char *contents) {
    if (author == NULL || target == NULL) {
        return 2;
    }
    for (int i = 0; i < MAX_FRIENDS; i++) {
        if (author->friends[i] == target) {
            Post *post = malloc(sizeof(Post));
            strcpy(post->author, author->name);
            strcpy(post->contents, contents);
            post->date = time(NULL); // [change-reason]: you do not need to dereference the pointer post when using the \`->\` operator, as \`->\` already dereferences the pointer and means to access the member of the struct that the pointer points to.
            post->next = target->first_post;
            target->first_post = post;
            return 0;
        }
    }
    return 1;
}
[end-fixed-code]

`;
*/
