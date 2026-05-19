# 🚀 Guía de Despliegue - FinanzasScanner

Esta guía te mostrará cómo desplegar tu aplicación FinanzasScanner en diferentes plataformas para que puedas usarla en tu teléfono Android sin necesidad de instalar nada en tu computadora.

## 📱 Opción 1: Netlify (Recomendado - Gratis)

### Paso 1: Preparar el Repositorio

1. Crea una cuenta en [GitHub](https://github.com) si no tienes
2. Crea un nuevo repositorio llamado `finanzas-scanner`
3. Sube todo el código a GitHub:

```bash
git init
git add .
git commit -m "Initial commit - FinanzasScanner"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/finanzas-scanner.git
git push -u origin main
```

### Paso 2: Desplegar en Netlify

1. Ve a [Netlify](https://www.netlify.com) y crea una cuenta gratuita
2. Click en "Add new site" → "Import an existing project"
3. Selecciona GitHub y autoriza el acceso
4. Elige tu repositorio `finanzas-scanner`
5. Configuración de build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click en "Deploy site"

### Paso 3: Configurar Dominio Personalizado (Opcional)

1. En el dashboard de Netlify, ve a "Domain settings"
2. Puedes usar el dominio gratis que te da Netlify (ej: `finanzas-scanner.netlify.app`)
3. O configurar tu propio dominio personalizado

### Paso 4: Instalar en tu Android

1. Abre Chrome en tu Android
2. Visita tu URL de Netlify
3. Toca el menú ⋮ → "Instalar aplicación"
4. ¡Listo! La app está en tu pantalla de inicio

---

## 🌐 Opción 2: Vercel (Gratis)

### Despliegue Automático

1. Ve a [Vercel](https://vercel.com) y crea una cuenta
2. Click en "Add New Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Vite
5. Click en "Deploy"
6. Tu app estará en `https://finanzas-scanner.vercel.app`

### Configuración Manual (si es necesario)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

---

## 📦 Opción 3: GitHub Pages (Gratis)

### Paso 1: Configurar Vite para GitHub Pages

Edita `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/finanzas-scanner/', // ← Agrega esta línea
})
```

### Paso 2: Instalar gh-pages

```bash
npm install --save-dev gh-pages
```

### Paso 3: Agregar scripts en package.json

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Paso 4: Desplegar

```bash
npm run deploy
```

Tu app estará en: `https://TU-USUARIO.github.io/finanzas-scanner/`

---

## 🔧 Opción 4: Servidor Propio (VPS/Cloud)

### Con Docker

1. Crea un `Dockerfile`:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Crea `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache de assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

3. Construir y ejecutar:

```bash
docker build -t finanzas-scanner .
docker run -p 80:80 finanzas-scanner
```

---

## 🌍 Opción 5: Firebase Hosting (Gratis)

### Paso 1: Instalar Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### Paso 2: Inicializar Firebase

```bash
firebase init hosting
```

Configuración:
- Public directory: `dist`
- Single-page app: `Yes`
- Set up automatic builds: `No`

### Paso 3: Desplegar

```bash
npm run build
firebase deploy
```

Tu app estará en: `https://TU-PROYECTO.web.app`

---

## 🎯 Opción 6: Cloudflare Pages (Gratis)

1. Ve a [Cloudflare Pages](https://pages.cloudflare.com)
2. Conecta tu repositorio de GitHub
3. Configuración:
   - Build command: `npm run build`
   - Build output: `dist`
4. Deploy

---

## ✅ Verificar que funciona correctamente

Después del despliegue, verifica:

1. ✅ La app carga correctamente
2. ✅ Puedes instalarla como PWA en Android
3. ✅ La cámara funciona (requiere HTTPS)
4. ✅ Los datos se guardan localmente
5. ✅ El modo oscuro funciona
6. ✅ Los gráficos se renderizan correctamente
7. ✅ Funciona offline después de la primera carga

---

## 🔒 Importante: HTTPS

⚠️ **La cámara solo funciona con HTTPS**

Todas las opciones mencionadas proveen HTTPS automáticamente. Si usas un servidor propio, asegúrate de configurar SSL/TLS con Let's Encrypt:

```bash
# Con Certbot
sudo certbot --nginx -d tu-dominio.com
```

---

## 📱 Compartir con Familia/Amigos

### Opción A: Compartir URL
1. Envía la URL de tu app por WhatsApp
2. Ellos la abren en Chrome
3. Instalan desde el navegador

### Opción B: Generar QR
1. Usa [qr-code-generator.com](https://www.qr-code-generator.com)
2. Pega tu URL
3. Descarga el QR
4. Comparte la imagen
5. Escanean con la cámara del teléfono

---

## 🔄 Actualizaciones Automáticas

### Netlify/Vercel (Automático)
Cada vez que hagas `git push` a GitHub, se desplegará automáticamente.

### GitHub Actions (Para cualquier servidor)

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2
      with:
        publish-dir: './dist'
        production-branch: main
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 🐛 Solución de Problemas

### La app no se instala en Android
- Verifica que esté en HTTPS
- Asegúrate de que `manifest.json` esté correctamente configurado
- Usa Chrome o Edge en Android

### La cámara no funciona
- Verifica que la URL sea HTTPS (no HTTP)
- Da permisos de cámara al navegador
- Prueba en modo incógnito primero

### Los datos se pierden
- No uses modo incógnito
- Verifica que IndexedDB esté habilitado
- No limpies datos del navegador

### Build falla
```bash
# Limpia cache y reinstala
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📊 Monitoreo (Opcional)

Para saber si hay errores en producción, puedes agregar:

### Sentry (Gratis hasta 5k eventos/mes)

```bash
npm install @sentry/react
```

En `main.tsx`:

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "TU_DSN_DE_SENTRY",
  environment: "production"
});
```

---

## 🎉 ¡Listo!

Tu app ahora está:
- ✅ Desplegada en la nube
- ✅ Accesible desde cualquier lugar
- ✅ Instalable en Android como app nativa
- ✅ Funcionando 100% offline
- ✅ Actualizable automáticamente

**¡Disfruta de tu aplicación de finanzas personales!** 💰📱
