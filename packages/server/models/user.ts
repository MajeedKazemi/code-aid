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
    canUseToolbox: boolean;
    refreshToken: Array<{ refreshToken: string }>;
    generating: boolean;
}

export const getUserData = (user: IUser) => {
    return {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        responses: user.responses,
        canUseToolbox: user.canUseToolbox,
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
        enum: ["admin", "user", "student"],
        default: "user",
    },
    responses: [ResponseSchema],
    canUseToolbox: {
        type: Boolean,
        default: true,
    },
    refreshToken: {
        type: [Session],
    },
    generating: {
        type: Boolean,
        default: false,
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
