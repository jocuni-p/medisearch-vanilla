/**
 * snapshot.js
 * Genera un archivo status_YYYY-MM-DD.md con un snapshot del proyecto.
 * Uso: node snapshot.js (desde la raíz del proyecto)
 */

const fs   = require("fs");
const path = require("path");

// ─── Configuración ────────────────────────────────────────────────────────────

const OUTPUT_PREFIX = "status_";

// Extensiones de texto cuyo contenido se incluirá en el snapshot
const TEXT_EXTENSIONS = [".html", ".css", ".js", ".json", ".md", ".txt"];

// Directorios y archivos a ignorar completamente
const IGNORE = new Set([
  "node_modules",
  ".git",
  ".DS_Store",
  "Thumbs.db",
  "snapshot.js",
]);

// Archivos cuyo contenido NO se incluye (solo se listan)
const BINARY_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico",
  ".woff", ".woff2", ".ttf", ".eot",
  ".pdf", ".zip",
]);

// ─── Utilidades ───────────────────────────────────────────────────────────────

function getDate() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function getDateTime() {
  return new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });
}

/**
 * Recorre el directorio recursivamente y devuelve una lista de rutas relativas.
 * @param {string} dir     - Directorio a explorar
 * @param {string} base    - Directorio raíz (para calcular rutas relativas)
 * @param {string[]} list  - Acumulador
 * @returns {string[]}
 */
function walk(dir, base, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORE.has(entry.name)) continue;

    // Ignorar los propios archivos de snapshot para no incluirlos
    if (entry.name.startsWith(OUTPUT_PREFIX) && entry.name.endsWith(".md")) continue;

    const fullPath = path.join(dir, entry.name);
    const relPath  = path.relative(base, fullPath);

    if (entry.isDirectory()) {
      list.push({ type: "dir", relPath });
      walk(fullPath, base, list);
    } else {
      list.push({ type: "file", relPath, fullPath, ext: path.extname(entry.name).toLowerCase() });
    }
  }

  return list;
}

// ─── Generación del snapshot ──────────────────────────────────────────────────

function generateSnapshot() {
  const root    = process.cwd();
  const date    = getDate();
  const outFile = path.join(root, `${OUTPUT_PREFIX}${date}.md`);
  const entries = walk(root, root);

  const lines = [];

  // Cabecera
  lines.push(`# Snapshot del proyecto`);
  lines.push(`**Fecha:** ${getDateTime()}`);
  lines.push(`**Directorio raíz:** \`${root}\``);
  lines.push("");

  // ── Árbol de archivos ──────────────────────────────────────────────────────
  lines.push("## Árbol de archivos");
  lines.push("");
  lines.push("```");

  for (const entry of entries) {
    const depth  = entry.relPath.split(path.sep).length - 1;
    const indent = "  ".repeat(depth);
    const icon   = entry.type === "dir" ? "📁" : "📄";
    lines.push(`${indent}${icon} ${path.basename(entry.relPath)}`);
  }

  lines.push("```");
  lines.push("");

  // ── Contenido de los archivos de texto ────────────────────────────────────
  lines.push("## Contenido de archivos");
  lines.push("");

  const textFiles = entries.filter(
    (e) => e.type === "file" && TEXT_EXTENSIONS.includes(e.ext)
  );

  if (textFiles.length === 0) {
    lines.push("_No se encontraron archivos de texto._");
  }

  for (const file of textFiles) {
    lines.push(`### \`${file.relPath}\``);
    lines.push("");

    try {
      const content = fs.readFileSync(file.fullPath, "utf-8");
      const lang    = file.ext.replace(".", ""); // html, css, js…
      lines.push(`\`\`\`${lang}`);
      lines.push(content.trimEnd());
      lines.push("```");
    } catch (err) {
      lines.push(`_Error al leer el archivo: ${err.message}_`);
    }

    lines.push("");
  }

  // ── Archivos binarios (solo listado) ──────────────────────────────────────
  const binaryFiles = entries.filter(
    (e) => e.type === "file" && BINARY_EXTENSIONS.has(e.ext)
  );

  if (binaryFiles.length > 0) {
    lines.push("## Archivos binarios (solo listado)");
    lines.push("");
    for (const file of binaryFiles) {
      lines.push(`- \`${file.relPath}\``);
    }
    lines.push("");
  }

  // ── Escritura del archivo ─────────────────────────────────────────────────
  fs.writeFileSync(outFile, lines.join("\n"), "utf-8");
  console.log(`✅ Snapshot generado: ${path.basename(outFile)}`);
}

// ─── Ejecución ────────────────────────────────────────────────────────────────

generateSnapshot();
