import apiConfig from "../config/apiConfig";

const getCategoryList = () => 
    apiConfig.get(`/category`);

export default {
    getCategoryList,
};