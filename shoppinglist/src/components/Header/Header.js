import React, { useState } from 'react';
import { useUser } from '../../context/userContext'; // Ujistěte se, že cesta je správná
import './header.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { users, selectedUser, setSelectedUser } = useUser();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const navigate = useNavigate(); // Inicializujeme useNavigate

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setIsUserMenuOpen(false);
        navigate('/'); // Přesměrování na původní routu po změně uživatele
    };

    const handleLogoClick = () => {
        navigate('/'); // Přesměrování na ShoppingListsView
    };

    console.log("Selected User: ", selectedUser);
    console.log("Users: ", users);

    return (
        <header className="header">
            <button className="logo-button" onClick={handleLogoClick}>The Shoppinglist</button>
            <div className="user-section">
                <button onClick={toggleUserMenu} className="user-button">
                    <i className="fa-regular fa-user icon" style={{ color: '#006cd9' }}></i>
                    <span className="user-text">
                        {selectedUser ? selectedUser.name : 'User'}
                    </span>
                </button>
                {isUserMenuOpen && (
                    <div className="user-menu">
                        <ul>
                            {users.filter(user => user.id !== (selectedUser ? selectedUser.id : null)).map((user) => (
                                <li key={user.id} onClick={() => handleUserSelect(user)}>
                                    {user.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
