import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { authLogout } from "../api/api";
import logo from "../assets/coding-steps-logo.png";
import { AuthContext } from "../context";
import { Button } from "./button";

interface NavigationBarProps {
    loading?: boolean;
}

export const NavigationBar = (props: NavigationBarProps) => {
    const { context, setContext } = useContext(AuthContext);

    const logoutHandler = () => {
        authLogout(context?.token).then(async (response) => {
            setContext({ token: null, user: null });
        });
    };

    return (
        <header className="navbar">
            <Link to="/" className="text-no-decoration">
                <div className="navbar-logo-container">
                    <img
                        className="navbar-logo"
                        src={logo}
                        alt="lines depicting steps "
                    ></img>
                    <h1 className="logo-type">My Personal TA: CSC209 UofT</h1>
                </div>
            </Link>
            {context?.user?.firstName && (
                <span>
                    {context?.user?.firstName + " " + context?.user?.lastName}
                </span>
            )}

            <div>
                {!props.loading && context?.token ? (
                    <Button icon="logout" onClick={logoutHandler}>
                        Logout
                    </Button>
                ) : null}
            </div>
        </header>
    );
};
