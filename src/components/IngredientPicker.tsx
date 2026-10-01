import React from 'react';
import type { Ingredient, Category } from '../types';
import { CATEGORY_TOKEN_PREFIX } from '../utils';

interface Props {
  ingredients: Ingredient[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
}

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'proteins', label: 'Proteins' },
  { key: 'carbs', label: 'Carbs' },
  { key: 'sides', label: 'Sides' },
  { key: 'veggies', label: 'Veggies' },
];

// Multi-select grouped by category. Only ingredients checked on the
// ingredients list are offered; "All <category>" picks the whole category.
export const IngredientPicker: React.FC<Props> = ({ ingredients, value, onChange, placeholder }) => {
  const toggle = (item: string, removeItems: string[] = []) => {
    if (value.includes(item)) {
      onChange(value.filter(v => v !== item));
    } else {
      onChange([...value.filter(v => !removeItems.includes(v)), item]);
    }
  };

  const summary = value.length === 0
    ? placeholder
    : value
        .map(v => {
          if (!v.startsWith(CATEGORY_TOKEN_PREFIX)) return v;
          const key = v.slice(CATEGORY_TOKEN_PREFIX.length);
          return `All ${CATEGORIES.find(c => c.key === key)?.label ?? key}`;
        })
        .join(', ');

  return (
    <details className="picker">
      <summary className={value.length === 0 ? 'placeholder' : ''}>{summary}</summary>
      <div className="picker-panel">
        {CATEGORIES.map(({ key, label }) => {
          const items = ingredients.filter(i => i.category === key && i.selected);
          if (items.length === 0) return null;
          const token = `${CATEGORY_TOKEN_PREFIX}${key}`;
          const wholeCategory = value.includes(token);
          return (
            <div key={key} className="picker-group">
              <div className="picker-group-label">{label}</div>
              <label className="picker-option picker-all">
                <input
                  type="checkbox"
                  checked={wholeCategory}
                  onChange={() => toggle(token, items.map(i => i.name))}
                />
                All {label}
              </label>
              {items.map(i => (
                <label key={i.id} className="picker-option">
                  <input
                    type="checkbox"
                    checked={wholeCategory || value.includes(i.name)}
                    disabled={wholeCategory}
                    onChange={() => toggle(i.name)}
                  />
                  {i.name}
                </label>
              ))}
            </div>
          );
        })}
      </div>
    </details>
  );
};
