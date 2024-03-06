import { fetchUtils } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

// Função para obter o access token do Session Storage
const getAccessToken = (): string | null => {
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith("session_data-instance")) {
      const sessionData = sessionStorage.getItem(key);
      if (sessionData) {
        const parsedData = JSON.parse(sessionData);
        return parsedData.access_token; // Ou ajuste conforme a sua estrutura de dados
      }
    }
  }
  return null;
};

// HttpClient personalizado que adiciona o token JWT nas requisições
const httpClient = async (url: string, options: any = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  
  const token = getAccessToken();
  if (token) {
    options.headers.set('Authorization', `Bearer ${token}`);
  }
  
  return fetchUtils.fetchJson(url, options);
};

// Cria o dataProvider utilizando o jsonServerProvider como base e o httpClient personalizado
const dataProvider = jsonServerProvider('/choreo-apis/dhxo/newsback/users-5cb/v1.0', httpClient);

export default dataProvider;
