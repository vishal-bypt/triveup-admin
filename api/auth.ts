import apiConfig from "../config/apiConfig";

const register = (body: {
  firstName: string;
  lastName: string;
  email: string;
  checkForMembership: boolean;
}) => apiConfig.post("/auth/join", body);

const signup = (body: {
  firstName: string;
  lastName: string;
  sex: string;
  password: string;
  confirmPassword : string;
  city: string;
  state: string;
  county: string
  country: string;
  email: string;
}) => apiConfig.post("/auth/register", body);


const login = (body: {
  email: string;
  password: string;
}) => apiConfig.post("/auth/login", body);

const forgotPassword = (body: {
  email: string;
}) => apiConfig.post("/auth/forgot-password", body);


const resetPassword = (body: {
  password: string;
}, token: any) => apiConfig.post(`/auth/reset-password?token=${token}`, body);


const countries = () => apiConfig.get("/country");

const states = (countryCode:String) => apiConfig.get(`/country/state/by/country?countryCode=${countryCode}`);

const county = (stateCode:String) => apiConfig.get(`/country/county/by/state?code=${stateCode}`);

const cities = (county:String) => apiConfig.get(`/country/cities/by/county?county=${county}`);

const logout = (body:Object) => apiConfig.post("/auth/logout", body);

export default {
  register,
  signup,
  login,
  forgotPassword,
  resetPassword,
  countries,
  states,
  county,
  cities,
  logout
};
