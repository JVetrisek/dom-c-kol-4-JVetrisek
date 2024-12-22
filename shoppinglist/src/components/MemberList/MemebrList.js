import React from 'react';
import './memberList.css'; // Import CSS stylů pro komponentu
import { useUser } from '../../context/userContext';
import { useShoppingList } from '../../context/shoppingListProvider'; // Importujeme useShoppingList

const MemberList = ({ shoppingList }) => {
    const { findUserById } = useUser();
    const { removeMemberFromList } = useShoppingList(); // Získání funkce pro odstranění člena
    const members = shoppingList.membersIds;

    const handleRemoveMember = (memberId) => {
        if (window.confirm("Are you sure you want to remove this member?")) {
            removeMemberFromList(shoppingList.id, memberId); // Volání funkce pro odstranění člena
        }
    };

    return (
        <div className="">
            <h2>Members list</h2>
            <ul className="members-list">
                {members.map(memberId => {
                    const member = findUserById(memberId);
                    return (
                        <li key={memberId}>
                            {member ? member.name : 'Unknown Member'}
                            <i
                                className="fa-solid fa-trash"
                                style={{ color: '#577bbf', cursor: 'pointer' }} // Přidání kurzoru pro lepší uživatelskou zkušenost
                                onClick={() => handleRemoveMember(memberId)} // Volání funkce s ID člena
                            ></i>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default MemberList;
