import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function AllUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3000/user/all_users');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const filteredUsers = data.filter(user => user.UserName !== 'admin');
                setUsers(filteredUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteUser = async (userID) => {
        try {
            const response = await fetch(`http://localhost:3000/user/${userID}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            Swal.fire({
                title: "Deleted!",
                text: result.message,
                icon: "success"
            });

            // Remove the deleted user from the state
            setUsers(users.filter(user => user.UserID !== userID));
        } catch (error) {
            console.error('Error deleting user:', error);
            Swal.fire({
                title: "Error!",
                text: "There was an error deleting the user.",
                icon: "error"
            });
        }
    };

    return (
        <div className="min-h-screen container mx-auto p-8 bg-gradient-to-br from-gray-100 to-gray-200">
            <h2 className="mt-16 text-5xl font-bold mb-12 text-center text-gray-800 hover:scale-105 transition-transform duration-300">
                Users List
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                    <div
                        key={user.UserID}
                        className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1 border-2 border-gray-200"
                    >
                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-2xl transform hover:scale-110 transition-transform duration-300">
                                {user.UserName.charAt(0)}
                            </div>
                            <div className="ml-6">
                                <p className="text-xl font-bold text-gray-800 hover:text-blue-500 transition-colors duration-300">
                                    {user.UserName}
                                </p>
                                <p className="text-gray-600 hover:text-gray-800 transition-colors duration-300">
                                    {user.Email}
                                </p>
                            </div>
                        </div>
                        <div className="text-gray-700 space-y-3">
                            <p className="group flex items-center transition-all duration-300 hover:pl-2">
                                <span className="font-bold text-gray-600 group-hover:text-blue-500">Age:</span>
                                <span className="ml-2 group-hover:text-gray-800">{user.Age}</span>
                            </p>
                            <p className="group flex items-center transition-all duration-300 hover:pl-2">
                                <span className="font-bold text-gray-600 group-hover:text-blue-500">Location:</span>
                                <span className="ml-2 group-hover:text-gray-800">{user.Location}</span>
                            </p>
                            <p className="group transition-all duration-300 hover:pl-2">
                                <span className="font-bold text-gray-600 group-hover:text-blue-500">Bio:</span>
                                <span className="ml-2 block mt-1 group-hover:text-gray-800">{user.Bio}</span>
                            </p>
                        </div>
                        <button
                            onClick={() => handleDeleteUser(user.UserID)}
                            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                        >
                            Delete User
                        </button>
                    </div>
                ))}
            </div>
            <button
                onClick={() => window.location.href = '/dashboard'}
                className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            >
                Back to Dashboard
            </button>
        </div>
    );
}

export default AllUsers;