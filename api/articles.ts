import apiConfig from "../config/apiConfig";

const getArticles = (page: number, limit: number, keyword: string) => {
  let apiUrl = `/article?page=${page}&limit=${limit}`;
  if (keyword) {
    apiUrl += `&keyword=${keyword}`;
  }
  return apiConfig.get(apiUrl);
}

const deleteArticle = (articleId: string) =>
  apiConfig.delete(`/article/${articleId}`);

const getArticleDetails = (articleId: string) =>
  apiConfig.get(`/article/${articleId}`);

const updateArticleDetails = (articleId: string, body: any) =>
  apiConfig.patch(`/article/${articleId}`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });

export default {
  getArticles,
  deleteArticle,
  getArticleDetails,
  updateArticleDetails,
};
