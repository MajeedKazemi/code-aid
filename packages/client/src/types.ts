export interface IUser {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface IContext {
    token: string | null;
    user: IUser | null;
}
