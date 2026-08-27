# 🎲 The Corner — WebApp Oficial (Drinks · Board Games & Entertainment)

WebApp interactiva y sistema de operaciones para **The Corner** (`@cornermcbo`, Calle 72 con Av. 10, Maracaibo, Zulia). Desarrollada con **Next.js + TypeScript + Tailwind CSS + Motion + Canvas Confetti + QRCode**.

---

## 🚀 Correr Localmente

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo local
npm run dev

# 3. Abrir en el navegador
# http://localhost:3000
```

---

## 🎮 Módulos y Funcionalidades Implementadas

1. **🎲 Ludoteca Digital Interactiva (50+ Juegos de Mesa)**:
   - Base de datos categorizada (Estrategia, Party Games, Cooperativos, Rol & D&D, Duelos 1v1, Cartas Rápidas).
   - Filtros dinámicos por número de jugadores, tiempo de partida y dificultad.
   - Ficha detallada con reglas express, sinopsis y botón para solicitar el juego o llamar al Game Master a la mesa.

2. **🎲 Selector IA / Tirador de Dado D20**:
   - Widget interactivo que simula una tirada de dado de 20 caras y recomienda el juego ideal según el grupo y tiempo disponible.

3. **🧪 Carta & Mixología Temática (Menú Digital)**:
   - Pociones mágicas con glitter UV, cócteles de autor, cervezas, baldes, burgers Angus y nachos volcánicos.
   - Switch de divisas en tiempo real **USD ($) / VES (Bs.)** a tasa oficial BCV.
   - Botón de adición directa a la comanda.

4. **🎟️ Módulo de Reservaciones con Pase VIP QR**:
   - Planes para Mesa Gamer (Ludoteca Ilimitada), Salón VIP Mazmorra (Cumpleaños y Eventos), Noche de Stand-Up Comedy y Barra.
   - Generación de **Pase Digital con código QR escaneable en vivo** (`#CRN-XXXX`) y botón de confirmación directa hacia WhatsApp.

5. **🛒 Comanda Digital & Carrito (Drawer Lateral)**:
   - Cálculo automático de subtotales, propina opcional al staff y notas de cocina/barra.
   - Checkout automatizado en 1 toque directo a WhatsApp con comanda estandarizada.

6. **📅 Agenda Semanal de Eventos & Torneos**:
   - Miércoles de Stand-Up Comedy, Jueves de Torneos de Catan/Codenames, Viernes de Glow UV Party, Sábados de Party Games y Domingos de D&D.

7. **🛡️ Dashboard del Gerente (Manager Mode)**:
   - Acceso desde la cabina superior o mediante `?gerente=true` / `?admin=true`.
   - KPIs en tiempo real (mesas ocupadas, juegos prestados, ventas estimadas del día, ticket promedio).
   - Control y modificación de la tasa BCV oficial.
   - Monitor de qué juego de mesa está prestado en qué mesa en vivo.
   - Gestor de estados de reservas (Confirmada, En Mesa, Pendiente, Finalizada).

8. **📍 Ubicación GPS & Contacto**:
   - Botones directos a Google Maps, Waze, Instagram y WhatsApp.

---

## 🛠️ Dónde Editar Contenidos

| Qué                                  | Archivo                 |
| ------------------------------------ | ----------------------- |
| Catálogo de 50+ Juegos de Mesa       | `data/cornerData.ts`    |
| Carta de Pociones, Tragos y Comida   | `data/cornerData.ts`    |
| Planes de Reserva y Precios          | `data/cornerData.ts`    |
| Agenda de Eventos Semanales          | `data/cornerData.ts`    |
| Teléfono, Instagram y Dirección      | `lib/config.ts`         |
| Tasa de cambio BCV por defecto       | `data/currencies.ts`    |

---

## 🌐 Deploy en Vercel

1. Sube el proyecto a tu repositorio de GitHub.
2. Importa el repositorio en Vercel.
3. Deploy instantáneo (listo para producción con PWA configurado).
