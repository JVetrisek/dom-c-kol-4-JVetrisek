import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/userContext';
import { useShoppingList } from '../../context/shoppingListProvider';
import ShoppingListCard from '../ShoppingListCard/ShoppingListCard';
import ShoppingListCreate from '../ShoppingListCreateButton/ShoppingListCreateButton';
import './shoppingListsView.css';

const ShoppingListOverview = () => {
    const { selectedUser } = useUser();
    const { isLoading, listByUser } = useShoppingList(); // Přidáme isLoading
    const [shoppingLists, setShoppingLists] = useState([]);
    const [showArchived, setShowArchived] = useState(false);

    const filterShoppingLists = (lists, userId) => {
        return lists.filter((list) => {
            if (list.ownerId === userId) {
                return true;
            }

            if (list.membersIds.includes(userId)) {
                return !list.archive || showArchived;
            }

            return false;
        });
    };

    const toggleArchived = () => {
        setShowArchived(!showArchived);
    };

    useEffect(() => {
        if (selectedUser) {
            const lists = listByUser(selectedUser.id, showArchived);
            setShoppingLists(lists);
        } else {
            setShoppingLists([]);
        }
    }, [selectedUser, showArchived, listByUser]);

    if (isLoading) {
        return <div className="loading">Načítám data...</div>; // Načítací komponenta
    }

    return (
        <div className='shoppingListsTable'>
            {selectedUser && (
                <label>
                    <input
                        type="checkbox"
                        checked={showArchived}
                        onChange={() => setShowArchived(!showArchived)}
                    />
                    Show Archived
                </label>
            )}

            <div className='shoppinglist-gird'>
                {selectedUser ? (
                    shoppingLists.length > 0 ? shoppingLists.map(list => (
                        <div key={list.id}>
                            <Link to={`/shopping-list/${list.id}`}>
                                <ShoppingListCard shoppingList={list} />
                            </Link>
                        </div>
                    )) : (
                        <p>Žádné nákupní seznamy nenalezeny pro tohoto uživatele.</p>
                    )
                ) : (
                    <p>Žádný uživatel není vybrán.</p>
                )}
            </div>
            <ShoppingListCreate />
        </div>
    );
};

export default ShoppingListOverview;