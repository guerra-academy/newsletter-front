import Cookies from 'js-cookie';
import React, { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { getUsers } from "./api/users/get-users";
import { User } from "./api/users/types/user";
import AddUser from "./components/modal/fragments/add-user";
import { deleteBooks } from "./api/users/delete-books";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { toast } from 'react-toastify';
import LoginBox from './components/LoginBox';

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function App() {

  const [userList, setUserList] = useState<User[] | null>(null);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    getUsersList();
  }, [signedIn]);

  async function getUsersList() {
    if (signedIn) {
      setIsLoading(true);
      getUsers()
        .then((res) => {
          setUserList(res.data); // setUsersList é o método do useState para definir a lista de usuários
          setIsLoading(false);
        })
        .catch((e) => {
          console.error(e); // Melhor usar console.error para erros
          setIsLoading(false); // Garante que o estado de loading seja atualizado mesmo em caso de erro
        });
    }
  }

  useEffect(() => {
    if (!isAddItemOpen) {
      getUsersList();
    }
  }, [isAddItemOpen]);

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    await deleteBooks(id);
    getUsersList();
    setIsLoading(false);
  };

  if (isAuthLoading) {
    return <div className="animate-spin h-5 w-5 text-white">.</div>;
  }

  if (!signedIn) {
    return <LoginBox />;
  }

  return (
    <div className="header-2 w-screen h-screen overflow-hidden">
      <nav className="bg-white py-2 md:py-2">
        <div className="container px-4 mx-auto md:flex md:items-center">
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

          <div
            className="hidden md:flex flex-col md:flex-row md:ml-auto mt-3 md:mt-0"
            id="navbar-collapse"
          >
            <button
              className="float-right bg-[#5b86e5] p-2 rounded-md text-sm my-3 font-medium text-white"
              onClick={() => {
                sessionStorage.removeItem("userInfo");
                window.location.href = `/auth/logout?session_hint=${Cookies.get('session_hint')}`;
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="py-3 md:py-6">
        <div className="container px-4 mx-auto flex justify-center">
          <div className="w-full max-w-lg px-2 py-16 sm:px-0 mb-20">
            <div className="flex justify-between">
              <p className="text-4xl text-white mb-3 font-bold">Newsletter Users</p>
              <div className="container w-auto">
                <button
                  className="float-right bg-black bg-opacity-20 p-2 rounded-md text-sm my-3 font-medium text-white h-10"
                  onClick={() => setIsAddItemOpen(true)}
                >
                  + Add New
                </button>
                <button
                  className="float-right bg-black bg-opacity-20 p-2 rounded-md text-sm my-3 font-medium text-white w-10 h-10 mr-1"
                  onClick={() => getUsersList()}
                >
                  <ArrowPathIcon />
                </button>
              </div>
            </div>
            {userList && (
              <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                  {Object.keys(userList).map((val) => (
                    <Tab
                      key={val}
                      className={({ selected }) =>
                        classNames(
                          "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                          "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                          selected
                            ? "bg-white shadow"
                            : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                        )
                      }
                    >
                      {val}
                    </Tab>
                  ))}
                </Tab.List>
                <Tab.Panels className="mt-2">
  {userList && (
    <Tab.Panel
      className={
        classNames(
          isLoading ? "animate-pulse" : "",
          "rounded-xl bg-white p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
        )
      }
    >
      <ul>
        {userList.map((user) => (
          <li key={user.id} className="relative rounded-md p-3">
            <div className="flex justify-between">
              <div>
                <h3 className="text-sm font-medium leading-5">{user.nome}</h3>
                <p className="mt-1 text-xs font-normal leading-4 text-gray-500">{user.email}</p>
                <p className="mt-1 text-xs font-normal leading-4 text-gray-500">{user.subscribed}</p>
                <p className="mt-1 text-xs font-normal leading-4 text-gray-500">{user.data_hora}</p>
                <p className="mt-1 text-xs font-normal leading-4 text-gray-500">{user.cod_rec}</p>
              </div>
              <button
                onClick={() => handleDelete(user.id.toString())} // Assegure que handleDelete pode aceitar o ID como string
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Tab.Panel>
  )}
</Tab.Panels>
              </Tab.Group>
            )}
            <AddUser isOpen={isAddItemOpen} setIsOpen={setIsAddItemOpen} />
          </div>
        </div>
      </div>
    </div>
  );
}
