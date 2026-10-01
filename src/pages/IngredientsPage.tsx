import React, { useState } from 'react';
import type { Ingredient, Category, Rule, RuleKind, CookingMethod } from '../types';
import { IngredientPicker } from '../components/IngredientPicker';
import { CATEGORY_TOKEN_PREFIX } from '../utils';
import { COOKING_METHODS, INGREDIENT_COOKING_METHODS } from '../data';
import '../styles/IngredientsPage.css';

interface Props {
  ingredients: Ingredient[];
  rules: Rule[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
  onRulesChange: (rules: Rule[]) => void;
}

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'proteins', label: 'Proteins' },
  { key: 'carbs', label: 'Carbs' },
  { key: 'sides', label: 'Sides' },
  { key: 'veggies', label: 'Veggies' },
];

export const IngredientsPage: React.FC<Props> = ({
  ingredients,
  rules,
  onIngredientsChange,
  onRulesChange,
}) => {
  const [newIngredient, setNewIngredient] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('proteins');
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsed, setCollapsed] = useState<Set<Category>>(new Set(CATEGORIES.map(c => c.key)));
  const [ruleKind, setRuleKind] = useState<RuleKind>('never-pair');
  const [ruleA, setRuleA] = useState<string[]>([]);
  const [ruleB, setRuleB] = useState<string[]>([]);
  const [ruleMax, setRuleMax] = useState(1);

  const labelFor = (targets: string[]) =>
    targets
      .map(t => {
        if (!t.startsWith(CATEGORY_TOKEN_PREFIX)) return t;
        const key = t.slice(CATEGORY_TOKEN_PREFIX.length);
        return `all ${CATEGORIES.find(c => c.key === key)?.label ?? key}`;
      })
      .join(' or ');

  const toggleCollapsed = (key: Category) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleAddRule = () => {
    if (ruleA.length === 0) return;
    if (ruleKind !== 'max-per-week' && ruleB.length === 0) return;

    const id = `rule-${Date.now()}`;
    const a = labelFor(ruleA);
    const b = labelFor(ruleB);
    let rule: Rule;
    if (ruleKind === 'never-pair') {
      rule = { id, description: `Never pair ${a} with ${b}`, type: 'exclusion', active: true, kind: ruleKind, a: ruleA, b: ruleB };
    } else if (ruleKind === 'requires') {
      rule = { id, description: `If ${a} is served, also serve ${b}`, type: 'requirement', active: true, kind: ruleKind, a: ruleA, b: ruleB };
    } else {
      const max = Math.max(0, Math.floor(ruleMax));
      rule = { id, description: `${a} at most ${max} time${max === 1 ? '' : 's'} per week`, type: 'exclusion', active: true, kind: ruleKind, a: ruleA, max };
    }

    onRulesChange([...rules, rule]);
    setRuleA([]);
    setRuleB([]);
  };

  const handleDeleteRule = (id: string) => {
    onRulesChange(rules.filter(r => r.id !== id));
  };

  const handleToggleIngredient = (id: string) => {
    const updated = ingredients.map(i =>
      i.id === id ? { ...i, selected: !i.selected } : i
    );
    onIngredientsChange(updated);
  };

  const handleCookingMethodChange = (id: string, method: string) => {
    onIngredientsChange(
      ingredients.map(i =>
        i.id === id ? { ...i, defaultCookingMethod: (method || undefined) as CookingMethod | undefined } : i
      )
    );
  };

  const handleAddIngredient = () => {
    if (!newIngredient.trim()) return;

    const ingredient: Ingredient = {
      id: `user-${Date.now()}`,
      name: newIngredient,
      category: selectedCategory,
      selected: true,
      userAdded: true,
    };

    onIngredientsChange([...ingredients, ingredient]);
    setNewIngredient('');
  };

  const handleDeleteIngredient = (id: string) => {
    const updated = ingredients.filter(i => i.id !== id);
    onIngredientsChange(updated);
  };

  const handleToggleRule = (id: string) => {
    const updated = rules.map(r =>
      r.id === id ? { ...r, active: !r.active } : r
    );
    onRulesChange(updated);
  };

  const handleEditRule = (id: string, newDescription: string) => {
    const updated = rules.map(r =>
      r.id === id ? { ...r, description: newDescription } : r
    );
    onRulesChange(updated);
  };

  const filterIngredients = (category: Category) => {
    return ingredients.filter(
      i =>
        i.category === category &&
        i.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="ingredients-page">
      <div className="ingredients-section">
        <h2>Ingredients</h2>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {CATEGORIES.map(({ key, label }) => {
          const items = filterIngredients(key);
          // Keep matches visible while searching
          const isCollapsed = collapsed.has(key) && !searchTerm;
          return (
          <div key={key} className="category-group">
            <button
              className={`category-toggle ${isCollapsed ? 'collapsed' : ''}`}
              onClick={() => toggleCollapsed(key)}
              aria-expanded={!isCollapsed}
            >
              <span className="chevron">▼</span>
              {label}
              <span className="count">
                ({items.filter(i => i.selected).length}/{items.length} selected)
              </span>
            </button>
            {!isCollapsed && <div className="ingredient-list">
              {items.map(ingredient => (
                <div key={ingredient.id} className="ingredient-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={ingredient.selected}
                      onChange={() => handleToggleIngredient(ingredient.id)}
                    />
                    <span>{ingredient.name}</span>
                  </label>
                  {(key === 'proteins' || key === 'veggies') && (
                    <select
                      className="method-select"
                      value={ingredient.defaultCookingMethod ?? INGREDIENT_COOKING_METHODS[ingredient.name] ?? ''}
                      onChange={(e) => handleCookingMethodChange(ingredient.id, e.target.value)}
                      title="Default cook method"
                    >
                      <option value="">Random</option>
                      {COOKING_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  )}
                  {ingredient.userAdded && (
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteIngredient(ingredient.id)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>}
          </div>
          );
        })}

        <div className="add-ingredient-section">
          <h3>Add New Ingredient</h3>
          <div className="add-form">
            <input
              type="text"
              placeholder="Ingredient name"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Category)}
            >
              {CATEGORIES.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <button onClick={handleAddIngredient}>Add</button>
          </div>
        </div>
      </div>

      <div className="rules-section">
        <h2>Rules</h2>
        <p className="rules-description">
          These rules are enforced during randomization
        </p>
        <div className="rules-list">
          {rules.map(rule => (
            <div key={rule.id} className="rule-item">
              <label>
                <input
                  type="checkbox"
                  checked={rule.active}
                  onChange={() => handleToggleRule(rule.id)}
                />
              </label>
              <input
                type="text"
                value={rule.description}
                readOnly={!!rule.kind}
                onChange={(e) => handleEditRule(rule.id, e.target.value)}
                className={rule.active ? '' : 'disabled'}
              />
              <button
                className="delete-btn"
                onClick={() => handleDeleteRule(rule.id)}
                title="Delete rule"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="add-rule-form">
          <h3>Add Rule</h3>
          <select value={ruleKind} onChange={(e) => setRuleKind(e.target.value as RuleKind)}>
            <option value="never-pair">Never pair… with…</option>
            <option value="requires">If… then also…</option>
            <option value="max-per-week">Limit per week</option>
          </select>
          <IngredientPicker
            ingredients={ingredients}
            value={ruleA}
            onChange={setRuleA}
            placeholder={ruleKind === 'never-pair' ? 'First: choose ingredients / categories' : ruleKind === 'requires' ? 'If served: choose…' : 'Limit: choose…'}
          />
          {ruleKind === 'max-per-week' ? (
            <input
              type="number"
              min={0}
              value={ruleMax}
              onChange={(e) => setRuleMax(Number(e.target.value))}
              aria-label="Maximum times per week"
            />
          ) : (
            <IngredientPicker
              ingredients={ingredients}
              value={ruleB}
              onChange={setRuleB}
              placeholder={ruleKind === 'never-pair' ? 'With: choose ingredients / categories' : 'Then also: choose…'}
            />
          )}
          <button onClick={handleAddRule}>Add Rule</button>
          <p className="rule-hint">
            These rules are applied automatically when randomizing.
          </p>
        </div>
      </div>
    </div>
  );
};
