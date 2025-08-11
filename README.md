<div align="center">
  <h1>🛒 Marketplace Prueba</h1>
  <p><strong>Aplicación desarrollada como <u>prueba técnica</u>.</strong></p>
  <p>Proyecto de marketplace construido con Next.js, DaisyUI, Prisma y Atomic Design.</p>
</div>

---

## 🚀 Descripción

Marketplace Prueba es una aplicación web moderna para la gestión de tiendas y productos, implementando Atomic Design y un estilo visual uniforme con DaisyUI. Permite a los usuarios crear tiendas, agregar productos, gestionar órdenes y explorar el catálogo de manera intuitiva.

---

## 🛠️ Tecnologías principales

- **Next.js 14** (App Router)
- **TypeScript**
- **Prisma ORM** (PostgreSQL)
- **DaisyUI** (sobre TailwindCSS)
- **Atomic Design** (atoms, molecules, organisms, templates)
- **NextAuth.js** (autenticación)
- **React Icons**

---

## 📁 Estructura del proyecto

```
src/
  app/
    (store)/         # Páginas principales del marketplace
    api/             # Rutas API (productos, tiendas, auth, seed)
  components/
    atoms/           # Elementos básicos reutilizables
    molecules/       # Combinaciones simples de átomos
    organisms/       # Componentes complejos y secciones
    templates/       # Layouts y plantillas de página
  lib/               # Utilidades, configuración de Prisma y auth
  store/             # Estado global (ej: carrito)
  types/             # Tipos TypeScript globales
public/              # Recursos estáticos
prisma/              # Esquema y migraciones de base de datos
```

---


## ⚡ Instalación y uso rápido

1. **Clona el repositorio:**
   ```bash
   git clone <repo-url>
   cd marketplace-prueba
   ```
2. **Configura el entorno:**
   - Renombra `.env.example` a `.env` y ajusta las variables si es necesario.
3. **Levanta todo con Docker Compose:**
   ```bash
   docker compose up --build
   ```
4. **Accede a** `http://localhost:3000`



**Notas importantes:**
- La base de datos utilizada es **PostgreSQL** (se crea automáticamente con Docker Compose).
- Los datos de prueba (usuarios, tiendas, productos) se generan usando **Faker.js** en el seed.
- El proceso de seed valida que las imágenes sean accesibles, por lo que poblar la base de datos puede tardar **hasta 5 minutos** en la primera ejecución. Ten paciencia mientras se crean tiendas y productos.
- El seed solo se ejecuta si la base de datos está vacía; si ya hay datos, no se vuelve a poblar automáticamente.

¡Eso es todo! No necesitas instalar nada más en tu máquina, solo tener Docker y Docker Compose instalados.

---

## 👤 Usuarios de prueba (seed)

### Usuarios BUSINESS (admin de tienda)

Puedes iniciar sesión como administrador de tienda con los siguientes usuarios:

| Email               | Contraseña |
|---------------------|:----------:|
| business1@gmail.com | abcd1234   |
| business2@gmail.com | abcd1234   |
| business3@gmail.com | abcd1234   |
| business4@gmail.com | abcd1234   |
| business5@gmail.com | abcd1234   |

### Usuarios CLIENT (cliente comprador)

Para probar como cliente, simplemente haz login con Google o GitHub desde la pantalla de acceso. No existe registro manual: la primera autenticación crea automáticamente tu usuario CLIENT. No hay usuarios CLIENT pre-cargados.




## ✅ Lista de chequeo de la prueba técnica

A continuación se detalla el cumplimiento de los objetivos y requisitos solicitados en la prueba técnica:

- [x] **Autenticación:** Sistema de autenticación implementado con NextAuth.js, un solo punto de entrada/login, manejo de dos tipos de usuario (Business y Cliente) y acceso diferenciado según rol.
- [x] **Business:** Puede registrarse/iniciar sesión, crear una o varias tiendas, crear productos asociados a cada tienda y ver un panel con los pedidos realizados a sus tiendas (solo los suyos).
- [x] **Cliente:** Puede navegar sin login (ver tiendas y productos), registrarse/iniciar sesión, comprar productos, y los pedidos quedan asociados correctamente a cliente, producto, tienda y negocio.
- [x] **Funcionalidades esperadas:** Listado de tiendas, productos por tienda, registro/login, compra de productos (solo logueado), creación de tiendas y productos, y panel de pedidos para negocios.
- [x] **Estructura y relaciones:** Código modular, uso correcto de relaciones en Prisma, manejo de permisos y rutas públicas/privadas.
- [x] **Frontend:** Formularios y navegación clara, separación de roles, calidad visual y usabilidad.
- [x] **Documentación:** README claro con instrucciones para correr localmente, configuración de .env y usuarios de prueba.


## 🧩 Atomic Design

El proyecto sigue la metodología Atomic Design:
- **Atoms:** Elementos básicos (botones, etiquetas)

---
- Gestión de órdenes
