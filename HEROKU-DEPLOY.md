# 🚀 Guía de Despliegue en Heroku

## Variables de Entorno Requeridas

Configura las siguientes variables en Heroku:

```bash
# Variables críticas
heroku config:set MONGODB_URI="mongodb+srv://usuario:password@cluster.mongodb.net/analizador_db"
heroku config:set JWT_SECRET="tu_jwt_secret_super_seguro_aqui"
heroku config:set NODE_ENV="production"

# Variables opcionales
heroku config:set ADMIN_USERNAME="admin"
heroku config:set ADMIN_PASSWORD="tu_password_seguro"
```

## Comandos de Despliegue

```bash
# 1. Crear aplicación en Heroku
heroku create tu-app-name

# 2. Configurar variables de entorno
heroku config:set MONGODB_URI="tu_mongodb_uri"
heroku config:set JWT_SECRET="tu_jwt_secret"

# 3. Desplegar
git push heroku main

# 4. Verificar logs
heroku logs --tail

# 5. Abrir aplicación
heroku open
```

## Verificación Post-Despliegue

1. **Health Check**: `https://tu-app.herokuapp.com/api/health`
2. **Logs**: `heroku logs --tail`
3. **Variables**: `heroku config`

## Solución de Problemas

### Error H10 (App Crashed)
- Verificar que todas las variables de entorno estén configuradas
- Revisar logs: `heroku logs --tail`
- Verificar conexión a MongoDB

### Error de Base de Datos
- Verificar URI de MongoDB Atlas
- Comprobar whitelist de IPs
- Verificar credenciales

### Error de JWT
- Verificar que JWT_SECRET esté configurado
- Usar una clave segura de al menos 32 caracteres

## Monitoreo

```bash
# Ver estado de la aplicación
heroku ps

# Ver logs en tiempo real
heroku logs --tail

# Reiniciar aplicación
heroku restart
```
