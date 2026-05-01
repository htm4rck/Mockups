'use client';

import React, { useMemo, useState } from 'react';
import {
  Search,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Headphones,
  Wifi,
  WifiOff,
  DownloadCloud,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Activity,
  MapPin,
  Filter,
  Radio,
  BarChart3,
  HardDrive,
  ShieldCheck,
  SkipForward,
  SkipBack,
  BellRing
} from 'lucide-react';

type PlaybackStatus =
  | 'PLAYING'
  | 'BUFFERING'
  | 'OFFLINE_CACHE'
  | 'DISCONNECTED'
  | 'ALERT';

interface PlaybackSession {
  id: string;
  branch: string;
  city: string;
  country: string;
  playlist: string;
  track: string;
  artist: string;
  duration: number;
  position: number;
  volume: number;
  latency: number;
  bitrate: number;
  cache: number;
  signal: number;
  status: PlaybackStatus;
  updatedAt: string;
  version: string;
  ip: string;
}

const data: PlaybackSession[] = [
  {
    id: 'LOC-001',
    branch: 'Larcomar Premium',
    city: 'Lima',
    country: 'Peru',
    playlist: 'Lunch Premium',
    track: 'Blue Lounge',
    artist: 'Studio Session',
    duration: 240,
    position: 143,
    volume: 72,
    latency: 32,
    bitrate: 320,
    cache: 96,
    signal: 92,
    status: 'PLAYING',
    updatedAt: '2 sec',
    version: '2.1.4',
    ip: '10.10.2.12'
  },
  {
    id: 'LOC-014',
    branch: 'San Isidro Corporate',
    city: 'Lima',
    country: 'Peru',
    playlist: 'Business Calm',
    track: 'Piano Ambient',
    artist: 'Moon Records',
    duration: 310,
    position: 75,
    volume: 64,
    latency: 55,
    bitrate: 256,
    cache: 88,
    signal: 71,
    status: 'BUFFERING',
    updatedAt: '4 sec',
    version: '2.1.4',
    ip: '10.10.4.22'
  },
  {
    id: 'LOC-028',
    branch: 'Bogotá Centro',
    city: 'Bogotá',
    country: 'Colombia',
    playlist: 'Night Lounge',
    track: 'Neo Jazz',
    artist: 'Live House',
    duration: 290,
    position: 210,
    volume: 80,
    latency: 0,
    bitrate: 320,
    cache: 100,
    signal: 0,
    status: 'OFFLINE_CACHE',
    updatedAt: '10 sec',
    version: '2.1.3',
    ip: '10.20.1.8'
  },
  {
    id: 'LOC-034',
    branch: 'Miami Brickell',
    city: 'Miami',
    country: 'USA',
    playlist: 'Restaurant Elite',
    track: 'Summer House',
    artist: 'Ocean Mix',
    duration: 260,
    position: 0,
    volume: 0,
    latency: 0,
    bitrate: 0,
    cache: 0,
    signal: 0,
    status: 'DISCONNECTED',
    updatedAt: '3 min',
    version: '2.0.9',
    ip: 'N/A'
  }
];

function secToTime(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function statusColor(status: PlaybackStatus) {
  switch (status) {
    case 'PLAYING':
      return 'bg-emerald-500';
    case 'BUFFERING':
      return 'bg-amber-500';
    case 'OFFLINE_CACHE':
      return 'bg-blue-500';
    case 'DISCONNECTED':
      return 'bg-red-500';
    default:
      return 'bg-purple-500';
  }
}

function statusLabel(status: PlaybackStatus) {
  switch (status) {
    case 'PLAYING':
      return 'Live';
    case 'BUFFERING':
      return 'Buffering';
    case 'OFFLINE_CACHE':
      return 'Offline Cache';
    case 'DISCONNECTED':
      return 'Disconnected';
    default:
      return 'Alert';
  }
}

function Progress({
  current,
  total
}: {
  current: number;
  total: number;
}) {
  const percent = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-[11px] text-slate-500">
        <span>{secToTime(current)}</span>
        <span>{secToTime(total)}</span>
      </div>

      <div className="h-2 rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-slate-900"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 text-slate-400">{icon}</div>
      <div className="text-xs text-slate-500">{title}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}

export default function PlaybackMonitor() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return data.filter(
      x =>
        x.branch.toLowerCase().includes(search.toLowerCase()) ||
        x.city.toLowerCase().includes(search.toLowerCase()) ||
        x.country.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Playback Monitor
          </h1>
          <p className="text-sm text-slate-500">
            Real-time global audio operations
          </p>
        </div>

        <div className="flex gap-3">
          <button className="rounded-xl border bg-white px-4 py-2 text-sm">
            Incident Center
          </button>

          <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white">
            Force Global Sync
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="mb-6 grid grid-cols-6 gap-4">
        <MetricCard
          title="Live Sessions"
          value="1,284"
          icon={<Radio size={18} />}
        />

        <MetricCard
          title="Buffer Rate"
          value="0.8%"
          icon={<Activity size={18} />}
        />

        <MetricCard
          title="Offline Cache"
          value="93"
          icon={<DownloadCloud size={18} />}
        />

        <MetricCard
          title="Incidents"
          value="4"
          icon={<BellRing size={18} />}
        />

        <MetricCard
          title="Avg Latency"
          value="42ms"
          icon={<Clock3 size={18} />}
        />

        <MetricCard
          title="Compliance"
          value="99.7%"
          icon={<ShieldCheck size={18} />}
        />
      </div>

      {/* FILTER */}
      <div className="mb-6 rounded-2xl border bg-white p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={18}
            />

            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by local, city, country..."
              className="w-full rounded-xl border pl-10 pr-4 py-2"
            />
          </div>

          <button className="rounded-xl border px-4">
            <Filter size={18} />
          </button>

          <button className="rounded-xl border px-4">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* SESSIONS */}
      <div className="space-y-4">
        {filtered.map(session => (
          <div
            key={session.id}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            {/* TOP */}
            <div className="mb-4 flex justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${statusColor(
                      session.status
                    )}`}
                  />

                  <h3 className="text-lg font-bold">
                    {session.branch}
                  </h3>

                  <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs">
                    {statusLabel(session.status)}
                  </span>
                </div>

                <div className="mt-2 flex gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {session.city}, {session.country}
                  </span>

                  <span>{session.id}</span>

                  <span>v{session.version}</span>
                </div>
              </div>

              <div className="text-right text-sm text-slate-500">
                Last heartbeat: {session.updatedAt}
              </div>
            </div>

            {/* TRACK */}
            <div className="mb-4">
              <div className="font-semibold">
                {session.track}
              </div>

              <div className="text-sm text-slate-500">
                {session.artist} • {session.playlist}
              </div>
            </div>

            <div className="mb-5">
              <Progress
                current={session.position}
                total={session.duration}
              />
            </div>

            {/* METRICS */}
            <div className="grid grid-cols-6 gap-4 text-sm">
              <div>
                <div className="text-slate-400">
                  Latency
                </div>
                <div className="font-semibold">
                  {session.latency}ms
                </div>
              </div>

              <div>
                <div className="text-slate-400">
                  Bitrate
                </div>
                <div className="font-semibold">
                  {session.bitrate}kbps
                </div>
              </div>

              <div>
                <div className="text-slate-400">
                  Cache
                </div>
                <div className="font-semibold">
                  {session.cache}%
                </div>
              </div>

              <div>
                <div className="text-slate-400">
                  Signal
                </div>
                <div className="font-semibold">
                  {session.signal}%
                </div>
              </div>

              <div>
                <div className="text-slate-400">
                  Volume
                </div>
                <div className="font-semibold">
                  {session.volume}%
                </div>
              </div>

              <div>
                <div className="text-slate-400">
                  IP
                </div>
                <div className="font-semibold">
                  {session.ip}
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-5 flex flex-wrap gap-2 border-t pt-5">
              <button className="rounded-xl border px-3 py-2 text-sm">
                <Play size={14} />
              </button>

              <button className="rounded-xl border px-3 py-2 text-sm">
                <Pause size={14} />
              </button>

              <button className="rounded-xl border px-3 py-2 text-sm">
                <SkipBack size={14} />
              </button>

              <button className="rounded-xl border px-3 py-2 text-sm">
                <SkipForward size={14} />
              </button>

              <button className="rounded-xl border px-3 py-2 text-sm">
                <RotateCcw size={14} />
              </button>

              <button className="rounded-xl border px-3 py-2 text-sm">
                <Volume2 size={14} />
              </button>

              <button className="rounded-xl border px-3 py-2 text-sm">
                <Headphones size={14} />
              </button>

              <button className="rounded-xl border px-3 py-2 text-sm">
                <HardDrive size={14} />
              </button>

              <button className="rounded-xl border px-3 py-2 text-sm">
                <BarChart3 size={14} />
              </button>

              <button className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600">
                <AlertTriangle size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}