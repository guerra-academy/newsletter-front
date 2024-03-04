import React from 'react';
import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import { dataProvider } from "./dataProvider";
import { useAuthContext } from "@asgardeo/auth-react";
import LoginBox from './LoginBox'; // Certifique-se de que o caminho está correto


const App: React.FC = () => {
  //const { signIn, state: { isAuthenticated } } = useAuthContext();
  const { state } = useAuthContext();

  if (!state.isAuthenticated) {
    return <LoginBox />;;
  }

  return (
    <Admin dataProvider={dataProvider}>
      <Resource
      name="usuarios"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
    />
    <Resource
      name="courses"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
    />
    </Admin>
  );
};
export default App;
