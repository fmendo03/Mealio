import type { Ingredient, Rule, CookingMethod } from './types';

export const COOKING_METHODS: CookingMethod[] = ['Baked', 'Fried', 'Grilled', 'Steamed', 'Sautéed', 'Boiled', 'Roasted'];

export const INGREDIENT_COOKING_METHODS: Record<string, CookingMethod> = {
  // Proteins
  'Ground Beef': 'Sautéed',
  'Steak': 'Grilled',
  'Pork Tenderloin': 'Roasted',
  'Porkchops': 'Grilled',
  'Chicken Breast': 'Baked',
  'Drumsticks': 'Baked',
  'Chicken Thighs': 'Roasted',
  'Tuna': 'Grilled',
  'Tilapia': 'Baked',
  'Shrimp': 'Sautéed',
  'Italian Sausage': 'Sautéed',
  'Burgers': 'Grilled',
  'Salmon': 'Baked',
  'Turkey Breast': 'Roasted',
  'Lamb Chops': 'Grilled',
  'Pork Chops': 'Grilled',
  'Cod': 'Baked',
  'Mahi Mahi': 'Grilled',
  
  // Veggies
  'Broccoli': 'Steamed',
  'Green Beans': 'Steamed',
  'Asparagus': 'Roasted',
  'Carrots': 'Roasted',
  'Zucchini': 'Sautéed',
  'Spinach': 'Sautéed',
  'Salad': 'Boiled',
  'Roasted Peppers & Onions': 'Roasted',
  'Peas': 'Steamed',
  'Beans': 'Boiled',
  'Mushrooms': 'Sautéed',
  'Brussels Sprouts': 'Roasted',
  'Cauliflower': 'Roasted',
  'Bell Peppers': 'Sautéed',
  'Green Cabbage': 'Steamed',
  'Kale': 'Sautéed',
  'Beets': 'Roasted',
};

export const INITIAL_INGREDIENTS: Ingredient[] = [
  // Proteins (from Excel + extras)
  { id: 'p1', name: 'Ground Beef', category: 'proteins', selected: true, userAdded: false },
  { id: 'p2', name: 'Steak', category: 'proteins', selected: true, userAdded: false },
  { id: 'p3', name: 'Pork Tenderloin', category: 'proteins', selected: true, userAdded: false },
  { id: 'p4', name: 'Porkchops', category: 'proteins', selected: true, userAdded: false },
  { id: 'p5', name: 'Chicken Breast', category: 'proteins', selected: true, userAdded: false },
  { id: 'p6', name: 'Drumsticks', category: 'proteins', selected: true, userAdded: false },
  { id: 'p7', name: 'Chicken Thighs', category: 'proteins', selected: true, userAdded: false },
  { id: 'p8', name: 'Tuna', category: 'proteins', selected: true, userAdded: false },
  { id: 'p9', name: 'Tilapia', category: 'proteins', selected: true, userAdded: false },
  { id: 'p10', name: 'Shrimp', category: 'proteins', selected: true, userAdded: false },
  { id: 'p11', name: 'Italian Sausage', category: 'proteins', selected: true, userAdded: false },
  { id: 'p12', name: 'Burgers', category: 'proteins', selected: true, userAdded: false },
  { id: 'p13', name: 'Salmon', category: 'proteins', selected: false, userAdded: false },
  { id: 'p14', name: 'Turkey Breast', category: 'proteins', selected: false, userAdded: false },
  { id: 'p15', name: 'Lamb Chops', category: 'proteins', selected: false, userAdded: false },
  { id: 'p16', name: 'Cod', category: 'proteins', selected: false, userAdded: false },
  { id: 'p17', name: 'Mahi Mahi', category: 'proteins', selected: false, userAdded: false },

  // Carbs (from Excel + extras)
  { id: 'c1', name: 'Rice', category: 'carbs', selected: true, userAdded: false },
  { id: 'c2', name: 'Pasta', category: 'carbs', selected: true, userAdded: false },
  { id: 'c3', name: 'Mashed Potatoes', category: 'carbs', selected: true, userAdded: false },
  { id: 'c4', name: 'Quinoa', category: 'carbs', selected: false, userAdded: false },
  { id: 'c5', name: 'Couscous', category: 'carbs', selected: false, userAdded: false },
  { id: 'c6', name: 'Sweet Potato', category: 'carbs', selected: false, userAdded: false },
  { id: 'c7', name: 'Polenta', category: 'carbs', selected: false, userAdded: false },
  { id: 'c8', name: 'Barley', category: 'carbs', selected: false, userAdded: false },

  // Sides (from Excel + extras)
  { id: 's1', name: 'Oven Potatoes', category: 'sides', selected: true, userAdded: false },
  { id: 's2', name: 'French Fries', category: 'sides', selected: true, userAdded: false },
  { id: 's3', name: 'Sweet Potatoes', category: 'sides', selected: true, userAdded: false },
  { id: 's4', name: 'Roasted Vegetables', category: 'sides', selected: false, userAdded: false },
  { id: 's5', name: 'Garlic Bread', category: 'sides', selected: false, userAdded: false },
  { id: 's6', name: 'Cornbread', category: 'sides', selected: false, userAdded: false },
  { id: 's7', name: 'Mac & Cheese', category: 'sides', selected: false, userAdded: false },

  // Veggies (from Excel + extras)
  { id: 'v1', name: 'Broccoli', category: 'veggies', selected: true, userAdded: false },
  { id: 'v2', name: 'Green Beans', category: 'veggies', selected: true, userAdded: false },
  { id: 'v3', name: 'Asparagus', category: 'veggies', selected: true, userAdded: false },
  { id: 'v4', name: 'Carrots', category: 'veggies', selected: true, userAdded: false },
  { id: 'v5', name: 'Zucchini', category: 'veggies', selected: true, userAdded: false },
  { id: 'v6', name: 'Spinach', category: 'veggies', selected: true, userAdded: false },
  { id: 'v7', name: 'Salad', category: 'veggies', selected: true, userAdded: false },
  { id: 'v8', name: 'Roasted Peppers & Onions', category: 'veggies', selected: true, userAdded: false },
  { id: 'v9', name: 'Peas', category: 'veggies', selected: true, userAdded: false },
  { id: 'v10', name: 'Beans', category: 'veggies', selected: true, userAdded: false },
  { id: 'v11', name: 'Mushrooms', category: 'veggies', selected: true, userAdded: false },
  { id: 'v12', name: 'Brussels Sprouts', category: 'veggies', selected: false, userAdded: false },
  { id: 'v13', name: 'Cauliflower', category: 'veggies', selected: false, userAdded: false },
  { id: 'v14', name: 'Bell Peppers', category: 'veggies', selected: false, userAdded: false },
  { id: 'v15', name: 'Green Cabbage', category: 'veggies', selected: false, userAdded: false },
  { id: 'v16', name: 'Kale', category: 'veggies', selected: false, userAdded: false },
  { id: 'v17', name: 'Beets', category: 'veggies', selected: false, userAdded: false },
];

export const DEFAULT_RULES: Rule[] = [
  {
    id: 'r1',
    description: "Don't repeat protein twice in the same week",
    type: 'exclusion',
    active: true,
  },
  {
    id: 'r2',
    description: 'Burgers cannot have carbs as a side',
    type: 'exclusion',
    active: true,
  },
  {
    id: 'r3',
    description: 'Burgers must have a side',
    type: 'requirement',
    active: true,
  },
];
