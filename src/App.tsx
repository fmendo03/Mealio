import React, { useState, useEffect } from 'react';
import { IngredientsPage } from './pages/IngredientsPage';
import { WeeklyPlanPage } from './pages/WeeklyPlanPage';
import { ShoppingListPage } from './pages/ShoppingListPage';
import type { Ingredient, DayMeal, Rule, ShoppingItem, AppState } from './types';
import { INITIAL_INGREDIENTS, DEFAULT_RULES } from './data';
import { generateWeek, saveToLocalStorage, loadFromLocalStorage } from './utils';
import './App.css';

type Page = 'ingredients' | 'weekly' | 'shopping';

export const App: React.FC = () => {
  const [page, setPage] = useState<Page>('weekly');

  // Load synchronously so the save effect below never overwrites saved data with empty state
  const [initial] = useState<AppState>(() => {
    const saved = loadFromLocalStorage<AppState | null>('mealPlannerState', null);
    if (saved && saved.ingredients?.length) return saved;
    return {
      ingredients: INITIAL_INGREDIENTS,
      rules: DEFAULT_RULES,
      weeklyMeals: generateWeek(INITIAL_INGREDIENTS, DEFAULT_RULES),
      shoppingList: saved?.shoppingList ?? [],
    };
  });
  const [ingredients, setIngredients] = useState<Ingredient[]>(initial.ingredients);
  const [weeklyMeals, setWeeklyMeals] = useState<DayMeal[]>(initial.weeklyMeals);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(initial.shoppingList);
  const [rules, setRules] = useState<Rule[]>(initial.rules);

  // Save to localStorage whenever state changes
  useEffect(() => {
    const state: AppState = {
      ingredients,
      weeklyMeals,
      shoppingList,
      rules,
    };
    saveToLocalStorage('mealPlannerState', state);
  }, [ingredients, weeklyMeals, shoppingList, rules]);

  const handleAddToShoppingList = (newItems: ShoppingItem[]) => {
    const updated = [...shoppingList];
    
    newItems.forEach(newItem => {
      // Check if item already exists
      const existing = updated.find(
        item => item.name.toLowerCase() === newItem.name.toLowerCase()
      );
      
      if (!existing) {
        updated.push(newItem);
      }
    });

    setShoppingList(updated);
    setPage('shopping');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍽️ Meal Randomizer</h1>
        <nav className="navigation">
          <button
            className={`nav-btn ${page === 'ingredients' ? 'active' : ''}`}
            onClick={() => setPage('ingredients')}
          >
            Ingredients
          </button>
          <button
            className={`nav-btn ${page === 'weekly' ? 'active' : ''}`}
            onClick={() => setPage('weekly')}
          >
            Weekly Plan
          </button>
          <button
            className={`nav-btn ${page === 'shopping' ? 'active' : ''}`}
            onClick={() => setPage('shopping')}
          >
            Shopping List
          </button>
        </nav>
      </header>

      <main className="app-main">
        {page === 'ingredients' && (
          <IngredientsPage
            ingredients={ingredients}
            rules={rules}
            onIngredientsChange={setIngredients}
            onRulesChange={setRules}
          />
        )}

        {page === 'weekly' && (
          <WeeklyPlanPage
            ingredients={ingredients}
            weeklyMeals={weeklyMeals}
            rules={rules}
            onWeeklyMealsChange={setWeeklyMeals}
            onAddToShoppingList={handleAddToShoppingList}
          />
        )}

        {page === 'shopping' && (
          <ShoppingListPage
            shoppingList={shoppingList}
            onShoppingListChange={setShoppingList}
          />
        )}
      </main>
    </div>
  );
};

export default App;
