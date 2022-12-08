const VITE_DEV_API_URL = import.meta.env.VITE_DEV_API_URL;
const VITE_PROD_API_URL = import.meta.env.VITE_PROD_API_URL;

if (VITE_DEV_API_URL === undefined) {
    throw Error("VITE_DEV_API_URL not set in .env");
}

if (VITE_PROD_API_URL === undefined) {
    throw Error("PROD_API_URL not set in .env");
}

export default {
    API_URL: import.meta.env.DEV ? VITE_DEV_API_URL : VITE_PROD_API_URL,
};
