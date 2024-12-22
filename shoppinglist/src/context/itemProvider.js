import React, { createContext, useContext, useState, useEffect } from 'react';

const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/items');
        if (!response.ok) {
          throw new Error('Chyba při načítání itemů');
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        setError(error);
        setItems([
          { id: 1, title: 'Bananas', shoppingListId: 1, state: false },
          { id: 2, title: 'Apples', shoppingListId: 1, state: false },
          { id: 3, title: 'Chips', shoppingListId: 2, state: false },
          { id: 4, title: 'Soda', shoppingListId: 2, state: false },
          { id: 5, title: 'Candy', shoppingListId: 3, state: false },
          { id: 6, title: 'Bread', shoppingListId: 1, state: false },
          { id: 7, title: 'Milk', shoppingListId: 1, state: false },
          { id: 8, title: 'Butter', shoppingListId: 2, state: false },
          { id: 9, title: 'Eggs', shoppingListId: 2, state: false },
          { id: 10, title: 'Coffee', shoppingListId: 3, state: false },
          { id: 11, title: 'Tea', shoppingListId: 1, state: false },
          { id: 12, title: 'Juice', shoppingListId: 1, state: false },
          { id: 13, title: 'Pasta', shoppingListId: 2, state: false },
          { id: 14, title: 'Rice', shoppingListId: 2, state: false },
          { id: 15, title: 'Chicken', shoppingListId: 3, state: false },
          { id: 16, title: 'Fish', shoppingListId: 1, state: false },
          { id: 17, title: 'Beef', shoppingListId: 1, state: false },
          { id: 18, title: 'Salad', shoppingListId: 2, state: false },
          { id: 19, title: 'Tomatoes', shoppingListId: 2, state: false },
          { id: 20, title: 'Cucumber', shoppingListId: 3, state: false },
        ]);
      } finally {
          setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const createItem = (title, shoppingListId) => {
    const newItem = {
      id: items.length ? Math.max(...items.map(item => item.id)) + 1 : 1,
      title,
      shoppingListId,
      state: false,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const getItemsByShoppingListId = (shoppingListId) => {
    return items.filter(item => item.shoppingListId === shoppingListId);
  };

  const toggleItemState = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, state: !item.state } : item
    ));
  };

  const editItem = (id, newTitle) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, title: newTitle } : item
    ));
  };

  return (
    <ItemContext.Provider value={{ items, isLoading, error, createItem, removeItem, getItemsByShoppingListId, toggleItemState, editItem }}>
      {children}
    </ItemContext.Provider>
  );
};

export const useItem = () => {
  return useContext(ItemContext);
};