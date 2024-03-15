import React, { useEffect, useState } from 'react';
import { getUsers} from '../api/users/get-users';
import { deleteUsers } from '../api/users/delete-users';
import { User } from '../api/users/types/user';
import { toast } from "react-toastify";

const UserList = () => {
  const [userList, setUserList] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteUsers(id);
      fetchUsers(); // Recarrega a lista após deletar
      toast.success("User deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="user-list-container bg-white">
      {userList && userList.map((user) => (
        <div key={user.id} className="user-item flex justify-between p-3 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-medium">{user.name}</h3>
            <p className="text-xs text-gray-500">{user.email}</p>
            {/* Outros detalhes do usuário */}
          </div>
          <button
            onClick={() => handleDelete(user.id.toString())}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserList;
