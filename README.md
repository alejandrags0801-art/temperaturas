# 🌡️ Convertidor de Temperatura

> Una aplicación web sencilla, bonita y accesible para convertir temperaturas entre
> **grados Celsius (°C)**, **grados Fahrenheit (°F)** y **Kelvin (K)**.
> Diseñada especialmente para que **las personas mayores** la usen sin ayuda: letra grande,
> botones enormes, alto contraste y resultados que se pueden escuchar.

---

## 📌 ¿Qué es esto?

Es una **página web de un solo archivo** (HTML + CSS + JavaScript, sin instalar nada).
Se abre en cualquier navegador (Chrome, Edge, Firefox…) y funciona sin conexión a internet
(solo necesita conexión la primera vez para cargar la letra especial).

### ¿Para qué sirve?

- 👵 Para una persona mayor que quiere saber si **37 °C es fiebre** (son 98.6 °F).
- 🍳 Para quien sigue una receta en grados Fahrenheit y su horno usa Celsius.
- 🧪 Para estudiantes o curiosos que quieren **entender cómo se convierten** las temperaturas.
- 🎓 Para aprender de forma visual: cada resultado muestra **la fórmula utilizada**.

---

## 🎯 Objetivo del diseño

La app se construyó pensando en **personas mayores**, con estas decisiones clave:

| Necesidad de la persona mayor | Solución en la app |
|---|---|
| Ver mal de cerca | Letra grande (texto ≥ 20px, resultados de 40–56px) |
| Distinguir colores | Alto contraste (cumple WCAG AA) |
| Pulso menos preciso | Botones táctiles enormes (≥ 48px) |
| Dificultad con teclados pequeños | Teclado numérico en pantalla, botones de un toque |
| Mala vista / cansancio visual | 🔊 Botón "Escuchar" que lee el resultado en voz alta |
| Confusión con pantallas cargadas | Una sola tarea por pantalla, nada oculto en menús |
| Sensibilidad a parpadeos | Sin animaciones molestas (respeta `prefers-reduced-motion`) |
| Miedo a equivocarse | Mensajes de error amables y en lenguaje sencillo |

---

## 🧩 Funciones

- ✅ **Conversión en tiempo real**: escribe y los resultados aparecen al instante.
- ✅ **Las 6 conversiones**: °C↔°F, °C↔K y °F↔K.
- ✅ **Selector de unidad** con 3 botones grandes.
- ✅ **Teclado numérico táctil** (para tablet o para no usar el teclado físico).
- ✅ **Botón "Usar como punto de partida"**: convierte al revés con un toque.
- ✅ **Tabla de temperaturas de referencia**: fiebre, congelación, etc. Toca un valor y se carga solo.
- ✅ **Modo claro / oscuro** con preferencia recordada.
- ✅ **Lectura en voz alta** de los resultados (Web Speech API).
- ✅ **Fórmula visible** en cada resultado para aprender el cálculo.
- ✅ **Validación amable** (por ejemplo: "Kelvin no puede ser menor que 0").

---

## 🗂️ Estructura del proyecto

```
convertidor-temperatura/
│
├── 📄 index.html      → Estructura de la página (accesible, con ARIA)
├── 🎨 styles.css      → Diseño: colores, letra grande, botones táctiles
├── ⚙️  app.js          → Lógica: conversiones, eventos, voz, temas
└── 📖 README.md       → Este documento
```

**¿Cómo funciona por dentro?**

```
 ┌─────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
 │ El usuario  │──▶│ app.js       │──▶│ Fórmulas     │──▶│ Resultados   │
 │ escribe 25  │   │ (JavaScript) │   │ (C → F, etc.)│   │ en pantalla  │
 └─────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
```

La lógica usa un **truco elegante**: todo se convierte pasando primero por Celsius.
Así, en vez de 6 fórmulas sueltas, solo hay 2 funciones: *"de cualquier unidad a Celsius"*
y *"de Celsius a cualquier unidad"*.

---

## 🚀 Cómo usarla

1. **Descarga o clona** este repositorio.
2. Haz **doble clic** en `index.html`.
3. ¡Listo! Se abre en tu navegador.

> 💡 **Consejo**: para compartirla con una persona mayor, puedes copiar los 3 archivos a
> su equipo o incluso enviarle el `index.html` — funciona sin servidor.

### Uso paso a paso

```
1. Escribe el número        →  por ejemplo:  37
2. Toca la unidad del dato  →  °C  °F  K     (toca "Grados Celsius")
3. Lee los resultados       →  98.6 °F  y  310.15 K
4. (Opcional) Pulsa 🔊      →  el navegador lo lee en voz alta
```

---

## 🧮 Cómo se convierte (la parte divulgativa)

### ¿Qué es cada escala?

| Escala | ¿Qué mide? | Punto de congelación del agua | Punto de ebullición del agua |
|---|---|---|---|
| **Celsius (°C)** | Temperatura cotidiana (métrico) | 0 °C | 100 °C |
| **Fahrenheit (°F)** | Temperatura cotidiana (EE. UU., recetas) | 32 °F | 212 °F |
| **Kelvin (K)** | Temperatura en ciencia; **no puede ser negativa** | 273.15 K | 373.15 K |

> 🧊 **Dato curioso**: el **cero absoluto** (0 K = −273.15 °C = −459.67 °F) es la temperatura
> más baja posible en el universo. Por eso Kelvin nunca es negativo.

### Las fórmulas

| Conversión | Fórmula | Ejemplo |
|---|---|---|
| °C → °F | `(C × 9/5) + 32` | 25 °C → **77 °F** |
| °C → K | `C + 273.15` | 25 °C → **298.15 K** |
| °F → °C | `(F − 32) × 5/9` | 77 °F → **25 °C** |
| °F → K | `(F − 32) × 5/9 + 273.15` | 77 °F → **298.15 K** |
| K → °C | `K − 273.15` | 298.15 K → **25 °C** |
| K → °F | `(K − 273.15) × 9/5 + 32` | 298.15 K → **77 °F** |

### Valores de referencia (para comprobar que todo funciona)

| Entrada | Salida esperada |
|---|---|
| 0 °C | 32 °F = 273.15 K (agua se congela) |
| 100 °C | 212 °F = 373.15 K (agua hierve) |
| −40 °C | −40 °F = 233.15 K (¡el punto donde coinciden C y F!) |
| 37 °C | 98.6 °F = 310.15 K (temperatura corporal) |
| 300 K | 26.85 °C = 80.33 °F |

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura y accesibilidad (ARIA, etiquetas `<label>`) |
| **CSS3** | Diseño, temas claro/oscuro, diseño responsive |
| **JavaScript (vanilla)** | Lógica pura, sin librerías ni frameworks |
| **Web Speech API** | Lectura en voz alta de los resultados |
| **Google Fonts** | Letra *Atkinson Hyperlegible* (diseñada para baja visión) |

---

## ♿ Accesibilidad

- Cumple pautas de **contraste WCAG AA** (4.5:1 en texto).
- Navegación completa con **teclado** (Tabulación con anillo de foco visible).
- **Etiquetas y roles ARIA** para lectores de pantalla.
- Texto de resultados anunciado automáticamente (`aria-live`).
- Respeto de `prefers-reduced-motion` (sin animaciones para quien las evita).

---

## 📝 Licencia

Libre para usar, modificar y compartir. Hecho con 💙 para que la tecnología
también sea de las personas mayores.