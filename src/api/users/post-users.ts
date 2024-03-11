import { apiUrl } from "./constants";
import { User } from "./types/user";
import { performRequestWithRetry } from "../retry";

export async function postUser(payload?: User) {

  const options = {
    method: 'POST',
    data: payload,
  };

  const response = await performRequestWithRetry(`${apiUrl}/users`, options);
  return response;
}
