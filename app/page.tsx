'use client';

import { MapPin, Clock, Navigation } from "lucide-react";

const routes = [
  {
    title: "Más rápida",
    time: "25 min",
    arrival: "Llega 5:45 PM",
    color: "from-purple-500 to-indigo-600",
    steps: [
      { label: "Camina 3 min", type: "walk" },
      { label: "Expreso 1", type: "bus", color: "bg-purple-500" },
      { label: "Camina 2 min", type: "walk" }
    ]
  },
  {
    title: "Menos caminata",
    time: "30 min",
    arrival: "Llega 5:50 PM",
    color: "from-blue-500 to-cyan-500",
    steps: [
      { label: "Regular B", type: "bus", color: "bg-blue-500" }
    ]
  }
];

export default function RouteResultsPro() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white p-4 space-y-4">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-3">
        <div className="bg-blue-100 p-2 rounded-xl">
          <MapPin className="text-blue-600" size={18} />
        </div>
        <div>
          <p className="text-sm text-gray-500">De</p>
          <p className="font-medium">Estación A</p>
        </div>
        <div className="mx-auto text-gray-400">→</div>
        <div>
          <p className="text-sm text-gray-500">A</p>
          <p className="font-medium">Estación B</p>
        </div>
      </div>

      {/* LISTA DE RUTAS */}
      {routes.map((route, i) => (
        <div
          key={i}
          className={`rounded-3xl p-[2px] bg-gradient-to-r ${route.color} shadow-lg`}
        >
          <div className="bg-white rounded-3xl p-4 space-y-4">

            {/* TOP */}
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100">
                {route.title}
              </span>

              <div className="text-right">
                <p className="font-bold text-lg">{route.time}</p>
                <p className="text-xs text-gray-500">{route.arrival}</p>
              </div>
            </div>

            {/* STEPS VISUALES */}
            <div className="flex items-center gap-2 flex-wrap">
              {route.steps.map((step, j) => (
                <div key={j} className="flex items-center gap-2">
                  <div
                    className={`px-3 py-1 text-xs rounded-full ${
                      step.type === "bus"
                        ? `${step.color} text-white`
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {step.label}
                  </div>

                  {j < route.steps.length - 1 && (
                    <div className="w-4 h-[2px] bg-gray-300" />
                  )}
                </div>
              ))}
            </div>

            {/* INFO EXTRA */}
            <div className="flex justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={14} /> Tiempo estimado
              </span>
              <span className="flex items-center gap-1">
                <Navigation size={14} /> Ruta optimizada
              </span>
            </div>

            {/* CTA */}
            <button className="w-full bg-black text-white py-3 rounded-2xl font-medium hover:opacity-90 transition">
              Iniciar viaje
            </button>

          </div>
        </div>
      ))}
    </div>
  );
}