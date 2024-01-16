"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import image1 from "../public/images/image-1.jpeg";
import image2 from "../public/images/image-2.jpeg";
import image3 from "../public/images/image-3.jpeg";
import cross from "../public/images/cross.svg";

const UserChip = ({ user, onRemove, style }) => {
  return (
    <div
      className={`flex items-center bg-gray-500 p-1 rounded-full mr-3 gap-x-2`}
      style={{ ...style }}
    >
      <Image
        src={user.image}
        alt={user.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <span>{user.name}</span>
      <Image
        src={cross}
        alt="Remove user"
        className="w-4 h-4 cursor-pointer text-white"
        onClick={() => onRemove(user)}
      />
    </div>
  );
};

const Home = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", image: image1, email: "john@example.com" },
    { id: 2, name: "Jane Doe", image: image2, email: "jane@example.com" },
    { id: 3, name: "Bob Smith", image: image3, email: "bob@email.com" },
  ]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isBackspacePressed, setIsBackspacePressed] = useState(false);
  const [highlightedChip, setHighlightedChip] = useState(null);

  const handleUserClick = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setUsers(users.filter((u) => u.id !== user.id));
  };

  const handleRemoveUser = (userToRemove) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user.id !== userToRemove.id)
    );
    setUsers([...users, userToRemove]);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  useEffect(() => {
    const handleBackspace = (event) => {
      if (
        event.key === "Backspace" &&
        selectedUsers.length > 0 &&
        !isBackspacePressed
      ) {
        const lastSelectedUser = selectedUsers[selectedUsers.length - 1];
        setIsBackspacePressed(true);
        setHighlightedChip(lastSelectedUser.id);
      } else if (
        event.key === "Backspace" &&
        selectedUsers.length > 0 &&
        isBackspacePressed
      ) {
        const lastSelectedUser = selectedUsers[selectedUsers.length - 1];
        handleRemoveUser(lastSelectedUser);
        setIsBackspacePressed(false);
        setHighlightedChip(null);
      }
    };

    window.addEventListener("keydown", handleBackspace);

    return () => {
      window.removeEventListener("keydown", handleBackspace);
    };
  }, [selectedUsers, isBackspacePressed]);

  return (
    <div
      className="p-10 relative flex flex-col items-center justify-center h-full"
      onClick={() => {
        setIsInputFocused(false);
      }}
    >
      <h1 className="text-5xl font-medium">Pick Users</h1>
      <div className="flex items-center justify-start w-3/4 mt-20">
        <div className="flex pb-2 flex-wrap gap-y-2">
          {selectedUsers.map((user) => (
            <UserChip
              key={user.id}
              user={user}
              onRemove={handleRemoveUser}
              style={{
                border:
                  user.id === highlightedChip
                    ? "1px solid red"
                    : "1px solid transparent",
              }}
            />
          ))}
        </div>
        <input
          className="appearance-none bg-transparent text-gray-700 pb-2 leading-tight focus:outline-none w-fit text-start"
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setIsInputFocused(true)}
          onClick={(e) => {
            e.stopPropagation();
          }}
        ></input>
      </div>
      <hr className="border-2 border-blue-500 w-3/4" />

      {isInputFocused && (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className=""
        >
          <div className="bg-white text-black max-h-60 overflow-y-scroll z-10 absolute left-72 right-0 w-[25vw]">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-start p-3 gap-x-2 z-10 cursor-pointer"
                onClick={() => handleUserClick(user)}
              >
                <Image
                  src={user.image}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <p className="text-xl font-medium">{user.name}</p>
                <p className="text-lg text-gray-500">{user.email}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
