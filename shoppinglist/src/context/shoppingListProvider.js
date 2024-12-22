import React, { createContext, useContext, useState, useEffect } from 'react';

const ShoppingListContext = createContext();

export const ShoppingListProvider = ({ children }) => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Přidáme stav pro chybu

  useEffect(() => {
    const fetchShoppingLists = async () => {
      try {
        const response = await fetch('/api/shopping-lists');
        if (!response.ok) {
          throw new Error('Chyba při načítání nákupních seznamů');
        }
        const data = await response.json();
        setShoppingLists(data);
      } catch (error) {
        setError(error);
        setShoppingLists([
          {
            id: 1,
            title: 'Weekly Groceries',
            ownerId: 1,
            membersIds: [2, 3],
            archive: false,
          },
          {
            id: 2,
            title: 'Party Supplies',
            ownerId: 2,
            membersIds: [1],
            archive: false,
          },
          {
            id: 3,
            title: 'Holiday Shopping',
            ownerId: 3,
            membersIds: [1, 2],
            archive: true,
          },
        ]);
    } finally {
        setIsLoading(false);
    }
  };
    
    fetchShoppingLists();
  }, []);

    const listByOwnerId = (ownerId) => {
        return shoppingLists.filter((list) => list.ownerId === ownerId);
    };

    const listByUser = (userId, showArchived) => {
        return shoppingLists.filter((list) => {
            // Pokud je uživatel vlastník seznamu, seznam bude vždy zobrazen (i když je archivovaný)
            if (list.ownerId === userId) {
                // Pokud je vlastník a showArchived je nastaveno na true, seznam se zobrazí
                if (list.archive && !showArchived) {
                    return false;  // Nezobrazí se, pokud je archivovaný a showArchived je false
                }
                return true;  // Seznam se zobrazí, i když je archivovaný
            }
    
            // Pokud je uživatel člen seznamu
            if (list.membersIds.includes(userId)) {
                // Pokud je seznam archivovaný a uživatel je pouze člen, seznam se nezobrazí
                if (list.archive === true) {
                    return false;  // Nezobrazí se archivované seznamy pro členy
                }
                return true;  // Zobrazí se nearchivovaný seznam pro členy
            }
    
            return false;  // Pokud uživatel není vlastník ani člen, seznam se nezobrazí
        });
    };
    
    
    const detail = (id) => {
        return shoppingLists.find((list) => list.id === id);
    };

    const editListTitle = (id, newTitle) => {
        setShoppingLists((prevLists) =>
            prevLists.map((list) =>
                list.id === id ? { ...list, title: newTitle } : list
            )
        );
    };

    // Funkce pro přepnutí stavu archivace seznamu
    const toggleArchiveStatus = (id, newStatus) => {
        setShoppingLists((prevLists) =>
            prevLists.map((list) =>
                list.id === id ? { ...list, archive: newStatus } : list
            )
        );
    };

    const getListById = (id) => shoppingLists.find((list) => list.id === id);

    const create = (title, ownerId) => {
        const newId = Math.max(...shoppingLists.map((list) => list.id)) + 1;
        const newShoppingList = {
            id: newId,
            title,
            ownerId,
            membersIds: [],
            archive: false,
        };
        setShoppingLists((prevLists) => [...prevLists, newShoppingList]);
    };

    const addMemberToList = (listId, memberId) => {
        setShoppingLists((prevLists) =>
            prevLists.map((list) =>
                list.id === listId ? { ...list, membersIds: [...list.membersIds, memberId] } : list
            )
        );
    };

    const removeMemberFromList = (listId, memberId) => {
        setShoppingLists((prevLists) =>
            prevLists.map((list) =>
                list.id === listId
                    ? { ...list, membersIds: list.membersIds.filter(id => id !== memberId) }
                    : list
            )
        );
    };

    const deleteList = (id) => {
        setShoppingLists((prevLists) => prevLists.filter((list) => list.id !== id)); 
    };    

    return (
        <ShoppingListContext.Provider
            value={{
                shoppingLists,
                isLoading,
                listByOwnerId,
                listByUser,
                detail,
                editListTitle,
                toggleArchiveStatus,
                create,
                deleteList,
                getListById,
                addMemberToList,
                error,
                removeMemberFromList
            }}
        >
            {children}
        </ShoppingListContext.Provider>
    );
};

export const useShoppingList = () => useContext(ShoppingListContext);
