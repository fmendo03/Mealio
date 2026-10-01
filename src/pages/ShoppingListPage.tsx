import React, { useState } from 'react';
import type { ShoppingItem, ShoppingCategory } from '../types';
import '../styles/ShoppingListPage.css';

interface Props {
  shoppingList: ShoppingItem[];
  onShoppingListChange: (items: ShoppingItem[]) => void;
}

const CATEGORIES: ShoppingCategory[] = ['proteins', 'carbs', 'sides', 'veggies', 'other'];
const CATEGORY_LABELS: Record<ShoppingCategory, string> = {
  proteins: 'Proteins',
  carbs: 'Carbs',
  sides: 'Sides',
  veggies: 'Veggies',
  other: 'Non-Ingredients',
};

export const ShoppingListPage: React.FC<Props> = ({
  shoppingList,
  onShoppingListChange,
}) => {
  const [newItem, setNewItem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ShoppingCategory>('other');

  const handleAddItem = () => {
    if (!newItem.trim()) return;

    const item: ShoppingItem = {
      id: `item-${Date.now()}`,
      name: newItem,
      category: selectedCategory,
      checked: false,
      fromMeal: false,
    };

    onShoppingListChange([...shoppingList, item]);
    setNewItem('');
  };

  const handleToggleItem = (id: string) => {
    const updated = shoppingList.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    onShoppingListChange(updated);
  };

  const handleDeleteItem = (id: string) => {
    const updated = shoppingList.filter(item => item.id !== id);
    onShoppingListChange(updated);
  };

  const handleClearChecked = () => {
    const updated = shoppingList.filter(item => !item.checked);
    onShoppingListChange(updated);
  };

  const groupedItems = CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = shoppingList.filter(item => item.category === category);
      return acc;
    },
    {} as Record<ShoppingCategory, ShoppingItem[]>
  );

  const checkedCount = shoppingList.filter(item => item.checked).length;

  return (
    <div className="shopping-list-page">
      <div className="shopping-header">
        <h2>Shopping List</h2>
        {checkedCount > 0 && (
          <button className="btn-danger" onClick={handleClearChecked}>
            Clear {checkedCount} Checked Item{checkedCount !== 1 ? 's' : ''}
          </button>
        )}
      </div>

      <div className="add-item-section">
        <h3>Add Item</h3>
        <div className="add-form">
          <input
            type="text"
            placeholder="Item name"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as ShoppingCategory)}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
          <button onClick={handleAddItem}>Add</button>
        </div>
      </div>

      <div className="shopping-list">
        {CATEGORIES.map(category => {
          const items = groupedItems[category];
          if (items.length === 0) return null;

          return (
            <div key={category} className="category-section">
              <h3>{CATEGORY_LABELS[category]}</h3>
              <div className="items-list">
                {items.map(item => (
                  <div
                    key={item.id}
                    className={`item ${item.checked ? 'checked' : ''}`}
                  >
                    <label>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleToggleItem(item.id)}
                      />
                      <span>{item.name}</span>
                      {item.fromMeal && <span className="from-meal">from meal</span>}
                    </label>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteItem(item.id)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {shoppingList.length === 0 && (
        <div className="empty-state">
          <p>No items yet. Add ingredients from meals or create custom items.</p>
        </div>
      )}
    </div>
  );
};
