# 📖 Manual de Usuario - FinanzasScanner

## 🚀 Inicio Rápido

### Primera vez usando la app

1. **Instalación**
   - Abre la app en tu navegador Chrome
   - Toca "Instalar aplicación" cuando aparezca el mensaje
   - La app se agregará a tu pantalla de inicio

2. **Configuración inicial**
   - Ve a la pestaña "Ajustes" (⚙️)
   - Configura tu ingreso mensual estimado
   - Ajusta tu presupuesto máximo (recomendado: 75% del ingreso)

## 📱 Uso Diario

### Escanear un Ticket

1. **Tomar la foto**
   - En el Dashboard, toca el botón verde flotante con el ícono de cámara 📸
   - Permite el acceso a la cámara si es la primera vez
   - Toma una foto clara del ticket, asegurándote de que se vea bien el monto y el comercio

2. **Revisión automática**
   - La app procesará automáticamente la imagen
   - Extraerá el monto, nombre del comercio y fecha
   - Verás un formulario pre-llenado con estos datos

3. **Confirmar y guardar**
   - Revisa que los datos sean correctos
   - Ajusta cualquier campo si es necesario
   - Selecciona la categoría apropiada
   - Elige el método de pago
   - Si pagaste con tarjeta, ingresa el nombre de la tarjeta
   - Toca "Guardar"

4. **Confirmación**
   - Verás un check verde gigante de "¡Gasto guardado con éxito!"
   - Automáticamente volverás al Dashboard
   - El nuevo gasto ya aparecerá en tus estadísticas

### Entender el Dashboard

#### Tarjetas de Resumen
- **Verde (Ingresos)**: Tu ingreso mensual configurado
- **Azul/Roja (Gastos)**: Total gastado en el mes actual
  - Azul: Todo va bien
  - Roja: ¡Atención! Excediste tu presupuesto

#### Termómetro del Mes
- Barra de progreso visual que muestra el porcentaje de presupuesto consumido
- **Verde**: Vas bien (menos del 100%)
- **Rojo**: Excediste el presupuesto
- Si excedes, verás un mensaje de alerta con el monto excedido

#### Análisis por Método de Pago
- Tabla con desglose de gastos por:
  - 💸 Transferencia
  - 💳 Tarjeta
  - 💵 Efectivo
- Gráfico de dona interactivo

#### Distribución de Gastos
- Gráfico circular con porcentajes por categoría
- Lista detallada con montos por categoría
- Colores únicos para cada categoría

#### Uso de Tarjetas
- Gráfico de barras horizontal
- Muestra el consumo de cada tarjeta de crédito
- Ordenado de mayor a menor uso

### Buscar y Filtrar Gastos

1. **Búsqueda rápida**
   - Ve a la pestaña "Historial"
   - Escribe en la barra de búsqueda
   - Filtra en tiempo real por comercio o categoría

2. **Filtros avanzados**
   - Toca el botón "Filtros"
   - **Por período:**
     - Este Mes
     - Mes Pasado
     - Personalizado
   - **Por método de pago:**
     - Transferencia
     - Tarjeta
     - Efectivo
   - **Por categoría:**
     - Casa, Comida, Familia, etc.
   - Los filtros se pueden combinar

3. **Ver tickets guardados**
   - En cada gasto, si tiene ticket adjunto, verás un botón "Ver ticket"
   - Toca para ver la imagen a pantalla completa
   - Toca fuera de la imagen o la X para cerrar

### Configuración Avanzada

#### Ajustar Ingresos y Presupuesto

1. **Ingreso Mensual**
   - Ingresa tu ingreso total mensual
   - El presupuesto se ajustará automáticamente al 75%

2. **Presupuesto Máximo**
   - Desliza el slider para ajustar
   - Rango: 10% a 100% de tu ingreso
   - El porcentaje actual se muestra en tiempo real
   - Recomendado: 75% para ahorrar el 25%

#### Tema Claro/Oscuro

- **Activar Modo Oscuro:**
  - Ve a Ajustes
  - Toca el switch "Modo Oscuro"
  - El cambio es instantáneo

- **Ventajas del Modo Oscuro:**
  - Ahorra batería en pantallas OLED
  - Más cómodo en ambientes con poca luz
  - Reduce la fatiga visual

#### Exportar Datos

1. **Exportar a CSV:**
   - Ve a Ajustes
   - Toca "Exportar Datos a CSV"
   - Elige dónde guardar o compartir
   - El archivo incluye todos tus gastos

2. **Usar el CSV:**
   - Abre con Excel, Google Sheets o cualquier hoja de cálculo
   - Columnas: ID, Fecha, Comercio, Categoría, Monto, Método de Pago, Tarjeta

#### Borrar Datos

⚠️ **PRECAUCIÓN**: Estas acciones son irreversibles

1. **Borrar Último Mes:**
   - Elimina gastos de los últimos 30 días
   - Una confirmación

2. **Borrar Todos los Datos:**
   - Elimina TODOS los gastos
   - Resetea la configuración a valores por defecto
   - Triple confirmación para evitar errores

## 💡 Tips y Trucos

### Para mejores resultados con OCR:
- ✅ Toma la foto con buena iluminación
- ✅ Enfoca bien el ticket
- ✅ Asegúrate de que el ticket esté plano
- ✅ Evita sombras sobre el texto
- ✅ Fondos blancos funcionan mejor

### Organización de Gastos:
- 📝 Usa categorías consistentes
- 💳 Nombra tus tarjetas de forma clara (ej: "Visa Gold", "MasterCard Platino")
- 📅 Escanea tickets el mismo día de la compra
- 🔍 Revisa el Dashboard semanalmente

### Ahorro Inteligente:
- 🎯 Mantén el presupuesto en 75% de tus ingresos
- 📊 Revisa qué categoría consume más
- 💰 Si excedes, reduce gastos en categorías menos esenciales
- 📈 Exporta datos mensualmente para análisis

### Control de Tarjetas:
- 💳 Registra el nombre de cada tarjeta
- 📊 Usa el gráfico de tarjetas para ver cuál usas más
- 🎯 Distribuye gastos entre tarjetas según beneficios
- ⚠️ Si una tarjeta consume mucho, considera cambiar de método de pago

## 🔐 Privacidad

### ¿Dónde se guardan mis datos?
- **En tu dispositivo únicamente**
- Base de datos local (IndexedDB)
- Las imágenes se comprimen y guardan en tu teléfono
- Ningún dato sale de tu dispositivo

### ¿Necesito internet?
- **NO** - La app funciona 100% offline
- Solo necesitas internet para la instalación inicial
- OCR y procesamiento se hace en tu teléfono

### ¿Puedo usar en varios dispositivos?
- Actualmente cada instalación es independiente
- Los datos no se sincronizan entre dispositivos
- Puedes exportar CSV desde un dispositivo e importar manualmente en otro

## ❓ Preguntas Frecuentes

**P: ¿La app es gratis?**
R: Sí, completamente gratis y sin anuncios.

**P: ¿Necesito crear una cuenta?**
R: No, la app no requiere registro ni login.

**P: ¿Puedo editar un gasto después de guardarlo?**
R: Actualmente no hay función de edición, pero puedes borrar y volver a crear.

**P: ¿Qué pasa si desinstalo la app?**
R: Perderás todos los datos. Exporta a CSV antes de desinstalar.

**P: ¿Funciona en iPhone?**
R: Sí, es una app web progresiva que funciona en cualquier navegador moderno.

**P: ¿El OCR funciona con tickets en otros idiomas?**
R: El OCR está optimizado para español, pero puede funcionar con otros idiomas latinos.

**P: ¿Puedo cambiar las categorías?**
R: Actualmente las 8 categorías son fijas, pero puedes usar "Otros" para casos especiales.

**P: ¿Se pueden agregar gastos manualmente sin foto?**
R: Sí, puedes dejar el campo de ticket vacío y solo llenar el formulario.

## 📞 Soporte

Si tienes problemas o sugerencias:
- Revisa este manual primero
- Busca en las Preguntas Frecuentes
- Reporta bugs en GitHub
- Contacta: [tu-email@ejemplo.com]

---

**¡Disfruta gestionando tus finanzas de forma privada, simple y visual!** 💰✨
