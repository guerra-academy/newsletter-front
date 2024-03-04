// src/asgardeoConfig.ts
import { AuthClientConfig } from "@asgardeo/auth-react";

export const asgardeoConfig: AuthClientConfig = {
    signInRedirectURL: "http://localhost:5173",
    signOutRedirectURL: "http://localhost:5173/logout",
    clientID: "iNmJDIyR1NgNjZWXJn10ZjBnij8a",
    baseUrl: "https://api.asgardeo.io/t/guerraacademy",
    scope: ["openid", "profile"]
};
