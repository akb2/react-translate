# translateContextFabric

`translateContextFabric` creates a reusable translation context, provider, and hook for a React application.

It centralizes translation storage, language selection, and runtime updates while keeping the translation API simple and consistent across your app.

## Overview

The factory returns an object with three members:

- `TranslateContext`: the React context used internally
- `TranslateProvider`: a provider component that stores translations and exposes them to consumers
- `useTranslate`: a hook that reads the current translation state and exposes a translation function

## API

```ts
const { TranslateContext, TranslateProvider, useTranslate } = translateContextFabric();
```

### `TranslateProvider`

```tsx
<TranslateProvider
  initialTranslates={translations}
  defaultLanguage="en"
>
  <App />
</TranslateProvider>
```

#### Props

- `children: React.ReactNode`
  - The app tree wrapped by the translation context.
- `initialTranslates?: TranslateMap | TranslateMap[]`
  - Initial translation dictionary or list of dictionaries to merge into the provider state.
- `defaultLanguage: Language`
  - The default language used before a user-selected language is available.

The provider keeps a flattened translation map in local state using `mergeAndFlatObjects(...)`, and it exposes an `addTranslates` callback for merging additional translation entries during runtime.

### `useTranslate`

```ts
const { translate, language, setLanguage, defaultLanguage } = useTranslate();
```

#### Returned values

- `translate(keyPath: string, templatedValues?: object): string`
  - Resolves a translation key for the currently selected language.
  - It internally builds the lookup key as `keyPath + "." + language` when the language is selected, or falls back to `defaultLanguage`.
  - If the translation is found, template placeholders are replaced with the provided values.
  - If no match is found, it returns the original `keyPath`.
- `language: Language`
  - The currently selected language.
- `setLanguage: (nextLanguage: Language) => void`
  - Updates the selected language and persists it to localStorage.
- `defaultLanguage: Language`
  - The fallback language configured for the provider.

## Language persistence

The hook uses `useLocalStorageState` to persist the chosen language in localStorage under the configured key (`TRANSLATE_LOCAL_STORAGE_KEY`). This keeps the selected language across reloads.

## Example

```tsx
import React from "react";
import { translateContextFabric } from "./utils/translate-context-fabric";

const { TranslateProvider, useTranslate } = translateContextFabric();

const translations = {
  home: {
    title: {
      en: "Welcome",
      fr: "Bienvenue",
    },
    greeting: {
      en: "Hello {name}",
      fr: "Bonjour {name}",
    },
  },
};

function App() {
  return (
    <TranslateProvider initialTranslates={translations} defaultLanguage="en">
      <Header />
    </TranslateProvider>
  );
}

function Header() {
  const { translate, language, setLanguage } = useTranslate();

  return (
    <header>
      <h1>{translate("home.title")}</h1>
      <p>{translate("home.greeting", { name: "Alice" })}</p>

      <button onClick={() => setLanguage("en")}>English</button>
      <button onClick={() => setLanguage("fr")}>Français</button>

      <small>Current language: {language}</small>
    </header>
  );
}
```

## Notes

- Translation values are merged deeply and flattened before use.
- Additional translation dictionaries can be added with `addTranslates(...)` when needed.
- The factory is designed to be instantiated once per app (or per isolated translation domain) and reused throughout the application.

## Typical use case

Use `translateContextFabric` when you want a dedicated translation context with:

- global translation state,
- dynamic language switching,
- a simple `translate()` API,
- persistent language preference,
- support for partial runtime translation injection.
