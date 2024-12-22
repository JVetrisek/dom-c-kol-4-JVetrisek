import React from 'react';
import './shoppingListCard.css'; // Import CSS stylů pro komponentu
import { useUser } from '../../context/userContext';
import { useShoppingList } from '../../context/shoppingListProvider';
import { useNavigate } from 'react-router-dom';

const ShoppingListCard = ({ shoppingList }) => {
    const { selectedUser } = useUser();
    const { findUserById } = useUser();
    const owner = findUserById(shoppingList.ownerId);
    const members = shoppingList.membersIds;

    const { deleteList } = useShoppingList();
    const navigate = useNavigate();

    const handleDelete = (event) => {
        event.preventDefault(); // Zamezí propagaci události, což zabrání kliknutí na odkaz
        if (window.confirm('Are you sure you want to delete this shopping list?')) {
            deleteList(shoppingList.id); // Zavolá funkci deleteList pro smazání
            navigate('/'); // Přesměrování na hlavní stránku s přehledem seznamů
        }
    };

    return (
        <div className="shopping-list-card">
            <div className='title-flex'>
                <h2 className="shopping-list-title">{shoppingList.title}</h2>
                {shoppingList.archive === true && (
                    <div className='archive-node'>Archived</div>
                )}
            </div>
            <h4 className="shopping-list-owner">Owner: {owner.name}</h4>
            <h5 className="shopping-list-members">Members:</h5>
            <div className="card-bottom-flex">
                <ul className="members-list">
                    {members.map(memberId => {
                        const member = findUserById(memberId);
                        return (
                            <li key={memberId}>
                                {member ? member.name : 'Unknown Member'}
                            </li>
                        );
                    })}
                </ul>
                {selectedUser && selectedUser.id === shoppingList.ownerId && (
                    <button onClick={handleDelete} className="delete-button">
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default ShoppingListCard;
