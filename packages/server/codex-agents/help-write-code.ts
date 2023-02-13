const mainHelpWriteCode = (task: string) => {
    return {
        prompt: `<|endoftext|>// blank .c programming file. for each task, first write the code, then explain each line of code in a comment next to it. Use the following format:
// [task]: implement a linked list using structs:
"code": [
    {
        "part-header": "define the structure of a node that contains the data and a pointer to the next node.",
        "code": "struct node {
    int data;
    struct node *next;
};"
    },
    {
        "part-header": "create a head node that points to the first node in the list.",
        "code": "struct node *head = NULL;"
    },
    {
        "part-header": "dynamically allocate memory for a new node",
        "code": "struct node *new_node = (struct node *)malloc(sizeof(struct node));"
    },
    {
        "part-header": "initialize the data and next fields of the new node",
        "code": "new_node->data = 1;
new_node->next = NULL;"
    },
    {
        "part-header": "traverse the list to find the last node and add the new node to the end",
        "code": "struct node *current = head;
while (current->next != NULL) {
    current = current->next;
}
current->next = new_node;"
    }
],
"c-library-functions": [
    {
        "name": "malloc",
        "description": "dynamically allocate memory",
        "include": "stdlib.h",
        "prototype": "void *malloc(size_t size)"
    },
    {
        "name": "free",
        "description": "free dynamically allocated memory",
        "include": "stdlib.h",
        "prototype": "void free(void *ptr)"
    },
    {
        "name": "sizeof",
        "description": "get the size of a variable or type",
        "include": "stdlib.h",
        "prototype": "size_t sizeof(type)"
    }
]
// [end-task]


// [task]: define a function void fib(...) below. this function takes parameter n and generates the first n values in the fibonacci sequence. the values should be stored in a dynamically-allocated array composed of exactly the correct number of integers. the values should be returned through a pointer parameter passed in as the first argument.
"code": [
    {
        "part-header": "define the function",
        "code": "void fib(int **arr, int n) {
    *arr = (int *)malloc(n * sizeof(int));
    (*arr)[0] = 0;
    (*arr)[1] = 1;
    for (int i = 2; i < n; i++) {
        (*arr)[i] = (*arr)[i - 1] + (*arr)[i - 2];
    }
}"
    },
    {
        "part-header": "call the function",
        "code": "int *arr;
fib(&arr, 10);
for (int i = 0; i < 10; i++) {
    printf(\\"%d \\", arr[i]);
}
free(arr);"
    }
],
"c-library-functions": [
    {
        "name": "malloc",
        "description": "dynamically allocate memory",
        "include": "stdlib.h",
        "prototype": "void *malloc(size_t size)",
    },
    {
        "name": "free",
        "description": "free dynamically allocated memory",
        "include": "stdlib.h",
        "prototype": "void free(void *ptr)"
    },
    {
        "name": "sizeof",
        "description": "get the size of a variable or type",
        "include": "stdlib.h",
        "prototype": "size_t sizeof(type)"
    }
]
// [end-task]


// [task]: ${task}
"code": [
`,
        stopTokens: [`// [end-task]`],
    };
};

const suggestHelpWriteCode = (task: string) => {
    return {
        prompt: `[task]: ${task}
[suggested-tasks]: generate three "how can I implement" tasks similar to the above [task] in C programming:
1.`,
        stopTokens: [`4.`],
    };
};

const replyHelpWriteCode = (prevThread: string, newQuestion: string) => {
    return {
        prompt: `// [task]: implement a linked list using structs:
"code": [
    {
        "part-header": "define the structure of a node that contains the data and a pointer to the next node.",
        "code": "struct node {
    int data;
    struct node *next;
};"
    },
    {
        "part-header": "create a head node that points to the first node in the list.",
        "code": "struct node *head = NULL;"
    },
    {
        "part-header": "dynamically allocate memory for a new node",
        "code": "struct node *new_node = (struct node *)malloc(sizeof(struct node));"
    },
    {
        "part-header": "initialize the data and next fields of the new node",
        "code": "new_node->data = 1;
new_node->next = NULL;"
    },
    {
        "part-header": "traverse the list to find the last node and add the new node to the end",
        "code": "struct node *current = head;
while (current->next != NULL) {
    current = current->next;
}
current->next = new_node;"
    }
],
"c-library-functions": [
    {
        "name": "malloc",
        "description": "dynamically allocate memory",
        "include": "stdlib.h",
        "prototype": "void *malloc(size_t size)"
    },
    {
        "name": "free",
        "description": "free dynamically allocated memory",
        "include": "stdlib.h",
        "prototype": "void free(void *ptr)"
    },
    {
        "name": "sizeof",
        "description": "get the size of a variable or type",
        "include": "stdlib.h",
        "prototype": "size_t sizeof(type)"
    }
]
// [follow-up-task]: write a function that would get a list of integers (as a pointer) and returns a linked list of the same integers.
"code": [
    {
        "part-header": "define the function",
        "code": "struct node *listify(int *arr, int n) {
    struct node *head = NULL;   
    for (int i = 0; i < n; i++) {
        struct node *new_node = (struct node *)malloc(sizeof(struct node));
        new_node->data = arr[i];
        new_node->next = NULL;
        if (head == NULL) {
            head = new_node;
        } else {
            struct node *current = head;
            while (current->next != NULL) {
                current = current->next;
            }
            current->next = new_node;
        }
    }
    return head;
}"
    },
    {
        "part-header": "call the function",
        "code": "int arr[] = {1, 2, 3, 4, 5};
struct node *head = listify(arr, 5);
struct node *current = head;
while (current != NULL) {
    printf(\\"%d \\", current->data);
    current = current->next;
}"
    }
],
"c-library-functions": [
    {
        "name": "malloc",
        "description": "dynamically allocate memory",
        "include": "stdlib.h",
        "prototype": "void *malloc(size_t size)",
    },
    {
        "name": "free",
        "description": "free dynamically allocated memory",
        "include": "stdlib.h",
        "prototype": "void free(void *ptr)"
    },
    {
        "name": "sizeof",
        "description": "get the size of a variable or type",
        "include": "stdlib.h",
        "prototype": "size_t sizeof(type)"
    }
]
// [end-task]


// ${prevThread}
// [follow-up-question]: ${newQuestion}
"code": [
`,
        stopTokens: [`// [end-task]`],
    };
};
