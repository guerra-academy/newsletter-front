import { apiUrl } from "./constants";
import { performRequestWithRetry } from "../retry";


export async function deleteUsers(id: string) {
 const options = {
    method: 'DELETE',
  };

  const response = await performRequestWithRetry(`${apiUrl}/${id}`, options);
  return response;
}
