import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface IResponse extends mongoose.Document {
    time: Date;
    type: string;
    data: {};
    feedback: {};
    followUps: Array<{
        time: Date;
        query: string;
        id: string;
        question: string;
        answer: string;
        feedback?: {
            rating: number;
            reason: string;
            time: Date;
        };
    }>;
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
});

export const ResponseModel = mongoose.model<IResponse>(
    "Response",
    ResponseSchema
);
