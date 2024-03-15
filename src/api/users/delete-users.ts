import { apiUrl } from "./constants.ts";
import { performRequestWithRetry } from "./retry.ts";


export async function deleteUsers(id: string) {
 const options = {
    method: 'DELETE',
  };

  const response = await performRequestWithRetry(`${apiUrl}/?id=${id}`, options);
  return response;
}