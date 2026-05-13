# Guía de Despliegue - Genli Energy

## Arquitectura
- **Frontend**: Vercel (gratis)
- **Backend**: Render (gratis)
- **Base de datos**: PlanetScale (gratis) o MySQL de cualquier proveedor

---

## Paso 1: Base de Datos (PlanetScale - Gratis)

1. Ve a https://planetscale.com y crea cuenta gratis
2. Crea una nueva base de datos "genli_energy"
3. Consigue las credenciales:
   - Host: `aws.connect.psdb.cloud`
   - Username: `xxx`
   - Password: `xxx`
   - Database: `genli_energy`

---

## Paso 2: Backend (Render - Gratis)

1. Ve a https://render.com y crea cuenta (GitHub)
2. Click "New" → "Blueprint"
3. Conecta tu repo de GitHub

### Crear archivo `render.yaml` en backend:

```yaml
services:
  - type: web
    name: genli-api
    env: php
    buildCommand: composer install --no-dev --optimize-autoloader
    startCommand: php artisan migrate && php -S 0.0.0.0:$PORT/public/index.php
    envVars:
      - key: APP_ENV
        value: production
      - key: APP_KEY
        sync: false
      - key: APP_DEBUG
        value: false
      - key: DB_CONNECTION
        value: mysql
      - key: DB_HOST
        fromDatabase:
          name: genli-db
          property: host
      - key: DB_PORT
        value: "3306"
      - key: DB_DATABASE
        fromDatabase:
          name: genli-db
          property: database
      - key: DB_USERNAME
        fromDatabase:
          name: genli-db
          property: username
      - key: DB_PASSWORD
        fromDatabase:
          name: genli-db
          property: password
```

### Configuración manual en Render:
1. Web Service
2. Repository: tu-repo/backend
3. Region: Oregon (o más cercano)
4. Branch: main
5. Root Directory: backend
6. Build Command: `composer install`
7. Start Command: `php artisan migrate && php -S 0.0.0.0:$PORT/public/index.php`

### Variables de entorno en Render:
```
APP_ENV=production
APP_KEY=base64:GENERAR_NUEVA_KEY
APP_DEBUG=false
APP_URL=https://tu-backend.onrender.com
DB_CONNECTION=mysql
DB_HOST=aws.connect.psdb.cloud
DB_PORT=3306
DB_DATABASE=genli_energy
DB_USERNAME=xxx
DB_PASSWORD=xxx
```

**Para generar APP_KEY nueva:**
```bash
php artisan key:generate --show
```

---

## Paso 3: Frontend (Vercel - Gratis)

1. Ve a https://vercel.com y conecta tu repo
2. Framework: Vite
3. Root Directory: frontend
4. Build Command: `npm run build`
5. Output Directory: `dist`

### Variables de entorno en Vercel:
```
VITE_API_URL=https://tu-backend.onrender.com
```

---

## Paso 4: Actualizar Código

### 1. Actualizar .env del backend con la key de producción:
```
APP_KEY=base64:TU_KEY_GENERADA
```

### 2. Actualizar CORS en config/cors.php con las URLs reales:
```php
'allowed_origins' => ['https://tu-frontend.vercel.app', 'http://localhost:5173'],
```

### 3. Subir a GitHub y desplegar

---

## URLs después del despliegue

| Servicio | URL |
|----------|-----|
| Frontend | `https://genli-energy.vercel.app` |
| Backend API | `https://genli-api.onrender.com` |

---

## Comandos útiles

### Verificar conexión a base de datos:
```bash
php artisan db:show
```

### Ejecutar migraciones en producción:
```bash
php artisan migrate --force
```

### Ver logs de errores:
```bash
php artisan logs:show
```

---

## Troubleshooting

### Error 500 en API:
- Verificar APP_KEY en variables de entorno
- Verificar credenciales de base de datos
- Revisar logs en Render

### CORS error:
- Agregar URL del frontend en config/cors.php

### Base de datos no conecta:
- Verificar que IP de Render esté whitelist en PlanetScale
- Revisar credenciales en variables de entorno