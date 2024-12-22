import React, { useState } from 'react';
import { useShoppingList } from '../../context/shoppingListProvider';
import { useUser } from '../../context/userContext';
import { useNavigate } from 'react-router-dom'; // Import pro přesměrování
import '../ShoppingListCreateButton/shoppingListCreateButton.css';

const ShoppingListCreateButton = () => {
    const { selectedUser } = useUser();
    const { create } = useShoppingList();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');
    const navigate = useNavigate(); // Hook pro přesměrování

    const handleCreateList = () => {
        if (!newListTitle.trim()) {
            alert('Shopping list title cannot be empty.');
            return;
        }
        if (selectedUser) {
            create(newListTitle, selectedUser.id); // Vytvoření nového seznamu
            setNewListTitle('');
            setIsModalOpen(false); // Zavření modálního okna
            navigate('/'); // Přesměrování na hlavní stránku po vytvoření
        }
    };

    if (!selectedUser) return null; // Nezobrazovat komponentu, pokud není vybrán uživatel

    return (
        <div className="shopping-list-create">
            <button 
                className="add-shoppinglist-button" 
                onClick={() => setIsModalOpen(true)}
            >
                Add New Shopping List
            </button>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Create New Shopping List</h3>
                        <input
                            type="text"
                            placeholder="Enter list title"
                            value={newListTitle}
                            onChange={(e) => setNewListTitle(e.target.value)}
                            className="modal-input"
                        />
                        <div className="modal-buttons">
                            <button 
                                className="cancel-button" 
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="create-button" 
                                onClick={handleCreateList}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShoppingListCreateButton;
