const tokenKey = "authToken"

const storeAuthToken = (tokens) => {
    if (typeof window !== "undefined") {
        window.localStorage.setItem(tokenKey, JSON.stringify(tokens));
    }
};

const getAuthToken = () => {
    if (typeof window !== "undefined") {
        return JSON.parse(window.localStorage.getItem(tokenKey));
    }
};

const removeAuthToken = () => {
    if (typeof window !== "undefined") {
        window.localStorage.removeItem(tokenKey);
    }
};

module.exports = { storeAuthToken, getAuthToken, removeAuthToken };