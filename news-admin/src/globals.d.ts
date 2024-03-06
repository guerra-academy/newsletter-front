// src/globals.d.ts
declare global {
    interface Window {
      configs?: {
        signInRedirectURL: string;
        signOutRedirectURL: string;
        clientID: string;
        baseUrl: string;
        scope: string[];
      };
    }
  }
  
  // Isso garante que este arquivo seja tratado como um módulo.
  export {};
  