# Backend - Sistema de Protección del Analizador

Backend API para el sistema de protección del analizador con códigos únicos de activación.

## Características

- Sistema de autenticación con tokens opacos
- Gestión de códigos de activación
- Control global de desactivación
- Validación de códigos para el analizador
- Base de datos MongoDB

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. Inicializar base de datos:
```bash
npm run seed
```

4. Ejecutar servidor:
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## Variables de Entorno

```env
MONGODB_URI=mongodb://localhost:27017/analizador
JWT_SECRET=random_secret_key_analizador_2024
PORT=3001
NODE_ENV=development
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Login de administrador
- `POST /api/auth/logout` - Cerrar sesión

### Códigos (requiere autenticación)
- `GET /api/codes` - Listar códigos
- `POST /api/codes` - Generar nuevo código
- `PATCH /api/codes/:id` - Actualizar estado
- `DELETE /api/codes/:id` - Eliminar código

### Configuración (requiere autenticación)
- `GET /api/settings/global` - Estado global
- `PATCH /api/settings/global` - Toggle global

### Validación (pública)
- `POST /api/validate/validate` - Validar código
- `GET /api/validate/status` - Estado global

## Puertos
- Backend API: `http://localhost:3070`
- Panel Admin: `http://localhost:3071`

## Uso

1. Iniciar MongoDB
2. Ejecutar `npm run seed` para crear admin por defecto
3. Iniciar servidor con `npm run dev`
4. Acceder al panel admin en `http://localhost:3071`
5. Login con credenciales por defecto: `admin` / `admin123`
