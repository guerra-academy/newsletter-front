import { apiUrl } from "./constants.ts";
import { performRequestWithRetry } from "../retry";
import { Newsletter } from "./types/newsletter";


export async function postNews(payload?: Newsletter) {
 const options = {
    method: 'POST',
    data: payload,
  };

  const response = await performRequestWithRetry(`${apiUrl}/sendNews`, options);
  return response;
}