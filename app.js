/* ==========================================================================
   Convertidor de Temperatura — lógica de conversión e interacción
   Convierte entre Celsius (°C), Fahrenheit (°F) y Kelvin (K).
   ========================================================================== */

(() => {
  "use strict";

  /* ---------- Datos de unidades ---------- */

  const UNITS = {
    C: { name: "Grados Celsius", symbol: "°C" },
    F: { name: "Grados Fahrenheit", symbol: "°F" },
    K: { name: "Kelvin", symbol: "K" },
  };

  // Fórmulas mostradas al usuario, con {v} = valor de entrada
  const FORMULAS = {
    "C-F": "({v} × 9/5) + 32",
    "C-K": "{v} + 273.15",
    "F-C": "({v} − 32) × 5/9",
    "F-K": "({v} − 32) × 5/9 + 273.15",
    "K-C": "{v} − 273.15",
    "K-F": "({v} − 273.15) × 9/5 + 32",
  };

  /* ---------- Referencias al DOM ---------- */

  const dom = {
    input: document.getElementById("tempInput"),
    clearBtn: document.getElementById("clearBtn"),
    error: document.getElementById("errorMsg"),
    unitBtns: Array.from(document.querySelectorAll(".unit-btn")),
    cards: Array.from(document.querySelectorAll(".result-card")),
    voiceBtns: Array.from(document.querySelectorAll(".voice-btn")),
    themeToggle: document.getElementById("themeToggle"),
  };

  let selectedUnit = "C";

  /* ---------- Lógica de conversión (funciones puras) ---------- */

  function toCelsius(value, unit) {
    switch (unit) {
      case "C":
        return value;
      case "F":
        return ((value - 32) * 5) / 9;
      case "K":
        return value - 273.15;
      default:
        throw new Error(`Unidad desconocida: ${unit}`);
    }
  }

  function fromCelsius(celsius, unit) {
    switch (unit) {
      case "C":
        return celsius;
      case "F":
        return (celsius * 9) / 5 + 32;
      case "K":
        return celsius + 273.15;
      default:
        throw new Error(`Unidad desconocida: ${unit}`);
    }
  }

  function convert(value, fromUnit, toUnit) {
    return fromCelsius(toCelsius(value, fromUnit), toUnit);
  }

  // Redondea a 2 decimales y quita ceros sobrantes: 77 → "77", 26.85 → "26.85"
  function formatNumber(n) {
    if (!Number.isFinite(n)) return "—";
    return String(parseFloat(n.toFixed(2)));
  }

  /* ---------- Validación de la entrada ---------- */

  // Acepta números como: 25, -4, 3.5, -0.2 (punto decimal, no coma)
  function parseInput(str) {
    const trimmed = str.trim();
    if (trimmed === "") return { ok: true, value: null };
    if (!/^-?\d*\.?\d*$/.test(trimmed)) return { ok: false, value: null };
    const value = parseFloat(trimmed);
    if (Number.isNaN(value)) return { ok: true, value: null }; // "-" o "." a medio escribir
    return { ok: true, value };
  }

  /* ---------- Renderizado de resultados ---------- */

  function render() {
    const parsed = parseInput(dom.input.value);
    let error = "";
    let value = null;

    if (!parsed.ok) {
      error = "Escribe un número, por ejemplo: 25 o −4.5";
    } else if (parsed.value !== null) {
      if (selectedUnit === "K" && parsed.value < 0) {
        error =
          "Kelvin no puede ser menor que 0. El cero absoluto es 0 K (−273.15 °C).";
      } else {
        value = parsed.value;
      }
    }

    dom.error.textContent = error;
    dom.error.hidden = error === "";

    dom.cards.forEach((card) => {
      const unit = card.dataset.unit;
      const valueEl = card.querySelector("[data-result]");
      const formulaEl = card.querySelector("[data-formula]");

      // La tarjeta de la unidad seleccionada queda oculta (esa es la entrada)
      if (unit === selectedUnit) {
        card.hidden = true;
        return;
      }
      card.hidden = false;

      if (value === null) {
        valueEl.textContent = "—";
        formulaEl.textContent = "";
        return;
      }

      const result = convert(value, selectedUnit, unit);
      const formatted = formatNumber(result);

      if (valueEl.textContent !== formatted) {
        valueEl.textContent = formatted;
        // Reinicia la animación suave solo si cambió el número
        valueEl.classList.remove("flash");
        void valueEl.offsetWidth;
        valueEl.classList.add("flash");
      }

      formulaEl.textContent =
        "Fórmula: " +
        FORMULAS[selectedUnit + "-" + unit].replace("{v}", String(value));
    });
  }

  /* ---------- Voz (lectura del resultado) ---------- */

  const speechSupported = "speechSynthesis" in window;

  function readResult(card) {
    if (!speechSupported) return;
    const unit = card.dataset.unit;
    const valueEl = card.querySelector("[data-result]");
    const text = valueEl.textContent;
    if (text === "—") return;

    const targetName = UNITS[unit].name.toLowerCase();
    const sourceName = UNITS[selectedUnit].name.toLowerCase();
    const sourceValue = formatNumber(parseInput(dom.input.value).value);

    const utterance = new SpeechSynthesisUtterance(
      `${sourceValue} ${sourceName} equivalen a ${text} ${targetName}.`
    );
    utterance.lang = "es-ES";
    utterance.rate = 0.95;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }

  if (!speechSupported) {
    dom.voiceBtns.forEach((btn) => {
      btn.hidden = true;
    });
  }

  /* ---------- Eventos ---------- */

  // Conversión en tiempo real
  dom.input.addEventListener("input", render);

  // Cambia la unidad de origen y actualiza los botones
  function selectUnit(unit) {
    selectedUnit = unit;
    dom.unitBtns.forEach((b) => {
      const active = b.dataset.unit === unit;
      b.classList.toggle("is-selected", active);
      b.setAttribute("aria-pressed", String(active));
    });
    render();
  }

  // Selector de unidad de origen
  dom.unitBtns.forEach((btn) => {
    btn.addEventListener("click", () => selectUnit(btn.dataset.unit));
  });

  // Botón limpiar
  dom.clearBtn.addEventListener("click", () => {
    dom.input.value = "";
    render();
    dom.input.focus();
  });

  // Lectura en voz alta
  dom.voiceBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      readResult(btn.closest(".result-card"));
    });
  });

  // Usar un resultado como nuevo punto de partida
  dom.cards.forEach((card) => {
    const swapBtn = card.querySelector(".swap-btn");
    swapBtn.addEventListener("click", () => {
      const resultText = card.querySelector("[data-result]").textContent;
      if (resultText === "—") return;
      dom.input.value = resultText;
      selectUnit(card.dataset.unit);
      dom.input.focus();
    });
  });

  // Temperaturas de referencia: tocar un valor lo carga como punto de partida
  document.querySelectorAll(".reference-table button[data-value]").forEach((btn) => {
    btn.addEventListener("click", () => {
      dom.input.value = btn.dataset.value;
      selectUnit(btn.dataset.unit);
      dom.input.focus();
    });
  });

  /* ---------- Tema claro / oscuro ---------- */

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const isDark = theme === "dark";
    dom.themeToggle.textContent = isDark ? "☀️" : "🌙";
    dom.themeToggle.setAttribute(
      "aria-label",
      isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
    );
  }

  function loadTheme() {
    let stored = null;
    try {
      stored = localStorage.getItem("theme");
    } catch (err) {
      stored = null;
    }
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return stored || (prefersDark ? "dark" : "light");
  }

  applyTheme(loadTheme());

  dom.themeToggle.addEventListener("click", () => {
    const next =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (err) {
      /* sin almacenamiento: el tema se aplica igual en la sesión */
    }
  });

  /* ---------- Inicio ---------- */

  render();
})();