export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6 text-center">
      <p className="text-emerald-400 font-medium mb-3">Transformación digital · Automatización · Datos</p>
      <h1 className="text-4xl md:text-6xl font-bold max-w-3xl">
        Procesos que funcionan solos
      </h1>
      <p className="mt-6 text-lg text-slate-300 max-w-2xl">
        Soy Alfredo Escudero. Ayudo a empresas a automatizar tareas repetitivas,
        conectar sus documentos y convertir sus datos en decisiones.
      </p>
      <div className="mt-10 flex gap-4">
        <a href="#proyectos" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-lg">
          Ver proyectos
        </a>
        <a href="mailto:tucorreo@ejemplo.com" className="border border-slate-600 hover:border-slate-400 px-6 py-3 rounded-lg">
          Contáctame
        </a>
      </div>
    </main>
  );
}