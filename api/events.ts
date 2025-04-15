import apiConfig from "../config/apiConfig";

const getEvents = (page: number, limit: number, keyword: string) => {
  let apiUrl = `/event?page=${page}&limit=${limit}`;
  if (keyword) {
    apiUrl += `&keyword=${keyword}`;
  }
  return apiConfig.get(apiUrl);
}

const deleteEvent = (articleId: string) =>
  apiConfig.delete(`/event/${articleId}`);

const getEventDetails = (articleId: string) =>
  apiConfig.get(`/event/${articleId}`);

const updateEventDetails = (articleId: string, body: any) =>
  apiConfig.patch(`/event/${articleId}`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });

export default {
  getEvents,
  deleteEvent,
  getEventDetails,
  updateEventDetails,
};
