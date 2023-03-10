import { genericParser, suggestionsParser } from "./shared/parsers";

export const mainWriteCode = (question: string) => {
    return {
        prompt: `focus on implementing c programming code. for each [question] below, implement the C programming code. first provide a high-level [answer], then provide the C programming code. finally, provide the [c-library-functions] used in the code. end response with [end-question].
[question]: what is the meaning of life?
[answer]: this question is irrelevant to C Programming.
[end-question-answer]


[question]: the fib function generates the first n values in the Fibonacci sequence, stores them in a dynamically-allocated array, and returns them through a pointer parameter passed as the first argument. call fib using argc and argv in the main function.
[answer]: to define the \`fib\` function, we need to pass in a pointer to an array of integers (which itself is a pointer) and the number of values to generate. Then, we need to dynamically allocate memory for the array using \`malloc\`. Next, we need to initialize the first two values in the array to 0 and 1. Make sure to check for the edge case in which n is less than 2 (in which case we can just return the array). Finally, we need to use a for loop to generate the remaining values in the array. The fibonacci sequence is defined as the sum of the previous two values in the sequence. Therefore, we can use the previous two values in the array to generate the next value in the array. Once we have generated the first n values in the array, we can return the array through the pointer parameter.
[code]:
[code-title]: define the function
void fib(int **arr, int n) {
    *arr = (int *)malloc(n * sizeof(int));

    if (n < 2) {
        return;
    }

    (*arr)[0] = 0;
    (*arr)[1] = 1;

    for (int i = 2; i < n; i++) {
        (*arr)[i] = (*arr)[i - 1] + (*arr)[i - 2];
    }
}

[code-title]: call the function in main using values from argc and argv
int main(int argc, char *argv[]) {
    int n = atoi(argv[1]);
    int *arr;
    fib(&arr, n);
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    free(arr);
    return 0;
}
[end-code]
[c-library-functions]: malloc, free, atoi, printf
[end-question-answer]


[question]: ${question}
[answer]:`,
        stop: [`[end-question-answer]`],
        model: "text-davinci-003",
        temperature: 0.1,
        max_tokens: 2048,
        parser: (resTxt: string) => genericParser(resTxt),
        raw: (resTxt: string) => `[question]: ${question}
[answer]:${resTxt}`,
    };
};

export const suggestWriteCode = (question: string, code: string) => {
    return {
        prompt: `[task-description]: ${question}
[answer]:
${code}
[suggested-tasks]: generate three "how can I implement" tasks similar to the above [task-description] in C programming:
1.`,

        stop: ["4."],
        model: "text-davinci-003",
        temperature: 0.3,
        max_tokens: 3500,
        parser: (output: string) => suggestionsParser(output),
    };
};

export const replyWriteCode = (
    prevResponses: string[],
    newQuestion: string
) => {
    let thread = "";

    if (prevResponses.length === 0) {
        console.error("prevQuery is empty");
    }

    `[code]:
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

[code-title]: traverse the list to find the last node and add the new node to the end
struct node *current = head;
while (current->next != NULL) {
    current = current->next;
}
current->next = new_node;
[end-code]`;

    // extract the code
    let code = "";

    for (let i = prevResponses.length - 1; i >= 0; i--) {
        let lines = prevResponses[i].split("\n");

        let codeLineStartIndex = lines.findIndex((line) =>
            line.startsWith("[code]:")
        );

        let codeLineEndIndex = lines.findIndex((line) =>
            line.startsWith("[end-code]")
        );

        if (
            codeLineStartIndex !== -1 &&
            codeLineEndIndex !== -1 &&
            code === ""
        ) {
            code = lines
                .slice(codeLineStartIndex, codeLineEndIndex + 1)
                .join("\n");
        } else {
            code = "";
        }

        let startWithQuestion = lines.filter((line) =>
            line.startsWith("[question]:")
        );

        if (startWithQuestion.length > 0) {
            let question = startWithQuestion[0].replace("[question]: ", "");
            let answer = lines
                .filter((line) => line.startsWith("[answer]:"))[0]
                .replace("[answer]: ", "");

            if (code !== "") {
                thread = `[question]: ${question}\n[answer]: ${answer}\n${code}\n[end-question-answer]\n\n${thread}`;
            } else {
                thread = `[question]: ${question}\n[answer]: ${answer}\n[end-question-answer]\n\n${thread}`;
            }
        } else {
            let followUpQuestion = lines
                .filter((line) => line.startsWith("[follow-up-question]:"))[0]
                .replace("[follow-up-question]: ", "");

            let followUpAnswer = lines
                .filter((line) => line.startsWith("[answer]:"))[0]
                .replace("[answer]: ", "");

            if (code !== "") {
                thread = `[follow-up-question]: ${followUpQuestion}\n[answer]: ${followUpAnswer}\n${code}\n[end-question-answer]\n\n${thread}`;
            } else {
                thread = `[follow-up-question]: ${followUpQuestion}\n[answer]: ${followUpAnswer}\n[end-question-answer]\n\n${thread}`;
            }
        }
    }

    return {
        prompt: `[question]: a linked list using structs:
[answer]: to implement a linked list, we need to define a \`struct\` that contains the data and a pointer to the next node in the list. Then, we need to create a head node that points to the first node in the list. The head node should be a pointer to a node struct. Next, we need to dynamically allocate memory for a new node (including the data and the next pointer) using \`malloc\`. Then, we need to initialize the data and next fields of the new node. Finally, we need to traverse the list to find the last node and add the new node to the end. To traverse the list, we need to create a current pointer that points to the head node. Then, we can use a while loop to traverse the list until we reach the last node. In the while loop, we can update the current pointer to point to the next node in the list. Once we reach the last node, we can set the next field of the last node to point to the new node.
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

[code-title]: traverse the list to find the last node and add the new node to the end
struct node *current = head;
while (current->next != NULL) {
    current = current->next;
}
current->next = new_node;
[end-code]
[end-question-answer]


[follow-up-question]: write a function that would get a list of integers (as a pointer) and returns a linked list of the same integers.
[answer]: to write a function that would get a list of integers (as a pointer) and returns a linked list of the same integers, we need to define a function that takes in an array of integers and the number of integers in the array. Then, we need to dynamically allocate memory for a new node using \`malloc\`. Next, we need to initialize the data field of the new node to the first value in the array. Then, we need to create a head node that points to the first node in the list. The head node should be a pointer to a node struct. Finally, we need to use a for loop to generate the remaining values in the array. In the for loop, we need to dynamically allocate memory for a new node using \`malloc\`. Then, we need to initialize the data field of the new node to the next value in the array. Next, we need to traverse the list to find the last node and add the new node to the end. To traverse the list, we need to create a current pointer that points to the head node. Then, we can use a while loop to traverse the list until we reach the last node. In the while loop, we can update the current pointer to point to the next node in the list. Once we reach the last node, we can set the next field of the last node to point to the new node.
[code]:
[code-title]: define the function listify
struct node *listify(int *arr, int n) {
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
}

[code-title]: call the function from main
int main() {
    int arr[] = {1, 2, 3, 4, 5};
    struct node *head = listify(arr, 5);
    struct node *current = head;
    while (current != NULL) {
        printf("%d ", current->data);
        current = current->next;
    }
    return 0;
}
[end-code]
[c-library-functions]: malloc, free, printf, scanf
[end-question-answer]


${thread}
[follow-up-question]: ${newQuestion}
[answer]:`,
        stop: ["[end-question-answer]"],
        model: "text-davinci-003",
        temperature: 0.1,
        max_tokens: 1024,
        parser: (resTxt: string) => genericParser(resTxt),
        raw: (resTxt: string) => `[follow-up-question]: ${newQuestion}
[answer]:${resTxt}`,
    };
};
