declare global {
    interface Window {
      configs: {
        signInRedirectURL: string;
        clientID: string;
        clientSecret: string;
        baseUrl: string;
      };
    }
  }
  
  export const signInRedirectURL = window?.configs?.signInRedirectURL ? window.configs.signInRedirectURL : "/";
  export const clientID = window?.configs?.clientID ? window.configs.clientID : "/";
  export const baseUrl = window?.configs?.baseUrl ? window.configs.baseUrl : "/";