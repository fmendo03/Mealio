import type { Ingredient, Category, Meal, MealComponent, DayMeal, Rule, CookingMethod } from './types';
import { INGREDIENT_COOKING_METHODS, COOKING_METHODS } from './data';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function getSelectedIngredients(ingredients: Ingredient[], category: Category): Ingredient[] {
  return ingredients.filter(i => i.category === category && i.selected);
}

export function getRandomCookingMethod(ingredient: string, ingredients: Ingredient[] = []): CookingMethod {
  const preferred =
    ingredients.find(i => i.name === ingredient)?.defaultCookingMethod ??
    INGREDIENT_COOKING_METHODS[ingredient];
  if (preferred) return preferred;
  return COOKING_METHODS[Math.floor(Math.random() * COOKING_METHODS.length)];
}

export function regenerateCookingMethod(
  weekMeals: DayMeal[],
  dayIndex: number,
  category: Category
): DayMeal[] {
  const newWeek = [...weekMeals];
  const meal = { ...newWeek[dayIndex].meal };
  const key = category === 'proteins' ? 'protein' : 'veggie';
  const current = meal[key].cookingMethod;
  const options = COOKING_METHODS.filter(m => m !== current);
  const cookingMethod = options[Math.floor(Math.random() * options.length)];
  meal[key] = { ...meal[key], cookingMethod };
  newWeek[dayIndex] = { ...newWeek[dayIndex], meal };
  return newWeek;
}

export function getMealComponent(
  ingredients: Ingredient[],
  category: Category,
  seed: number
): MealComponent {
  const selected = getSelectedIngredients(ingredients, category);
  if (selected.length === 0) throw new Error(`No selected ingredients for category: ${category}`);
  
  const index = Math.floor(Math.abs(seed)) % selected.length;
  const ingredient = selected[index];
  const cookingMethod = (category === 'proteins' || category === 'veggies') 
    ? getRandomCookingMethod(ingredient.name, ingredients)
    : undefined;
  
  return {
    ingredient: ingredient.name,
    category,
    cookingMethod,
  };
}

export function generateMeal(
  ingredients: Ingredient[],
  dayIndex: number,
  weekSeed: number,
  rules: Rule[]
): Meal {
  let meal: Meal;
  let attempts = 0;
  const maxAttempts = 50;

  do {
    const baseSeeds = {
      protein: weekSeed + (dayIndex * 13) + (attempts * 7919),
      carb: weekSeed + (dayIndex * 17) + (attempts * 104729),
      side: weekSeed + (dayIndex * 19) + (attempts * 15485863),
      veggie: weekSeed + (dayIndex * 23) + (attempts * 32452867),
    };

    meal = {
      protein: getMealComponent(ingredients, 'proteins', baseSeeds.protein),
      carb: getMealComponent(ingredients, 'carbs', baseSeeds.carb),
      side: getMealComponent(ingredients, 'sides', baseSeeds.side),
      veggie: getMealComponent(ingredients, 'veggies', baseSeeds.veggie),
    };

    if (validateMeal(meal, rules)) break;
    attempts++;
  } while (attempts < maxAttempts);

  return meal;
}

export const CATEGORY_TOKEN_PREFIX = 'category:';

function toTargets(v: string[] | string | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v]; // older saved rules stored a single string
}

// True if the meal contains any of the targets (ingredient names or whole categories)
function mealMatches(meal: Meal, targets: string[] | string | undefined): boolean {
  const list = toTargets(targets).map(t => t.toLowerCase());
  if (list.length === 0) return false;
  return [meal.protein, meal.carb, meal.side, meal.veggie].some(
    c =>
      list.includes(c.ingredient.toLowerCase()) ||
      list.includes(`${CATEGORY_TOKEN_PREFIX}${c.category}`)
  );
}

export function validateMeal(meal: Meal, rules: Rule[]): boolean {
  for (const rule of rules) {
    if (!rule.active) continue;

    if (rule.kind === 'never-pair' || rule.kind === 'requires') {
      const hasA = mealMatches(meal, rule.a);
      const hasB = mealMatches(meal, rule.b);
      if (rule.kind === 'never-pair' && hasA && hasB) return false;
      if (rule.kind === 'requires' && hasA && !hasB) return false;
      continue;
    }

    if (rule.description.includes("Burgers")) {
      const isBurger = meal.protein.ingredient.toLowerCase().includes('burger');
      
      if (rule.description.includes('cannot have carbs')) {
        if (isBurger && ['Pasta', 'Rice', 'Mashed Potatoes', 'Quinoa', 'Couscous', 'Sweet Potato', 'Polenta', 'Barley'].includes(meal.carb.ingredient)) {
          return false;
        }
      }
      
      if (rule.description.includes('must have a side')) {
        if (isBurger && meal.side.ingredient === 'None') {
          return false;
        }
      }
    }
  }
  return true;
}

export function validateWeek(weekMeals: DayMeal[], rules: Rule[]): boolean {
  const activeRules = rules.filter(r => r.active);
  
  for (const rule of activeRules) {
    if (rule.kind === 'max-per-week' && rule.max !== undefined) {
      const uses = weekMeals.filter(dm => mealMatches(dm.meal, rule.a)).length;
      if (uses > rule.max) return false;
      continue;
    }
    if (rule.description.includes("Don't repeat protein")) {
      const proteins = weekMeals.map(dm => dm.meal.protein.ingredient);
      if (new Set(proteins).size !== proteins.length) {
        return false;
      }
    }
  }
  return true;
}

export function generateWeek(
  ingredients: Ingredient[],
  rules: Rule[]
): DayMeal[] {
  const weekSeed = Math.floor(Math.random() * 1000000);
  let weekMeals: DayMeal[] = [];
  let attempts = 0;
  const maxAttempts = 100;

  do {
    weekMeals = [];
    for (let i = 0; i < 7; i++) {
      const meal = generateMeal(ingredients, i, weekSeed + (attempts * 1000), rules);
      weekMeals.push({
        day: DAYS[i],
        meal,
        cookFresh: [0, 2, 4, 6].includes(i), // Default: Sunday, Tuesday, Thursday, Saturday
      });
    }

    if (validateWeek(weekMeals, rules)) break;
    attempts++;
  } while (attempts < maxAttempts);

  return weekMeals;
}

export function regenerateSingleDay(
  ingredients: Ingredient[],
  weekMeals: DayMeal[],
  dayIndex: number,
  rules: Rule[]
): DayMeal[] {
  const newWeek = [...weekMeals];
  let attempts = 0;
  const maxAttempts = 50;

  do {
    const newMeal = generateMeal(ingredients, dayIndex, Math.random() * 1000000, rules);
    newWeek[dayIndex] = { ...newWeek[dayIndex], meal: newMeal };

    if (validateWeek(newWeek, rules)) break;
    attempts++;
  } while (attempts < maxAttempts);

  return newWeek;
}

export function regenerateSingleComponent(
  ingredients: Ingredient[],
  weekMeals: DayMeal[],
  dayIndex: number,
  category: Category,
  rules: Rule[]
): DayMeal[] {
  const newWeek = [...weekMeals];
  const meal = { ...newWeek[dayIndex].meal };
  
  let attempts = 0;
  const maxAttempts = 50;

  do {
    const newComponent = getMealComponent(ingredients, category, Math.floor(Math.random() * 1000000));
    
    switch (category) {
      case 'proteins':
        meal.protein = newComponent;
        break;
      case 'carbs':
        meal.carb = newComponent;
        break;
      case 'sides':
        meal.side = newComponent;
        break;
      case 'veggies':
        meal.veggie = newComponent;
        break;
    }

    if (validateMeal(meal, rules)) break;
    attempts++;
  } while (attempts < maxAttempts);

  newWeek[dayIndex] = { ...newWeek[dayIndex], meal };
  return newWeek;
}

export function applyLeftovers(weekMeals: DayMeal[]): DayMeal[] {
  const result = [...weekMeals];
  let lastCookMeal: Meal | null = null;

  for (let i = 0; i < result.length; i++) {
    if (result[i].cookFresh) {
      lastCookMeal = result[i].meal;
    } else if (lastCookMeal) {
      result[i].meal = lastCookMeal;
    }
  }

  return result;
}

export function getShoppingListFromWeek(weekMeals: DayMeal[]): Array<{ ingredient: string; category: Category }> {
  const ingredientMap = new Map<string, Category>();

  weekMeals.forEach(dm => {
    const meal = dm.meal;
    ingredientMap.set(meal.protein.ingredient, 'proteins');
    ingredientMap.set(meal.carb.ingredient, 'carbs');
    ingredientMap.set(meal.side.ingredient, 'sides');
    ingredientMap.set(meal.veggie.ingredient, 'veggies');
  });

  return Array.from(ingredientMap.entries()).map(([ingredient, category]) => ({
    ingredient,
    category,
  }));
}

// LocalStorage persistence
export function saveToLocalStorage(key: string, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
    return defaultValue;
  }
}
