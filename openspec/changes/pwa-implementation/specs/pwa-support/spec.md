## ADDED Requirements

### Requirement: PWA Manifest Configuration
The application SHALL have a properly configured web manifest in `app.json` under the `web` key, including a short name, theme color, and a favicon.

#### Scenario: User visits the application on the web
- **WHEN** the user visits the deployed PWA via a browser
- **THEN** they should be prompted to install the application to their home screen
- **THEN** the application should use the configured theme color and icons

### Requirement: Offline Support
The application SHALL register a service worker in the production web build to cache core assets and support offline capabilities.

#### Scenario: User opens the application without internet
- **WHEN** the user has previously installed the PWA and opens it while offline
- **THEN** the application shell should load from the cache
