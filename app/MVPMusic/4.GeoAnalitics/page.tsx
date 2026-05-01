'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Globe2,
  Search,
  Filter,
  Radio,
  Clock3,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Building2,
  Headphones,
  ShieldCheck,
  Music2,
  RefreshCw,
  Eye,
  Signal,
} from 'lucide-react';
import type { RegionMetric } from '../../components/GeoMap';

// Leaflet must be loaded client-side only — no SSR
const GeoMap = dynamic(() => import('../../components/GeoMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[420px] items-center justify-center rounded-3xl bg-slate-900 text-slate-400 text-sm">
      Loading map…
    </div>
  ),
});

const STATUS_COLOR: Record<RegionMetric['status'], string> = {
  HEALTHY: '#34d399',
  WARNING: '#fbbf24',
  CRITICAL: '#f87171',
};

const regions: RegionMetric[] = [
  {
    id: 'REG-001', country: 'Peru', city: 'Lima',
    coords: [-12.0464, -77.0428],
    locations: 284, activeNow: 279, streamHours: '18,420h',
    avgLatency: 24, cacheUsage: 91, compliance: 99.8,
    incidents: 1, topPlaylist: 'Lunch Premium', growth: 18, status: 'HEALTHY',
  },
  {
    id: 'REG-002', country: 'Colombia', city: 'Bogotá',
    coords: [4.711, -74.0721],
    locations: 144, activeNow: 132, streamHours: '9,140h',
    avgLatency: 38, cacheUsage: 88, compliance: 97.2,
    incidents: 4, topPlaylist: 'Business Flow', growth: 11, status: 'WARNING',
  },
  {
    id: 'REG-003', country: 'Chile', city: 'Santiago',
    coords: [-33.4489, -70.6693],
    locations: 82, activeNow: 68, streamHours: '5,922h',
    avgLatency: 81, cacheUsage: 73, compliance: 92.4,
    incidents: 8, topPlaylist: 'Night Lounge', growth: -6, status: 'CRITICAL',
  },
  {
    id: 'REG-004', country: 'USA', city: 'Miami',
    coords: [25.7617, -80.1918],
    locations: 120, activeNow: 118, streamHours: '12,420h',
    avgLatency: 18, cacheUsage: 96, compliance: 99.9,
    incidents: 0, topPlaylist: 'Restaurant Elite', growth: 23, status: 'HEALTHY',
  },
  {
    id: 'REG-005', country: 'Spain', city: 'Madrid',
    coords: [40.4168, -3.7038],
    locations: 0, activeNow: 0, streamHours: 'Roadmap',
    avgLatency: 0, cacheUsage: 0, compliance: 0,
    incidents: 0, topPlaylist: 'CDN Ready', growth: 0, status: 'HEALTHY',
  },
];

function statusText(s: RegionMetric['status']) {
  return s === 'HEALTHY' ? 'Healthy' : s === 'WARNING' ? 'Warning' : 'Critical';
}

function Kpi({ title, value, helper, icon }: {
  title: string; value: string; helper: string; icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 text-slate-400">{icon}</div>
      <p className="text-xs text-slate-500">{title}</p>
      <h3 className="mt-1 text-2xl font-bold">{value}</h3>
      <p className="mt-1 text-xs text-slate-400">{helper}</p>
    </div>
  );
}

export default function GeoAnalytics() {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionMetric>(regions[0]);

  const filtered = useMemo(
    () =>
      regions.filter(
        (x) =>
          x.country.toLowerCase().includes(search.toLowerCase()) ||
          x.city.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const healthy = regions.filter((x) => x.status === 'HEALTHY').length;
  const warnings = regions.filter((x) => x.status === 'WARNING').length;
  const critical = regions.filter((x) => x.status === 'CRITICAL').length;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Geo Analytics</h1>
            <p className="mt-1 text-sm text-slate-500">
              Real-time regional streaming intelligence, compliance and operational performance.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-xl border bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">
              Export Intelligence
            </button>
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
              Regional Heatmap
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="mb-6 grid gap-4 md:grid-cols-6">
          <Kpi title="Countries"   value="12"     helper="Live"               icon={<Globe2      size={18} />} />
          <Kpi title="Locations"   value="1,842"  helper="Registered"         icon={<Building2   size={18} />} />
          <Kpi title="Live Streams" value="1,781" helper="Now"                icon={<Radio       size={18} />} />
          <Kpi title="Compliance"  value="99.1%"  helper="Protected playback" icon={<ShieldCheck size={18} />} />
          <Kpi title="Streaming"   value="45K h"  helper="Today"              icon={<Clock3      size={18} />} />
          <Kpi title="Incidents"   value="13"     helper="Global"             icon={<AlertTriangle size={18} />} />
        </div>

        {/* MAP SECTION */}
        <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-bold text-lg">Global Operations Map</h2>
              <p className="text-sm text-slate-400">
                Streaming health, live playback and CDN performance by region. Click a marker for details.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Healthy ({healthy})
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                Warning ({warnings})
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                Critical ({critical})
              </span>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
            {/* Map */}
            <div className="overflow-hidden rounded-3xl border border-white/10" style={{ height: 460 }}>
              <GeoMap
                regions={regions}
                selected={selectedRegion}
                onSelect={setSelectedRegion}
              />
            </div>

            {/* Detail panel */}
            <div className="flex flex-col rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">Selected Region</p>
                  <h3 className="mt-1 text-2xl font-bold">{selectedRegion.city}</h3>
                  <p className="text-sm text-slate-400">{selectedRegion.country}</p>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold text-slate-950"
                  style={{ backgroundColor: STATUS_COLOR[selectedRegion.status] }}
                >
                  {statusText(selectedRegion.status)}
                </span>
              </div>

              <div className="flex-1 space-y-3 text-sm">
                {[
                  ['Locations',    selectedRegion.locations],
                  ['Active now',   selectedRegion.activeNow],
                  ['Latency',      `${selectedRegion.avgLatency}ms`],
                  ['Cache usage',  `${selectedRegion.cacheUsage}%`],
                  ['Compliance',   `${selectedRegion.compliance}%`],
                  ['Incidents',    selectedRegion.incidents],
                  ['Top playlist', selectedRegion.topPlaylist],
                ].map(([label, val]) => (
                  <div key={String(label)} className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-slate-400">{label}</span>
                    <span className="font-semibold">{val}</span>
                  </div>
                ))}
              </div>

              {/* Mini status bar */}
              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Cache usage</span>
                  <span>{selectedRegion.cacheUsage}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${selectedRegion.cacheUsage}%`,
                      backgroundColor: STATUS_COLOR[selectedRegion.status],
                    }}
                  />
                </div>
              </div>

              <button className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 hover:bg-slate-100 transition-colors">
                View Region Detail →
              </button>
            </div>
          </div>

          {/* Bottom stats */}
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: 'Global Health', value: '97.8%', sub: '1,781 active locations', color: 'text-emerald-400' },
              { label: 'Avg Latency',   value: '40ms',  sub: 'Across all regions',     color: 'text-blue-400' },
              { label: 'Current Risk',  value: 'Santiago', sub: 'High latency detected', color: 'text-amber-400' },
              { label: 'CDN Ready',     value: 'Madrid', sub: 'Expansion roadmap',      color: 'text-slate-400' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">{s.label}</p>
                <p className={`mt-1 text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="mt-1 text-xs text-slate-500">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-3 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country or city…"
                className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 outline-none focus:border-blue-400"
              />
            </div>
            <button className="rounded-xl border px-4 hover:bg-slate-50"><Filter size={18} /></button>
            <button className="rounded-xl border px-4 hover:bg-slate-50"><RefreshCw size={18} /></button>
          </div>
        </div>

        {/* REGIONS TABLE */}
        <div className="space-y-4">
          {filtered.map((region) => (
            <div
              key={region.id}
              onClick={() => setSelectedRegion(region)}
              className={`cursor-pointer rounded-3xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
                selectedRegion.id === region.id ? 'border-blue-300 ring-1 ring-blue-200' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full shadow-sm"
                      style={{
                        backgroundColor: STATUS_COLOR[region.status],
                        boxShadow: `0 0 8px ${STATUS_COLOR[region.status]}`,
                      }}
                    />
                    <h3 className="text-lg font-bold">{region.city}, {region.country}</h3>
                    <span className="rounded-full border px-2 py-0.5 text-xs text-slate-500">{region.id}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedRegion(region); }}
                  className="self-start rounded-xl border px-4 py-2 hover:bg-slate-50"
                >
                  <Eye size={16} />
                </button>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-8">
                {[
                  ['Locations',  region.locations],
                  ['Active',     region.activeNow],
                  ['Streaming',  region.streamHours],
                  ['Latency',    `${region.avgLatency}ms`],
                  ['Cache',      `${region.cacheUsage}%`],
                  ['Compliance', `${region.compliance}%`],
                  ['Incidents',  region.incidents],
                ].map(([label, val]) => (
                  <div key={String(label)}>
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="font-semibold">{val}</p>
                  </div>
                ))}
                <div>
                  <p className="text-xs text-slate-400">Growth</p>
                  <div className="flex items-center gap-1 font-semibold">
                    {region.growth >= 0
                      ? <TrendingUp size={14} className="text-emerald-600" />
                      : <TrendingDown size={14} className="text-red-600" />}
                    {region.growth}%
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t pt-4">
                <div className="flex flex-wrap gap-6 text-sm text-slate-500">
                  <span className="flex items-center gap-2"><Music2 size={14} />Top: {region.topPlaylist}</span>
                  <span className="flex items-center gap-2"><Signal size={14} />Regional health monitoring</span>
                  <span className="flex items-center gap-2"><Headphones size={14} />Live audio analytics</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* INSIGHTS */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-emerald-50 p-5 border border-emerald-100">
            <h3 className="font-bold text-emerald-700">Opportunity</h3>
            <p className="mt-2 text-sm text-emerald-700">Lima premium restaurants stream 28% more between 12:00 and 15:00.</p>
          </div>
          <div className="rounded-3xl bg-blue-50 p-5 border border-blue-100">
            <h3 className="font-bold text-blue-700">Insight</h3>
            <p className="mt-2 text-sm text-blue-700">Miami shows highest compliance and lowest latency globally.</p>
          </div>
          <div className="rounded-3xl bg-amber-50 p-5 border border-amber-100">
            <h3 className="font-bold text-amber-700">Attention</h3>
            <p className="mt-2 text-sm text-amber-700">Santiago has rising latency. Recommend cache preloading.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
