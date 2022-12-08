import React, { useContext, useState } from "react";

import { authLogin } from "../api/api";
import { AuthContext } from "../context";
import { Button } from "./button";
import { Input } from "./input";

export const Login = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { setContext } = useContext(AuthContext);

    const formSubmitHandler = (e: any) => {
        e.preventDefault();
        setIsSubmitting(true);

        const genericErrorMessage =
            "Something went wrong! Please try again later.";

        authLogin(username, password)
            .then(async (response) => {
                setIsSubmitting(false);

                if (!response.ok) {
                    console.error("login failed");
                } else {
                    const data = await response.json();

                    setContext({ token: data.token, user: data.user });
                }
            })
            .catch((error) => {
                setIsSubmitting(false);
                setContext({ token: null, user: null });
            });
    };

    return (
        <form onSubmit={formSubmitHandler} className="mb-md">
            <span className="section-title">Login</span>
            <Input
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button icon="login">
                {`${isSubmitting ? "Signing In" : "Sign In"}`}
            </Button>
        </form>
    );
};
