// App.js
import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.tsx';
import UserList from './components/Users.tsx';
import News from './components/Newsletter.tsx';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css'; // Importa o CSS
import 'react-quill/dist/quill.snow.css'; // ou quill.bubble.css para um estilo diferente
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material'; // Importações adicionadas
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

function App() {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    if (Cookies.get('userinfo')) {
      // We are here after a login
      const userInfoCookie = Cookies.get('userinfo')
      sessionStorage.setItem("userInfo", userInfoCookie);
      Cookies.remove('userinfo');
      var userInfo = JSON.parse(atob(userInfoCookie));
      setSignedIn(true);
      setUser(userInfo);
    } else if (sessionStorage.getItem("userInfo")) {
      // We have already logged in
      var userInfo = JSON.parse(atob(sessionStorage.getItem("userInfo")!));
      setSignedIn(true);
      setUser(userInfo);
    } else {
      console.log("User is not signed in");
    }
    setIsAuthLoading(false);
  }, []);

  useEffect(() => {
    // Handle errors from Managed Authentication
    const errorCode = new URLSearchParams(window.location.search).get('code');
    const errorMessage = new URLSearchParams(window.location.search).get('message');
    if (errorCode) {
      toast.error(<>
        <p className="text-[16px] font-bold text-slate-800">Something went wrong !</p>
        <p className="text-[13px] text-slate-400 mt-1">Error Code : {errorCode}<br />Error Description: {errorMessage}</p>
      </>);    
    }
  }, []);

  if (isAuthLoading) {
    return <div className="animate-spin h-5 w-5 text-white">.</div>;
  }

  if (!signedIn) {
    return (
      <button
        className="float-right bg-black bg-opacity-20 p-2 rounded-md text-sm my-3 font-medium text-white"
        onClick={() => { window.location.href = "/auth/login" }}
      >
        Login
      </button>
    );
  }

  return (
    <Router>
      <CssBaseline />
      <div className="container">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="content">
          <AppBar position="static" className="header">
            <Toolbar>
              {/* Adicione sua logo aqui */}
              <img src="/images/logo.png" alt="Logo da Sua Empresa" className="logo" />

              {/* Título da aplicação */}
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Guerra Academy - Newsletter
              </Typography>

              <div className="flex justify-between items-center">
                {user && (
                  <a href="#" className="font-bold text-xl text-[#36d1dc]">
                    {user?.org_name}
                  </a>
                )}
                <button
                  className="border border-solid border-gray-600 px-3 py-1 rounded text-gray-600 opacity-50 hover:opacity-75 md:hidden"
                  id="navbar-toggle"
                >
                  <i className="fas fa-bars"></i>
                </button>
              </div>
              
              {/* Botão de logout */}
              <IconButton color="inherit" 
              onClick={() => {
                sessionStorage.removeItem("userInfo");
                window.location.href = `/auth/logout?session_hint=${Cookies.get('session_hint')}`;
              }}>
                <img src="/images/logout.png" alt="Logout" className="logout-icon" />
              </IconButton>
            </Toolbar>
          </AppBar>
          <div className="main-content">
            <Routes>
              <Route path="/users" element={<UserList />} />
              <Route path="newsletter" element={<News />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
