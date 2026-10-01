import React, { useEffect, useRef, useState } from 'react';
import type { Ingredient, DayMeal, Rule, Category, ShoppingItem } from '../types';
import {
  generateWeek,
  regenerateSingleDay,
  regenerateSingleComponent,
  regenerateCookingMethod,
  applyLeftovers,
  getShoppingListFromWeek,
} from '../utils';
import '../styles/WeeklyPlanPage.css';

interface Props {
  ingredients: Ingredient[];
  weeklyMeals: DayMeal[];
  rules: Rule[];
  onWeeklyMealsChange: (meals: DayMeal[]) => void;
  onAddToShoppingList: (items: ShoppingItem[]) => void;
}

// Layout is designed at this width and scaled down uniformly to fit the window
const DESIGN_WIDTH = 900;
const BOTTOM_MARGIN = 40;
const MIN_HEIGHT_FIT_RATIO = 0.6;

export const WeeklyPlanPage: React.FC<Props> = ({
  ingredients,
  weeklyMeals,
  rules,
  onWeeklyMealsChange,
  onAddToShoppingList,
}) => {
  // Leftover days copy the last cook-fresh day, so edits must go to that day
  const sourceDay = (dayIndex: number) => {
    for (let j = dayIndex; j >= 0; j--) if (weeklyMeals[j].cookFresh) return j;
    return dayIndex;
  };

  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ scale: 1, width: DESIGN_WIDTH, offset: 0, height: 0 });

  // Scale the whole page uniformly so it fits the window with no scrolling
  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    const update = () => {
      const availW = wrap.clientWidth;
      const innerW = Math.max(DESIGN_WIDTH, availW);
      inner.style.width = `${innerW}px`;
      const naturalH = inner.offsetHeight;
      const top = wrap.getBoundingClientRect().top + window.scrollY;
      const availH = window.innerHeight - top - BOTTOM_MARGIN;
      const widthFit = Math.min(1, availW / innerW);
      const heightFit = availH / naturalH;
      // On short screens (e.g. phone sideways) fitting the height would be
      // microscopic, so fill the width instead and let the page scroll.
      const scale = heightFit < widthFit * MIN_HEIGHT_FIT_RATIO ? widthFit : Math.min(widthFit, heightFit);
      setFit({
        scale,
        width: innerW,
        offset: (availW - innerW * scale) / 2,
        height: naturalH * scale,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrap);
    ro.observe(inner);
    window.addEventListener('resize', update);
    // Safari can report stale sizes right after rotating
    const onRotate = () => setTimeout(update, 250);
    window.addEventListener('orientationchange', onRotate);
    window.visualViewport?.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', onRotate);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, []);

  const handleRandomizeWeek = () => {
    const newMeals = generateWeek(ingredients, rules);
    onWeeklyMealsChange(newMeals);
  };

  const handleRandomizeDay = (dayIndex: number) => {
    const newMeals = regenerateSingleDay(ingredients, weeklyMeals, sourceDay(dayIndex), rules);
    onWeeklyMealsChange(newMeals);
  };

  const handleRandomizeComponent = (dayIndex: number, category: Category) => {
    const newMeals = regenerateSingleComponent(
      ingredients,
      weeklyMeals,
      sourceDay(dayIndex),
      category,
      rules
    );
    onWeeklyMealsChange(newMeals);
  };

  const handleRandomizeCookMethod = (dayIndex: number, category: Category) => {
    onWeeklyMealsChange(regenerateCookingMethod(weeklyMeals, sourceDay(dayIndex), category));
  };

  const handleToggleCookFresh = (dayIndex: number) => {
    const newMeals = [...weeklyMeals];
    newMeals[dayIndex] = {
      ...newMeals[dayIndex],
      cookFresh: !newMeals[dayIndex].cookFresh,
    };
    const withLeftovers = applyLeftovers(newMeals);
    onWeeklyMealsChange(withLeftovers);
  };

  const handleAddAllToShoppingList = () => {
    const mealIngredients = getShoppingListFromWeek(weeklyMeals);
    const shoppingItems: ShoppingItem[] = mealIngredients.map((item, idx) => ({
      id: `meal-${Date.now()}-${idx}`,
      name: item.ingredient,
      category: item.category,
      checked: false,
      fromMeal: true,
    }));
    onAddToShoppingList(shoppingItems);
  };

  const mealWithLeftovers = applyLeftovers(weeklyMeals);

  return (
    <div className="weekly-fit" ref={wrapRef} style={{ height: fit.height || undefined }}>
    <div
      className="weekly-plan-page"
      ref={innerRef}
      style={{ width: fit.width, transform: `translateX(${fit.offset}px) scale(${fit.scale})` }}
    >
      <div className="controls">
        <button className="btn-primary" onClick={handleRandomizeWeek}>
          🔀 Randomize Whole Week
        </button>
      </div>

      <div className="weekly-grid">
        {mealWithLeftovers.map((dayMeal, idx) => (
          <div key={idx} className="day-card">
            <div className="day-header">
              <h3>{dayMeal.day}</h3>
              <label className="cook-fresh-toggle">
                <input
                  type="checkbox"
                  checked={dayMeal.cookFresh}
                  onChange={() => handleToggleCookFresh(idx)}
                />
                <span>{dayMeal.cookFresh ? 'COOK FRESH' : 'leftovers'}</span>
              </label>
            </div>

            <div className="meal-components">
              <div className="component">
                <div className="component-header">
                  <span className="label">Protein</span>
                  <button
                    className="btn-reroll"
                    onClick={() => handleRandomizeComponent(idx, 'proteins')}
                    title="Randomize protein"
                  >
                    ↻
                  </button>
                </div>
                <div className="component-value">
                  {dayMeal.meal.protein.ingredient}
                  {dayMeal.meal.protein.cookingMethod && (
                    <span className="cooking-method">
                      ({dayMeal.meal.protein.cookingMethod})
                      <button
                        className="btn-reroll"
                        onClick={() => handleRandomizeCookMethod(idx, 'proteins')}
                        title="Randomize cook method"
                      >
                        🔥
                      </button>
                    </span>
                  )}
                </div>
              </div>

              <div className="component">
                <div className="component-header">
                  <span className="label">Carbs</span>
                  <button
                    className="btn-reroll"
                    onClick={() => handleRandomizeComponent(idx, 'carbs')}
                    title="Randomize carbs"
                  >
                    ↻
                  </button>
                </div>
                <div className="component-value">{dayMeal.meal.carb.ingredient}</div>
              </div>

              <div className="component">
                <div className="component-header">
                  <span className="label">Side</span>
                  <button
                    className="btn-reroll"
                    onClick={() => handleRandomizeComponent(idx, 'sides')}
                    title="Randomize side"
                  >
                    ↻
                  </button>
                </div>
                <div className="component-value">{dayMeal.meal.side.ingredient}</div>
              </div>

              <div className="component">
                <div className="component-header">
                  <span className="label">Veggie</span>
                  <button
                    className="btn-reroll"
                    onClick={() => handleRandomizeComponent(idx, 'veggies')}
                    title="Randomize veggie"
                  >
                    ↻
                  </button>
                </div>
                <div className="component-value">
                  {dayMeal.meal.veggie.ingredient}
                  {dayMeal.meal.veggie.cookingMethod && (
                    <span className="cooking-method">
                      ({dayMeal.meal.veggie.cookingMethod})
                      <button
                        className="btn-reroll"
                        onClick={() => handleRandomizeCookMethod(idx, 'veggies')}
                        title="Randomize cook method"
                      >
                        🔥
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              className="btn-reroll-day"
              onClick={() => handleRandomizeDay(idx)}
              title="Randomize entire day"
            >
              ↻ Randomize Day
            </button>
          </div>
        ))}
      </div>

      <div className="bottom-controls">
        <button className="btn-primary" onClick={handleAddAllToShoppingList}>
          📋 Add All Ingredients to Shopping List
        </button>
      </div>
    </div>
    </div>
  );
};
