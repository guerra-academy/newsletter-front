import axios, { AxiosRequestConfig } from 'axios';


export const performRequestWithRetry = async (url: string, options: AxiosRequestConfig<any> | undefined) => {

  try {
    const response = await axios(url, options);
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        await axios.post('/auth/refresh');
        const retryResponse = await axios(url, options);
        return retryResponse;
      } catch (refreshError) {
        if (refreshError.response && refreshError.response.status === 401) {
          console.log('Failed to refresh token. Status: ' + refreshError.response.status);
          window.location.href = '/auth/login';
        } else {
          throw error;
        }
      }
    } else {
      throw error;
    }
  }
};
