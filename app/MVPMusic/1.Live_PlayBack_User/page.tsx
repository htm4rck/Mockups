'use client';

import React, { useMemo, useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Wifi,
  WifiOff,
  DownloadCloud,
  ShieldCheck,
  Clock3,
  ListMusic,
  MapPin,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Radio,
  Headphones,
  CalendarDays,
  Music2
} from 'lucide-react';

type PlayerStatus = 'ONLINE' | 'OFFLINE_CACHE' | 'SYNCING' | 'ERROR';

const playlist = [
  {
    id: 1,
    title: 'Morning Coffee',
    artist: 'Lima Jazz Studio',
    duration: '03:42',
    status: 'played'
  },
  {
    id: 2,
    title: 'Blue Lounge',
    artist: 'Andes Premium Music',
    duration: '04:12',
    status: 'playing'
  },
  {
    id: 3,
    title: 'Soft Business',
    artist: 'Corporate Sessions',
    duration: '03:55',
    status: 'next'
  },
  {
    id: 4,
    title: 'Urban Dinner',
    artist: 'Night Market',
    duration: '04:40',
    status: 'next'
  },
  {
    id: 5,
    title: 'Golden Lobby',
    artist: 'Hotel Soundscape',
    duration: '05:05',
    status: 'next'
  }
];

function StatusBadge({ status }: { status: PlayerStatus }) {
  const config = {
    ONLINE: {
      label: 'Online',
      icon: <Wifi size={14} />,
      className: 'bg-emerald-100 text-emerald-700'
    },
    OFFLINE_CACHE: {
      label: 'Modo offline seguro',
      icon: <WifiOff size={14} />,
      className: 'bg-blue-100 text-blue-700'
    },
    SYNCING: {
      label: 'Sincronizando',
      icon: <RefreshCw size={14} />,
      className: 'bg-amber-100 text-amber-700'
    },
    ERROR: {
      label: 'Requiere atención',
      icon: <AlertTriangle size={14} />,
      className: 'bg-red-100 text-red-700'
    }
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${config[status].className}`}
    >
      {config[status].icon}
      {config[status].label}
    </div>
  );
}

function MetricCard({
  icon,
  title,
  value,
  helper
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 text-slate-400">{icon}</div>
      <p className="text-xs text-slate-500">{title}</p>
      <h3 className="mt-1 text-xl font-bold text-slate-900">{value}</h3>
      <p className="mt-1 text-xs text-slate-400">{helper}</p>
    </div>
  );
}

export default function UserLivePlayback() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(72);
  const [status] = useState<PlayerStatus>('ONLINE');

  const currentTrack = useMemo(
    () => playlist.find(item => item.status === 'playing'),
    []
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Live Playback</h1>
            <p className="mt-1 text-sm text-slate-500">
              Reproductor activo del local en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={status} />

            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Reportar problema
            </button>
          </div>
        </div>

        {/* LOCAL INFO */}
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-xs text-slate-400">Cliente</p>
              <h2 className="text-lg font-bold">Restaurante La Mar</h2>
            </div>

            <div>
              <p className="text-xs text-slate-400">Local</p>
              <div className="flex items-center gap-2 font-semibold">
                <MapPin size={16} />
                Miraflores, Lima
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400">Plan activo</p>
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck size={16} />
                Business Music Pro
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400">Horario actual</p>
              <div className="flex items-center gap-2 font-semibold">
                <CalendarDays size={16} />
                Lunch Premium · 12:00 - 15:00
              </div>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          {/* PLAYER */}
          <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Now Playing
                </p>
                <h2 className="mt-2 text-3xl font-bold">
                  {currentTrack?.title}
                </h2>
                <p className="mt-1 text-slate-400">
                  {currentTrack?.artist}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <Music2 size={42} />
              </div>
            </div>

            {/* FAKE ALBUM / WAVE */}
            <div className="mb-8 flex h-72 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900">
              <div className="flex items-end gap-2">
                {[32, 70, 46, 88, 58, 110, 74, 96, 52, 80, 42, 64].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="w-3 rounded-full bg-white/80"
                      style={{ height }}
                    />
                  )
                )}
              </div>
            </div>

            {/* PROGRESS */}
            <div className="mb-6">
              <div className="mb-2 flex justify-between text-xs text-slate-400">
                <span>02:43</span>
                <span>04:12</span>
              </div>

              <div className="h-2 rounded-full bg-white/10">
                <div className="h-2 w-[64%] rounded-full bg-white" />
              </div>
            </div>

            {/* CONTROLS */}
            <div className="flex items-center justify-center gap-5">
              <button className="rounded-full bg-white/10 p-4 hover:bg-white/20">
                <SkipBack size={22} />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="rounded-full bg-white p-6 text-slate-950 shadow-lg"
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} />}
              </button>

              <button className="rounded-full bg-white/10 p-4 hover:bg-white/20">
                <SkipForward size={22} />
              </button>
            </div>

            {/* VOLUME */}
            <div className="mt-8 flex items-center gap-4">
              <Volume2 size={20} className="text-slate-400" />

              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={e => setVolume(Number(e.target.value))}
                className="w-full"
              />

              <span className="w-10 text-sm text-slate-300">
                {volume}%
              </span>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                icon={<DownloadCloud size={20} />}
                title="Cache local"
                value="96%"
                helper="8h 20m disponibles"
              />

              <MetricCard
                icon={<Radio size={20} />}
                title="Calidad"
                value="320kbps"
                helper="Audio premium"
              />

              <MetricCard
                icon={<Clock3 size={20} />}
                title="Sin cortes"
                value="12h 44m"
                helper="Última sesión estable"
              />

              <MetricCard
                icon={<CheckCircle2 size={20} />}
                title="Licencia"
                value="Activa"
                helper="Vence en 28 días"
              />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold">Cola de reproducción</h3>
                  <p className="text-sm text-slate-500">
                    Playlist autorizada para este horario.
                  </p>
                </div>

                <ListMusic size={20} className="text-slate-400" />
              </div>

              <div className="space-y-3">
                {playlist.map(item => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between rounded-2xl p-3 ${
                      item.status === 'playing'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p
                        className={`text-xs ${
                          item.status === 'playing'
                            ? 'text-slate-300'
                            : 'text-slate-500'
                        }`}
                      >
                        {item.artist}
                      </p>
                    </div>

                    <div className="text-xs">{item.duration}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-bold">Estado técnico</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Conexión</span>
                  <span className="font-semibold text-emerald-600">
                    Estable
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Última sincronización</span>
                  <span className="font-semibold">Hace 12 seg.</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Versión del player</span>
                  <span className="font-semibold">v2.1.4</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Dispositivo</span>
                  <span className="font-semibold">Windows Player 01</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Salida de audio</span>
                  <span className="flex items-center gap-2 font-semibold">
                    <Headphones size={14} />
                    Realtek HD Audio
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ALERT */}
        <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={22} />
            <div>
              <h3 className="font-bold">
                Reproducción protegida contra cortes
              </h3>
              <p className="text-sm">
                Este local puede continuar reproduciendo música autorizada aunque pierda conexión temporalmente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}