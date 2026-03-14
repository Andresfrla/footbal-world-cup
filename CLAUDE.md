# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

World Cup Album is an Expo/React Native mobile app for tracking sticker collection progress in a World Cup album. The app allows users to track which stickers they have, mark duplicates, and see their progress.

## Commands

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios

# Reset to fresh project
npm run reset-project

# Type check
npx tsc --noEmit
```

## Architecture

- **Framework**: Expo with React Native, using Expo Router for file-based routing
- **State Management**: Zustand with AsyncStorage persistence (`store/albumStore.ts`)
- **Navigation**: Bottom tabs with 3 screens in `app/(tabs)/`:
  - `index.tsx` - Dashboard showing progress statistics
  - `album.tsx` - Sticker collection view grouped by team
  - `matches.tsx` - World Cup match schedule
- **Data**: Static data in `src/data.ts` (teams, stickers), types in `src/types.ts`
- **Theme**: Dark theme defined in `constants/theme.ts`

## Key Files

- `store/albumStore.ts` - Central state for sticker collection (owned, missing, duplicates)
- `src/data.ts` - Initial album data with 50 teams, 20 stickers each
- `app/modal.tsx` - Modal for sticker details/editing
- `constants/theme.ts` - Colors, spacing, font sizes

## Data Flow

The album store uses Zustand's persist middleware to save progress to AsyncStorage. Each sticker has:
- `id`: Unique identifier
- `team`: Team code (e.g., "MEX", "BRA", "ARG")
- `number`: Sticker number within the team (1-20)
- `status`: "missing" | "owned"
- `duplicates`: Count of duplicate copies
