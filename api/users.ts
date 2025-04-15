import apiConfig from "../config/apiConfig";

const getUsersList = (page: number, limit: number, keyword: string) => {
  let apiUrl = `/users?page=${page}&limit=${limit}`;
  if (keyword) {
    apiUrl += `&keyword=${keyword}`;
  }
  return apiConfig.get(apiUrl);
};

const deleteUser = (userId: string) =>
  apiConfig.delete(`/users/${userId}`);

const getUserDetails = (userId: string) =>
  apiConfig.get(`users/${userId}`);

export default {
  getUsersList,
  deleteUser,
  getUserDetails,
};
