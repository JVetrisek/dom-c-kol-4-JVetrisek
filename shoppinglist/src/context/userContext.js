import React, { createContext, useContext, useState } from 'react';

// Vytvoření UserContext
const UserContext = createContext();

// Exportování vlastního hooku pro použití kontextu
export const useUser = () => {
    return useContext(UserContext);
};

// Vytvoření UserProvider komponenty
export const UserProvider = ({ children }) => {
    // Testovací data pro uživatele
    const [users] = useState([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
    ]);
    
    const [selectedUser, setSelectedUser,] = useState(null); // Stav pro vybraného uživatele

    const findUserById = (id) => {
        return users.find(user => user.id === id) || null;
    };

    return (
        <UserContext.Provider value={{ users, selectedUser, setSelectedUser, findUserById }}>
            {children}
        </UserContext.Provider>
    );
};
