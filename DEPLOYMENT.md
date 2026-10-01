# Meal Randomizer - Deployment Guide

Your meal randomizer app is ready! Here's how to deploy it to Vercel.

## Prerequisites
- GitHub account
- Vercel account (free)

## Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Create a new repository called `meal-randomizer`
3. Do NOT initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

## Step 2: Push Your Code to GitHub

In the terminal, from the meal-randomizer folder, run these commands:

```bash
git init
git add .
git commit -m "Initial commit: Meal randomizer app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/meal-randomizer.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Deploy to Vercel

1. Go to https://vercel.com/import
2. Click "Import Project"
3. Select "Import Git Repository"
4. Paste your GitHub repo URL: `https://github.com/YOUR_USERNAME/meal-randomizer.git`
5. Click "Continue"
6. Framework: Select "Vite"
7. Click "Deploy"

Vercel will build and deploy your app. This typically takes 1-2 minutes.

## Step 4: Access Your App

Once deployed, Vercel will give you a URL like `https://meal-randomizer-xyz.vercel.app`

You can share this link with anyone, or:
- Save it to your iPhone home screen:
  1. Open the link on your iPhone
  2. Tap the Share button
  3. Tap "Add to Home Screen"
  4. Name it "Meal Randomizer"
  5. Tap "Add"

## How It Works

- **Ingredients Page**: Add/remove ingredients from your rotation. Edit rules here too.
- **Weekly Plan Page**: Randomize your whole week, individual days, or specific meal components. Toggle "Cook Fresh" vs "leftovers". Add all ingredients to shopping list.
- **Shopping List Page**: Manage what you're buying. Check items off while shopping. Add custom non-meal items.

All your data is stored locally on your phone—nothing is sent to a server.

## Making Changes

To update the app in the future:
1. Make your changes locally
2. Run `git add .`
3. Run `git commit -m "Your change description"`
4. Run `git push`
5. Vercel will automatically redeploy

## Troubleshooting

**App data disappeared?**
- localStorage might have been cleared. Use the "Add all ingredients to shopping list" button to rebuild from the weekly plan.

**Changes not showing up?**
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

**Need help?**
- Check the browser console for errors (F12, then Console tab)
