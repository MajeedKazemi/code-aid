import { HintOption } from "../components/coding-assistant";

export class UseCase {
    shortDescription: string;
    longDescription: string;

    question: string | null;
    code: string | null;

    hintOption: HintOption;

    constructor(
        shortDescription: string,
        longDescription: string,
        question: string | null,
        code: string | null,
        hintOption: HintOption
    ) {
        this.shortDescription = shortDescription;
        this.longDescription = longDescription;
        this.question = question;
        this.code = code;
        this.hintOption = hintOption;
    }
}
