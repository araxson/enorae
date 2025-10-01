# 02. Project Initialization Rules

## 2.1 Project Creation Rules

### Rule 2.1.1: Use official templates when available
```bash
# Next.js with Supabase template
npx create-next-app -e with-supabase

# Supabase bootstrap command
npx supabase@latest bootstrap
bunx supabase@latest bootstrap
```

### Rule 2.1.2: Framework-specific project creation
```bash
# React with Vite
npm create vite@latest my-app -- --template react

# SvelteKit
npx sv create my-app

# Flutter
flutter create my_app

# Rails with PostgreSQL
rails new blog -d=postgresql

# Laravel
composer create-project laravel/laravel example-app
```

## 2.2 Supabase CLI Initialization

### Rule 2.2.1: Initialize Supabase in existing project
```bash
cd your-existing-project
supabase init
```

### Rule 2.2.2: Create new project with Supabase structure
```bash
supabase init my-edge-functions-project
cd my-edge-functions-project
```

## 2.3 Development Server Setup

### Rule 2.3.1: Standard development commands
```bash
# Next.js/React/Vue
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

# Rails
bin/rails server

# Laravel
php artisan serve

# Flutter
flutter run

# Expo
npx expo start
```

## 2.4 Bootstrap Commands

### Rule 2.4.1: Use Supabase bootstrap for quick setup
```bash
# Bootstrap specific templates
npx supabase@latest bootstrap hono
```

### Rule 2.4.2: Framework CLI generation commands
```bash
# Angular project setup
ng new trelloBoard --routing --style=scss

# Ionic setup
ionic start supaAuth blank --type=angular
```