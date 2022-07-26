import axios from "axios";

export const http = axios.create({
    baseURL: 
       import.meta.env.DEV ?
       import.meta.env.VITE_PROJECT_APP_URL 
      :
      `${window.location.protocol}//${window.location.hostname}/api/v1`,
    
    headers: { 
      authorization: "Bearer",
      "Content-Type": "application/json"
    }
});

http.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.log('in window location origin error --> ', error.response)

    return Promise.reject(error);
  }
);


