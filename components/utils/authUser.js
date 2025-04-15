const userKey = "authUser";

const storeAuthUser = (userData) => {
    if (typeof window !== "undefined") {
        window.localStorage.setItem(userKey, JSON.stringify(userData));
    }
};

const getAuthUser = () => {
    if (typeof window !== "undefined") {
        return JSON.parse(window.localStorage.getItem(userKey));
    }
};

const removeAuthUser = () => {
    if (typeof window !== "undefined") {
        window.localStorage.removeItem(userKey);
    }
};

module.exports = { storeAuthUser, getAuthUser, removeAuthUser };