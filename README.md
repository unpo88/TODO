# Toturial

## 1. Install Brew & Node & Yarn
``` shell
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
$ brew install node
$ brew install yarn --ignore-dependencies
```

## 2. Install Vite
``` shell
$ yarn create vite

# Project Name : frontend
# Select a framework: react
# Select a variant: TypeScript + SWC
```

## 3. Package 설치 후 최초 실행
``` shell
$ cd frontend
$ yarn install
# yarn dev
```

## 4. Emotion, Antd, UUID, Prettier, viteTsConfigPaths 등 설치
``` shell
$ yarn add antd @emotion/react @emotion/styled uuid 
$ yarn add -D prettier @types/uuid vite-tsconfig-paths
```

## 5. Vite Config 설정
#### tsconfig.json
``` json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "jsxImportSource": "@emotion/react", // 추가

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
    
    "paths": {
      "@frontend/*": ["src/*"],  // 추가
    },
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### vite.config.ts
``` ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
// plugins 추가
 plugins: [ 
    react({
      // NOTE: swc는 빌드 타겟을 es 버전으로 설정해야 함
      devTarget: "es2022",
      jsxImportSource: "@emotion/react",
      plugins: [["@swc/plugin-emotion", {}]],
    }),
    tsconfigPaths(),
  ],
});
```

### 폴더 구조

``` shell 
frontend
ㄴ src
   ㄴ todo
       ㄴ components
       ㄴ pages
       ㄴ types
   ㄴ Apps.tsx
   ㄴ main.tsx
```