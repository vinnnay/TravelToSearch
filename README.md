# TraveltoSearch — iOS App

A React Native + Expo mobile app with six screens and a built-in offline catalog of attractions in Washington DC, New York, Paris, Tokyo, London, and Rome.

## Requirements
- Node.js 20.19+ (or an Expo SDK 54-compatible LTS release)
- npm
- iPhone with **Expo Go** installed, or macOS + Xcode with iOS Simulator

## Run
```bash
npm install
npx expo start
```
Scan the Expo QR code with your iPhone's camera to open in Expo Go. The phone and computer generally need to share a network. If necessary, run `npx expo start --tunnel` (may require an extra package).

For the iOS Simulator on macOS:
```bash
npm run ios
```

## Features
- Home screen with travel search and popular cities
- City search across six built-in destinations
- City attraction lists and category filters
- Attraction details, favorite toggle, and directions via Google Maps web URL
- Checklists, visit progress, and saved destinations
- Profile and reset control
- Local persistence via AsyncStorage (no account or backend)

## Structure
- `app/`: Expo Router screens
- `src/data/catalog.ts`: offline destination and attraction records
- `src/store.tsx`: persisted checklist and saved city state
- `src/theme/ui.tsx`: reusable components and styling

## Important notes
- The **attraction data is offline**, but photos load from Unsplash and directions open a web map, so those require internet access. Some illustrative photos may not depict the exact attraction.
- Attraction prices, schedules, and access conditions are illustrative, not live verified.
- Replace `com.example.traveltosearch` in `app.json` with your own unique iOS bundle identifier before publishing.
- Publishing to the App Store requires an Apple Developer account, appropriate branding rights, testing, and App Store submission.
- This project is source code, not a signed `.ipa` or an App Store release.

## Verify
```bash
npm run typecheck
```
