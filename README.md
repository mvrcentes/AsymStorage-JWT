# AsymStorage-JWT

# 🔐 Proyecto Fullstack - Frontend + Backend

Este proyecto está dividido en dos partes: `front` y `back`. Utiliza **Vite** para el frontend y un entorno personalizado para el backend. Asegúrate de tener instalados **Node.js**, **npm** y **Bun** antes de comenzar.

## 🛠 Requisitos

- Node.js >= 18
- [Bun](https://bun.sh/)
- `.env` configurados en ambos directorios (`front/.env.local` y `back/.env.local`)

---


## 🚀 Instalación

### Instala dependencias
#### Frontend

```bash
cd front
npm install
bun install

```


#### Backend
```bash
cd ../back
npm install
bun install
```

### Variables de entorno

para frontend
```bash
frontend/.env.local

VITE_API_URL
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

para backend
```bash
backend/.env.local

PORT
PUBLIC_SUPABASE_URL
PUBLIC_SUPABASE_ANON_KEY
JWT_SECRET
SUPABASE_SERVICE_ROLE
```

Una vez que todo esté instalado y configurado, puedes iniciar los servidores de desarrollo:

En front:
```bash
npm run dev
```

En back:
```bash
npm run dev
```

📦 Stack Tecnológico

🧩 Frontend: React + Vite
🛠 Backend: Node.js (con Bun y npm)
🔐 JWT Authentication
📦 Bundler: Vite