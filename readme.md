# Code Inquiry Assistant

This tool is an LLM-based, personal coding assistant with the following main functionalities:

-   ask question
-   ask question from code
-   explain code
-   help fix code
-   help write code

It also has the following features:

-   stream data similar to _ChatGPT_
-   display _pseudo-code_ instead of direct code solutions
-   rate each response and provide feedback
-   ask follow-up questions

# Running the Tool:

## Boot Docker Containers
```bash
docker compose up -d
```

## Set environment variables

1. `cp .env.template .env`
2. Get Secrets for empty values

## Install Dependencies
```bash
yarn
```

## Start the Tool
```bash
yarn dev
```

# Useful Endpoints:

## User Creation
This can be done through the `/api/auth/signup` endpoint which expects the following body:

```bash
{
    "username": "username",
    "password": "secret",
    "firstName": "first",
    "lastName": "last"
}
```
