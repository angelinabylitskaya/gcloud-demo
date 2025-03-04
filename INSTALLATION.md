# Create project from scratch

To develop same project from scratch, please follow these steps.
This is not a complete guide. Please follow these steps attentively.

- [Create project from scratch](#create-project-from-scratch)
  - [1. Install Angular CLI](#1-install-angular-cli)
  - [2. Create project](#2-create-project)
  - [3. (optional) Fix node version](#3-optional-fix-node-version)
      - [3.1 Via package.json](#31-via-packagejson)
      - [3.2 Via nvm](#32-via-nvm)
  - [4. Add Angular Material](#4-add-angular-material)
  - [5. Add Angular Fire](#5-add-angular-fire)
      - [5.1 Create Firebase Project](#51-create-firebase-project)
      - [5.2 Add Angular Fire](#52-add-angular-fire)
      - [5.4 Move config to .env file](#54-move-config-to-env-file)
  - [6. ESlint + Prettier + Husky](#6-eslint--prettier--husky)
  - [7. Run project](#7-run-project)
  - [8. Troubleshooting](#8-troubleshooting)

## 1. Install Angular CLI

```bash
npm install -g @angular/cli
```

If you have angular v19, node version 19...22 and see the following error:

```
⠏ Installing packages (npm)...npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR!
npm ERR! While resolving: gcloud-demo@0.0.0
npm ERR! Found: typescript@undefined
npm ERR! node_modules/typescript
npm ERR!   dev typescript@"~4.2.3" from the root project
npm ERR!
...
```

Use Angular v18.

## 2. Create project

```bash
ng new <project-name>
```

Example: `ng new gcloud-demo`

## 3. (optional) Fix node version

#### 3.1 Via package.json

```json
{
    "name": "<project-name>",
    "version": "0.0.0",
+    "engines" : {
+        "npm" : ">=10.9.0",
+        "node" : "22.10.0"
+    },
    ...
}
```

to enforce `npm install` to fail if versions does not match add the following file

```bash
cat > .npmrc << EOF
engine-strict=true
EOF
```

#### 3.2 Via nvm

Node Version Manager is a useful tool that allows to install multiple versions at once and switch between them.

[Install NVM](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/)

The following command will create a file to let NVM know what node version to use and switch automatically.

If you what to fix some specific version:

```bash
cat > .nvmrc << EOF
v22.10.0
EOF
```

Write a current node version:

```bash
node -v > .nvmrc
```

## 4. Add Angular Material

```bash
ng add @angular/material
```

## 5. Add Angular Fire

#### 5.1 Create Firebase Project

#### 5.2 Add Angular Fire

```bash
ng add @angular/fire
```

Select:

- Authentication
- Firestore
- Cloud Functions (callable)
- Cloud Storage
- Remote Config

Login with a google account.

Select project, then select an app.

After completing the `app.config.ts` file will be updated with required modules and configuration.

#### 5.4 Move config to .env file

[Article](https://medium.com/@desinaoluseun/using-env-to-store-environment-variables-in-angular-20c15c7c0e6a)

```bash
npm i @types/nodes
npm install @angular-builders/custom-webpack -D
npm install dotenv-webpack -D
```

WHen using angular 18 instead of Angular 19, use `npm install @angular-builders/custom-webpack@18 -D`

Make sure you have `"main": "src/main.ts",` instead of `"browser": "src/main.ts",` in `architect.build.options`.

```bash
sed -i '' 's/"types": \[\]/"types": ["node"]/' tsconfig.app.json
```

```bach
cat > src/custom-webpack.config.ts <<EOF
import Dotenv from 'dotenv-webpack';
module.exports = {
  plugins: [new Dotenv()],
};
EOF
```

Update angular.json to use custom webpack builder for build and serve.

Create `.env` file and fill it with values from the `app.config.ts`. Don't forget to ignore it.

```bash
cat > .env <<EOF
FIREBASE_PROJECT_ID=
FIREBASE_APP_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_MESSAGING_SENDER_ID=
EOF
```

Update [angular.json](./angular.json) with configurations.

Generate environments and modify:

`ng generate environments`

![alt text](image.png)

environment.ts:
```typescript
export const environment = {
    production: false,

    firebase: {
        projectId: process.env["FIREBASE_PROJECT_ID"],
        appId: process.env["FIREBASE_APP_ID"],
        storageBucket: process.env["FIREBASE_STORAGE_BUCKET"],
        apiKey: process.env["FIREBASE_API_KEY"],
        authDomain: process.env["FIREBASE_AUTH_DOMAIN"],
        messagingSenderId: process.env["FIREBASE_MESSAGING_SENDER_ID"],
    }
};

```

Update `app.config.ts` config with environment.
```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';
import {
  getRemoteConfig,
  provideRemoteConfig,
} from '@angular/fire/remote-config';
+import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
+      initializeApp(environment.firebase)
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideStorage(() => getStorage()),
    provideRemoteConfig(() => getRemoteConfig()),
  ],
};

```

## 6. ESlint + Prettier + Husky

[Article](https://imedbekaia.medium.com/eslint-husky-682cef0cd52c)

```bash
npm uninstall tslint
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-import eslint-plugin-jsdoc eslint-plugin-prettier eslint-plugin-eslint-comments
npm install --save-dev husky lint-staged
npx husky init
mkdir -p .husky && echo -e '#!/bin/sh\n. "$(dirname "$0")/_/husky.sh"\n\nnpx lint-staged' > .husky/pre-commit
chmod +x .husky/pre-commit
```

Update `tsconfig.app.json`:
```json
{
    ...,
    "include": [
        "src/**/*.d.ts",
+        "src/environments/*.ts"
    ]
}
```

```bash
cat > .eslintignore <<EOF
node_modules/
dist/
build/
EOF
```

```bash
cat > .eslintrc.json <<EOF
{
  "root": true,
  "ignorePatterns": ["projects/**/*"],
  "extends": ["plugin:prettier/recommended"],
  "overrides": [
    {
      "files": ["*.ts"],
      "extends": [
        "plugin:@angular-eslint/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended"
      ],
      "parserOptions": {
        "project": ["tsconfig.json"]
      },
      "rules": {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { "argsIgnorePattern": "^_" }
        ],
        "@angular-eslint/component-selector": [
          "error",
          { "type": "element", "prefix": "app", "style": "kebab-case" }
        ],
        "@angular-eslint/directive-selector": [
          "error",
          { "type": "attribute", "prefix": "app", "style": "camelCase" }
        ]
      }
    },
    {
      "files": ["*.html"],
      "extends": ["plugin:@angular-eslint/template/recommended"],
      "rules": {
        "max-len": ["error", { "code": 140 }],
        "prettier/prettier": "error"
      }
    }
  ]
}
EOF
```

When committing changes if error appears with not found config file, migrate config by running `npx  @eslint/migrate-config .eslintrc.json`

```bash
cat > .prettierrc <<EOF
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 80
}
EOF
```

```bash
cat > .lintstagedrc <<EOF
{
  "*.{ts,html}": [
    "eslint --fix",
    "prettier --write"
  ]
}
EOF
```

## 7. Run project

Update `package.json`:
```json
{
    ...,
    "scripts": {
        ...
        "start": "ng serve --configuration local",
}
```

`npm start`

## 8. Troubleshooting

```bash
rm -rf node_modules package-lock.json
npm install
```
