import { useEffect, useState } from "react";

interface IProps {
    message: string | null;
}

export const ErrorComponent = (props: IProps) => {
    const [showError, setShowError] = useState(false);

    // when props.message changes, setShowError to true. start a timer that sets it back to false after 5 seconds

    useEffect(() => {
        if (props.message) {
            setShowError(true);

            setTimeout(() => {
                setShowError(false);
            }, 5000);
        }
    }, [props.message]);

    if (!showError) return null;

    return (
        <div className="error-container">
            {showError && <div className="error-message">{props.message}</div>}
        </div>
    );
};
