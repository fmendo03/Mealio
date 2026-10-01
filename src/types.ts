export type Category = 'proteins' | 'carbs' | 'sides' | 'veggies';
export type ShoppingCategory = Category | 'other';
export type CookingMethod = 'Baked' | 'Fried' | 'Grilled' | 'Steamed' | 'Sautéed' | 'Boiled' | 'Roasted';

export interface Ingredient {
  id: string;
  name: string;
  category: Category;
  selected: boolean;
  userAdded: boolean;
  defaultCookingMethod?: CookingMethod;
}

export interface MealComponent {
  ingredient: string;
  category: Category;
  cookingMethod?: CookingMethod;
}

export interface Meal {
  protein: MealComponent;
  carb: MealComponent;
  side: MealComponent;
  veggie: MealComponent;
}

export interface DayMeal {
  day: string;
  meal: Meal;
  cookFresh: boolean;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category?: ShoppingCategory;
  checked: boolean;
  fromMeal: boolean;
}

export type RuleKind = 'never-pair' | 'requires' | 'max-per-week';

export interface Rule {
  id: string;
  description: string;
  type: 'exclusion' | 'requirement';
  active: boolean;
  // Structured rules (user-created) are enforced by the randomizer
  kind?: RuleKind;
  // Ingredient names, or `category:<key>` to cover a whole category
  a?: string[];
  b?: string[];
  max?: number;
}

export interface AppState {
  ingredients: Ingredient[];
  weeklyMeals: DayMeal[];
  shoppingList: ShoppingItem[];
  rules: Rule[];
}
