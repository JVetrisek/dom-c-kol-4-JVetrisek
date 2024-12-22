import React, { createContext, useContext, useState } from 'react';

// Vytvoření kontextu
const UserContext = createContext();

// Poskytovatel uživatelů
export const UserProvider = ({ children }) => {
    const [users] = useState([
        { id: 1, name: 'Martin' },
        { id: 2, name: 'Pavel' },
        { id: 3, name: 'Hanka' }
    ]);
    const [selectedUser, setSelectedUser] = useState(null); // Stav pro vybraného uživatele

    // Funkce pro výběr uživatele
    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };

    return (
        <UserContext.Provider value={{ users, selectedUser, handleUserSelect }}>
            {children}
        </UserContext.Provider>
    );
};

// Vlastní hook pro používání UserContextu
export const useUser = () => {
    return useContext(UserContext);
};
