import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface IResponse extends mongoose.Document {
    time: Date;
    type: string;
    raw?: string;
    data: any;
    feedback: {};
    followUps: Array<{
        time: Date;
        query?: string;

        id: string;
        question: string;
        answer?: string;
        response?: any;
        raw?: string;

        feedback?: {
            rating: number;
            reason: string;
            time: Date;
        };

        finished: boolean;
    }>;
    analysis: {
        time: Date;
        admin: string;
        likertScales: {
            relevance: number;
            correctness: number;
            helpfulness: number;
            directness: number;
        };
        notes: string;
        analyzed: boolean;
    };
    finished: boolean;
    tags: Array<string>;
}

export const ResponseSchema = new Schema({
    type: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now,
    },
    data: {
        type: JSON,
        default: {},
    },
    feedback: {
        type: JSON,
        default: {},
    },
    followUps: {
        type: Array,
        default: [],
    },
    analysis: {
        type: JSON,
        default: {},
    },
    finished: {
        type: Boolean,
        default: false,
    },
    tags: {
        type: Array,
        default: [],
    },
});

export const ResponseModel = mongoose.model<IResponse>(
    "Response",
    ResponseSchema
);
