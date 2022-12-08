import React, { useContext, useState } from "react";

import { authSignup } from "../api/api";
import { AuthContext } from "../context";
import { Button } from "./button";
import { Input } from "./input";

export const Register = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setContext } = useContext(AuthContext);

    const formSubmitHandler = (e: any) => {
        e.preventDefault();
        setIsSubmitting(true);

        authSignup(username, password, firstName, lastName)
            .then(async (response) => {
                setIsSubmitting(false);
                if (!response.ok) {
                    console.error("Sign up failed.");
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
            <span className="section-title">Register</span>
            <Input
                type="username"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
            />
            <Input
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <Input
                type="text"
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
            />
            <Input
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
            />

            <Button>{`${isSubmitting ? "Registering" : "Register"}`}</Button>
        </form>
    );
};
