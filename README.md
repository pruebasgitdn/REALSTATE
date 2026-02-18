# Real State Platform
Plataforma inmobiliaria fullstack inspirada en Airbnb que permite publicar, comprar y reservar propiedades con integración de pagos mediante Stripe, comunicación en tiempo real y validación de disponibilidad.
El sistema está diseñado bajo una arquitectura modular cliente-servidor, con manejo de estado global y lógica de negocio robusta.

## Demo
### Frontend: Vercel
### Backend: Render
### Base de datos: MongoDB Atlas
### Pagos: Stripe Checkout (modo test)
(Agregar enlace y video demo)

## Características principales

### Acceso público
- Visualización de propiedades sin iniciar sesión
- Visualización del perfil del usuario y sus propiedades publicadas
- Filtros por precio, tipo (venta/alquiler) y búsqueda por texto

### Autenticación
- Registro e inicio de sesión con JWT en cookies HTTPOnly
- Protección de rutas privadas
- Persistencia de sesión

### Publicaciones
- Crear, editar e inhabilitar propiedades
- Subida de imágenes con Cloudinary
- Perfil público con listado de propiedades del usuario

### Comunicación
- Chat 1 a 1 en tiempo real con Socket.io
- Persistencia de mensajes en la BD vía MongoDB
- Notificaciones en tiempo real cuando:
- Se agenda una propiedad
- Se compra una propiedad
- Se recibe un mensaje

### Reservas
- Reservas por día o por mes
- Validación backend y frontend contra superposición de fechas
- Cálculo automatico del precio total
- Prevención de auto-reserva

### Compra de Propiedades
- Integración con Stripe Checkout
- Validación para impedir compra de propiedad propia
- Transferencia automática de propiedad (al comprador) tras pago exitoso
- Registro de ventas en colección Sales
- Notificación en tiempo real a comprador y vendedor en caso de novedad en sus propiedades

## Instalación Local

- **Backend**

```
cd server
npm install
npm run dev
```
Variables necesarias:
```
PORT
MONGO_URL
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_SECRET
CLOUDINARY_API_KEY
JWT_SECRET_KEY
STRIPE_SECRET_KEY
JWT_EXPIRES
COOKIE_EXPIRE

```

- **Frontend**
```
cd client
npm install
npm run dev
```


## Arquitectura
### Frontend
- React 19 + Vite
- Redux Toolkit
- Redux Persist
- React Router
- Ant Design
- Dayjs
- Framer Motion
- Socket.io-client
- Stripe.js


### Backend
**Node.js + Express**
- **Arquitectura modular, y sus modulos:**
  - users
  - listings
  - bookings
  - checkout
  - message
  - favorites

- MongoDB + Mongoose
- JWT + cookies seguras
- Stripe SDK
- Cloudinary
- Middlewares
- Validaciones con express-validator
- Sistema centralizado de errores

## Infraestructura
- **Vercel (Frontend)**
- **Render (Backend)**
- **MongoDB Atlas**
- **Stripe (modo test)**


## Flujo de Compra con Stripe
1. Usuario autenticado presiona “Comprar”
2. Se ejecuta el thunk que apunta al controlador goToPay
3. Dicho controlador crea la sesion de pago de Stripe
4. Stripe redirige al usuario a la pasarela de pago
- En caso de éxito se redirecciona a success
5. En success se ejecuta una verificación:
- Se consulta la sesión en Stripe.
- Se registra venta en la colección Sales y la persistencia en la BD 
- Se transfiere propiedad al nuevo propietario.
- Se emiten eventos Socket.io para notificar a ambas partes.

## Lógica de Reservas
**Validaciones implementadas:**
- Usuario no puede reservar su propia propiedad.
- Validación de formato de fechas.
- Fecha inicio < fecha fin.
  
Prevención de sobreponer reservas:
```
{
  publicacionId,
  $and: [
    { fechaInicio: { $lte: endDate } },
    { fechaFin: { $gte: startDate } }
  ]
}
```

**Cálculo automatico:**
- Por día
- Por mes (mínimo 28 días)
- Precio fijo (VENTA)

## Sistema de Chat
- Comunicación 1 a 1 en tiempo real.
- Persistencia en base de datos.
- Modal del chat carga historial al abrir.
- Notificaciones en tiempo real cuando:
- Se agenda propiedad (al dueño de la propiedad).
- Se compra propiedad (al antiguo propietario de la misma, que ya ha sido comprada/adquirida).

## Decisiones Técnicas Importantes
- Arquitectura modular en backend para mejorar la escalabilidad y separar responsabilidades entre modulos.
- Uso de metadata en Stripe para almacenar informacion relacionada al pago y a la venta de la propiedad.
- Verificación de sesión de pago en lugar de los Hooks de stripe.
- La prevención de duplicación de ventas mediante validación de session_id.
- Emisión de eventos en tiempo real tras operaciones de la pasarela de pago y el registro del Nuevo propietario con su nueva propiedad.
- Distribuir la lógica de negocio y transporte de datos (HTTP vs Socket).

## Retos Técnicos Enfrentados
- Manejo correcto de Stripe en modo test.
- Sincronizar la transferencia de propiedad al nuevo propietario tras el pago éxitoso.
- Prevención de compra o reserva de propiedad propia, mas bien implementado como logica del negocio.
- Validación robusta de superposición de fechas, en el server y cliente.
- Sincronización Redux + Socket para notificaciones.
- Manejo de cookies seguras en producción; las cuales en desarrollo no presentaron tantos retos.

## Mejoras Futuras
- Implementar los Hooks oficiales de Stripe para darle un mejor manejo a ese estado
- Sistema de roles (admin para regular la plataforma y el contenido)
- Dashboard analítico (para el admin)
- Calificaciones y reviews para los sitios de reserva
- Filtros avanzados por ubicación geográfica para facilitar la experiencia de busqueda y comodidad del usuario
- Panel de estadísticas para propietarios
