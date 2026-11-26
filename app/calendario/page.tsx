"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type Estado = "pendiente" | "en-curso" | "hecho";
type Etiqueta = "Trabajo" | "Estudio" | "Proyecto" | "Personal";

type Tarea = {
  id: string;
  titulo: string;
  etiqueta: Etiqueta;
  fecha: string;
  estado: Estado;
};

const COLUMNAS: { id: Estado; titulo: string; punto: string }[] = [
  { id: "pendiente", titulo: "Por hacer", punto: "bg-slate-400" },
  { id: "en-curso", titulo: "En curso", punto: "bg-amber-400" },
  { id: "hecho", titulo: "Hecho", punto: "bg-emerald-400" },
];

const ETIQUETAS: Record<Etiqueta, string> = {
  Trabajo: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  Estudio: "bg-violet-500/15 text-violet-300 ring-violet-500/30",
  Proyecto: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  Personal: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
};

const CLAVE = "calendario-tareas";

function formatearFecha(fecha: string) {
  if (!fecha) return "";
  return new Date(fecha + "T00:00:00").toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
  });
}

export default function Calendario() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargado, setCargado] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [etiqueta, setEtiqueta] = useState<Etiqueta>("Proyecto");
  const [fecha, setFecha] = useState("");
  const [arrastrando, setArrastrando] = useState<string | null>(null);
  const [columnaActiva, setColumnaActiva] = useState<Estado | null>(null);

  // Cargar tareas guardadas en el navegador
  useEffect(() => {
    try {
      const guardadas = localStorage.getItem(CLAVE);
      if (guardadas) setTareas(JSON.parse(guardadas));
    } catch {}
    setCargado(true);
  }, []);

  // Guardar cada vez que algo cambia
  useEffect(() => {
    if (!cargado) return;
    try {
      localStorage.setItem(CLAVE, JSON.stringify(tareas));
    } catch {}
  }, [tareas, cargado]);

  function agregar(e: FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) return;
    setTareas((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        titulo: titulo.trim(),
        etiqueta,
        fecha,
        estado: "pendiente",
      },
    ]);
    setTitulo("");
    setFecha("");
  }

  function mover(id: string, estado: Estado) {
    setTareas((prev) => prev.map((t) => (t.id === id ? { ...t, estado } : t)));
  }

  function eliminar(id: string) {
    setTareas((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-10 md:px-10">
      {/* Encabezado */}
      <header className="max-w-6xl mx-auto mb-8">
        <p className="text-emerald-400 font-medium text-sm">Mi registro de actividades</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-1">Calendario</h1>
        <p className="text-slate-400 mt-2">
          {tareas.length} actividades ·{" "}
          {tareas.filter((t) => t.estado === "hecho").length} completadas
        </p>
      </header>

      {/* Formulario */}
      <form
        onSubmit={agregar}
        className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4"
      >
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="¿Qué actividad quieres registrar?"
          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 outline-none focus:border-emerald-500"
        />
        <select
          value={etiqueta}
          onChange={(e) => setEtiqueta(e.target.value as Etiqueta)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500"
        >
          {Object.keys(ETIQUETAS).map((et) => (
            <option key={et}>{et}</option>
          ))}
        </select>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500 [color-scheme:dark]"
        />
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg px-5 py-2.5"
        >
          + Agregar
        </button>
      </form>

      {/* Tablero */}
      <section className="max-w-6xl mx-auto grid gap-5 md:grid-cols-3">
        {COLUMNAS.map((col, i) => {
          const lista = tareas.filter((t) => t.estado === col.id);
          return (
            <div
              key={col.id}
              onDragOver={(e) => {
                e.preventDefault();
                setColumnaActiva(col.id);
              }}
              onDragLeave={() => setColumnaActiva(null)}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain");
                if (id) mover(id, col.id);
                setColumnaActiva(null);
                setArrastrando(null);
              }}
              className={`rounded-xl border p-4 min-h-[300px] transition-colors ${
                columnaActiva === col.id
                  ? "border-emerald-500 bg-emerald-500/5"
                  : "border-slate-800 bg-slate-900/60"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.punto}`} />
                  {col.titulo}
                </h2>
                <span className="text-xs bg-slate-800 text-slate-300 rounded-full px-2.5 py-1">
                  {lista.length}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {lista.map((t) => (
                  <article
                    key={t.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", t.id);
                      setArrastrando(t.id);
                    }}
                    onDragEnd={() => {
                      setArrastrando(null);
                      setColumnaActiva(null);
                    }}
                    className={`group bg-slate-950 border border-slate-800 hover:border-slate-600 rounded-lg p-3 cursor-grab active:cursor-grabbing ${
                      arrastrando === t.id ? "opacity-40" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`text-xs font-medium rounded-md px-2 py-0.5 ring-1 ${ETIQUETAS[t.etiqueta]}`}
                      >
                        {t.etiqueta}
                      </span>
                      <button
                        onClick={() => eliminar(t.id)}
                        className="text-slate-500 hover:text-rose-400 text-sm opacity-0 group-hover:opacity-100"
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    </div>

                    <p
                      className={`mt-2 ${
                        t.estado === "hecho" ? "line-through text-slate-500" : ""
                      }`}
                    >
                      {t.titulo}
                    </p>

                    <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                      <span>{t.fecha ? `📅 ${formatearFecha(t.fecha)}` : ""}</span>
                      <div className="flex gap-1">
                        {i > 0 && (
                          <button
                            onClick={() => mover(t.id, COLUMNAS[i - 1].id)}
                            className="hover:bg-slate-800 rounded px-2 py-0.5"
                            title="Mover a la izquierda"
                          >
                            ←
                          </button>
                        )}
                        {i < COLUMNAS.length - 1 && (
                          <button
                            onClick={() => mover(t.id, COLUMNAS[i + 1].id)}
                            className="hover:bg-slate-800 rounded px-2 py-0.5"
                            title="Mover a la derecha"
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}

                {lista.length === 0 && (
                  <p className="text-sm text-slate-600 text-center py-8 border border-dashed border-slate-800 rounded-lg">
                    Arrastra una tarjeta aquí
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}