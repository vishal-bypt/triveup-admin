import apiConfig from "../config/apiConfigAi";


const generateEvents = (body: {
    category: string;
    subCategory: string;
    contentType: string;
  }) => apiConfig.post("/generate-ai-events", body);

const generateArticles = (body: {
    category: string;
    subCategory: string;
    contentType: string;
  }) => apiConfig.post("/generate-ai-articles", body);  

  export default {
    generateEvents,
    generateArticles
  };  