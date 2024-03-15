import { AxiosResponse } from "axios";
import { apiUrl } from "./constants.ts";
import { User } from "./types/user";
import { performRequestWithRetry } from "./retry.ts";

export async function getUsers() {
 const options = {
    method: 'GET',
  };

  const response = await performRequestWithRetry(`${apiUrl}`, options);
  return response as AxiosResponse<User[]>;
}
