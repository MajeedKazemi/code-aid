const v1 = `[code]:
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
[task]: generate a non c-language pseudo code (close to plain English) of the above [code]
[pseudo-code]:

Function fib(arr, count):
    Allocate count space in arr
    IF count > 0 THEN
        Set arr[0] to 0
    IF count > 1 THEN
        Set arr[1] to 1
    FOR i = 2 to count
        Set arr[i] to arr[i - 1] + arr[i - 2]
    END FOR
END Function
[end-pseudo-code]
`;

const v2 = `[code]:
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
[task]: generate a pseudocode of the above [code]
[pseudo-code]:
// function to generate Fibonacci sequence
FUNCTION fib(arr, count):
    // allocate memory for 'arr'
    arr = ALLOCATE(count * sizeof(int))
    
    // if count is greater than 0, set first element to 0
    IF count > 0:
        arr[0] = 0
    
    // if count is greater than 1, set second element to 1
    IF count > 1:
        arr[1] = 1
    
    // loop through the rest of the elements, setting each element to the sum of the two elements before it
    FOR i = 2 TO count:
        arr[i] = arr[i - 1] + arr[i - 2]
        
    // return 'arr'
    RETURN arr
END FUNCTION`;

const v3 = `[code]:
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
[task]: generate an easy to understand structured **pseudo-code** of the above [code] (don't add comments, just convert it to a new interesting pseudo-code). take inspiration from other high-level structured programming languages, e.g. SQL, assembly, markdown, python, 
[pseudo-code]:

FUNCTION fib(arr, count):
    arr ← ALLOCATE(count)
    
    IF count > 0:
        arr[0] ← 0
    
    IF count > 1:
        arr[1] ← 1
    
    LOOP FROM i ← 2; i < count; i++:
        arr[i] ← arr[i-1] + arr[i-2]
    
    RETURN arr

END FUNCTION`;
