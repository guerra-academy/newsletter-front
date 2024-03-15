import React, { useEffect, useState } from 'react';
import { getUsers } from '../api/users/get-users.ts';
import { deleteUsers } from '../api/users/delete-users.ts';
import { toast } from "react-toastify";
import { User } from '../api/users/types/user.tsx';

const ITEMS_PER_PAGE = 10;

const UserList = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getUsers();
      setUserList(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users.");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await deleteUsers(id);
      fetchUsers(); // Reload the list after deleting
      toast.success("User deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user.");
    }
    setIsLoading(false);
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = userList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(userList.length / ITEMS_PER_PAGE);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="user-list-container">
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Subscribed?</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nome}</td>
              <td>{user.email}</td>
              <td>{user.subscribed === 1 ? 'True' : 'False'}</td>
              <td>
                <button onClick={() => handleDelete(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
          <button
            key={pageNumber}
            onClick={() => goToPage(pageNumber)}
            disabled={currentPage === pageNumber}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserList;
