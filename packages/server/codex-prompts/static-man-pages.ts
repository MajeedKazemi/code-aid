export const staticManPages = {
    printf: {
        summary:
            "`printf()` is a standard C library function that writes a formatted string to the standard output stream.",
        synopsis: "int printf(const char *format, ...);",
        include: ["#include <stdio.h>"],
        examples: [
            {
                title: "using `printf()` to print a number and a string",
                code: '#include <stdio.h>\n\nint main () {\n    int number = 10;\n    char string[] = "Hello World";\n    \n    printf("Number = %d, String = %s\\n", number, string);\n    \n    return 0;\n}\n',
            },
            {
                title: "using `printf()` to print ASCII characters",
                code: '#include <stdio.h>\n\nint main () {\n   int ch;\n\n   for( ch = 75 ; ch <= 100; ch++ ) {\n      printf("ASCII value = %d, Character = %c\\n", ch , ch );\n   }\n\n   return(0);\n}\n',
            },
        ],
        description:
            "`printf()` function takes a format string and a variable number of arguments, and writes the formatted string to the standard output stream. The format string contains conversion specifications, which are used to specify how the arguments should be formatted.",
        return: "`printf()` function returns the number of characters written to the standard output stream.",
        notes: "The format string can contain escape sequences, which are special characters that are interpreted by the `printf()` function. These escape sequences are used to format the output of the `printf()` function.",
        bugs: "It is possible for `printf()` to cause a buffer overflow if the format string is too long. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["fprintf", "sprintf"],
    },
    scanf: {
        summary:
            "`scanf()` is a standard C library function that reads formatted input from the standard input stream (stdin) and stores it in the locations pointed to by its arguments.",
        synopsis: "int scanf(const char *format, ...);",
        include: ["#include <stdio.h>"],
        examples: [
            {
                title: "The following example shows the usage of `scanf()` function.",
                code: '#include <stdio.h>\n\nint main () {\n    int i;\n    float f;\n    \n    printf("Enter an integer and a float: ");\n    scanf("%d %f", &i, &f);\n    \n    printf("You entered: %d and %f\\n", i, f);\n    \n    return 0;\n}',
            },
        ],
        description:
            "`scanf()` function reads formatted input from the standard input stream (stdin) and stores it in the locations pointed to by its arguments. The format string is a sequence of characters that specify the expected format of the input.",
        return: "`scanf()` function returns the number of items successfully read, or EOF if an input failure occurs before any data is successfully read.",
        notes: "It is important to note that `scanf()` does not check for buffer overflows, so it is important to ensure that the size of the destination array is large enough to hold the input data.",
        bugs: "`scanf()` can cause a buffer overflow if the destination array is not large enough to hold the input data. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["fscanf", "sscanf", "fgets", "getchar", "getline"],
    },
    malloc: {
        summary:
            "`malloc()` is a standard C library function that allocates memory on the heap.",
        synopsis: "void *malloc(size_t size);",
        include: ["#include <stdlib.h>"],
        examples: [
            {
                title: "The following example shows the usage of `malloc()` function.",
                code: '#include <stdio.h>\n#include <stdlib.h>\n\nint main () {\n    int num, i, *ptr, sum = 0;\n    \n    printf("Enter number of elements: ");\n    scanf("%d", &num);\n    \n    ptr = (int*) malloc(num * sizeof(int));  // Memory allocated using malloc\n    \n    if(ptr == NULL) {\n        printf("Error! memory not allocated.");\n        exit(0);\n    }\n    \n    printf("Enter elements of array: ");\n    for(i = 0; i < num; ++i) {\n        scanf("%d", ptr + i);\n        sum += *(ptr + i);\n    }\n    \n    printf("Sum = %d", sum);\n    free(ptr);\n    return 0;\n}',
            },
        ],
        description:
            "`malloc()` function takes a single argument, size, which is the size of the memory block, in bytes, to be allocated. It returns a pointer to the beginning of the allocated memory block.",
        return: "`malloc()` function returns a pointer to the allocated memory block, or NULL if the request fails.",
        notes: "It is important to remember to free the memory allocated by `malloc()` when it is no longer needed, to avoid memory leaks.",
        bugs: "It is possible for `malloc()` to return a NULL pointer if the request fails. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["calloc", "realloc", "free"],
    },
    free: {
        summary:
            "`free()` is a standard C library function that deallocates a block of memory previously allocated by a call to `malloc()`, `calloc()`, or `realloc()`.",
        synopsis: "void free(void *ptr);",
        include: ["#include <stdlib.h>"],
        examples: [
            {
                title: "The following example shows the usage of `free()` function.",
                code: '#include <stdio.h>\n#include <stdlib.h>\n\nint main () {\n    int *ptr = (int *)malloc(sizeof(int));\n    \n    *ptr = 10;\n    printf("Value of ptr = %d\\n", *ptr);\n    \n    free(ptr);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`free()` function takes a single argument, a pointer to a block of memory previously allocated by a call to `malloc()`, `calloc()`, or `realloc()`. The argument should point to a memory block previously allocated with an appropriate call to one of those functions. If the argument does not point to such a block, the behavior is undefined.",
        return: "`free()` function does not return a value.",
        notes: "It is important to note that `free()` does not change the value of the pointer passed to it, it simply deallocates the memory pointed to by the pointer.",
        bugs: "It is possible for `free()` to cause a memory leak if the pointer passed to it does not point to a block of memory previously allocated by a call to `malloc()`, `calloc()`, or `realloc()`. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["malloc", "calloc", "realloc"],
    },
    getchar: {
        summary:
            "`getchar()` is a standard C library function that reads a single character from the standard input stream (stdin).",
        synopsis: "int getchar(void);",
        include: ["#include <stdio.h>"],
        examples: [
            {
                title: "The following example shows the usage of `getchar()` function.",
                code: '#include <stdio.h>\n\nint main() {\n    char c;\n    printf("Enter a character: ");\n    c = getchar();\n    printf("You entered: %c", c);\n    return 0;\n}',
            },
        ],
        description:
            "`getchar()` function reads a single character from the standard input stream (stdin) and returns it as an integer. If the end of the input stream is reached, it returns EOF (end of file).",
        return: "`getchar()` function returns the character read as an integer or EOF if the end of the input stream is reached.",
        notes: "The `getchar()` function is equivalent to `getc(stdin)`.",
        bugs: "None.",
        similar: ["getc", "fgetc", "getw", "fgetw"],
    },
    fopen: {
        summary:
            "`fopen()` is a standard C library function that opens a file and returns a pointer to a FILE structure.",
        synopsis: "FILE *fopen(const char *pathname, const char *mode);",
        include: ["#include <stdio.h>"],
        examples: [
            {
                title: "The following example shows the usage of `fopen()` function.",
                code: '#include <stdio.h>\n\nint main () {\n    FILE *fp;\n    char buff[255];\n    \n    fp = fopen("test.txt", "r");\n    fscanf(fp, "%s", buff);\n    printf("1 : %s\\n", buff );\n    \n    fgets(buff, 255, (FILE*)fp);\n    printf("2: %s\\n", buff );\n    \n    fgets(buff, 255, (FILE*)fp);\n    printf("3: %s\\n", buff );\n    fclose(fp);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`fopen()` function takes two arguments, pathname and mode, and returns a pointer to a FILE structure. The pathname argument is the name of the file to be opened, and the mode argument is a string that specifies how the file should be opened.",
        return: "`fopen()` function returns a pointer to the opened file, or NULL if the file could not be opened.",
        notes: 'The mode argument can be one of the following: "r" for reading, "w" for writing, "a" for appending, "r+" for reading and writing, "w+" for writing and reading, or "a+" for appending and reading.',
        bugs: "It is possible for `fopen()` to fail if the file does not exist or if the user does not have permission to access the file. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["fclose", "fread", "fwrite", "fseek", "ftell"],
    },
    fseek: {
        summary:
            "`fseek()` is a standard C library function that sets the file position indicator for the stream pointed to by stream.",
        synopsis: "int fseek(FILE *stream, long offset, int whence);",
        include: ["#include <stdio.h>"],
        examples: [
            {
                title: "The following example shows the usage of `fseek()` function.",
                code: '#include <stdio.h>\n\nint main () {\n    FILE *fp;\n    char buff[255];\n    \n    fp = fopen("test.txt", "r");\n    fseek(fp, 10, SEEK_SET);\n    fscanf(fp, "%s", buff);\n    printf("1 : %s\\n", buff );\n    \n    fseek(fp, -3, SEEK_CUR);\n    fscanf(fp, "%s", buff);\n    printf("2: %s\\n", buff );\n    \n    fseek(fp, -3, SEEK_END);\n    fscanf(fp, "%s", buff);\n    printf("3: %s\\n", buff );\n    \n    fclose(fp);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`fseek()` function sets the file position indicator for the stream pointed to by stream. The new position, measured in bytes, is obtained by adding offset bytes to the position specified by whence. If whence is set to SEEK_SET, SEEK_CUR, or SEEK_END, the offset is relative to the start of the file, the current position indicator, or end-of-file, respectively.",
        return: "`fseek()` function returns zero on success, or non-zero if an error occurs.",
        notes: "The `fseek()` function does not change the file position indicator if a write error occurs.",
        bugs: "The `fseek()` function does not check for overflow of the offset argument.",
        similar: ["ftell", "rewind", "fgetpos", "fsetpos"],
    },
    ftell: {
        summary:
            "`ftell()` is a standard C library function that returns the current position of the file pointer associated with the given stream.",
        synopsis: "long int ftell(FILE *stream);",
        include: ["#include <stdio.h>"],
        examples: [
            {
                title: "The following example shows the usage of `ftell()` function.",
                code: '#include <stdio.h>\n\nint main () {\n    FILE *fp;\n    long int pos;\n    \n    fp = fopen("file.txt", "r");\n    pos = ftell(fp);\n    printf("Current position is %ld\\n", pos);\n    \n    fclose(fp);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`ftell()` function takes a single argument, a pointer to a `FILE` structure, and returns the current position of the file pointer associated with the given stream.",
        return: "`ftell()` function returns the current position of the file pointer associated with the given stream, or -1L if an error occurs.",
        notes: "The position returned by `ftell()` is measured in bytes from the beginning of the file.",
        bugs: "If the file pointer is at the end of the file, `ftell()` will return 0, which may be misinterpreted as an error.",
        similar: ["fseek", "rewind", "fgetpos", "fsetpos"],
    },
    fclose: {
        summary:
            "`fclose()` is a standard C library function that closes a file stream.",
        synopsis: "int fclose(FILE *stream);",
        include: ["#include <stdio.h>"],
        examples: [
            {
                title: "The following example shows the usage of `fclose()` function.",
                code: '#include <stdio.h>\n\nint main () {\n    FILE *fp;\n    char filename[] = "file.txt";\n    \n    fp = fopen(filename, "r");\n    if (fp == NULL) {\n        perror("Error while opening the file.\\n");\n        exit(EXIT_FAILURE);\n    }\n    \n    fclose(fp);\n    \n    return 0;\n}',
            },
        ],
        description:
            "`fclose()` function takes a single argument, a pointer to a `FILE` object that identifies the stream to be closed. All associated buffers are flushed and the stream is closed.",
        return: "`fclose()` function returns `0` on success, or `EOF` on failure.",
        notes: "It is important to close all open files when they are no longer needed, as this will free up system resources.",
        bugs: "If `fclose()` is called on a stream that has already been closed, it will return `EOF` and set the `errno` variable to `EBADF`.",
        similar: ["fopen", "fread", "fwrite", "fseek", "ftell"],
    },
    fgets: {
        summary:
            "`fgets()` is a standard C library function that reads a line from a stream and stores it in a string.",
        synopsis: "char *fgets(char *str, int n, FILE *stream);",
        include: ["#include <stdio.h>"],
        examples: [
            {
                title: "The following example shows the usage of `fgets()` function.",
                code: '#include <stdio.h>\n\nint main () {\n    char str[100];\n    \n    printf("Enter a string: ");\n    fgets(str, 100, stdin);\n    printf("You entered: %s", str);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`fgets()` function reads a line from the specified stream and stores it into the string pointed to by str. It stops when either (n-1) characters are read, the newline character is read, or the end-of-file is reached, whichever comes first.",
        return: "`fgets()` function returns a pointer to the string str on success, and a null pointer on failure or when end-of-file occurs while no characters have been read.",
        notes: "The newline character is not stored in the string. If the number of characters read is equal to n-1, the last character is set to the null character.",
        bugs: "It is possible for `fgets()` to cause a buffer overflow if the string pointed to by str is not large enough to hold the line read from the stream. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["fgetc", "fputs", "gets", "puts"],
    },
    fgetc: {
        summary:
            "`fgetc()` is a standard C library function that reads a single character from the specified stream.",
        synopsis: "int fgetc(FILE *stream);",
        include: ["#include <stdio.h>"],
        examples: [
            {
                title: "The following example shows the usage of `fgetc()` function.",
                code: '#include <stdio.h>\n\nint main () {\n    FILE *fp;\n    int c;\n    \n    fp = fopen("file.txt", "r");\n    if (fp == NULL)\n        exit(EXIT_FAILURE);\n    \n    while ((c = fgetc(fp)) != EOF)\n        printf("%c", c);\n    \n    fclose(fp);\n    return 0;\n}',
            },
        ],
        description:
            "`fgetc()` function reads a single character from the specified stream and returns it as an integer. If the end of the file is reached, it returns `EOF`.",
        return: "`fgetc()` function returns the character read as an unsigned char cast to an int, or `EOF` on end of file or error.",
        notes: "The `fgetc()` function is equivalent to `getc()` with the argument `stdin`.",
        bugs: "None.",
        similar: ["getc", "fgets", "fread", "fputc"],
    },
    fputs: {
        summary:
            "`fputs()` is a standard C library function that writes a string to a given stream.",
        synopsis: "int fputs(const char *s, FILE *stream);",
        include: ["#include <stdio.h>"],
        examples: [
            {
                title: "The following example shows the usage of `fputs()` function.",
                code: '#include <stdio.h>\n\nint main () {\n    FILE *fp;\n    char str[] = "This is tutorialspoint.com";\n    \n    fp = fopen("file.txt", "w+");\n    fputs(str, fp);\n    fclose(fp);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`fputs()` function takes two arguments, a string and a stream, and writes the string to the stream. The string must be null-terminated.",
        return: "`fputs()` function returns a non-negative value on success, or EOF on error.",
        notes: "The `fputs()` function does not append a newline character to the end of the string.",
        bugs: "It is possible for `fputs()` to cause a buffer overflow if the string is too long for the stream. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["fprintf", "fwrite", "puts", "putc"],
    },
    gets: {
        summary:
            "`gets()` is a standard C library function that reads a line from the standard input stream (stdin) into a buffer.",
        synopsis: "char *gets(char *s);",
        include: ["#include <stdio.h>"],
        examples: [
            {
                title: "The following example shows the usage of `gets()` function.",
                code: '#include <stdio.h>\n\nint main () {\n    char str[100];\n    \n    printf("Enter a value :");\n    gets(str);\n    \n    printf("\\nYou entered: %s", str);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`gets()` function reads a line from the standard input stream (stdin) into a buffer. It stops when either the newline character is read or when the end-of-file is reached, whichever comes first.",
        return: "`gets()` function returns a pointer to the buffer containing the read line.",
        notes: "`gets()` is a dangerous function as it does not perform any bounds checking on the input string. This can result in a buffer overflow if the input string is too long.",
        bugs: "`gets()` is a dangerous function as it does not perform any bounds checking on the input string. This can result in a buffer overflow if the input string is too long.",
        similar: ["fgets", "getline", "getchar"],
    },
    puts: {
        summary:
            "`puts()` is a standard C library function that writes a string to the standard output stream (stdout).",
        synopsis: "int puts(const char *str);",
        include: ["#include <stdio.h>"],
        examples: [
            {
                title: "The following example shows the usage of `puts()` function.",
                code: '#include <stdio.h>\n\nint main () {\n    char str[100];\n    \n    strcpy(str, "This is tutorialspoint.com");\n    puts(str);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`puts()` function takes a single argument, a pointer to a null-terminated string, and writes it to the standard output stream (stdout). It appends a newline character to the output.",
        return: "`puts()` function returns a non-negative value on success, or EOF on error.",
        notes: "The `puts()` function is not guaranteed to be thread-safe.",
        bugs: "The `puts()` function does not check for buffer overflows, so it is possible for it to cause a buffer overflow if the string is too long.",
        similar: ["printf", "fputs", "putchar"],
    },
    fread: {
        summary:
            "`fread()` is a standard C library function that reads a specified number of elements from a given stream into an array.",
        synopsis:
            "size_t fread(void *ptr, size_t size, size_t nmemb, FILE *stream);",
        include: ["#include <stdio.h>"],
        examples: [
            {
                title: "The following example shows the usage of `fread()` function.",
                code: '#include <stdio.h>\n\nint main () {\n    FILE *fp;\n    char buff[255];\n    \n    fp = fopen("test.txt", "r");\n    fread(buff, sizeof(buff), 1, fp);\n    printf("%s", buff);\n    fclose(fp);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`fread()` function reads `nmemb` elements of data, each `size` bytes long, from the given stream, into the array pointed to by `ptr`. The file position indicator of the given stream is advanced by the total amount of bytes read.",
        return: "`fread()` function returns the number of elements successfully read, which may be less than `nmemb` if a read error or end-of-file is encountered.",
        notes: "It is not guaranteed that the data read from the stream will be null-terminated. This can result in unexpected behavior.",
        bugs: "It is possible for `fread()` to cause a buffer overflow if the destination array is not large enough to hold the data read from the stream. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["fwrite", "fgetc", "fgets", "fputc", "fputs"],
    },
    fwrite: {
        summary:
            "`fwrite()` is a standard C library function that writes a specified number of elements of a given size from a given buffer to a given stream.",
        synopsis:
            "size_t fwrite(const void *ptr, size_t size, size_t nmemb, FILE *stream);",
        include: ["#include <stdio.h>"],
        examples: [
            {
                title: "The following example shows the usage of `fwrite()` function.",
                code: '#include <stdio.h>\n\nint main () {\n    FILE *fp;\n    char str[] = "This is tutorialspoint.com";\n    \n    fp = fopen("file.txt", "w");\n    fwrite(str, 1, sizeof(str), fp);\n    \n    fclose(fp);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`fwrite()` function takes four arguments, a pointer to the buffer containing the data to be written, the size of each element to be written, the number of elements to be written, and a pointer to the stream to which the data is to be written.",
        return: "`fwrite()` function returns the number of elements written, or 0 if an error occurred.",
        notes: "It is important to note that `fwrite()` does not write a null terminator to the stream, so the data written may not be null-terminated.",
        bugs: "It is possible for `fwrite()` to cause a buffer overflow if the destination array is not large enough to hold the source string. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["fread", "fprintf", "fputs", "fputc"],
    },
    fputc: {
        summary:
            "`fputc()` is a standard C library function that writes a character to the specified stream.",
        synopsis: "int fputc(int character, FILE *stream);",
        include: ["#include <stdio.h>"],
        examples: [
            {
                title: "The following example shows the usage of `fputc()` function.",
                code: '#include <stdio.h>\n\nint main () {\n    FILE *fp;\n    int c;\n    \n    fp = fopen("file.txt", "w+");\n    c = fputc(\'A\', fp);\n    printf("%c", c);\n    fclose(fp);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`fputc()` function takes two arguments, character and stream. It writes the character to the specified stream and returns the character written, or EOF if an error occurs.",
        return: "`fputc()` function returns the character written, or EOF if an error occurs.",
        notes: "The stream must be open for writing before calling `fputc()`.",
        bugs: "If the stream is not open for writing, `fputc()` will fail and return EOF.",
        similar: ["fgetc", "fputs", "putc", "putchar"],
    },
    socket: {
        summary:
            "`socket()` is a system call that creates an endpoint for communication and returns a file descriptor that refers to that endpoint.",
        synopsis: "int socket(int domain, int type, int protocol);",
        include: ["#include <sys/socket.h>"],
        examples: [
            {
                title: "The following example shows the usage of `socket()` function.",
                code: '#include <stdio.h>\n#include <sys/socket.h>\n\nint main () {\n    int sockfd;\n    \n    sockfd = socket(AF_INET, SOCK_STREAM, 0);\n    if (sockfd == -1) {\n        printf("socket creation failed...\\n");\n        exit(0);\n    }\n    else\n        printf("Socket successfully created..\\n");\n    \n    return 0;\n}',
            },
        ],
        description:
            "`socket()` creates an endpoint for communication and returns a file descriptor that refers to that endpoint. The domain argument specifies a communication domain; this selects the protocol family which will be used for communication. The type argument specifies the communication semantics. The protocol argument specifies a particular protocol to be used with the socket.",
        return: "`socket()` returns a file descriptor that refers to the endpoint. On error, -1 is returned, and errno is set appropriately.",
        notes: "The protocol specifies a particular protocol to be used with the socket. Normally only a single protocol exists to support a particular socket type within a given protocol family, in which case protocol can be specified as 0.",
        bugs: "None.",
        similar: ["bind", "listen", "accept", "connect"],
    },
    inet_pton: {
        summary:
            "`inet_pton()` is a standard C library function that converts an Internet Protocol address from its presentation format (textual representation) to its numeric binary form.",
        synopsis: "int inet_pton(int af, const char *src, void *dst);",
        include: ["#include <arpa/inet.h>"],
        examples: [
            {
                title: "The following example shows the usage of `inet_pton()` function.",
                code: '#include <stdio.h>\n#include <arpa/inet.h>\n\nint main () {\n    char ipv4[INET_ADDRSTRLEN];\n    char ipv6[INET6_ADDRSTRLEN];\n    struct sockaddr_in sa;\n    struct sockaddr_in6 sa6;\n    \n    inet_pton(AF_INET, "192.0.2.1", &(sa.sin_addr));\n    inet_ntop(AF_INET, &(sa.sin_addr), ipv4, INET_ADDRSTRLEN);\n    printf("The IPv4 address is: %s\\n", ipv4);\n    \n    inet_pton(AF_INET6, "2001:db8:63b3:1::3490", &(sa6.sin6_addr));\n    inet_ntop(AF_INET6, &(sa6.sin6_addr), ipv6, INET6_ADDRSTRLEN);\n    printf("The IPv6 address is: %s\\n", ipv6);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`inet_pton()` function takes three arguments, af (address family), src (source string) and dst (destination buffer). It converts the presentation format of an Internet Protocol address (IP address) to its numeric binary form.",
        return: "`inet_pton()` function returns 1 if the conversion succeeds, 0 if the input is not a valid IPv4 dotted-decimal string or -1 if the input is not a valid IPv6 address.",
        notes: "The `inet_pton()` function is not thread-safe and should not be used in a multi-threaded application.",
        bugs: "The `inet_pton()` function does not check for invalid characters in the input string. This can result in unexpected behavior.",
        similar: ["inet_ntop", "getaddrinfo", "getnameinfo"],
    },
    bind: {
        summary:
            "`bind()` is a system call used to assign a local address to a socket.",
        synopsis:
            "int bind(int sockfd, const struct sockaddr *addr, socklen_t addrlen);",
        include: ["#include <sys/socket.h>"],
        examples: [
            {
                title: "The following example shows the usage of `bind()` function.",
                code: "#include <stdio.h>\n#include <sys/socket.h>\n#include <netinet/in.h>\n#include <string.h>\n\nint main() {\n    int sockfd;\n    struct sockaddr_in serverAddr;\n    \n    sockfd = socket(AF_INET, SOCK_STREAM, 0);\n    \n    memset(&serverAddr, '0', sizeof(serverAddr));\n    serverAddr.sin_family = AF_INET;\n    serverAddr.sin_port = htons(8080);\n    serverAddr.sin_addr.s_addr = htonl(INADDR_ANY);\n    \n    bind(sockfd, (struct sockaddr*)&serverAddr, sizeof(serverAddr));\n    \n    return 0;\n}",
            },
        ],
        description:
            "`bind()` assigns a local address to a socket. The address is specified by addr and its length is addrlen. The address family should be AF_INET for IPv4 or AF_INET6 for IPv6.",
        return: "`bind()` returns 0 on success and -1 on error.",
        notes: "The address specified by addr must be a valid address for the address family specified by the socket. If the address is already in use, `bind()` will fail.",
        bugs: "If the address specified by addr is not valid, `bind()` will fail and the socket will not be bound.",
        similar: ["connect", "listen", "accept", "socket"],
    },
    listen: {
        summary:
            "`listen()` is a system call used by a server process to listen for incoming connections from client processes.",
        synopsis: "int listen(int sockfd, int backlog);",
        include: ["#include <sys/socket.h>"],
        examples: [
            {
                title: "The following example shows the usage of `listen()` function.",
                code: '#include <stdio.h>\n#include <sys/socket.h>\n#include <netinet/in.h>\n#include <string.h>\n\nint main() {\n    int welcomeSocket, newSocket;\n    char buffer[1024];\n    struct sockaddr_in serverAddr;\n    struct sockaddr_storage serverStorage;\n    socklen_t addr_size;\n    \n    /*---- Create the socket. The three arguments are: ----*/\n    /* 1) Internet domain 2) Stream socket 3) Default protocol (TCP in this case) */\n    welcomeSocket = socket(PF_INET, SOCK_STREAM, 0);\n    \n    /*---- Configure settings of the server address struct ----*/\n    /* Address family = Internet */\n    serverAddr.sin_family = AF_INET;\n    /* Set port number, using htons function to use proper byte order */\n    serverAddr.sin_port = htons(7891);\n    /* Set IP address to localhost */\n    serverAddr.sin_addr.s_addr = inet_addr("127.0.0.1");\n    /* Set all bits of the padding field to 0 */\n    memset(serverAddr.sin_zero, \'\\0\', sizeof serverAddr.sin_zero);\n    \n    /*---- Bind the address struct to the socket ----*/\n    bind(welcomeSocket, (struct sockaddr *) &serverAddr, sizeof(serverAddr));\n    \n    /*---- Listen on the socket, with 5 max connection requests queued ----*/\n    if(listen(welcomeSocket,5)==0) \n        printf("Listening\\n");\n    else \n        printf("Error\\n");\n    \n    /*---- Accept call creates a new socket for the incoming connection ----*/\n    addr_size = sizeof serverStorage;\n    newSocket = accept(welcomeSocket, (struct sockaddr *) &serverStorage, &addr_size);\n    \n    /*---- Send message to the socket of the incoming connection ----*/\n    strcpy(buffer,"Hello World\\n");\n    send(newSocket,buffer,13,0);\n    \n    return 0;\n}',
            },
        ],
        description:
            "`listen()` is used by a server process to listen for incoming connections from client processes. It takes two arguments, a socket file descriptor and a backlog, which is the maximum number of connections that can be queued for the socket.",
        return: "`listen()` returns 0 on success and -1 on error.",
        notes: "The socket must be bound to an address and listening before `accept()` can be called to accept incoming connections.",
        bugs: "If the backlog argument is greater than the maximum allowed value, the connection may be refused.",
        similar: ["accept", "bind", "connect", "socket"],
    },
    connect: {
        summary:
            "`connect()` is a system call used to establish a connection between a socket and a remote socket address.",
        synopsis:
            "int connect(int sockfd, const struct sockaddr *addr, socklen_t addrlen);",
        include: ["#include <sys/types.h>", "#include <sys/socket.h>"],
        examples: [
            {
                title: "The following example shows the usage of `connect()` function.",
                code: '#include <stdio.h>\n#include <sys/socket.h>\n#include <netinet/in.h>\n#include <string.h>\n\nint main() {\n    int clientSocket;\n    char buffer[1024];\n    struct sockaddr_in serverAddr;\n    socklen_t addr_size;\n    \n    /*---- Create the socket. The three arguments are: ----*/\n    /* 1) Internet domain 2) Stream socket 3) Default protocol (TCP in this case) */\n    clientSocket = socket(PF_INET, SOCK_STREAM, 0);\n    \n    /*---- Configure settings of the server address struct ----*/\n    /* Address family = Internet */\n    serverAddr.sin_family = AF_INET;\n    /* Set port number, using htons function to use proper byte order */\n    serverAddr.sin_port = htons(7891);\n    /* Set IP address to localhost */\n    serverAddr.sin_addr.s_addr = inet_addr("127.0.0.1");\n    /* Set all bits of the padding field to 0 */\n    memset(serverAddr.sin_zero, \'\\0\', sizeof serverAddr.sin_zero);   \n    \n    /*---- Connect the socket to the server using the address struct ----*/\n    addr_size = sizeof serverAddr;\n    connect(clientSocket, (struct sockaddr *) &serverAddr, addr_size);\n    \n    /*---- Read the message from the server into the buffer ----*/\n    recv(clientSocket, buffer, 1024, 0);\n    \n    /*---- Print the received message ----*/\n    printf("Data received: %s",buffer);    \n    \n    return 0;\n}',
            },
        ],
        description:
            "`connect()` is used to establish a connection between a socket and a remote socket address. The socket must be in a connected state before calling `connect()`. The `connect()` call takes three arguments: the socket file descriptor, a pointer to a `struct sockaddr` containing the remote address, and the size of the `struct sockaddr`.",
        return: "`connect()` returns 0 on success and -1 on error.",
        notes: "The `connect()` call is used to establish a connection between a socket and a remote socket address. The socket must be in a connected state before calling `connect()`.",
        bugs: "If the remote socket address is invalid, `connect()` may fail with an error. It is important to check the return value of `connect()` to ensure that the connection was successful.",
        similar: ["socket", "bind", "listen", "accept"],
    },
    accept: {
        summary:
            "`accept()` is a system call used to accept a connection on a socket.",
        synopsis:
            "int accept(int sockfd, struct sockaddr *addr, socklen_t *addrlen);",
        include: ["#include <sys/types.h>", "#include <sys/socket.h>"],
        examples: [
            {
                title: "The following example shows the usage of `accept()` function.",
                code: '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <sys/types.h>\n#include <sys/socket.h>\n#include <netinet/in.h>\n\nint main(int argc, char *argv[]) {\n    int sockfd, newsockfd, portno;\n    socklen_t clilen;\n    char buffer[256];\n    struct sockaddr_in serv_addr, cli_addr;\n    int n;\n    \n    // Create a socket\n    sockfd = socket(AF_INET, SOCK_STREAM, 0);\n    \n    // Initialize socket structure\n    bzero((char *) &serv_addr, sizeof(serv_addr));\n    portno = 5001;\n    \n    serv_addr.sin_family = AF_INET;\n    serv_addr.sin_addr.s_addr = INADDR_ANY;\n    serv_addr.sin_port = htons(portno);\n    \n    // Bind the host address\n    bind(sockfd, (struct sockaddr *) &serv_addr, sizeof(serv_addr));\n    \n    // Start listening for the clients\n    listen(sockfd,5);\n    clilen = sizeof(cli_addr);\n    \n    // Accept actual connection from the client\n    newsockfd = accept(sockfd, (struct sockaddr *)&cli_addr, &clilen);\n    \n    // If connection is established then start communicating\n    bzero(buffer,256);\n    n = read( newsockfd,buffer,255 );\n    \n    if (n < 0) {\n        perror("ERROR reading from socket");\n        exit(1);\n    }\n    \n    printf("Here is the message: %s\\n",buffer);\n    \n    n = write(newsockfd,"I got your message",18);\n    \n    if (n < 0) {\n        perror("ERROR writing to socket");\n        exit(1);\n    }\n    \n    return 0;\n}',
            },
        ],
        description:
            "`accept()` is used with connection-based socket types (SOCK_STREAM, SOCK_SEQPACKET). It extracts the first connection request on the queue of pending connections, creates a new connected socket, and returns a new file descriptor referring to that socket. At this point, connection is established between client and server, and they are ready to transfer data.",
        return: "`accept()` returns a non-negative integer that is a descriptor for the accepted socket, if no error occurs. Otherwise, -1 is returned and `errno` is set appropriately.",
        notes: "The `accept()` system call is used with connection-based socket types (SOCK_STREAM, SOCK_SEQPACKET). It is normally used with a connectionless socket type (SOCK_DGRAM).",
        bugs: "If the socket is set to non-blocking mode, `accept()` can return -1 with `errno` set to EAGAIN or EWOULDBLOCK if no connections are present to be accepted.",
        similar: ["socket", "bind", "listen", "connect"],
    },
    fprintf: {
        summary:
            "`fprintf()` is a standard C library function that writes formatted output to a stream.",
        synopsis: "int fprintf(FILE *stream, const char *format, ...);",
        include: ["#include <stdio.h>"],
        examples: [
            {
                title: "The following example shows the usage of `fprintf()` function.",
                code: '#include <stdio.h>\n\nint main () {\n    FILE *fp;\n    fp = fopen("file.txt", "w+");\n    fprintf(fp, "This is testing for fprintf...\\n");\n    fclose(fp);\n    return(0);\n}',
            },
        ],
        description:
            "`fprintf()` function takes a stream, a format string, and a variable number of arguments. It writes the formatted output to the stream.",
        return: "`fprintf()` function returns the number of characters written to the stream, or a negative value if an error occurs.",
        notes: "The format string can contain special characters that are replaced with the values of the arguments. The format string can also contain flags, width, and precision specifiers.",
        bugs: "It is possible for `fprintf()` to cause a buffer overflow if the format string is too long. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["printf", "sprintf", "snprintf", "fscanf", "sscanf"],
    },
    sizeof: {
        summary:
            "`sizeof` is a C language operator that returns the size of a data type or the size of an object.",
        synopsis: "size_t sizeof(type);",
        include: [],
        examples: [
            {
                title: "The following example shows the usage of `sizeof()` operator.",
                code: '#include <stdio.h>\n\nint main () {\n    int a;\n    float b;\n    double c;\n    char d;\n    \n    printf("Size of int: %ld bytes\\n", sizeof(a));\n    printf("Size of float: %ld bytes\\n", sizeof(b));\n    printf("Size of double: %ld bytes\\n", sizeof(c));\n    printf("Size of char: %ld byte\\n", sizeof(d));\n    \n    return 0;\n}',
            },
        ],
        description:
            "`sizeof` operator returns the size of a data type or the size of an object. It is a compile-time operator and can be used to get the size of built-in data types, such as int, float, double, etc., as well as user-defined data types, such as structures and unions.",
        return: "`sizeof` operator returns the size of a data type or the size of an object in bytes.",
        notes: "The `sizeof` operator is not a function, so it does not require parentheses around its argument.",
        bugs: "The `sizeof` operator does not work on variables, only on data types.",
        similar: ["strlen", "strcpy", "strcat", "strncat", "memcpy", "memmove"],
    },

    fork: {
        summary:
            "`fork()` is a system call in Unix-like operating systems that creates a new process by duplicating the existing process.",
        synopsis: "pid_t fork(void);",
        include: ["#include <unistd.h>"],
        examples: [
            {
                title: "The following example shows the usage of `fork()` function.",
                code: '#include <stdio.h>\n#include <unistd.h>\n\nint main () {\n    int pid;\n    \n    pid = fork();\n    \n    if (pid == 0) {\n        printf("Child process\\n");\n    } else {\n        printf("Parent process\\n");\n    }\n    \n    return 0;\n}',
            },
        ],
        description:
            "`fork()` creates a new process by duplicating the existing process. The new process is called the child process, and the existing process is called the parent process. The child process has its own unique process ID, and it runs independently of the parent process.",
        return: "`fork()` returns 0 to the child process and the process ID of the child process to the parent process.",
        notes: "The child process is a copy of the parent process, but it has its own unique process ID. The child process does not have access to the parent process's memory or file descriptors.",
        bugs: "If the parent process is terminated before the child process, the child process will become a zombie process. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["exec", "wait", "exit", "kill"],
    },
    exec: {
        summary:
            "`exec()` is a system call that is used to execute a program from within a process.",
        synopsis: "int exec(const char *filename, char *const argv[]);",
        include: ["#include <unistd.h>"],
        examples: [
            {
                title: "The following example shows the usage of `exec()` function.",
                code: '#include <stdio.h>\n#include <unistd.h>\n\nint main () {\n    char *argv[] = {"/bin/ls", "-l", "-a", NULL};\n    execv("/bin/ls", argv);\n    \n    printf("This line will not be executed\\n");\n    \n    return(0);\n}',
            },
        ],
        description:
            "`exec()` function replaces the current process image with a new process image. The new process image is constructed from a regular, executable file called the new process image file. The new process image file is pointed to by the filename argument.",
        return: "`exec()` function does not return on success, and the return value is -1 on error.",
        notes: "The `exec()` family of functions is used to execute a new program from within a process. The `exec()` family of functions replaces the current process image with a new process image.",
        bugs: "The `exec()` family of functions does not check for the existence of the new process image file before attempting to execute it. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["execv", "execve", "execl", "execlp", "execle", "execvp"],
    },

    kill: {
        summary:
            "`kill()` is a system call in the Linux kernel that sends a signal to a process or process group.",
        synopsis: "int kill(pid_t pid, int sig);",
        include: ["#include <sys/types.h>", "#include <signal.h>"],
        examples: [
            {
                title: "The following example shows the usage of `kill()` function.",
                code: "#include <stdio.h>\n#include <sys/types.h>\n#include <signal.h>\n\nint main () {\n    pid_t pid;\n    int sig;\n    \n    pid = getpid();\n    sig = SIGTERM;\n    \n    kill(pid, sig);\n    \n    return 0;\n}",
            },
        ],
        description:
            "`kill()` sends the signal specified by sig to the process specified by pid. If pid is 0, then sig is sent to every process in the process group of the calling process.",
        return: "`kill()` returns 0 on success and -1 on error.",
        notes: "The signal sent by `kill()` can be caught by the process, ignored, or cause the process to terminate.",
        bugs: "If the signal sent by `kill()` is not caught or ignored, it can cause the process to terminate unexpectedly.",
        similar: ["killpg", "raise", "sigaction", "sigprocmask", "sigqueue"],
    },
    wait: {
        summary:
            "`wait()` is a system call that suspends the calling process until one of its children terminates.",
        synopsis: "pid_t wait(int *status);",
        include: ["#include <sys/types.h>", "#include <sys/wait.h>"],
        examples: [
            {
                title: "The following example shows the usage of `wait()` function.",
                code: '#include <stdio.h>\n#include <sys/types.h>\n#include <unistd.h>\n#include <sys/wait.h>\n\nint main () {\n    pid_t child_pid;\n    int status;\n    \n    child_pid = fork();\n    \n    if (child_pid == 0) {\n        /* This is done by the child process. */\n        printf("Child process!\\n");\n        return 0;\n    }\n    else {\n        /* This is run by the parent.  Wait for the child to terminate. */\n        wait(&status);\n        printf("Child returned status: %d\\n", status);\n    }\n    \n    return 0;\n}',
            },
        ],
        description:
            "`wait()` suspends the calling process until one of its children terminates. The call returns the process ID of the terminated child; if the call was unsuccessful, -1 is returned.",
        return: "`wait()` returns the process ID of the terminated child, or -1 if the call was unsuccessful.",
        notes: "The `wait()` system call should be used with caution, as it can cause the calling process to become blocked indefinitely if the child process does not terminate.",
        bugs: "If the child process does not terminate, the `wait()` system call can cause the calling process to become blocked indefinitely.",
        similar: ["waitpid", "waitid", "wait3", "wait4"],
    },
    exit: {
        summary:
            "`exit()` is a standard C library function that terminates the calling process.",
        synopsis: "void exit(int status);",
        include: ["#include <stdlib.h>"],
        examples: [
            {
                title: "The following example shows the usage of `exit()` function.",
                code: '#include <stdio.h>\n#include <stdlib.h>\n\nint main () {\n    printf("This is the first statement");\n    \n    exit(0);\n    \n    printf("This statement will not be executed");\n    \n    return 0;\n}',
            },
        ],
        description:
            "`exit()` function terminates the calling process and returns the status code to the parent process. The status code is an integer value that can be used to determine the cause of termination.",
        return: "`exit()` function does not return any value.",
        notes: "The `exit()` function does not perform any cleanup operations, such as closing open files or releasing memory. It is the responsibility of the programmer to perform any necessary cleanup operations before calling `exit()`.",
        bugs: "The `exit()` function does not perform any cleanup operations, such as closing open files or releasing memory. It is the responsibility of the programmer to perform any necessary cleanup operations before calling `exit()`.",
        similar: ["_exit", "abort", "atexit"],
    },
    perror: {
        summary:
            "`perror()` is a standard C library function that prints a descriptive error message to the standard error stream (stderr) based on the value of the global variable errno.",
        synopsis: "void perror(const char *s);",
        include: ["#include <stdio.h>", "#include <errno.h>"],
        examples: [
            {
                title: "The following example shows the usage of `perror()` function.",
                code: '#include <stdio.h>\n#include <errno.h>\n\nint main () {\n    FILE *fp;\n    \n    fp = fopen("file.txt", "r");\n    if (fp == NULL) {\n        perror("Error printed by perror");\n    }\n    else {\n        fclose(fp);\n    }\n    \n    return(0);\n}',
            },
        ],
        description:
            "`perror()` takes a single argument, which is a string that is printed before the error message. If the argument is `NULL`, no string is printed before the error message.",
        return: "`perror()` does not return a value.",
        notes: "The error message is based on the value of the global variable `errno`, which is set by system calls and library functions to indicate an error occurred. The error message is implementation-defined and may vary from system to system.",
        bugs: "`perror()` does not print the error message if `errno` is set to `0`.",
        similar: ["strerror", "errno"],
    },
    strtoul: {
        summary:
            "`strtoul()` is a standard C library function that converts a string to an unsigned long integer.",
        synopsis:
            "unsigned long int strtoul(const char *nptr, char **endptr, int base);",
        include: ["#include <stdlib.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `strtoul()` function.",
                code: '#include <stdio.h>\n#include <stdlib.h>\n\nint main () {\n    char str[30] = "2030300 This is test";\n    char *ptr;\n    long ret;\n\n    ret = strtoul(str, &ptr, 10);\n    printf("The number(unsigned long integer) is %ld\\n", ret);\n    printf("String part is |%s|\\n", ptr);\n\n    return(0);\n}',
            },
        ],
        description:
            "`strtoul()` function takes three arguments, nptr, endptr, and base. The nptr argument is a pointer to the string to be converted. The endptr argument is a pointer to a character pointer that will be set to the first character after the number in the string. The base argument is the base of the number to be converted. The base must be between 2 and 36, or 0.",
        return: "`strtoul()` function returns the converted unsigned long integer value, or 0 if an error occurs.",
        notes: "The `strtoul()` function is not guaranteed to be thread-safe.",
        bugs: "The `strtoul()` function does not check for overflow or underflow. This can result in unexpected behavior.",
        similar: [
            "strtol",
            "strtoll",
            "strtoull",
            "strtod",
            "strtof",
            "strtold",
        ],
    },
    setlocale: {
        summary:
            "`setlocale()` is a standard C library function that sets the current locale of the program.",
        synopsis: "char *setlocale(int category, const char *locale);",
        include: ["#include <locale.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `setlocale()` function.",
                code: '#include <stdio.h>\n#include <locale.h>\n\nint main () {\n    char *locale;\n    \n    locale = setlocale(LC_ALL, "");\n    printf("Locale set to %s\\n", locale);\n    \n    return(0);\n}',
            },
        ],
        description:
            '`setlocale()` function sets the current locale of the program. The locale is specified by the locale argument, which is a string that can have one of the following values: "C", "POSIX", or an implementation-defined string that represents a valid locale.',
        return: "`setlocale()` function returns a pointer to the string associated with the specified locale, or a null pointer if the locale could not be set.",
        notes: "The locale argument can also be a comma-separated list of locale names, in which case the first valid locale in the list is used.",
        bugs: "The locale argument must be a valid locale name, otherwise the function will fail and return a null pointer.",
        similar: ["localeconv", "nl_langinfo"],
    },
    toupper: {
        summary:
            "`toupper()` is a standard C library function that converts a lowercase letter to its uppercase equivalent.",
        synopsis: "int toupper(int c);",
        include: ["#include <ctype.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `toupper()` function.",
                code: "#include <stdio.h>\n#include <ctype.h>\n\nint main () {\n    char c;\n    \n    c = 'm';\n    printf(\"%c in uppercase is %c\\n\", c, toupper(c));\n    \n    return(0);\n}",
            },
        ],
        description:
            "`toupper()` function takes an argument of type int and returns its uppercase equivalent if it is a lowercase letter. If the argument is not a lowercase letter, the function returns the argument unchanged.",
        return: "`toupper()` function returns the uppercase equivalent of the argument if it is a lowercase letter, or the argument unchanged if it is not a lowercase letter.",
        notes: "The argument must be an int, not a char, because the argument is converted to an int before the comparison is made.",
        similar: ["tolower", "isupper", "islower", "isalpha"],
    },
    tolower: {
        summary:
            "`tolower()` is a standard C library function that converts an upper-case letter to its corresponding lower-case letter.",
        synopsis: "int tolower(int c);",
        include: ["#include <ctype.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `tolower()` function.",
                code: "#include <stdio.h>\n#include <ctype.h>\n\nint main () {\n    int c = 'A';\n    \n    printf(\"The lowercase of %c is %c\\n\", c, tolower(c));\n    \n    return(0);\n}",
            },
        ],
        description:
            "`tolower()` function takes an argument of type int and returns the corresponding lower-case letter if the argument is an upper-case letter. If the argument is not an upper-case letter, the function returns the argument unchanged.",
        return: "`tolower()` function returns the corresponding lower-case letter if the argument is an upper-case letter, or the argument unchanged if it is not an upper-case letter.",
        notes: "The behavior of `tolower()` is undefined if the argument is not an integer in the range of an `unsigned char` or the value of `EOF`.",
        bugs: "None.",
        similar: ["toupper", "isupper", "islower", "isalpha"],
    },
    bzero: {
        summary:
            "`bzero()` is a standard C library function that sets the first n bytes of the memory area pointed to by s to zero.",
        synopsis: "void bzero(void *s, size_t n);",
        include: ["#include <strings.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `bzero()` function.",
                code: '#include <stdio.h>\n#include <strings.h>\n\nint main () {\n    char str[50];\n    \n    strcpy(str,"This is tutorialspoint.com");\n    printf("Before memset(): %s\\n", str);\n    \n    bzero(str, 10);\n    printf("After memset(): %s\\n", str);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`bzero()` function sets the first n bytes of the memory area pointed to by s to zero. The function takes two arguments, s and n, where s is a pointer to the memory area and n is the number of bytes to be set to zero.",
        return: "`bzero()` function does not return any value.",
        notes: "It is important to note that `bzero()` does not guarantee that the memory area is zeroed out. It is possible for the memory area to contain non-zero values after the call to `bzero()`.",
        bugs: "It is possible for `bzero()` to cause a buffer overflow if the memory area is not large enough to hold the number of bytes specified. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["memset", "memcpy", "memmove"],
    },

    strtol: {
        summary:
            "`strtol()` is a standard C library function that converts a string to a long integer.",
        synopsis: "long int strtol(const char *nptr, char **endptr, int base);",
        include: ["#include <stdlib.h>"],
        examples: [
            {
                title: "The following example shows the usage of `strtol()` function.",
                code: '#include <stdio.h>\n#include <stdlib.h>\n\nint main () {\n    char str[30] = "-1234567abc";\n    char *ptr;\n    long ret;\n\n    ret = strtol(str, &ptr, 10);\n    printf("The number(unsigned long integer) is %ld\\n", ret);\n    printf("String part is |%s|\\n", ptr);\n\n    return(0);\n}',
            },
        ],
        description:
            "`strtol()` function takes three arguments, nptr, endptr, and base. The nptr argument is a pointer to the string to be converted. The endptr argument is a pointer to a character pointer that will be set to the first character after the number in the string. The base argument is the base of the number to be converted. The base must be between 2 and 36, or 0.",
        return: "`strtol()` function returns the converted long integer value, or 0 if an error occurs.",
        notes: "If the base is 0, the function will attempt to determine the base from the string. If the string begins with 0x or 0X, the base is assumed to be 16. If the string begins with 0, the base is assumed to be 8. Otherwise, the base is assumed to be 10.",
        bugs: "If the string contains characters that are not valid for the specified base, the function will return 0 and set the endptr to the first invalid character.",
        similar: [
            "strtoul",
            "strtoll",
            "strtoull",
            "strtod",
            "strtof",
            "strtold",
        ],
    },
    strchr: {
        summary:
            "`strchr()` is a standard C library function that searches for the first occurrence of a character in a null-terminated string.",
        synopsis: "char *strchr(const char *s, int c);",
        include: ["#include <string.h>"],
        examples: [
            {
                title: "The following example shows the usage of `strchr()` function.",
                code: '#include <stdio.h>\n#include <string.h>\n\nint main () {\n    const char str[] = "This is a sample string";\n    const char ch = \'a\';\n    char *ret;\n\n    ret = strchr(str, ch);\n\n    printf("String after |%c| is - |%s|\\n", ch, ret);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`strchr()` function takes two arguments, a pointer to a null-terminated string (the source) and an integer (the character to search for). It returns a pointer to the first occurrence of the character in the string, or `NULL` if the character is not found.",
        return: "`strchr()` function returns a pointer to the first occurrence of the character in the string, or `NULL` if the character is not found.",
        notes: "The `strchr()` function is case-sensitive, so it will not find a character if it is not in the same case as the one specified.",
        bugs: "It is possible for `strchr()` to cause a buffer overflow if the string is too long. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["strstr", "strrchr", "strspn", "strcspn"],
    },
    strlen: {
        summary:
            "`strlen()` is a standard C library function that returns the length of a null-terminated string.",
        synopsis: "size_t strlen(const char *s);",
        include: ["#include <string.h>"],
        examples: [
            {
                title: "The following example shows the usage of `strlen()` function.",
                code: '#include <stdio.h>\n#include <string.h>\n\nint main () {\n    char str[50];\n    int len;\n    \n    strcpy(str, "tutorialspoint.com");\n    len = strlen(str);\n    printf("Length of |%s| is |%d|\\n", str, len);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`strlen()` function takes a single argument, a pointer to a null-terminated string, and returns the length of the string, not including the null terminator.",
        return: "`strlen()` function returns the length of the string, not including the null terminator.",
        notes: "It is not guaranteed that the string will be null-terminated if the source string is too long. This can result in unexpected behavior.",
        bugs: "It is possible for `strlen()` to cause a buffer overflow if the string is too long. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: [
            "strcpy",
            "strncpy",
            "strcat",
            "strncat",
            "memcpy",
            "memmove",
        ],
    },
    dup2: {
        summary:
            "`dup2()` is a system call that creates a copy of an existing file descriptor.",
        synopsis: "int dup2(int oldfd, int newfd);",
        include: ["#include <unistd.h>"],
        examples: [
            {
                title: "The following example shows the usage of `dup2()` function.",
                code: '#include <stdio.h>\n#include <unistd.h>\n\nint main () {\n    int fd1, fd2;\n    char *msg = "Hello World";\n    \n    fd1 = dup(1);\n    fd2 = dup2(fd1, 7);\n    printf("fd1 = %d, fd2 = %d\\n", fd1, fd2);\n    write(fd2, msg, strlen(msg)+1);\n    \n    return 0;\n}',
            },
        ],
        description:
            "`dup2()` creates a copy of the existing file descriptor oldfd, using the descriptor number newfd. If newfd is already open, it is first closed.",
        return: "`dup2()` returns the new file descriptor, or -1 if an error occurred.",
        notes: "`dup2()` is similar to `dup()`, but it allows the user to specify the new file descriptor number.",
        bugs: "None known.",
        similar: ["dup", "dup3"],
    },
    close: {
        summary:
            "`close()` is a system call that closes a file descriptor, so that it no longer refers to any file and may be reused.",
        synopsis: "int close(int fd);",
        include: ["#include <unistd.h>"],
        examples: [
            {
                title: "The following example shows the usage of `close()` function.",
                code: '#include <stdio.h>\n#include <unistd.h>\n\nint main () {\n    int fd;\n    \n    fd = open("test.txt", O_RDONLY);\n    if (fd == -1) {\n        perror("open");\n        return 1;\n    }\n    \n    if (close(fd) == -1) {\n        perror("close");\n        return 1;\n    }\n    \n    return 0;\n}',
            },
        ],
        description:
            "`close()` closes a file descriptor, so that it no longer refers to any file and may be reused. Any record locks (see fcntl(2)) held on the file it was associated with, and owned by the process, are removed (regardless of the file descriptor that was used to obtain the lock).",
        return: "`close()` returns zero on success. On error, -1 is returned, and errno is set appropriately.",
        notes: "`close()` should not be used on a socket. Use shutdown(2) instead.",
        bugs: "`close()` does not close the underlying file descriptor, but only the file descriptor table entry. This means that if the same file descriptor is opened again, it will refer to the same file.",
        similar: ["open", "read", "write", "lseek", "fsync", "fdatasync"],
    },
    pipe: {
        summary:
            "`pipe()` is a system call that creates a pipe, a unidirectional data channel that can be used for interprocess communication.",
        synopsis: "int pipe(int pipefd[2]);",
        include: ["#include <unistd.h>"],
        examples: [
            {
                title: "The following example shows the usage of `pipe()` function.",
                code: '#include <stdio.h>\n#include <unistd.h>\n\nint main () {\n    int fd[2];\n    int ret;\n    char buffer[20];\n    \n    ret = pipe(fd);\n    \n    if (ret == -1) {\n        printf("Error creating pipe\\n");\n        return 1;\n    }\n    \n    write(fd[1], "Hello World!\\n", 13);\n    read(fd[0], buffer, 13);\n    printf("Received string: %s\\n", buffer);\n    \n    return 0;\n}',
            },
        ],
        description:
            "`pipe()` creates a pipe, a unidirectional data channel that can be used for interprocess communication. The pipe is created with two file descriptors, `pipefd[0]` and `pipefd[1]`. Data written to `pipefd[1]` can be read from `pipefd[0]`.",
        return: "`pipe()` returns 0 on success, or -1 on error.",
        notes: "The pipe is created with a buffer size of 65536 bytes. This buffer size can be changed using the `fcntl()` system call.",
        bugs: "`pipe()` does not support non-blocking I/O. If the pipe is full, any write operations will block until there is space available in the pipe.",
        similar: ["pipe2", "socketpair", "mkfifo"],
    },
    strncat: {
        summary:
            "`strncat()` is a standard C library function that appends a specified number of characters from a source string to the end of a destination string.",
        synopsis:
            "char *strncat(char *destination, const char *source, size_t num);",
        include: ["#include <string.h>"],
        examples: [
            {
                title: "The following example shows the usage of `strncat()` function.",
                code: '#include <stdio.h>\n#include <string.h>\n\nint main () {\n    char src[50];\n    char dest[50];\n    \n    strcpy(src,  "This is source");\n    strcpy(dest, "This is destination");\n    \n    strncat(dest, src, 15);\n    \n    printf("Final destination string : |%s|", dest);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`strncat()` function takes three arguments, destination, source, and num. It appends the first num characters of source to the end of destination, and then adds a terminating null character. If the length of source is less than num, only the contents of source are appended, and a null character is added.",
        return: "`strncat()` function returns a pointer to the destination string.",
        notes: "It is not guaranteed that the destination string will be null-terminated if the source string is too long. This can result in unexpected behavior.",
        bugs: "It is possible for `strncat()` to cause a buffer overflow if the destination array is not large enough to hold the source string. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["strcpy", "strcat", "strncpy", "memcpy", "memmove"],
    },
    strcmp: {
        summary:
            "`strcmp()` is a standard C library function that compares two null-terminated strings and returns an integer indicating their relative ordering.",
        synopsis: "int strcmp(const char *s1, const char *s2);",
        include: ["#include <string.h>"],
        examples: [
            {
                title: "The following example shows the usage of `strcmp()` function.",
                code: '#include <stdio.h>\n#include <string.h>\n\nint main () {\n    char str1[15];\n    char str2[15];\n    int ret;\n    \n    strcpy(str1, "abcdef");\n    strcpy(str2, "ABCDEF");\n    \n    ret = strcmp(str1, str2);\n    \n    if(ret < 0) {\n        printf("str1 is less than str2");\n    } else if(ret > 0) {\n        printf("str2 is less than str1");\n    } else {\n        printf("str1 is equal to str2");\n    }\n    \n    return(0);\n}',
            },
        ],
        description:
            "`strcmp()` function takes two arguments, s1 and s2, and compares them. It returns an integer indicating their relative ordering. If s1 is less than s2, it returns a negative number. If s1 is greater than s2, it returns a positive number. If s1 is equal to s2, it returns 0.",
        return: "`strcmp()` function returns an integer indicating the relative ordering of the two strings.",
        notes: "It is not guaranteed that the strings will be null-terminated if they are too long. This can result in unexpected behavior.",
        bugs: "It is possible for `strcmp()` to cause a buffer overflow if the strings are not null-terminated. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["strncmp", "strcasecmp", "strncasecmp", "strcoll", "strxfrm"],
    },
    strcat: {
        summary:
            "`strcat()` is a standard C library function that appends a copy of the null-terminated string pointed to by source to the end of the null-terminated string pointed to by destination.",
        synopsis: "char *strcat(char *destination, const char *source);",
        include: ["#include <string.h>"],
        examples: [
            {
                title: "The following example shows the usage of `strcat()`` function.",
                code: '#include <stdio.h>\n#include <string.h>\n\nint main () {\n    char src[50], dest[50];\n    \n    strcpy(src,  "This is source");\n    strcpy(dest, "This is destination");\n    \n    strcat(dest, src);\n    \n    printf("Final destination string : |%s|", dest);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`strcat()` function takes two arguments, destination and source, and appends the contents of source to the end of destination. The destination array must be large enough to hold the source string and a null terminator.",
        return: "`strcat()` function returns a pointer to the destination string.",
        notes: "It is not guaranteed that the destination string will be null-terminated if the source string is too long. This can result in unexpected behavior.",
        bugs: "It is possible for `strcat()` to cause a buffer overflow if the destination array is not large enough to hold the source string. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["strcpy", "strncpy", "strncat", "memcpy", "memmove"],
    },
    strspn: {
        summary:
            "`strspn()` is a standard C library function that calculates the length of the initial segment of a string which consists entirely of characters from a given set of characters.",
        synopsis: "size_t strspn(const char *str1, const char *str2);",
        include: ["#include <string.h>"],
        examples: [
            {
                title: "The following example shows the usage of `strspn()` function.",
                code: '#include <stdio.h>\n#include <string.h>\n\nint main () {\n    char str1[] = "ABCDEFG";\n    char str2[] = "ABCD";\n    \n    int i;\n    i = strspn(str1, str2);\n    \n    printf("Length of initial segment matching %d\\n", i);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`strspn()` function takes two arguments, str1 and str2, and returns the length of the initial segment of str1 which consists entirely of characters from str2.",
        return: "`strspn()` function returns the length of the initial segment of str1 which consists entirely of characters from str2.",
        notes: "The `strspn()` function does not modify the strings it is passed.",
        bugs: "None.",
        similar: ["strcspn", "strpbrk", "strstr", "strtok"],
    },
    strstr: {
        summary:
            "`strstr()` is a standard C library function that searches for the first occurrence of a substring in a string.",
        synopsis: "char *strstr(const char *haystack, const char *needle);",
        include: ["#include <string.h>"],
        examples: [
            {
                title: "The following example shows the usage of `strstr()` function.",
                code: '#include <stdio.h>\n#include <string.h>\n\nint main () {\n    char str[] = "This is a simple string";\n    char * pch;\n    \n    pch = strstr (str,"simple");\n    strncpy (pch,"sample",6);\n    puts (str);\n    \n    return 0;\n}',
            },
        ],
        description:
            "`strstr()` function takes two arguments, haystack and needle, and searches for the first occurrence of needle in haystack. If needle is found, a pointer to the beginning of the substring is returned. If needle is not found, a null pointer is returned.",
        return: "`strstr()` function returns a pointer to the beginning of the substring if found, or a null pointer if not found.",
        notes: "It is not guaranteed that the substring will be null-terminated if the string is too long. This can result in unexpected behavior.",
        bugs: "It is possible for `strstr()` to cause a buffer overflow if the haystack array is not large enough to hold the needle string. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: [
            "strchr",
            "strrchr",
            "strstr",
            "strpbrk",
            "strspn",
            "strcspn",
        ],
    },
    strncmp: {
        summary:
            "`strncmp()` is a standard C library function that compares the first n characters of two strings.",
        synopsis: "int strncmp(const char *s1, const char *s2, size_t n);",
        include: ["#include <string.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `strncmp()` function.",
                code: '#include <stdio.h>\n#include <string.h>\n\nint main () {\n    char str1[15];\n    char str2[15];\n    int ret;\n    \n    strcpy(str1, "abcdef");\n    strcpy(str2, "ABCDEF");\n\n    ret = strncmp(str1, str2, 4);\n\n    if(ret < 0) {\n        printf("str1 is less than str2\\n");\n    } else if(ret > 0) {\n        printf("str2 is less than str1\\n");\n    } else {\n        printf("str1 is equal to str2\\n");\n    }\n    \n    return(0);\n}',
            },
        ],
        description:
            "`strncmp()` function takes three arguments, s1, s2 and n, and compares the first n characters of s1 and s2. If the first n characters of s1 and s2 are equal, the function returns 0. If the first n characters of s1 are greater than the first n characters of s2, the function returns a positive number. If the first n characters of s1 are less than the first n characters of s2, the function returns a negative number.",
        return: "`strncmp()` function returns an integer less than, equal to, or greater than zero if s1 is found, respectively, to be less than, to match, or be greater than s2.",
        notes: "It is not guaranteed that the strings will be null-terminated if the source string is too long. This can result in unexpected behavior.",
        bugs: "It is possible for `strncmp()` to cause a buffer overflow if the destination array is not large enough to hold the source string. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: [
            "strcmp",
            "strcpy",
            "strcat",
            "strncat",
            "memcmp",
            "memcpy",
            "memmove",
        ],
    },
    strcat_s: {
        summary:
            "`strcat_s()` is a standard C library function that appends a null-terminated string (the source) to the end of another null-terminated string (the destination).",
        synopsis:
            "errno_t strcat_s(char *destination, rsize_t destsz, const char *source);",
        include: ["#include <string.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `strcat_s()` function.",
                code: '#include <stdio.h>\n#include <string.h>\n\nint main () {\n    char src[40];\n    char dest[100];\n    \n    memset(dest, \'\\0\', sizeof(dest));\n    strcpy(src, "This is tutorialspoint.com");\n    strcat_s(dest, 100, src);\n\n    printf("Final concatenated string : %s\\n", dest);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`strcat_s()` function takes three arguments, destination, destsz and source, and appends the contents of source to the end of destination. The destination array must be large enough to hold the source string and a null terminator.",
        return: "`strcat_s()` function returns zero on success, or a non-zero value on failure.",
        notes: "It is not guaranteed that the destination string will be null-terminated if the source string is too long. This can result in unexpected behavior.",
        bugs: "It is possible for `strcat_s()` to cause a buffer overflow if the destination array is not large enough to hold the source string. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["strcpy", "strncpy", "strncat", "memcpy", "memmove"],
    },
    memcpy_s: {
        summary:
            "`memcpy_s()` is a standard C library function that copies a specified number of bytes from a source memory location to a destination memory location.",
        synopsis:
            "errno_t memcpy_s(void *dest, rsize_t destsz, const void *src, rsize_t n);",
        include: ["#include <string.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `memcpy_s()` function.",
                code: '#include <stdio.h>\n#include <string.h>\n\nint main () {\n    char src[40];\n    char dest[100];\n    \n    memset(dest, \'\\0\', sizeof(dest));\n    strcpy(src, "This is tutorialspoint.com");\n    memcpy_s(dest, sizeof(dest), src, strlen(src)+1);\n\n    printf("Final copied string : %s\\n", dest);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`memcpy_s()` function takes four arguments, destination, destination size, source, and number of bytes to copy. It copies the specified number of bytes from the source memory location to the destination memory location.",
        return: "`memcpy_s()` function returns 0 on success and a non-zero value on failure.",
        notes: "`memcpy_s()` is a safer version of `memcpy()` as it checks the size of the destination buffer before copying the data. This prevents buffer overflows.",
        bugs: "None.",
        similar: ["strcpy", "strncpy", "strcat", "strncat", "memmove"],
    },
    memmove: {
        summary:
            "`memmove()` is a standard C library function that copies a block of memory from one location to another.",
        synopsis: "void *memmove(void *dest, const void *src, size_t n);",
        include: ["#include <string.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `memmove()` function.",
                code: '#include <stdio.h>\n#include <string.h>\n\nint main () {\n    char str1[] = "GeeksforGeeks";\n    char str2[] = "GeeksQuiz";\n    \n    // Copies str1 into str2\n    memmove(str2, str1, strlen(str1)+1);\n    \n    printf("str2 after memmove: %s\\n", str2);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`memmove()` function copies n bytes from memory area src to memory area dest. The memory areas may overlap: copying takes place as though the bytes in src are first copied into a temporary array that does not overlap src or dest, and the bytes are then copied from the temporary array to dest.",
        return: "`memmove()` function returns a pointer to the destination string.",
        notes: "It is not guaranteed that the destination string will be null-terminated if the source string is too long. This can result in unexpected behavior.",
        bugs: "It is possible for `memmove()` to cause a buffer overflow if the destination array is not large enough to hold the source string. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["strcpy", "strncpy", "strcat", "strncat", "memcpy"],
    },
    memchr: {
        summary:
            "`memchr()` is a standard C library function that searches for a character in a memory area.",
        synopsis: "void *memchr(const void *s, int c, size_t n);",
        include: ["#include <string.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `memchr()` function.",
                code: "#include <stdio.h>\n#include <string.h>\n\nint main () {\n    char str[] = \"This is a sample string\";\n    char * pch;\n    \n    pch = (char*) memchr (str, 's', strlen(str));\n    while (pch != NULL) {\n        printf (\"found at %d\\n\", pch-str+1);\n        pch = (char*) memchr (pch+1, 's', strlen(pch+1));\n    }\n    \n    return(0);\n}",
            },
        ],
        description:
            "`memchr()` function searches for the first occurrence of the character c (converted to an unsigned char) in the first n bytes of the memory area pointed to by s. The function returns a pointer to the located character or a null pointer if the character does not occur in the memory area.",
        return: "`memchr()` function returns a pointer to the located character or a null pointer if the character does not occur in the memory area.",
        notes: "The `memchr()` function is not guaranteed to be thread-safe.",
        bugs: "None.",
        similar: [
            "memcmp",
            "memcpy",
            "memmove",
            "strchr",
            "strcmp",
            "strcpy",
            "strlen",
        ],
    },

    qsort: {
        summary:
            "`qsort()` is a standard C library function that sorts an array of elements in ascending order.",
        synopsis:
            "void qsort(void *base, size_t nmemb, size_t size, int (*compar)(const void *, const void *));",
        include: ["#include <stdlib.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `qsort()` function.",
                code: '#include <stdio.h>\n#include <stdlib.h>\n\nint values[] = { 40, 10, 100, 90, 20, 25 };\n\nint cmpfunc (const void * a, const void * b) {\n   return ( *(int*)a - *(int*)b );\n}\n\nint main () {\n   int n;\n\n   printf("Before sorting the list is:\\n");\n   for( n = 0 ; n < 6; n++ ) {\n      printf("%d ", values[n]);\n   }\n\n   qsort(values, 6, sizeof(int), cmpfunc);\n\n   printf("\\nAfter sorting the list is:\\n");\n   for( n = 0 ; n < 6; n++ ) {\n      printf("%d ", values[n]);\n   }\n\n   return(0);\n}',
            },
        ],
        description:
            "`qsort()` function takes four arguments, base, nmemb, size, and compar. The base argument is a pointer to the first element of the array to be sorted. The nmemb argument is the number of elements in the array pointed to by base. The size argument is the size of each element in the array. The compar argument is a pointer to a function that compares two elements and returns an integer less than, equal to, or greater than zero if the first argument is considered to be respectively less than, equal to, or greater than the second.",
        return: "`qsort()` function does not return a value.",
        notes: "The compar function must return an integer less than, equal to, or greater than zero if the first argument is considered to be respectively less than, equal to, or greater than the second.",
        bugs: "It is possible for `qsort()` to cause a buffer overflow if the array is not large enough to hold the elements. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["bsearch", "qsort_r", "heapsort"],
    },
    rand_r: {
        summary:
            "`rand_r()` is a standard C library function that generates a random number using a given seed.",
        synopsis: "int rand_r(unsigned int *seed);",
        include: ["#include <stdlib.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `rand_r()` function.",
                code: '#include <stdio.h>\n#include <stdlib.h>\n\nint main () {\n    int i;\n    unsigned int seed = 10;\n    \n    printf("Random numbers with seed %u\\n", seed);\n    for (i = 0; i < 5; i++) {\n        printf("%d\\n", rand_r(&seed));\n    }\n    \n    return(0);\n}',
            },
        ],
        description:
            "`rand_r()` function takes a pointer to an unsigned int as its argument and returns a random number. The seed argument is used to generate the random number and should be initialized to some value before calling `rand_r()`.",
        return: "`rand_r()` function returns a random number.",
        notes: "The random numbers generated by `rand_r()` are not cryptographically secure. It is recommended to use `random()` or `rand()` instead.",
        bugs: "`rand_r()` is not thread-safe and should not be used in multi-threaded applications.",
        similar: ["random", "rand", "srand"],
    },
    setjmp: {
        summary:
            "`setjmp()` is a standard C library function that saves the current program state in a buffer and returns 0.",
        synopsis: "int setjmp(jmp_buf env);",
        include: ["#include <setjmp.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `setjmp()` function.",
                code: '#include <stdio.h>\n#include <setjmp.h>\n\njmp_buf buf;\n\nvoid f2() {\n    printf("Inside f2()\\n");\n    longjmp(buf, 1);\n}\n\nvoid f1() {\n    printf("Inside f1()\\n");\n    f2();\n}\n\nint main() {\n    if (setjmp(buf) == 0) {\n        printf("Calling f1()\\n");\n        f1();\n    } else {\n        printf("Back in main\\n");\n    }\n    return 0;\n}',
            },
        ],
        description:
            "`setjmp()` saves the current program state in the buffer pointed to by env. This state includes the values of the program's registers, the stack pointer, and the program counter. The program state can later be restored by calling `longjmp()`.",
        return: "`setjmp()` returns 0 when called directly, and a non-zero value when called from `longjmp()`.",
        notes: "`setjmp()` should not be used to handle errors or exceptions. It should only be used to return to a specific point in the program.",
        bugs: "`setjmp()` should not be used to handle errors or exceptions. It should only be used to return to a specific point in the program.",
        similar: ["longjmp", "sigsetjmp", "siglongjmp"],
    },
    longjmp: {
        summary:
            "`longjmp()` is a standard C library function that restores the environment saved by a previous call to `setjmp()`.",
        synopsis: "void longjmp(jmp_buf env, int val);",
        include: ["#include <setjmp.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `longjmp()` function.",
                code: '#include <stdio.h>\n#include <setjmp.h>\n\njmp_buf env;\n\nvoid f2() {\n    printf("Inside f2()\\n");\n    longjmp(env, 1);\n}\n\nvoid f1() {\n    printf("Inside f1()\\n");\n    f2();\n}\n\nint main() {\n    if (setjmp(env) == 0) {\n        printf("Inside main()\\n");\n        f1();\n    } else {\n        printf("Back in main()\\n");\n    }\n    return 0;\n}',
            },
        ],
        description:
            "`longjmp()` restores the environment saved by the most recent call to `setjmp()` in the same invocation of the program, with the corresponding `jmp_buf` argument. The `val` argument is passed as the return value of `setjmp()`.",
        return: "`longjmp()` does not return.",
        notes: "`longjmp()` should not be used to jump out of a function that has called `malloc()` or `free()` since these functions may have modified the heap.",
        bugs: "`longjmp()` should not be used to jump out of a loop or switch statement since this may cause unexpected behavior.",
        similar: ["setjmp", "siglongjmp", "sigsetjmp"],
    },
    signal: {
        summary:
            "`signal()` is a standard C library function that sets a signal handler for a specified signal.",
        synopsis: "void (*signal(int signum, void (*handler)(int)))(int);",
        include: ["#include <signal.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `signal()` function.",
                code: '#include <stdio.h>\n#include <signal.h>\n\nvoid signal_handler(int signum) {\n    printf("Received signal %d\\n", signum);\n}\n\nint main() {\n    signal(SIGINT, signal_handler);\n    while(1) {\n        sleep(1);\n    }\n    return 0;\n}',
            },
        ],
        description:
            "`signal()` function sets the signal handler for the specified signal. The signal handler is a function that is called when the signal is received. The signal handler can be set to a function that ignores the signal, or to a function that handles the signal.",
        return: "`signal()` function returns a pointer to the previous signal handler, or `SIG_ERR` if an error occurs.",
        notes: "The signal handler must be re-installed after each invocation, or the signal will be ignored.",
        bugs: "If the signal handler is not re-installed after each invocation, the signal may be ignored.",
        similar: ["sigaction", "raise", "kill", "alarm"],
    },
    sigaction: {
        summary:
            "`sigaction()` is a POSIX system call that allows a process to examine and change the action taken by the system on receipt of a specific signal.",
        synopsis:
            "int sigaction(int signum, const struct sigaction *act, struct sigaction *oldact);",
        include: ["#include <signal.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `sigaction()` function.",
                code: '#include <stdio.h>\n#include <signal.h>\n\nvoid signal_handler(int signum) {\n    printf("Received signal %d\\n", signum);\n}\n\nint main() {\n    struct sigaction act;\n    act.sa_handler = signal_handler;\n    sigaction(SIGINT, &act, NULL);\n    while(1);\n    return 0;\n}',
            },
        ],
        description:
            "`sigaction()` takes three arguments: the signal number, a pointer to a `struct sigaction` containing the action to be taken, and a pointer to a `struct sigaction` to store the old action. The `struct sigaction` contains the signal handler, a set of flags, and a set of signal masks.",
        return: "`sigaction()` returns 0 on success and -1 on error.",
        notes: "The signal handler must be a function that takes a single integer argument and returns void.",
        bugs: "If the signal handler is not set correctly, the signal may be ignored or the program may crash.",
        similar: ["signal", "sigprocmask", "sigpending", "sigwait"],
    },
    time: {
        summary:
            "`time()` is a system call that returns the current calendar time.",
        synopsis: "time_t time(time_t *t);",
        include: ["#include <time.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `time()` function.",
                code: '#include <stdio.h>\n#include <time.h>\n\nint main () {\n    time_t seconds;\n    \n    seconds = time(NULL);\n    printf("Number of hours since January 1, 1970 is %ld\\n", seconds/3600);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`time()` returns the current calendar time as a value of type `time_t`. If the argument is not a null pointer, the return value is also stored in the object pointed to by the argument.",
        return: "`time()` returns the current calendar time as a `time_t` value.",
        notes: "The `time()` function is not affected by changes made by `adjtime()` or `settimeofday()`.",
        bugs: "The `time()` function is affected by changes made by `stime()`.",
        similar: [
            "clock_gettime",
            "gettimeofday",
            "gmtime",
            "localtime",
            "mktime",
        ],
    },
    localtime: {
        summary:
            "`localtime()` is a standard C library function that converts a time value to a broken-down local time structure.",
        synopsis: "struct tm *localtime(const time_t *timep);",
        include: ["#include <time.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `localtime()` function.",
                code: '#include <stdio.h>\n#include <time.h>\n\nint main () {\n    time_t rawtime;\n    struct tm *info;\n    char buffer[80];\n\n    time(&rawtime);\n\n    info = localtime(&rawtime);\n\n    strftime(buffer,80,"%x - %I:%M%p", info);\n    printf("Formatted date & time : %s\\n", buffer);\n\n    return 0;\n}',
            },
        ],
        description:
            "`localtime()` takes a pointer to a time value and converts it to a broken-down local time structure. The broken-down time structure is stored in a static area and is overwritten each time `localtime()` is called.",
        return: "`localtime()` returns a pointer to the broken-down local time structure.",
        notes: "The returned broken-down time structure is not thread-safe and should not be used in a multi-threaded application.",
        bugs: "`localtime()` does not take into account daylight savings time or other time zone changes.",
        similar: ["gmtime", "mktime", "strftime"],
    },
    gmtime: {
        summary:
            "`gmtime()` is a standard C library function that converts a time value into a broken-down time structure, expressed in Coordinated Universal Time (UTC).",
        synopsis: "struct tm *gmtime(const time_t *timep);",
        include: ["#include <time.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `gmtime()` function.",
                code: '#include <stdio.h>\n#include <time.h>\n\nint main () {\n    time_t rawtime;\n    struct tm *info;\n    char buffer[80];\n\n    time(&rawtime);\n\n    info = gmtime(&rawtime);\n\n    strftime(buffer,80,"%x - %I:%M%p", info);\n    printf("Formatted date & time : %s\\n", buffer);\n\n    return 0;\n}',
            },
        ],
        description:
            "`gmtime()` takes a pointer to a time value and returns a pointer to a `tm` structure with the broken-down time. The `tm` structure contains the following fields: `tm_sec`, `tm_min`, `tm_hour`, `tm_mday`, `tm_mon`, `tm_year`, `tm_wday`, `tm_yday`, and `tm_isdst`.",
        return: "`gmtime()` function returns a pointer to a `tm` structure, or `NULL` if the time value is not valid.",
        notes: "The `tm` structure is defined in `<time.h>` header file.",
        bugs: "`gmtime()` does not check for overflow when converting the time value to a broken-down time structure.",
        similar: ["localtime", "mktime", "strftime", "ctime"],
    },
    strftime: {
        summary:
            "`strftime()` is a standard C library function that formats a given date and time according to the specified format.",
        synopsis:
            "size_t strftime(char *s, size_t max, const char *format, const struct tm *tm);",
        include: ["#include <time.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `strftime()` function.",
                code: '#include <stdio.h>\n#include <time.h>\n\nint main () {\n    time_t rawtime;\n    struct tm * timeinfo;\n    char buffer[80];\n    \n    time (&rawtime);\n    timeinfo = localtime(&rawtime);\n    \n    strftime(buffer,80,"%d-%m-%Y %I:%M:%S",timeinfo);\n    printf("Formatted date & time : %s\\n",buffer);\n    \n    return 0;\n}',
            },
        ],
        description:
            "`strftime()` function takes four arguments, s, max, format, and tm. The s argument is a pointer to the destination string, max is the maximum number of characters to be written, format is a string containing the format specifiers, and tm is a pointer to a tm structure containing the date and time information.",
        return: "`strftime()` function returns the number of characters written to the destination string, or 0 if an error occurs.",
        notes: "The format specifiers used in `strftime()` are the same as those used in the C library function `printf()`.",
        bugs: "`strftime()` does not check for buffer overflows, so it is possible for the destination string to be overwritten if the format string is too long.",
        similar: ["strptime", "gmtime", "localtime", "mktime"],
    },
    mktime: {
        summary:
            "`mktime()` is a standard C library function that converts a broken-down time structure (struct tm) into a calendar time (time_t).",
        synopsis: "time_t mktime(struct tm *timeptr);",
        include: ["#include <time.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `mktime()` function.",
                code: '#include <stdio.h>\n#include <time.h>\n\nint main () {\n    struct tm t;\n    time_t t_of_day;\n    \n    t.tm_year = 2020 - 1900;\n    t.tm_mon = 11;\n    t.tm_mday = 31;\n    t.tm_hour = 23;\n    t.tm_min = 59;\n    t.tm_sec = 59;\n    \n    t_of_day = mktime(&t);\n    \n    printf("Seconds since the Epoch: %ld\\n", (long) t_of_day);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`mktime()` function takes a pointer to a struct tm object and returns the calendar time (time_t) corresponding to the broken-down time structure. The struct tm object should be initialized with the desired values before calling `mktime()`.",
        return: "`mktime()` function returns the calendar time (time_t) corresponding to the broken-down time structure, or -1 if the time cannot be represented.",
        notes: "The `mktime()` function is not guaranteed to be thread-safe.",
        bugs: "The `mktime()` function may not be able to represent dates outside of the range of time_t.",
        similar: ["gmtime", "localtime", "strftime", "ctime"],
    },
    difftime: {
        summary:
            "`difftime()` is a standard C library function that computes the difference between two calendar times.",
        synopsis: "double difftime(time_t time1, time_t time2);",
        include: ["#include <time.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `difftime()` function.",
                code: '#include <stdio.h>\n#include <time.h>\n\nint main () {\n    time_t start, end;\n    double diff;\n    \n    time(&start);\n    sleep(2);\n    time(&end);\n    \n    diff = difftime(end, start);\n    \n    printf("%.f seconds elapsed.\\n", diff);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`difftime()` function takes two arguments, time1 and time2, and returns the difference between them in seconds. The arguments are of type `time_t` which is an arithmetic type representing the number of seconds elapsed since the Epoch (00:00:00 UTC, January 1, 1970).",
        return: "`difftime()` function returns the difference between two calendar times in seconds.",
        notes: "The `difftime()` function is not affected by daylight savings time.",
        bugs: "None.",
        similar: ["time", "mktime", "gmtime", "localtime"],
    },
    strncpy: {
        summary:
            "`strncpy()` is a standard C library function that copies up to n characters from the null-terminated string (the source) to the memory location pointed to by destination.",
        synopsis:
            "char *strncpy(char *destination, const char *source, size_t n);",
        include: ["#include <stdlib.h>"],
        examples: [
            {
                title: "The following example shows the usage of `strncpy()`` function.",
                code: '#include <stdio.h>\n#include <string.h>\n\nint main () {\n    char src[40];\n    char dest[100];\n    \n    memset(dest, \'\\0\', sizeof(dest));\n    strncpy(src, "This is tutorialspoint.com", 10);\n    strncpy(dest, src, 10);\n\n    printf("Final copied string : %s\\n", dest);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`strncpy()` function takes three arguments, destination, source, and n, and copies up to n characters from source to destination. The destination array must be large enough to hold the source string and a null terminator.",
        return: "`strncpy()` function returns a pointer to the destination string.",
        notes: "It is not guaranteed that the destination string will be null-terminated if the source string is too long. This can result in unexpected behavior.",
        bugs: "It is possible for `strncpy()` to cause a buffer overflow if the destination array is not large enough to hold the source string. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["strcpy", "strcat", "strncat", "memcpy", "memmove"],
    },
    memcpy: {
        summary:
            "`memcpy()` is a standard C library function that copies a block of memory from one location to another.",
        synopsis: "void *memcpy(void *dest, const void *src, size_t n);",
        include: ["#include <string.h>"],
        examples: [
            {
                title: "The following example shows the usage of `memcpy()` function.",
                code: '#include <stdio.h>\n#include <string.h>\n\nint main () {\n    char src[50] = "GeeksforGeeks";\n    char dest[50];\n    \n    memcpy(dest, src, strlen(src)+1);\n    printf("Final copied string : %s\\n", dest);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`memcpy()` function takes three arguments, destination, source, and size. It copies the contents of the source memory location to the destination memory location for the specified number of bytes.",
        return: "`memcpy()` function returns a pointer to the destination string.",
        notes: "It is not guaranteed that the destination string will be null-terminated if the source string is too long. This can result in unexpected behavior.",
        bugs: "It is possible for `memcpy()` to cause a buffer overflow if the destination array is not large enough to hold the source string. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["strcpy", "strncpy", "strcat", "strncat", "memmove"],
    },
    FD_ISSET: {
        summary:
            "`FD_ISSET()` is a macro that tests to see if a file descriptor is part of a set.",
        synopsis: "int FD_ISSET(int fd, fd_set *set);",
        include: ["#include <sys/select.h>"],
        examples: [
            {
                title: "The following example shows the usage of `FD_ISSET()` macro.",
                code: '#include <stdio.h>\n#include <sys/select.h>\n\nint main () {\n    int fd;\n    fd_set rfds;\n    \n    FD_ZERO(&rfds);\n    FD_SET(fd, &rfds);\n    \n    if (FD_ISSET(fd, &rfds)) {\n        printf("fd is set\\n");\n    }\n    \n    return(0);\n}',
            },
        ],
        description:
            "`FD_ISSET()` macro takes two arguments, a file descriptor and a pointer to a set of file descriptors, and tests to see if the file descriptor is part of the set. If the file descriptor is part of the set, the macro returns a non-zero value, otherwise it returns zero.",
        return: "`FD_ISSET()` macro returns a non-zero value if the file descriptor is part of the set, otherwise it returns zero.",
        notes: "The `FD_ISSET()` macro should be used in conjunction with the `FD_ZERO()` and `FD_SET()` macros.",
        bugs: "None.",
        similar: ["FD_ZERO", "FD_SET", "FD_CLR"],
    },
    select: {
        summary:
            '`select()` is a system call that allows a program to monitor multiple file descriptors, waiting until one or more of the file descriptors become "ready" for some class of I/O operation.',
        synopsis:
            "int select(int nfds, fd_set *readfds, fd_set *writefds, fd_set *exceptfds, struct timeval *timeout);",
        include: ["#include <sys/select.h>"],
        examples: [
            {
                title: "The following example shows the usage of `select()` function.",
                code: '#include <stdio.h>\n#include <sys/time.h>\n#include <sys/types.h>\n#include <unistd.h>\n\nint main(void) {\n    fd_set rfds;\n    struct timeval tv;\n    int retval;\n\n    /* Watch stdin (fd 0) to see when it has input. */\n    FD_ZERO(&rfds);\n    FD_SET(0, &rfds);\n\n    /* Wait up to five seconds. */\n    tv.tv_sec = 5;\n    tv.tv_usec = 0;\n\n    retval = select(1, &rfds, NULL, NULL, &tv);\n    /* Don\'t rely on the value of tv now! */\n\n    if (retval == -1) \n        perror("select()");\n    else if (retval) \n        printf("Data is available now.\\n");\n        /* FD_ISSET(0, &rfds) will be true. */\n    else\n        printf("No data within five seconds.\\n");\n\n    return 0;\n}',
            },
        ],
        description:
            '`select()` is used to monitor multiple file descriptors, waiting until one or more of the file descriptors become "ready" for some class of I/O operation (e.g., input possible). A file descriptor is considered ready if it is possible to perform the corresponding I/O operation (e.g., read(2)) without blocking.',
        return: "`select()` returns the total number of bits that are set in the bit masks, or -1 if an error occurred.",
        notes: "The timeout argument specifies the maximum time for which the call will block. If timeout is NULL, the call will block indefinitely.",
        bugs: "`select()` can be slow when monitoring a large number of file descriptors. It is also not thread-safe.",
        similar: ["poll", "epoll"],
    },
    abs: {
        summary:
            "`abs()` is a standard C library function that returns the absolute value of an integer.",
        synopsis: "int abs(int x);",
        include: ["#include <stdlib.h>"],
        examples: [
            {
                title: "The following example shows the usage of `abs()` function.",
                code: '#include <stdio.h>\n#include <stdlib.h>\n\nint main () {\n    int x = -10;\n    int result;\n    \n    result = abs(x);\n    printf("abs(%d) = %d\\n", x, result);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`abs()` function takes one argument, an integer, and returns the absolute value of that integer. The absolute value of a number is its magnitude without regard to its sign.",
        return: "`abs()` function returns the absolute value of the argument.",
        notes: "The absolute value of the most negative number cannot be represented in a signed integer type, so the result of `abs()` on the most negative number is undefined.",
        bugs: "None.",
        similar: ["fabs", "labs"],
    },
    atoi: {
        summary:
            "`atoi()` is a standard C library function that converts a string (the source) to an integer.",
        synopsis: "int atoi(const char *str);",
        include: ["#include <stdlib.h>"],
        examples: [
            {
                title: "The following example shows the usage of `atoi()` function.",
                code: '#include <stdio.h>\n#include <stdlib.h>\n\nint main () {\n    char str[30] = "10 20 30";\n    int num;\n    \n    num = atoi(str);\n    printf("The string \'%s\' is converted to integer %d\\n", str, num);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`atoi()` function takes one argument, a string, and converts it to an integer. The string must contain only digits, and an optional leading + or - sign.",
        return: "`atoi()` function returns the converted integer, or 0 if the string does not contain a valid integer.",
        notes: "`atoi()` does not perform any error checking, so it is possible for it to return an incorrect result if the string is not a valid integer.",
        bugs: "`atoi()` does not perform any error checking, so it is possible for it to return an incorrect result if the string is not a valid integer.",
        similar: [
            "strtol",
            "strtoul",
            "strtoll",
            "strtoull",
            "strtof",
            "strtod",
            "strtold",
        ],
    },
    memset: {
        summary:
            "`memset()` is a standard C library function that fills a block of memory with a specified value.",
        synopsis: "void *memset(void *s, int c, size_t n);",
        include: ["#include <string.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `memset()` function.",
                code: "#include <stdio.h>\n#include <string.h>\n\nint main () {\n    char str[50];\n    \n    strcpy(str,\"This is string.h library function\");\n    puts(str);\n    \n    memset(str,'$',7);\n    puts(str);\n    \n    return(0);\n}",
            },
        ],
        description:
            "`memset()` function takes three arguments, a pointer to the memory location to be filled, the value to be filled and the number of bytes to be filled. It fills the first n bytes of the memory location pointed to by s with the value c.",
        return: "`memset()` function returns a pointer to the memory location s.",
        notes: "It is important to note that the value c is interpreted as an unsigned char, so if a negative value is passed, it will be interpreted as a large positive number.",
        bugs: "It is possible for `memset()` to cause a buffer overflow if the destination array is not large enough to hold the source string. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: [
            "strcpy",
            "strncpy",
            "strcat",
            "strncat",
            "memcpy",
            "memmove",
        ],
    },
    rand: {
        summary:
            "`rand()` is a standard C library function that generates a pseudo-random integer between 0 and RAND_MAX.",
        synopsis: "int rand(void);",
        include: ["#include <stdlib.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `rand()` function.",
                code: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int i, n;\n    n = 5;\n    printf("Random numbers:");\n    for (i = 0; i < n; i++) {\n        printf(" %d", rand());\n    }\n    printf("\\n");\n    \n    return(0);\n}',
            },
        ],
        description:
            "`rand()` function returns a pseudo-random integer in the range of 0 to RAND_MAX. The RAND_MAX is a constant defined in the header file stdlib.h.",
        return: "`rand()` function returns a pseudo-random integer.",
        notes: "The `rand()` function is not cryptographically secure and should not be used for security purposes. It should only be used for generating random numbers for general purposes.",
        bugs: "The `rand()` function is not guaranteed to produce the same sequence of numbers on different platforms. This can result in unexpected behavior.",
        similar: ["srand", "random", "rand_r"],
    },
    srand: {
        summary:
            "`srand()` is a standard C library function that sets the starting point for generating a series of pseudo-random integers.",
        synopsis: "void srand(unsigned int seed);",
        include: ["#include <stdlib.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `srand()` function.",
                code: '#include <stdio.h>\n#include <stdlib.h>\n#include <time.h>\n\nint main () {\n    int i, n;\n    time_t t;\n    \n    n = 5;\n    \n    /* Intializes random number generator */\n    srand((unsigned) time(&t));\n    \n    /* Print 5 random numbers from 0 to 49 */\n    for( i = 0 ; i < n ; i++ ) {\n        printf("%d\\n", rand() % 50);\n    }\n    \n    return(0);\n}',
            },
        ],
        description:
            "`srand()` takes an unsigned integer argument, which is used as a seed for the pseudo-random number generator. The same seed will always produce the same sequence of pseudo-random numbers.",
        return: "`srand()` does not return a value.",
        notes: "It is important to note that `srand()` should only be called once in a program. If it is called multiple times, the same sequence of pseudo-random numbers will be generated each time.",
        bugs: "If `srand()` is not called before `rand()`, the pseudo-random number generator will be initialized with a default seed, which may result in the same sequence of pseudo-random numbers being generated each time the program is run.",
        similar: ["rand", "srandom", "random"],
    },
    atof: {
        summary:
            "`atof()` is a standard C library function that converts a string to a double-precision floating-point number.",
        synopsis: "double atof(const char *str);",
        include: ["#include <stdlib.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `atof()` function.",
                code: '#include <stdio.h>\n#include <stdlib.h>\n\nint main () {\n    char str[30] = "10.20";\n    double val;\n    \n    val = atof(str);\n    printf("String value = %s, Float value = %f\\n", str, val);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`atof()` function takes a string as an argument and returns the converted double-precision floating-point number. The string must contain a valid number, otherwise the result is undefined.",
        return: "`atof()` function returns the converted double-precision floating-point number.",
        notes: "The `atof()` function is not thread-safe and should not be used in multi-threaded applications.",
        bugs: "The `atof()` function does not check for overflow or underflow, so it is possible for the result to be incorrect if the string contains a number that is too large or too small.",
        similar: ["atol", "atoll", "strtod", "strtof"],
    },
    atol: {
        summary:
            "`atol()` is a standard C library function that converts a string to a long integer.",
        synopsis: "long atol(const char *str);",
        include: ["#include <stdlib.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `atol()` function.",
                code: '#include <stdio.h>\n#include <stdlib.h>\n\nint main () {\n    char str[30] = "-1234567";\n    long val;\n    \n    val = atol(str);\n    printf("The string value = %s, Long value = %ld\\n", str, val);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`atol()` function takes a string as an argument and converts it to a long integer. The string must contain only digits, an optional sign (+ or -) and an optional decimal point.",
        return: "`atol()` function returns the converted long integer value.",
        notes: "The `atol()` function does not perform any error checking. If the string contains any non-numeric characters, the result is undefined.",
        bugs: "The `atol()` function does not check for overflow or underflow. If the string contains a number that is too large or too small to fit in a long integer, the result is undefined.",
        similar: ["atoi", "atoll", "strtol", "strtoll"],
    },
    ceil: {
        summary:
            "`ceil()` is a standard C library function that returns the smallest integral value that is not less than the given argument.",
        synopsis: "double ceil(double x);",
        include: ["#include <math.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `ceil()` function.",
                code: '#include <stdio.h>\n#include <math.h>\n\nint main () {\n    double x = 3.14;\n    double y;\n    \n    y = ceil(x);\n    printf("ceil of %lf is %lf\\n", x, y);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`ceil()` function takes a single argument, x, and returns the smallest integral value that is not less than x. If x is already an integral value, then the same value is returned.",
        return: "`ceil()` function returns the smallest integral value that is not less than x.",
        notes: "The `ceil()` function is part of the C99 standard library and is not available in earlier versions of the C language.",
        bugs: "None.",
        similar: ["floor", "round", "trunc"],
    },
    floor: {
        summary:
            "`floor()` is a standard C library function that returns the largest integral value that is not greater than the given argument.",
        synopsis: "double floor(double x);",
        include: ["#include <math.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `floor()` function.",
                code: '#include <stdio.h>\n#include <math.h>\n\nint main () {\n    double x = 3.14;\n    double y = floor(x);\n    \n    printf("floor of %lf is %lf\\n", x, y);\n    \n    return 0;\n}',
            },
        ],
        description:
            "`floor()` function takes a double argument and returns the largest integral value that is not greater than the given argument.",
        return: "`floor()` function returns the largest integral value that is not greater than the given argument.",
        notes: "The `floor()` function is defined in the math library and is declared in `math.h` header file.",
        bugs: "None.",
        similar: ["ceil", "round", "trunc"],
    },
    fmod: {
        summary:
            "`fmod()` is a standard C library function that returns the remainder of a division operation.",
        synopsis: "double fmod(double x, double y);",
        include: ["#include <math.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `fmod()` function.",
                code: '#include <stdio.h>\n#include <math.h>\n\nint main () {\n    double x = 5.3;\n    double y = 2.1;\n    \n    printf("fmod of %lf and %lf is %lf\\n", x, y, fmod(x, y));\n    \n    return(0);\n}',
            },
        ],
        description:
            "`fmod()` function takes two arguments, x and y, and returns the remainder of x divided by y. The result is always between 0 and y, inclusive.",
        return: "`fmod()` function returns the remainder of x divided by y.",
        notes: "If either argument is NaN, a NaN is returned. If either argument is infinite, a domain error occurs and a NaN is returned.",
        bugs: "If the result of the division is not representable in the return type, a domain error occurs and a NaN is returned.",
        similar: ["modf", "remainder", "remquo"],
    },
    pow: {
        summary:
            "`pow()` is a standard C library function that computes the value of x raised to the power of y.",
        synopsis: "double pow(double x, double y);",
        include: ["#include <math.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `pow()` function.",
                code: '#include <stdio.h>\n#include <math.h>\n\nint main () {\n    double x = 2.0;\n    double y = 3.0;\n    \n    printf("The value of 2^3 is %lf\\n", pow(x, y));\n    \n    return(0);\n}',
            },
        ],
        description:
            "`pow()` function takes two arguments, x and y, and returns the value of x raised to the power of y.",
        return: "`pow()` function returns the value of x raised to the power of y.",
        notes: "The `pow()` function is not guaranteed to be accurate for large values of x and y.",
        bugs: "The `pow()` function may produce unexpected results if the arguments are not valid.",
        similar: ["sqrt", "exp", "log", "log10"],
    },
    sqrt: {
        summary:
            "`sqrt()` is a standard C library function that computes the square root of a number.",
        synopsis: "double sqrt(double x);",
        include: ["#include <math.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `sqrt()` function.",
                code: '#include <stdio.h>\n#include <math.h>\n\nint main () {\n    double x = 9.0;\n    double result;\n    \n    result = sqrt(x);\n    printf("The square root of %lf is %lf\\n", x, result);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`sqrt()` function takes one argument, x, and returns the square root of x. If x is negative, `sqrt()` will return NaN (not a number).",
        return: "`sqrt()` function returns the square root of x.",
        notes: "The accuracy of the result depends on the implementation of the library function.",
        bugs: "If x is negative, `sqrt()` will return NaN (not a number).",
        similar: ["pow", "exp", "log", "log10"],
    },
    exp: {
        summary:
            "`exp()` is a standard C library function that calculates the exponential of a given number.",
        synopsis: "double exp(double x);",
        include: ["#include <math.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `exp()` function.",
                code: '#include <stdio.h>\n#include <math.h>\n\nint main () {\n    double x = 2.0;\n    double result;\n    \n    result = exp(x);\n    printf("The exponential value of %lf is %lf\\n", x, result);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`exp()` function takes a single argument, x, and returns the exponential of x. The exponential of x is calculated using the formula e^x, where e is Euler's number (2.718281828459045).",
        return: "`exp()` function returns the exponential of x.",
        notes: "The result of `exp()` is undefined if x is infinite or NaN.",
        bugs: "None.",
        similar: ["exp2", "exp10", "log", "log2", "log10"],
    },
    syslog: {
        summary:
            "`syslog()` is a standard C library function that sends a message to the system log.",
        synopsis: "void syslog(int priority, const char *format, ...);",
        include: ["#include <syslog.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `syslog()` function.",
                code: '#include <stdio.h>\n#include <syslog.h>\n\nint main () {\n    openlog("exampleprog", LOG_CONS | LOG_PID | LOG_NDELAY, LOG_LOCAL1);\n    syslog(LOG_NOTICE, "Program started by User %d", getuid());\n    syslog(LOG_INFO, "A tree falls in a forest");\n    closelog();\n    \n    return 0;\n}',
            },
        ],
        description:
            "`syslog()` function takes two arguments, priority and format. The priority argument is used to specify the importance of the message. The format argument is a printf-style format string, followed by any additional arguments required by the format string.",
        return: "`syslog()` function does not return a value.",
        notes: "The syslog() function is not thread-safe and should not be used in a multi-threaded application.",
        bugs: "The syslog() function is not guaranteed to be thread-safe and should not be used in a multi-threaded application.",
        similar: ["openlog", "closelog", "setlogmask", "vsyslog"],
    },
    poll: {
        summary:
            '`poll()` is a system call that allows a program to monitor multiple file descriptors, waiting until one or more of the file descriptors become "ready" for some class of I/O operation.',
        synopsis: "int poll(struct pollfd *fds, nfds_t nfds, int timeout);",
        include: ["#include <poll.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `poll()` function.",
                code: '#include <stdio.h>\n#include <poll.h>\n\nint main () {\n    struct pollfd fds[2];\n    int timeout;\n    int ret;\n    \n    /* watch stdin for input */\n    fds[0].fd = 0;\n    fds[0].events = POLLIN;\n    \n    /* watch stdout for ability to write (almost always true) */\n    fds[1].fd = 1;\n    fds[1].events = POLLOUT;\n    \n    /* All set, block! */\n    timeout = 5000; /* 5 seconds */\n    ret = poll(fds, 2, timeout);\n    \n    if (ret == -1) {\n        perror("poll");\n    } else if (ret == 0) {\n        printf("timeout\\n");\n    } else {\n        if (fds[0].revents & POLLIN) {\n            printf("stdin is readable\\n");\n        }\n        if (fds[1].revents & POLLOUT) {\n            printf("stdout is writable\\n");\n        }\n    }\n    \n    return(0);\n}',
            },
        ],
        description:
            "`poll()` takes three arguments: an array of structures describing the file descriptors to be monitored, the number of elements in the array, and a timeout value in milliseconds. The function returns the number of file descriptors that are ready for I/O, or -1 if an error occurred.",
        return: "`poll()` returns the number of file descriptors that are ready for I/O, or -1 if an error occurred.",
        notes: "The `poll()` system call is a more efficient alternative to the `select()` system call, as it does not require the program to iterate through all of the file descriptors to check for readiness.",
        bugs: "`poll()` can be slow if the number of file descriptors is large, as it must iterate through all of the file descriptors to check for readiness.",
        similar: ["select", "epoll"],
    },
    dup: {
        summary:
            "`dup()` is a system call that creates a copy of a file descriptor.",
        synopsis: "int dup(int oldfd);",
        include: ["#include <unistd.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `dup()` function.",
                code: '#include <stdio.h>\n#include <unistd.h>\n\nint main () {\n    int fd1, fd2;\n    char *msg = "Hello World";\n    \n    fd1 = dup(STDOUT_FILENO);\n    fd2 = dup2(fd1, STDERR_FILENO);\n    \n    printf("fd1 = %d, fd2 = %d\\n", fd1, fd2);\n    write(fd1, msg, strlen(msg)+1);\n    write(fd2, msg, strlen(msg)+1);\n    \n    return 0;\n}',
            },
        ],
        description:
            "`dup()` creates a copy of the file descriptor oldfd, using the lowest-numbered unused file descriptor for the new descriptor. The new descriptor shares the same file pointer, file status flags, and file access modes as the old descriptor.",
        return: "`dup()` returns the new file descriptor, or -1 if an error occurred.",
        notes: "The new file descriptor is not set to close-on-exec. The FD_CLOEXEC flag must be set explicitly if the file descriptor is to be closed on exec.",
        bugs: "None.",
        similar: ["dup2", "fcntl"],
    },
    isdigit: {
        summary:
            "`isdigit()` is a standard C library function that checks if a given character is a decimal digit character.",
        synopsis: "int isdigit(int c);",
        include: ["#include <ctype.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `isdigit()` function.",
                code: "#include <stdio.h>\n#include <ctype.h>\n\nint main () {\n    char c;\n    int result;\n    \n    c = '7';\n    result = isdigit(c);\n    printf(\"The result is %d\\n\", result);\n    \n    return(0);\n}",
            },
        ],
        description:
            "`isdigit()` function takes an argument of type int and checks if it is a decimal digit character. It returns a non-zero value if the argument is a decimal digit character, and zero if it is not.",
        return: "`isdigit()` function returns a non-zero value if the argument is a decimal digit character, and zero if it is not.",
        notes: "The argument must be an int, not a char, because the function must be able to accept any value that can be represented as an int, not just characters.",
        bugs: "None.",
        similar: ["isalpha", "isalnum", "isspace", "isupper", "islower"],
    },
    isalpha: {
        summary:
            "`isalpha()` is a standard C library function that checks if a given character is an alphabetic character.",
        synopsis: "int isalpha(int c);",
        include: ["#include <ctype.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `isalpha()` function.",
                code: '#include <stdio.h>\n#include <ctype.h>\n\nint main () {\n    char c;\n    int result;\n    \n    c = \'m\';\n    result = isalpha(c);\n    printf("The given character is %c\\n", c);\n    if (result == 0) {\n        printf("%c is not an alphabetic character.\\n", c);\n    } else {\n        printf("%c is an alphabetic character.\\n", c);\n    }\n    \n    return(0);\n}',
            },
        ],
        description:
            "`isalpha()` function takes an integer argument and checks if it is an alphabetic character. It returns a non-zero value if the argument is an alphabetic character, and zero if it is not.",
        return: "`isalpha()` function returns a non-zero value if the argument is an alphabetic character, and zero if it is not.",
        notes: "The argument must be an integer in the range of an `unsigned char` or `EOF`. If the argument is not in this range, the behavior of `isalpha()` is undefined.",
        bugs: "None.",
        similar: ["isalnum", "isupper", "islower", "isdigit", "isxdigit"],
    },
    isspace: {
        summary:
            "`isspace()` is a standard C library function that checks if a character is a whitespace character.",
        synopsis: "int isspace(int c);",
        include: ["#include <ctype.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `isspace()` function.",
                code: '#include <stdio.h>\n#include <ctype.h>\n\nint main () {\n    int var1 = \' \';\n    int var2 = \'a\';\n    int var3 = \'\\t\';\n    int var4 = \'\\n\';\n    \n    if( isspace(var1) ) {\n        printf("var1 = |%c| is a whitespace character\\n", var1 );\n    } else {\n        printf("var1 = |%c| is not a whitespace character\\n", var1 );\n    }\n    \n    if( isspace(var2) ) {\n        printf("var2 = |%c| is a whitespace character\\n", var2 );\n    } else {\n        printf("var2 = |%c| is not a whitespace character\\n", var2 );\n    }\n    \n    if( isspace(var3) ) {\n        printf("var3 = |%c| is a whitespace character\\n", var3 );\n    } else {\n        printf("var3 = |%c| is not a whitespace character\\n", var3 );\n    }\n    \n    if( isspace(var4) ) {\n        printf("var4 = |%c| is a whitespace character\\n", var4 );\n    } else {\n        printf("var4 = |%c| is not a whitespace character\\n", var4 );\n    }\n    \n    return(0);\n}',
            },
        ],
        description:
            "`isspace()` function takes an integer argument and checks if it is a whitespace character. The whitespace characters are space, form feed (`\\f`), newline (`\\n`), carriage return (`\\r`), horizontal tab (`\\t`), and vertical tab (`\\v`).",
        return: "`isspace()` function returns a non-zero value if the argument is a whitespace character, and zero otherwise.",
        notes: "The argument must be an integer in the range of `0` to `255`.",
        similar: ["isalpha", "isdigit", "isalnum", "isxdigit", "isprint"],
    },
    strrchr: {
        summary:
            "`strrchr()` is a standard C library function that searches for the last occurrence of a character in a string.",
        synopsis: "char *strrchr(const char *str, int c);",
        include: ["#include <string.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `strrchr()` function.",
                code: "#include <stdio.h>\n#include <string.h>\n\nint main () {\n    char str[] = \"This is a sample string\";\n    char * pch;\n    \n    pch = strrchr(str, 's');\n    printf(\"Last occurrence of 's' found at %d \\n\", pch - str + 1);\n    \n    return(0);\n}",
            },
        ],
        description:
            "`strrchr()` function takes two arguments, a pointer to a string and an integer representing a character. It searches for the last occurrence of the character in the string and returns a pointer to the position of the character in the string.",
        return: "`strrchr()` function returns a pointer to the last occurrence of the character in the string, or NULL if the character is not found.",
        notes: "The `strrchr()` function is not case-sensitive. It will search for the character regardless of whether it is upper- or lower-case.",
        bugs: "The `strrchr()` function does not check for the validity of the pointer passed as the first argument. If an invalid pointer is passed, the function may cause a segmentation fault.",
        similar: ["strchr", "strstr", "strpbrk", "strcspn"],
    },
    sprintf: {
        summary:
            "`sprintf()` is a standard C library function that writes a formatted string to a character array.",
        synopsis: "int sprintf(char *str, const char *format, ...);",
        include: ["#include <stdio.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `sprintf()` function.",
                code: '#include <stdio.h>\n\nint main () {\n    char buffer[50];\n    int n, a=5, b=3;\n    n=sprintf (buffer, "%d plus %d is %d", a, b, a+b);\n    printf ("[%s] is a string %d chars long\n",buffer,n);\n    \n    return 0;\n}',
            },
        ],
        description:
            "`sprintf()` function writes the formatted string to the character array `str`. The format string is composed of zero or more directives. Each directive is composed of one of the following: a percent sign (%), a conversion specifier, and optional flags, width, and precision specifiers.",
        return: "`sprintf()` function returns the number of characters written to the character array `str`.",
        notes: "The `sprintf()` function is not recommended for secure programming, as it does not perform any bounds checking on the destination buffer.",
        bugs: "The `sprintf()` function does not perform any bounds checking on the destination buffer, which can result in a buffer overflow and unexpected behavior.",
        similar: ["snprintf", "vsprintf", "vfprintf", "fprintf"],
    },
    sscanf: {
        summary:
            "`sscanf()` is a standard C library function that reads formatted input from a string.",
        synopsis: "int sscanf(const char *str, const char *format, ...);",
        include: ["#include <stdio.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `sscanf()` function.",
                code: '#include <stdio.h>\n\nint main () {\n    char str[80] = "Tutorials Point is best";\n    char str1[80], str2[80];\n    int i;\n    \n    sscanf(str, "%s %s %d", str1, str2, &i);\n    \n    printf("str1: %s\\nstr2: %s\\ni: %d\\n", str1, str2, i);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`sscanf()` function reads formatted input from a string. It takes three arguments, the string to read from, the format string, and a variable list of arguments to store the results.",
        return: "`sscanf()` function returns the number of items successfully read from the string.",
        notes: "The format string is a sequence of characters that specify the expected format of the input string. The format string can contain literal characters, conversion specifiers, and field widths.",
        bugs: "`sscanf()` can cause a buffer overflow if the input string is too long. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["scanf", "fscanf", "sscanf_s", "fscanf_s"],
    },
    strtod: {
        summary:
            "`strtod()` is a standard C library function that converts a string to a double-precision floating-point number.",
        synopsis: "double strtod(const char *str, char **endptr);",
        include: ["#include <stdlib.h>"],
        // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
        examples: [
            {
                title: "The following example shows the usage of `strtod()` function.",
                code: '#include <stdio.h>\n#include <stdlib.h>\n\nint main () {\n    char str[30] = "20.30300 This is test";\n    char *ptr;\n    double ret;\n\n    ret = strtod(str, &ptr);\n    printf("The number(double) is %lf\\n", ret);\n    printf("String part is |%s|", ptr);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`strtod()` function takes two arguments, str and endptr. It converts the initial part of the string in str to a double-precision floating-point number and stores it in the location pointed to by endptr.",
        return: "`strtod()` function returns the converted double-precision floating-point number.",
        notes: "The string must contain a valid number, otherwise the function will return 0.0.",
        bugs: "It is possible for `strtod()` to cause a buffer overflow if the string is too long. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["strtol", "strtoul", "strtof", "strtold"],
    },
    strcpy: {
        summary:
            "`strcpy()` is a standard C library function that copies the contents of a null-terminated string (the source) to the memory location pointed to by destination.",
        synopsis: "char *strcpy(char *destination, const char *source);",
        include: ["#include <string.h>"],
        examples: [
            {
                title: "The following example shows the usage of `strcpy()`` function.",
                code: '#include <stdio.h>\n#include <string.h>\n\nint main () {\n    char src[40];\n    char dest[100];\n    \n    memset(dest, \'\\0\', sizeof(dest));\n    strcpy(src, "This is tutorialspoint.com");\n    strcpy(dest, src);\n\n    printf("Final copied string : %s\\n", dest);\n    \n    return(0);\n}',
            },
        ],
        description:
            "`strcpy()` function takes two arguments, destination and source, and copies the contents of source to destination. The destination array must be large enough to hold the source string and a null terminator.",
        return: "`strcpy()` function returns a pointer to the destination string.",
        notes: "It is not guaranteed that the destination string will be null-terminated if the source string is too long. This can result in unexpected behavior.",
        bugs: "It is possible for `strcpy()` to cause a buffer overflow if the destination array is not large enough to hold the source string. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
        similar: ["strncpy", "strcat", "strncat", "memcpy", "memmove"],
    },
};

// `
// strcpy linux manual page:

// https://man7.org/linux/man-pages/man3/strcpy.3.html

// strcpy: {
//     "summary": "`strcpy()` is a standard C library function that copies the contents of a null-terminated string (the source) to the memory location pointed to by destination.",
//     "synopsis": "char *strcpy(char *destination, const char *source);",
//     "examples": // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
//     [
//         {
//             "title": "The following example shows the usage of `strcpy()`` function.",
//             "code": "#include <stdio.h>\n#include <string.h>\n\nint main () {\n    char src[40];\n    char dest[100];\n    \n    memset(dest, '\\0', sizeof(dest));\n    strcpy(src, \"This is tutorialspoint.com\");\n    strcpy(dest, src);\n\n    printf(\"Final copied string : %s\\n\", dest);\n    \n    return(0);\n}"
//         },
//     ],
//     "description": "`strcpy()` function takes two arguments, destination and source, and copies the contents of source to destination. The destination array must be large enough to hold the source string and a null terminator.",
//     "return": "`strcpy()` function returns a pointer to the destination string.",
//     "notes": "It is not guaranteed that the destination string will be null-terminated if the source string is too long. This can result in unexpected behavior.",
//     "bugs": "It is possible for `strcpy()` to cause a buffer overflow if the destination array is not large enough to hold the source string. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
//     "similar": ["strncpy", "strcat", "strncat", "memcpy", "memmove"]
// }
// "strcpy": {
//     "summary": "`strcpy()` is a standard C library function that copies the contents of a null-terminated string (the source) to the memory location pointed to by destination.",
//     "synopsis": "char *strcpy(char *destination, const char *source);",
//     "examples": // from https://www.tutorialspoint.com/ or https://www.geeksforgeeks.org/ or www.programiz.com
//     [
//         {
//         "title": "The following example shows the usage of `strcpy()`` function.",
//         "code": "#include <stdio.h>\n#include <string.h>\n\nint main () {\n    char src[40];\n    char dest[100];\n    \n    memset(dest, '\\0', sizeof(dest));\n    strcpy(src, \"This is tutorialspoint.com\");\n    strcpy(dest, src);\n\n    printf(\"Final copied string : %s\\n\", dest);\n    \n    return(0);\n}"
//     },],
//     "description": "`strcpy()` function takes two arguments, destination and source, and copies the contents of source to destination. The destination array must be large enough to hold the source string and a null terminator.",
//     "return": "`strcpy()` function returns a pointer to the destination string.",
//     "notes": "It is not guaranteed that the destination string will be null-terminated if the source string is too long. This can result in unexpected behavior.",
//     "bugs": "It is possible for `strcpy()` to cause a buffer overflow if the destination array is not large enough to hold the source string. This can result in unexpected behavior, including program crashes and security vulnerabilities.",
//     "similar": ["strncpy", "strcat", "strncat", "memcpy", "memmove"]
// }
// `
