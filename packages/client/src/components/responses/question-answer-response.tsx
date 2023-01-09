import { useContext, useState } from "react";

import { apiReplyAnswerQuestion } from "../../api/api";
import { AuthContext } from "../../context";
import { highlightCode } from "../../utils/utils";
import { ResponseStatus } from "../main-container";

interface IProps {
    data: { question: string; answer: string; id: string; query: string };
}

export const QuestionAnswerResponse = (props: IProps) => {
    const { context } = useContext(AuthContext);
    const [status, setStatus] = useState<ResponseStatus | null>(null);

    const [followUps, setFollowUps] = useState<any[]>([]);
    const [followUpQuestion, setFollowUpQuestion] = useState<string>("");

    return (
        <div>
            <div>{props.data.question}</div>
            <div
                dangerouslySetInnerHTML={{
                    __html: highlightCode(props.data.answer),
                }}
            ></div>
            <hr />
            <div>
                {followUps.map((f: any) => {
                    return (
                        <div key={f.id}>
                            <div>{f.question}</div>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: highlightCode(f.answer),
                                }}
                            ></div>
                            <hr />
                        </div>
                    );
                })}
            </div>
            <hr />
            <textarea
                onChange={(e) => {
                    setFollowUpQuestion(e.target.value);
                }}
                value={followUpQuestion}
            ></textarea>
            <button
                onClick={() => {
                    let prevQuestions =
                        followUps.length > 0
                            ? followUps[followUps.length - 1].query
                            : props.data.query;

                    setStatus(ResponseStatus.Loading);

                    apiReplyAnswerQuestion(
                        context?.token,
                        prevQuestions,
                        followUpQuestion
                    )
                        .then(async (res) => {
                            const data = await res.json();

                            setFollowUps([...followUps, { ...data }]);
                            setStatus(ResponseStatus.Success);
                        })
                        .catch(() => {
                            setStatus(ResponseStatus.Failed);
                        });
                }}
            >
                follow-up
            </button>

            {status === ResponseStatus.Loading ? (
                <div>loading...</div>
            ) : status === ResponseStatus.Failed ? (
                <div>failed to load</div>
            ) : null}
        </div>
    );
};
