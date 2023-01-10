import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

import { IResponse, ResponseSchema } from "./response";

const Schema = mongoose.Schema;

const Session = new Schema({
    refreshToken: {
        type: String,
        default: "",
    },
});

export interface IUser extends mongoose.Document {
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    responses: Array<IResponse>;
    refreshToken: Array<{ refreshToken: string }>;
}

export const getUserData = (user: IUser) => {
    return {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        responses: user.responses,
    };
};

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        default: "",
    },
    lastName: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    responses: [ResponseSchema],
    refreshToken: {
        type: [Session],
    },
});

UserSchema.set("toJSON", {
    transform: (doc, ret, options) => {
        // remove refreshToken from the response
        delete ret.refreshToken;

        return ret;
    },
});

UserSchema.plugin(passportLocalMongoose);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
