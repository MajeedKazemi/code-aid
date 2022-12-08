import React, { useContext, useEffect, useState } from "react";

import { Layout } from "../components/layout";
import { AuthContext } from "../context";
import { ISubmission } from "../types";

export const AdminPage = () => {
    const { context, setContext } = useContext(AuthContext);
    const [submissions, setSubmissions] = useState<Array<ISubmission>>([]);

    return (
        <Layout>
            <div className="admin-grading-container">
                <h2>Admin Page</h2>
            </div>
        </Layout>
    );
};
