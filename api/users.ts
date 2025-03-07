import apiConfig from "../config/apiConfig";



const getWaitingListUsers = () => apiConfig.get(`/users/waiting-list`);


export default {
    getWaitingListUsers
};
