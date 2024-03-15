import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Navbar from "./components/Navbar";
import UserList from "./components/UserList";
import NewsletterCreate from "./components/NewsletterCreate";
import LoginBox from "./components/LoginBox";
import { getUsers } from "./api/users/get-users";
import { deleteUsers } from "./api/users/delete-users";
import { User } from "./api/users/types/user";

const App = () => {
  const [userList, setUserList] = useState<User[] | null>(null);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (Cookies.get("userinfo")) {
      const userInfoCookie = Cookies.get("userinfo");
      sessionStorage.setItem("userInfo", userInfoCookie);
      Cookies.remove('userinfo');
      const userInfo = JSON.parse(atob(userInfoCookie));
      setSignedIn(true);
      setUser(userInfo);
    } else if (sessionStorage.getItem("userInfo")) {
      const userInfo = JSON.parse(atob(sessionStorage.getItem("userInfo")!));
      setSignedIn(true);
      setUser(userInfo);
    } else {
      console.log("User is not signed in");
    }
    setIsAuthLoading(false);
  }, []);

  useEffect(() => {
    const errorCode = new URLSearchParams(window.location.search).get("code");
    const errorMessage = new URLSearchParams(window.location.search).get("message");
    if (errorCode) {
      toast.error(
        <>
          <p className="text-[16px] font-bold text-slate-800">
            Something went wrong!
          </p>
          <p className="text-[13px] text-slate-400 mt-1">
            Error Code: {errorCode}<br />
            Error Description: {errorMessage}
          </p>
        </>
      );
    }
  }, []);

  useEffect(() => {
    getUsersList();
  }, [signedIn]);

  async function getUsersList() {
    if (signedIn) {
      setIsLoading(true);
      try {
        const response = await getUsers();
        setUserList(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load users.");
      }
      setIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteUsers(id);
      getUsersList();
      toast.success("User deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user.");
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userInfo");
    setSignedIn(false);
    setUser(null);
    toast.info("You have been logged out.");
  };

  if (isAuthLoading) {
    return <div className="animate-spin h-5 w-5 text-white">.</div>;
  }

  if (!signedIn) {
    return <LoginBox />;
  }

  return (
    <Router>
      <div className="w-screen min-h-screen">
        <Navbar user={user} onLogout={handleLogout} />
        <Switch>
          <Route path="/users">
            <UserList userList={userList} handleDelete={handleDelete} />
          </Route>
          <Route path="/newsletter-create">
            <NewsletterCreate />
          </Route>
          <Route path="/">
            {/* Talvez você queira um componente de boas-vindas ou redirecionar para "/users" */}
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
