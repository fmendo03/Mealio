# 🍽️ Meal Randomizer

A simple web app to randomize your weekly meal plans and generate shopping lists.

## Features

✨ **Ingredients Management**
- Pre-populated list of proteins, carbs, sides, and veggies
- Search and select which ingredients to rotate through
- Add your own custom ingredients
- Define rules that the randomizer respects

📅 **Weekly Meal Planning**
- Randomize your entire week with one click
- Randomize individual days or specific meal components
- Toggle "Cook Fresh" vs "Leftovers" for each day
- Set cooking methods for proteins and veggies

🛒 **Shopping List**
- Auto-generate from your weekly meals
- Add custom items (paper towels, milk, etc.)
- Check off items while shopping
- Organize by meal category

💾 **Local Storage**
- All data stored on your phone—nothing uploaded to a server
- Works offline
- Data persists between sessions

## Tech Stack

- React + TypeScript
- Vite
- CSS Grid & Flexbox
- LocalStorage for persistence

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step deployment instructions to Vercel.

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## How It Works

### Rules Enforcement
The app supports programmatic rule enforcement during randomization. For example:
- "Don't repeat protein twice in the same week"
- "Burgers cannot have carbs as a side"
- "Burgers must have a side"

Edit these rules on the Ingredients page.

### Cooking Methods
Proteins and veggies can have cooking methods (Baked, Fried, Grilled, Steamed, Sautéed, Boiled, Roasted). These randomize alongside the ingredient selection.

### Leftovers Logic
Days marked as "leftovers" automatically use the meal from the last "cook fresh" day.

## Data Structure

All data is stored in localStorage under the key `mealPlannerState`:
- Ingredients (with selection status)
- Weekly meals (with cooking methods)
- Shopping list items
- Rules

No data leaves your device.
