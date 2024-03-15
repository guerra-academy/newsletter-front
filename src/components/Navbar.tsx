import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => (
  <nav className="bg-white py-2 shadow-md">
    <div className="container px-4 mx-auto md:flex md:items-center justify-between">
      <Link to="/" className="font-bold text-xl text-[#36d1dc]">
        {user?.org_name || "Home"}
      </Link>
      <div>
        <Link to="/users" className="text-blue-500 hover:text-blue-700">
          User List
        </Link>
        <Link to="/newsletter-create" className="text-blue-500 hover:text-blue-700">
          Create Newsletter
        </Link>
        <button onClick={onLogout} className="text-red-500 hover:text-red-700">
          Logout
        </button>
      </div>
    </div>
  </nav>
);

export default Navbar;
