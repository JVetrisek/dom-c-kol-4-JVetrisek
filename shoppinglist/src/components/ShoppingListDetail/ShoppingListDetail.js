import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShoppingList } from '../../context/shoppingListProvider';
import { useItem } from '../../context/itemProvider';
import Item from '../Item/Item';
import { useUser } from '../../context/userContext';
import MemberList from '../MemberList/MemebrList';
import './shoppingListDetail.css';

const ShoppingListDetail = () => {
  const navigate = useNavigate();
  const { isLoading: isLoadingShoppingList, addMemberToList, removeMemberFromList, toggleArchiveStatus } = useShoppingList(); // Oprava: alias pro isLoading
  const { isLoading: isLoadingItems } = useItem();
  const { id } = useParams();
  const { getListById, editListTitle } = useShoppingList();
  const { getItemsByShoppingListId, createItem } = useItem();
  const { users } = useUser();
  const shoppingList = getListById(parseInt(id, 10));
  const { selectedUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(shoppingList ? shoppingList.title : '');
  const [showCompleted, setShowCompleted] = useState(true);
  const [showPending, setShowPending] = useState(true);
  const [newItemName, setNewItemName] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (shoppingList) {
      setIsDisabled(shoppingList.archive);
    }
  }, [shoppingList, isLoadingShoppingList]); // Používáme alias

  if (isLoadingShoppingList || isLoadingItems) {
    return <div className="loading">Načítám data...</div>;
  }

  if (!shoppingList) {
    return <p>Shopping list not found.</p>;
  }
    

    const handleSaveTitle = () => {
        if (shoppingList) {
            editListTitle(shoppingList.id, newTitle);
            setIsEditing(false);
        }
    };

    const handleAddMember = (memberId) => {
        if (shoppingList.membersIds.includes(memberId)) {
            alert('Member already exists in the shopping list.');
            return;
        }

        const selectedMember = users.find(user => user.id === memberId);
        if (selectedMember) {
            addMemberToList(shoppingList.id, memberId);
        } else {
            alert('Attempting to add a non-existent member.');
        }
    };

    const handleRemoveMember = (memberId) => {
        if (window.confirm("Are you sure you want to remove this member?")) {
            removeMemberFromList(shoppingList.id, memberId);
            navigate('/');
        }
    };

    const handleAddItem = () => {
        if (newItemName.trim() === '') {
            alert('Item name cannot be empty.');
            return;
        }
        createItem(newItemName, shoppingList.id);
        setNewItemName('');
    };

    const handleToggleArchive = () => {
        toggleArchiveStatus(shoppingList.id, !shoppingList.archive);
    };

    if (!shoppingList) {
        return <p>Shopping list not found.</p>;
    }

    const items = getItemsByShoppingListId(shoppingList.id);
    const filteredItems = items.filter(item => {
        if (item.state === true && showCompleted) return true;
        if (item.state === false && showPending) return true;
        return false;
    });

    const existingMemberIds = shoppingList.membersIds || [];
    const ownerId = shoppingList.ownerId;
    const availableMembers = users.filter(user => 
        !existingMemberIds.includes(user.id) && user.id !== ownerId
    );

    return (
        <div className={`shopping-list-detail ${isDisabled ? 'disabled' : ''}`}>
            <div className='shopping-list-header'>
                <div>
                    <h3 className='shopping-list-title'>
                        {isEditing ? (
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onBlur={handleSaveTitle}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveTitle();
                                }}
                                autoFocus
                            />
                        ) : (
                            <>
                                {shoppingList.title}
                                {selectedUser && selectedUser.id === shoppingList.ownerId && (
                                    <button 
                                        className="edit-button" 
                                        onClick={() => {
                                            setNewTitle(shoppingList.title);
                                            setIsEditing(true);
                                        }} 
                                    >
                                        <i className="fa-regular fa-pen-to-square" style={{ color: '#577bbf' }}></i>
                                    </button>
                                )}
                            </>
                        )}
                    </h3>

                    <div className="filter-options">
                        <label>
                            <input 
                                type="checkbox" 
                                checked={showCompleted} 
                                onChange={() => setShowCompleted(!showCompleted)} 
                            />
                            Show Completed
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={showPending} 
                                onChange={() => setShowPending(!showPending)} 
                            />
                            Show Pending
                        </label>
                    </div>
                </div>

                {selectedUser && selectedUser.id === shoppingList.ownerId && (
                    <button 
                        className={`archive-button ${shoppingList.archive ? 'active' : ''}`} 
                        onClick={handleToggleArchive}
                    >
                        <i className="fa-solid fa-archive" />
                        {shoppingList.archive ? 'Unarchive' : 'Archive'}
                    </button>
                )}
                
                <div className="add-item-form">
                    <input
                        type="text"
                        placeholder="Add a new item"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="new-item-input"
                    />
                    <button 
                        onClick={handleAddItem}
                        className="add-item-button"
                    >
                        Add Item
                    </button>
                </div>
            </div>

            <hr className='border-line' />
            <div className="item-list">
                {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                        <Item key={item.id} item={item} />
                    ))
                ) : (
                    <p>No items found in this shopping list.</p>
                )}
            </div>

            {selectedUser && selectedUser.id === shoppingList.ownerId && (
                <>
                    <MemberList shoppingList={shoppingList} />

                    <h3>Add Member</h3>
                    <div className="available-members">
                        {availableMembers.length > 0 ? (
                            availableMembers.map(member => (
                                <button 
                                    key={member.id} 
                                    className="add-member-button" 
                                    onClick={() => handleAddMember(member.id)}
                                >
                                    <i className="fa-solid fa-user-plus" style={{ color: '#577bbf' }}></i>
                                    {member.name}
                                </button>
                            ))
                        ) : (
                            <p>All users are already members.</p>
                        )}
                    </div>
                </>
            )}

            {selectedUser && selectedUser.id !== shoppingList.ownerId && (
                <i className="fa-solid fa-person-walking-arrow-right" style={{ color: '#577bbf' }}
                onClick={() => handleRemoveMember(selectedUser.id)}>Leave ShoppingList</i>
            )}
        </div>
    );
};

export default ShoppingListDetail;
