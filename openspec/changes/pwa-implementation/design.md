## Context

The Leleco MVP app is currently functioning as an Expo/React Native mobile application. We want to expand its reach by adding Progressive Web App (PWA) support, which enables users to add the application to their home screen directly from a browser and use it offline.

## Goals / Non-Goals

**Goals:**
- Configure the application to run as a web app.
- Make the web app installable as a PWA.
- Implement basic offline capabilities using standard Expo PWA configuration.

**Non-Goals:**
- Extensive rewrite of the React Native code to optimize for desktop web (we will keep the mobile-first layout).
- Implementing complex custom service workers outside of what Expo provides out of the box.

## Decisions

- **Decision:** Use Expo's built-in web and PWA support.
  - **Rationale:** Expo provides `@expo/metro-runtime` and standard configurations via `app.json` for web. This minimizes custom configuration and allows us to maintain a single codebase.
  - **Alternatives Considered:** Ejecting or using a custom Webpack config, but this is overkill for basic PWA requirements.

## Risks / Trade-offs

- **Risk:** Some native modules might not be supported on the web.
  - **Mitigation:** We will test the app in the browser and ensure any non-web supported native modules fail gracefully or use web polyfills (e.g., using `Platform.OS !== 'web'`).

## Migration Plan

1. Run `npx expo install react-native-web react-dom @expo/metro-runtime` if they aren't installed.
2. Update `app.json` with web configurations (favicon, name, short_name, theme_color).
3. Generate and configure web assets.
4. Test with `npm run web`.
