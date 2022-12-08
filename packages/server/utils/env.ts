import { config } from "dotenv";

config();

const dev = process.env.NODE_ENV !== "production";

const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_EXPIRY = process.env.SESSION_EXPIRY;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
const PORT_PREFIX = process.env.PORT_PREFIX;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const JWT_SECRET = process.env.SESSION_EXPIRY;
const WHITELISTED_DOMAINS = process.env.WHITELISTED_DOMAINS;
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const NODE_APP_INSTANCE = process.env.NODE_APP_INSTANCE;

if (REFRESH_TOKEN_EXPIRY === undefined) {
    throw Error("REFRESH_TOKEN_EXPIRY not set in .env");
}

if (REFRESH_TOKEN_SECRET === undefined) {
    throw Error("REFRESH_TOKEN_SECRET not set in .env");
}

if (JWT_SECRET === undefined) {
    throw Error("JWT_SECRET not set in .env");
}

if (SESSION_EXPIRY === undefined) {
    throw Error("SESSION_EXPIRY not set in .env");
}

if (MONGODB_URI === undefined) {
    throw Error("MONGODB_URI not set in .env");
}

if (PORT_PREFIX === undefined) {
    throw Error("PORT_PREFIX not set in .env");
}

if (WHITELISTED_DOMAINS === undefined) {
    throw Error("WHITELISTED_DOMAINS not set in .env");
}

if (COOKIE_SECRET === undefined) {
    throw Error("COOKIE_SECRET not set in .env");
}

if (OPENAI_API_KEY === undefined) {
    throw Error("OPENAI_API_KEY not set in .env");
}

if (NODE_APP_INSTANCE === undefined) {
    throw Error("NODE_APP_INSTANCE not set in .env");
}

export default {
    REFRESH_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET,
    JWT_SECRET,
    SESSION_EXPIRY,
    MONGODB_URI,
    WHITELISTED_DOMAINS,
    PORT_PREFIX,
    COOKIE_SECRET,
    OPENAI_API_KEY,
    dev,
    NODE_APP_INSTANCE,
};
