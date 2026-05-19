# ⚡ Inicio Rápido - FinanzasScanner

## 🚀 En 5 Minutos

### Opción A: Usuario Final (Sin Código)

**Paso 1:** Abre Chrome en tu Android
```
📱 Abre Google Chrome
```

**Paso 2:** Visita la app desplegada
```
🌐 Ir a: https://tu-app.netlify.app
(Reemplaza con tu URL real después del deploy)
```

**Paso 3:** Instala como app
```
⋮ Menú → "Instalar aplicación"
✅ ¡Listo! Ahora está en tu pantalla de inicio
```

**Paso 4:** Configura tus finanzas
```
⚙️ Ajustes → Ingresa tu salario mensual
📊 Ajusta tu presupuesto (recomendado: 75%)
```

**Paso 5:** Empieza a usar
```
📸 Toca el botón verde → Escanea un ticket
📊 Ve tus estadísticas en el Dashboard
```

---

### Opción B: Desarrollador (Deploy Propio)

#### Deploy Rápido en Netlify (5 minutos)

**1. Sube a GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/finanzas-scanner.git
git push -u origin main
```

**2. Deploy en Netlify**
```
1. Ve a https://netlify.com
2. Login con GitHub
3. "New site from Git"
4. Selecciona tu repo
5. Build command: npm run build
6. Publish directory: dist
7. Deploy!
```

**3. Listo**
```
🎉 Tu app está en: https://TU-APP.netlify.app
```

---

#### Desarrollo Local (2 minutos)

```bash
# 1. Clona el repo
git clone https://github.com/TU-USUARIO/finanzas-scanner.git
cd finanzas-scanner

# 2. Instala dependencias
npm install

# 3. Ejecuta en dev
npm run dev

# 4. Abre en navegador
# http://localhost:5173
```

---

## 📱 Primera Vez Usando la App

### Setup Inicial (1 minuto)

```
1. Abre la app
2. Ve a "Ajustes" (pestaña derecha)
3. Ingresa tu salario mensual (ej: $15,000)
4. El presupuesto se ajusta automáticamente a 75%
5. Ajusta si quieres (slider)
6. ¡Listo para usar!
```

### Escanear tu Primer Ticket (30 segundos)

```
1. Toca el botón verde flotante (cámara)
2. Permite acceso a la cámara
3. Toma foto del ticket
4. La app extrae automáticamente:
   - Monto
   - Comercio
   - Fecha
5. Revisa los datos
6. Selecciona categoría (ej: Comida)
7. Selecciona método de pago
8. Toca "Guardar"
9. ¡Check verde = Guardado! ✅
```

### Ver tus Estadísticas (Inmediato)

```
Dashboard automáticamente muestra:
✅ Total de ingresos vs gastos
✅ Porcentaje de presupuesto usado
✅ Gráficos por categoría
✅ Desglose por método de pago
```

---

## 💡 Tips Rápidos

### Para Mejores Resultados con OCR
```
✅ Buena luz
✅ Ticket plano
✅ Enfoque nítido
✅ Fondo blanco
```

### Categorías Disponibles
```
🏠 Casa       - Alquiler, servicios
🍔 Comida     - Super, restaurantes
👨‍👩‍👧 Familia    - Educación, ropa
🚗 Transporte - Combustible, transporte
✈️ Viajes     - Turismo
❤️ Salud      - Médicos, medicamentos
📄 Monotributo- Impuestos
📦 Otros      - Varios
```

### Métodos de Pago
```
💸 Transferencia
💳 Tarjeta (especifica el nombre)
💵 Efectivo
```

---

## 🎯 Casos de Uso Comunes

### Caso 1: Compra en el Super
```
1. Pagas en caja
2. Recibes ticket
3. Abres FinanzasScanner
4. Escaneas ticket
5. Categoría: Comida
6. Método: Tarjeta → "Visa Gold"
7. Guardar
```

### Caso 2: Pago de Alquiler
```
1. Abres app
2. Botón cámara
3. Tomar foto del recibo
4. Categoría: Casa
5. Método: Transferencia
6. Guardar
```

### Caso 3: Revisar Gastos del Mes
```
1. Dashboard → Ver termómetro
2. Si está en verde (< 75%) → ¡Vas bien!
3. Si está en rojo (> 100%) → Reducir gastos
4. Historial → Ver detalle por categoría
```

### Caso 4: Exportar para Análisis
```
1. Ajustes
2. "Exportar Datos a CSV"
3. Compartir → Google Drive / Email
4. Abrir en Google Sheets
5. Analizar tendencias
```

---

## 🔧 Solución Rápida de Problemas

### "La cámara no funciona"
```
✅ Usa HTTPS (no HTTP)
✅ Da permisos al navegador
✅ Recarga la página
```

### "OCR no detecta el monto"
```
✅ Toma foto más clara
✅ Mejora la iluminación
✅ Si falla, edita manualmente (está bien!)
```

### "Los datos desaparecieron"
```
❌ ¿Usaste modo incógnito?
❌ ¿Borraste datos del navegador?
✅ Próxima vez: Exporta CSV mensualmente
```

### "No puedo instalar la app"
```
✅ Usa Chrome en Android
✅ Debe ser HTTPS
✅ Espera el mensaje de instalación
✅ O: Menú → "Añadir a pantalla de inicio"
```

---

## 📚 Documentación Completa

Para información detallada, consulta:

- **[README.md](README.md)** - Overview general
- **[MANUAL_USUARIO.md](MANUAL_USUARIO.md)** - Manual completo de usuario
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Guía de despliegue
- **[BEST_PRACTICES.md](BEST_PRACTICES.md)** - Mejores prácticas financieras
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Resumen técnico

---

## ❓ Preguntas Frecuentes

**¿Es gratis?**  
✅ Sí, 100% gratis sin anuncios ni suscripciones

**¿Mis datos están seguros?**  
✅ Sí, todo se guarda localmente en tu teléfono

**¿Necesito internet?**  
❌ No, funciona completamente offline

**¿Funciona en iPhone?**  
✅ Sí, en Safari 14+

**¿Puedo editar gastos?**  
⚠️ No actualmente, pero puedes borrar y volver a crear

**¿Se sincroniza entre dispositivos?**  
❌ No, cada dispositivo es independiente

**¿Puedo hacer backup?**  
✅ Sí, exporta a CSV desde Ajustes

---

## 🎉 ¡Ya Estás Listo!

```
✅ App instalada
✅ Configuración completa
✅ Primer gasto registrado
✅ Dashboard funcionando

Ahora solo:
1. Escanea tickets diariamente
2. Revisa el dashboard semanalmente
3. Ajusta presupuesto mensualmente
4. ¡Ahorra más! 💰
```

---

## 📞 Soporte

- **Problemas:** Abre un Issue en GitHub
- **Preguntas:** Lee el manual de usuario
- **Sugerencias:** Pull Request bienvenido

---

**¡Disfruta de FinanzasScanner y toma control de tus finanzas!** 💚📱

---

### Siguiente Paso Recomendado

👉 **[Leer el Manual de Usuario](MANUAL_USUARIO.md)** para aprovechar todas las funciones
