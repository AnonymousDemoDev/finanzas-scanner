# FinanzasScanner 💰📱

**Aplicación web progresiva (PWA) 100% local-first para gestión de finanzas personales con escaneo inteligente de tickets**

## 🌟 Características Principales

### ✅ 100% Local y Privado
- **Sin servidores externos**: Todos los datos se almacenan en tu dispositivo
- **Base de datos local**: IndexedDB de alto rendimiento
- **Privacidad total**: Tus datos financieros nunca salen de tu teléfono
- **Funciona offline**: No requiere conexión a internet

### 📊 Dashboard Avanzado
- **Resumen ejecutivo** con ingresos vs gastos
- **Termómetro visual** del presupuesto mensual con alertas
- **Análisis por método de pago** (Transferencia, Tarjeta, Efectivo)
- **Gráficos interactivos** de distribución por categorías
- **Tracking de uso de tarjetas** de crédito

### 📸 Escaneo Inteligente de Tickets
- **Captura con cámara** del teléfono
- **OCR local** (Tesseract.js) para extraer datos automáticamente
- **Detección de monto, comercio y fecha**
- **Confirmación visual** antes de guardar

### 🔍 Historial Completo
- **Búsqueda en tiempo real** por comercio o categoría
- **Filtros avanzados** por fecha, método de pago y categoría
- **Visualización de tickets** almacenados
- **Ordenamiento cronológico** descendente

### ⚙️ Configuración Flexible
- **Ingreso mensual estimado** configurable
- **Presupuesto máximo** con slider dinámico (10%-100% del ingreso)
- **Modo oscuro** con cambio instantáneo
- **Exportar datos a CSV** con opción de compartir
- **Borrado selectivo** (último mes) o total con triple confirmación

### 🎨 Diseño UX Premium
- **Interfaz moderna** con Tailwind CSS
- **Modo claro/oscuro** automático
- **Animaciones fluidas** y feedback visual
- **Responsive design** optimizado para móviles
- **Navegación por pestañas** (Bottom Navigation)

## 📱 Instalación en Android

### Opción 1: Instalación Directa (Recomendada)

1. Abre el navegador Chrome en tu Android
2. Visita: `https://tu-dominio.com` (o localhost si estás en desarrollo)
3. Toca el menú ⋮ → "Instalar aplicación" / "Add to Home Screen"
4. La app se instalará como aplicación nativa
5. ¡Listo! Úsala como cualquier app de tu teléfono

### Opción 2: Desde el Código Fuente

Si quieres compilar desde el código:

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/finanzas-scanner.git
cd finanzas-scanner

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev

# 4. Construir para producción
npm run build

# 5. Los archivos compilados estarán en /dist
```

## 🚀 Tecnologías Utilizadas

- **React 19** - Framework UI moderno
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Styling utility-first
- **Zustand** - Gestión de estado minimalista
- **Dexie.js** - Wrapper de IndexedDB
- **Tesseract.js** - OCR local en el navegador
- **Recharts** - Gráficos interactivos
- **date-fns** - Manipulación de fechas
- **Lucide React** - Iconos modernos

## 📂 Estructura del Proyecto

```
finanzas-scanner/
├── public/
│   ├── manifest.json          # PWA Manifest
│   ├── icon-192.png           # Icono app 192x192
│   └── icon-512.png           # Icono app 512x512
├── src/
│   ├── components/
│   │   ├── tabs/
│   │   │   ├── DashboardTab.tsx      # Tab principal con gráficos
│   │   │   ├── HistorialTab.tsx      # Tab de historial y filtros
│   │   │   └── AjustesTab.tsx        # Tab de configuración
│   │   ├── CameraCapture.tsx         # Modal de captura y OCR
│   │   ├── ConfirmDialog.tsx         # Diálogos de confirmación
│   │   ├── LoadingSpinner.tsx        # Spinner de carga
│   │   └── SuccessAnimation.tsx      # Animación de éxito
│   ├── lib/
│   │   └── database.ts               # Configuración Dexie/IndexedDB
│   ├── store/
│   │   └── useAppStore.ts            # Store Zustand global
│   ├── utils/
│   │   ├── exportUtils.ts            # Exportación CSV
│   │   ├── imageUtils.ts             # Compresión de imágenes
│   │   └── ocrUtils.ts               # Procesamiento OCR
│   ├── App.tsx                       # Componente principal
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Estilos globales
├── package.json
└── README.md
```

## 🎯 Categorías de Gastos

La app incluye 8 categorías predefinidas:

1. 🏠 **Casa** - Alquiler, servicios, mantenimiento
2. 🍔 **Comida** - Supermercado, restaurantes
3. 👨‍👩‍👧 **Familia** - Educación, ropa, entretenimiento
4. 🚗 **Transporte** - Combustible, transporte público
5. ✈️ **Viajes** - Turismo, hospedaje
6. ❤️ **Salud** - Medicamentos, médicos
7. 📄 **Monotributo** - Impuestos, servicios profesionales
8. 📦 **Otros** - Gastos varios

## 🔒 Privacidad y Seguridad

- ✅ **Todos los datos se almacenan localmente** en el dispositivo
- ✅ **Sin conexión a servidores externos**
- ✅ **Sin tracking ni analytics**
- ✅ **Imágenes de tickets guardadas en el dispositivo**
- ✅ **OCR procesado 100% en el navegador**
- ✅ **Código fuente abierto y auditable**

## 📊 Métodos de Pago Soportados

- 💸 **Transferencia** - Transferencias bancarias
- 💳 **Tarjeta** - Tarjetas de crédito/débito (con nombre de tarjeta)
- 💵 **Efectivo** - Pagos en efectivo

## 🎨 Temas

- ☀️ **Modo Claro** - Fondo blanco, ideal para el día
- 🌙 **Modo Oscuro** - Fondo negro, ideal para la noche

## 📈 Próximas Mejoras (Roadmap)

- [ ] Gráficos de tendencias mensuales
- [ ] Presupuestos por categoría
- [ ] Recordatorios de gastos recurrentes
- [ ] Sincronización opcional entre dispositivos
- [ ] Reportes PDF exportables
- [ ] Widget para pantalla de inicio
- [ ] Soporte para múltiples monedas

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Si encuentras un bug o tienes una sugerencia:

1. Abre un Issue
2. Fork el proyecto
3. Crea una rama para tu feature
4. Commit tus cambios
5. Push a la rama
6. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto bajo licencia MIT.

## 👨‍💻 Desarrollo

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

## 🐛 Troubleshooting

### La cámara no funciona
- Asegúrate de dar permisos de cámara al navegador
- Usa HTTPS (la API de cámara requiere conexión segura)

### OCR no detecta texto correctamente
- Asegúrate de que la imagen sea clara y enfocada
- El OCR funciona mejor con fondos blancos
- Puedes editar manualmente los datos después del escaneo

### Los datos no persisten
- Verifica que IndexedDB esté habilitado en tu navegador
- No uses modo incógnito (los datos se borran al cerrar)

## 📞 Soporte

Para reportar problemas o hacer preguntas:
- Abre un Issue en GitHub
- Email: tu-email@ejemplo.com

---

**Hecho con ❤️ para ayudarte a gestionar tus finanzas personales de forma privada y eficiente**
