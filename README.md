# FutboLink App

App móvil de FutboLink (React Native + Expo + TypeScript).

Estado: prototipo con **datos de ejemplo**, todavía sin conexión a la API real.
El plan por etapas está en el proyecto "FutboLink" de Claude (`plan-app-movil`).

## Cómo correrla

```bash
npm install
npx expo start --web
```

- `npx expo start --web` la abre en el navegador (útil para desarrollar).
- En iPhone, Expo Go 57 pide iniciar sesión en Expo y hoy tiene un bug de login (expo/expo#50085 y #50246). Para probar en el teléfono: Android con Expo Go, o un development build.

## Estructura

```
App.tsx                  Navegación (pestañas) y estado de sesión de prueba
src/theme.ts             Colores y medidas de FutboLink
src/data.ts              Datos de ejemplo y tipos
src/components/          OfferCard, TabBar
src/screens/             Auth, Mercado, Oferta, Buscar, Perfil
```

## Reglas

- Nunca subir claves, contraseñas ni archivos `.env` a este repo.
- Textos de la app en 4 idiomas (es, en, it, pt) cuando se conecte con la web.
