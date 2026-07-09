## Why

The Leleco MVP app is currently built as an Expo/React Native app. Adding Progressive Web App (PWA) support will allow users to install and use the app on their devices seamlessly from the browser, increasing reach and accessibility without going through app stores.

## What Changes

- Add `@expo/metro-runtime` and `@expo/webpack-config` for web support (if not fully configured).
- Add web-specific configurations in `app.json` (such as `favicon`, `manifest`, `themeColor`).
- Generate web assets (icons/splashes) for the PWA if needed.
- Enable service worker for offline capabilities (Expo standard PWA setup).

## Capabilities

### New Capabilities
- `pwa-support`: The application can be installed as a PWA, operates offline via service workers, and displays custom icons/theme colors.

### Modified Capabilities

## Impact

- `app.json`: Added web configurations.
- `package.json`: Dependencies updated to support PWA/Web fully if needed.
- Users can run `npm run web` to serve the PWA.
