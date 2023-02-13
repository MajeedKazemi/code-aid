const mainAskFromCodeV2 = (question: string, code: string) => {
    return {
        prompt: `<|endoftext|>// blank .c question / answer file. use the following format:
// [code]:
typedef struct user {
    char name[MAX_NAME];
    char profile_pic[MAX_NAME];  // This is a *filename*, not the file contents.
    struct post *first_post;
    struct user *friends[MAX_FRIENDS];
    struct user *next;
} User;

int create_user(const char *name, User **user_ptr_add) {
    if(strlen(name) > 33){
        return -2;
    }

    while((*user_ptr_add)->next != NULL){
        if (strcmp((**user_ptr_add).name, name) == 0){
            return -1;
        }
        *user_ptr_add = (*user_ptr_add)->next;
    }

    User *add = malloc(sizeof(User));
    strcpy(add->name, name);

    (*user_ptr_add)->next = add;
    return -1;
}
// [question]: why is there a segmenation fault?
// [detailed-answer]: (in the context of C Programming)
{
    "answer": [
        "paragraph": "The code is prone to a segmentation fault because of the way \`user_ptr_add\` is used in \`while ((*user_ptr_add)->next != NULL)\` and \`*user_ptr_add = (*user_ptr_add)->next\`. In particular, the code uses \`*user_ptr_add\` to traverse the linked list of User structures, but the while loop does not check if \`*user_ptr_add\` is NULL before accessing its fields. Fix this by checking if \`*user_ptr_add\` is not NULL before accessing its fields.",
        "code-snippet": {
            "code": "while ((*user_ptr_add) != NULL && (*user_ptr_add)->next != NULL)",
            "title": "fixed while loop"
        }
    ]
}
// [end-question-answer]


// [code]:
void fib(int **pt, int n) {
    *pt = malloc(sizeof(int) * n);
    int *heap_pt = *pt;
    for (int i = 0; i < n ; i++) {
      if (i == 0) {
        heap_pt[0] = 0;
      } else if (i == 1) {
        heap_pt[1] = 1;
      } else {
        heap_pt[i] = heap_pt[i-1] + heap_pt[i-2];
      }
    }
}
// [question]: is *heap_pt pointing to the first element of an array?
// [detailed-answer]: (in the context of C Programming)
{
    "answer": [
        "paragraph": "Yes, \`heap_pt\` is pointing to the first element of an array. In this code, \`pt\` is a double pointer to an integer, and \`heap_pt\` is a single pointer to an integer. \`malloc\` is used to allocate memory dynamically on the heap and the returned pointer is stored in \`*pt\`. Then \`heap_pt\` is assigned the value of \`*pt\`, so \`heap_pt\` is pointing to the first element of the dynamically allocated array. In the for loop, the Fibonacci sequence is calculated and stored in the dynamically allocated memory, starting from the first element, which \`heap_pt\` is pointing to."
    ]
}
// [end-question-answer]


// [code]:
unsigned long fsize(char* file) {
    FILE f = fopen(file, "r");
    fseek(0, f, SEEK_END);
    long len = long(ftell(f));
    fclose(f);

    return len;
}
// [question]: what's wrong with this code?
// [detailed-answer]: (in the context of C Programming)
{
    "answer": [
        "paragraph": "The code contains a number of issues that would prevent it from working as intended:",
        "paragraph": "1. The \`FILE\` type should be a pointer, but it is being declared as a value in the line \`FILE f = fopen(file, "r");\`.",
        "paragraph": "2. The \`fseek\` function takes the file pointer as its first argument and the offset as its second argument, but the arguments are being passed in the opposite order in the line \`fseek(0, f, SEEK_END);\`.",
        "paragraph": "3. \`long\` is not a valid type in C, instead \`long int\` should be used.",
        "code-snippet": {
            "code":
"unsigned long fsize(char* file) {
    FILE *f = fopen(file, \\"r\\");
    fseek(f, 0, SEEK_END);
    long int len = ftell(f);
    fclose(f);
    
    return len;
}",
            "title": "fixed code"
    ]
}
// [end-question-answer]


// [code]:
#include <stdlib.h>
#include <stdio.h>
int main() {
    char **last_names;
    // Assign a dynamically allocated char * array of length 4 to last_names. 
    // Then, allocate a character array of length 20 for each element of the array 
    // pointed to by last_names.
    last_names = (char **) malloc(sizeof(char*)*4);
    for (int i=0; i <= sizeof(last_names); ++i)
    {
        last_names[i] = (char *) malloc(20 * sizeof(char));
    }
    return 0;
}
// [question]: How do I allocate a character array of length 20 for each element of the array pointed to by last_names?
// [detailed-answer]: (in the context of C Programming)
{
    "answer": [
        "paragraph": "Your code correctly allocates memory of length 4 for \`last_names\`, and memory of length 20 for each element of the array pointed to by \`last_names\`. The issue is that the for loop is using \`sizeof(last_names)\` to determine the number of iterations, which is not the correct way to do this. The \`sizeof\` operator returns the size of a variable in bytes, and \`last_names\` is a pointer to a character array, so \`sizeof(last_names)\` will return 8 bytes on a 64-bit machine. This means that the for loop will run 8 times, which is out of bounds of the array. To fix this, you can use \`4\` instead of \`sizeof(last_names)\`.",
        "code-snippet": {
            "code":
"#include <stdlib.h>
#include <stdio.h>
int main() {
    char **last_names;
    last_names = (char **) malloc(sizeof(char*)*4);
    for (int i=0; i <= 4; ++i)
    {
        last_names[i] = (char *) malloc(20 * sizeof(char));
    }
    return 0;
}",
            "title": "fixed code"
        }
    ]
}
// [end-question-answer]


// [code]:
int **split_array(const int *s, int length) {
    14     int **main_array = malloc(sizeof(int *) * 2);
    15     main_array[0] = malloc(sizeof(int) * length / 2);
    16     main_array[1] = malloc(sizeof(int) * length / 2);
    17
    18     for (int i = 0; i < length; i++) {
    19         if (i % 2 == 0) {
    20             main_array[0][i] = s[i];
    21         } else {
    22             main_array[1][i] = s[i];
    23         }
    24     }
    25
    26     return main_array;
    27 }   
// [question]: What is wrong with this code?
// [detailed-answer]: (in the context of C Programming)
{
    "answer": [
        "paragraph": "The code only looks at the first argument of the list because of the logic in lines 19-23. \`if (i % 2 == 0)\` checks whether \`i\` is even, and if it is, it puts the corresponding value of \`s\` in the first sub-array \`main_array[0]\`. If \`i\` is not even, meaning it's odd, then the value of \`s\` is put in the second sub-array \`main_array[1]\`.",
        "paragraph": "This means that the first half of the values in \`s\` will end up in \`main_array[0]\`, and the second half of the values in \`s\` will end up in \`main_array[1]\`. So, the code is effectively only looking at the first argument of the list because it is only putting the first half of the values in \`s\` into one of the sub-arrays."
    ]
}
// [end-question-answer]
    

// [code]: ${code}
// [question]: ${question}
// [detailed-answer]: (in the context of C Programming)
`,
        stopTokens: [
            "// [end-question-answer]",
            "// [question]:",
            "// [detailed-answer]:",
        ],
    };
};

const suggestAskFromCodeV2 = (code: string, question: string) => {
    return {
        prompt: `[code]: ${code}
[question]: ${question}
[suggested-questions]: generate three follow-up questions related to C programming and the above [code] and [question]?
1.`,
        stopTokens: [`4.`],
    };
};

const replyAskFromCodeV2 = (prevThread: string, newQuestion: string) => {
    return {
        prompt: `// [code]:
void fib(int **pt, int n) {
    *pt = malloc(sizeof(int) * n);
    int *heap_pt = *pt;
    for (int i = 0; i < n ; i++) {
      if (i == 0) {
        heap_pt[0] = 0;
      } else if (i == 1) {
        heap_pt[1] = 1;
      } else {
        heap_pt[i] = heap_pt[i-1] + heap_pt[i-2];
      }
    }
}
// [question]: is *heap_pt pointing to the first element of an array?
// [detailed-answer]: (in the context of C Programming)
{
    "answer": [
        "paragraph": "Yes, \`heap_pt\` is pointing to the first element of an array. In this code, \`pt\` is a double pointer to an integer, and \`heap_pt\` is a single pointer to an integer. \`malloc\` is used to allocate memory dynamically on the heap and the returned pointer is stored in \`*pt\`. Then \`heap_pt\` is assigned the value of \`*pt\`, so \`heap_pt\` is pointing to the first element of the dynamically allocated array. In the for loop, the Fibonacci sequence is calculated and stored in the dynamically allocated memory, starting from the first element, which \`heap_pt\` is pointing to."
    ]
}
// [follow-up-question]: how can I rewrite this code to use a single pointer?
// [detailed-answer]: (in the context of C Programming)
{
    "answer": [
        "paragraph": "You can rewrite this code to use a single pointer by using \`pt\` instead of \`heap_pt\` in the for loop. \`pt\` is a double pointer to an integer, so \`*pt\` is a single pointer to an integer, which is what you need to use in the for loop.",
        "code-snippet": {
            "code":
"void fib(int **pt, int n) {
    *pt = malloc(sizeof(int) * n);
    for (int i = 0; i < n ; i++) {
        if (i == 0) {
            (*pt)[0] = 0;
        } else if (i == 1) {
            (*pt)[1] = 1;
        } else {
            (*pt)[i] = (*pt)[i-1] + (*pt)[i-2];
        }
    }
}",
            "title": "fib rewritten to use a single pointer"
        }
    ]
}
// [end-question-answer]


// [code]:
unsigned long fsize(char* file) {
    FILE f = fopen(file, "r");
    fseek(0, f, SEEK_END);
    long len = long(ftell(f));
    fclose(f);

    return len;
}
// [question]: what's wrong with this code?
// [detailed-answer]: (in the context of C Programming)
{
    "answer": [
        "paragraph": "The code contains a number of issues that would prevent it from working as intended:",
        "paragraph": "1. The \`FILE\` type should be a pointer, but it is being declared as a value in the line \`FILE f = fopen(file, "r");\`.",
        "paragraph": "2. The \`fseek\` function takes the file pointer as its first argument and the offset as its second argument, but the arguments are being passed in the opposite order in the line \`fseek(0, f, SEEK_END);\`.",
        "paragraph": "3. \`long\` is not a valid type in C, instead \`long int\` should be used.",
        "code-snippet": {
            "code":
"unsigned long fsize(char* file) {
    FILE *f = fopen(file, \\"r\\");
    fseek(f, 0, SEEK_END);
    long int len = ftell(f);
    fclose(f);
    
    return len;
}",
            "title": "fixed code"
    ]
}
// [follow-up-question]: how can I use fseek and ftell properly?
// [detailed-answer]: (in the context of C Programming)
{
    "answer": [
        "paragraph": "Here's the prototype of the \`fseek\` function:",
        "code-snippet": {
            "code":
"int fseek(FILE *stream, long int offset, int whence);",
            "title": "fseek prototype"
        },
        "paragraph": "The first argument is the file pointer, the second argument is the offset, and the third argument is the position from which the offset is measured. The third argument can be one of the following values:",
        "paragraph": "1. \`SEEK_SET\` - the offset is measured from the beginning of the file",
        "paragraph": "2. \`SEEK_CUR\` - the offset is measured from the current position in the file",
        "paragraph": "3. \`SEEK_END\` - the offset is measured from the end of the file",
        "paragraph": "Here's the prototype of the \`ftell\` function:",
        "code-snippet": {
            "code":
"long int ftell(FILE *stream);",
            "title": "ftell prototype"
        },
        "paragraph": "The \`ftell\` function returns the current position in the file, which is measured in bytes from the beginning of the file."
    ]
}
// [end-question-answer]


${prevThread}
// [follow-up-question]: ${newQuestion}
// [detailed-answer]: (in the context of C Programming)
`,
    };
};
