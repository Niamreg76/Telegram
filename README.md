# Application de Chat en Ligne Nostr

![image](https://github.com/user-attachments/assets/e446a850-957b-454c-a879-e03fda21dea7)


Cette application est une application de chat en ligne construite avec React, TypeScript et Vite. Elle utilise le protocole Nostr pour la communication sécurisée entre les utilisateurs.

## Fonctionnalités

- Connexion avec une clé privée Nostr
- Génération de nouvelles clés privées et publiques
- Ajout de contacts avec leur clé publique
- Envoi et réception de messages en temps réel
- Interface utilisateur réactive et moderne

## Installation

1. Clonez le dépôt :
   ```sh
   git clone https://github.com/votre-utilisateur/votre-repo.git
   cd votre-repo
   ```

2. Installez les dépendances :
   ```sh
   npm install
   ```

3. Démarrez le serveur de développement :
   ```sh
   npm run dev
   ```

## Configuration ESLint

Pour une meilleure qualité de code, nous recommandons de configurer ESLint avec des règles de type-aware :

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

Vous pouvez également installer les plugins [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) et [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) pour des règles spécifiques à React :

```js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## Utilisation

1. Connectez-vous avec votre clé privée Nostr ou générez une nouvelle clé.
2. Ajoutez des contacts en utilisant leur clé publique.
3. Sélectionnez un contact pour commencer une conversation.
4. Envoyez et recevez des messages en temps réel.

## Dépendances

- React
- TypeScript
- Vite
- Nostr-tools
- Lucide-react
- React-icons

## Scripts

- `npm run dev` : Démarre le serveur de développement
- `npm run build` : Compile l'application pour la production
- `npm run lint` : Lint le code source

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
