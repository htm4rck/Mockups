'use client';

import React, { useMemo, useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Clock3,
  Building2,
  MapPin,
  CreditCard,
  CalendarDays,
  Activity,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
  PauseCircle,
  Ban,
  Download,
  FileText,
  Radio,
  Headphones,
  MonitorPlay
} from 'lucide-react';

type LicenseStatus =
  | 'ACTIVE'
  | 'EXPIRING'
  | 'SUSPENDED'
  | 'EXPIRED';

interface License {
  id: string;
  customer: string;
  company: string;
  country: string;
  city: string;
  plan: string;
  channels: number;
  devices: number;
  currentDevices: number;
  expiresAt: string;
  renewalAt: string;
  amount: string;
  lastHeartbeat: string;
  streamingHours: string;
  status: LicenseStatus;
}

const licenses: License[] = [
  {
    id: 'LIC-0001',
    customer: 'Restaurante La Mar',
    company: 'La Mar Group',
    country: 'Peru',
    city: 'Lima',
    plan: 'Business Premium',
    channels: 12,
    devices: 18,
    currentDevices: 16,
    expiresAt: '2026-06-28',
    renewalAt: 'Auto Renewal',
    amount: '$1,290',
    lastHeartbeat: '4 sec',
    streamingHours: '423h',
    status: 'ACTIVE'
  },
  {
    id: 'LIC-0008',
    customer: 'Hotel Miraflores',
    company: 'Pacific Hotels',
    country: 'Peru',
    city: 'Lima',
    plan: 'Enterprise',
    channels: 35,
    devices: 60,
    currentDevices: 54,
    expiresAt: '2026-05-05',
    renewalAt: 'Pending',
    amount: '$3,800',
    lastHeartbeat: '8 sec',
    streamingHours: '912h',
    status: 'EXPIRING'
  },
  {
    id: 'LIC-0016',
    customer: 'Café Bogotá',
    company: 'Andes Coffee',
    country: 'Colombia',
    city: 'Bogotá',
    plan: 'Standard',
    channels: 5,
    devices: 8,
    currentDevices: 8,
    expiresAt: '2026-04-20',
    renewalAt: 'Manual',
    amount: '$490',
    lastHeartbeat: '2 min',
    streamingHours: '0h',
    status: 'EXPIRED'
  },
  {
    id: 'LIC-0024',
    customer: 'Brickell Lounge',
    company: 'Miami Dining',
    country: 'USA',
    city: 'Miami',
    plan: 'Business',
    channels: 20,
    devices: 30,
    currentDevices: 12,
    expiresAt: '2026-08-14',
    renewalAt: 'Auto Renewal',
    amount: '$2,100',
    lastHeartbeat: '12 sec',
    streamingHours: '204h',
    status: 'SUSPENDED'
  }
];

function statusConfig(status: LicenseStatus) {
  switch (status) {
    case 'ACTIVE':
      return {
        label: 'Active',
        className: 'bg-emerald-100 text-emerald-700',
        icon: <CheckCircle2 size={14} />
      };

    case 'EXPIRING':
      return {
        label: 'Expiring',
        className: 'bg-amber-100 text-amber-700',
        icon: <Clock3 size={14} />
      };

    case 'SUSPENDED':
      return {
        label: 'Suspended',
        className: 'bg-blue-100 text-blue-700',
        icon: <PauseCircle size={14} />
      };

    default:
      return {
        label: 'Expired',
        className: 'bg-red-100 text-red-700',
        icon: <Ban size={14} />
      };
  }
}

function StatCard({
  title,
  value,
  helper,
  icon
}: {
  title: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 text-slate-400">
        {icon}
      </div>

      <p className="text-xs text-slate-500">
        {title}
      </p>

      <h3 className="mt-1 text-2xl font-bold">
        {value}
      </h3>

      <p className="mt-1 text-xs text-slate-400">
        {helper}
      </p>
    </div>
  );
}

export default function LicenseManagement() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return licenses.filter(
      x =>
        x.customer.toLowerCase().includes(search.toLowerCase()) ||
        x.company.toLowerCase().includes(search.toLowerCase()) ||
        x.city.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              License Center
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Commercial licenses, compliance and streaming entitlement management.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="rounded-xl border bg-white px-4 py-2 text-sm font-medium">
              Export Report
            </button>

            <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              <Plus size={16} />
              New License
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="mb-6 grid gap-4 md:grid-cols-6">
          <StatCard
            title="Active"
            value="1,248"
            helper="92% operational"
            icon={<ShieldCheck size={18} />}
          />

          <StatCard
            title="Expiring"
            value="43"
            helper="Next 30 days"
            icon={<AlertTriangle size={18} />}
          />

          <StatCard
            title="Revenue"
            value="$148K"
            helper="Monthly recurring"
            icon={<CreditCard size={18} />}
          />

          <StatCard
            title="Streaming"
            value="84K h"
            helper="Current month"
            icon={<Radio size={18} />}
          />

          <StatCard
            title="Devices"
            value="4,218"
            helper="Registered"
            icon={<MonitorPlay size={18} />}
          />

          <StatCard
            title="Compliance"
            value="99.8%"
            helper="Protected playback"
            icon={<Activity size={18} />}
          />
        </div>

        {/* SEARCH */}
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search customer, company or city..."
                className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4"
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

        {/* TABLE */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* HEADER */}
          <div className="grid grid-cols-12 border-b p-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <div className="col-span-3">Customer</div>
            <div className="col-span-2">Plan</div>
            <div className="col-span-1">Devices</div>
            <div className="col-span-2">Usage</div>
            <div className="col-span-2">Expiration</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1"></div>
          </div>

          {/* ROWS */}
          {filtered.map(item => {
            const status = statusConfig(item.status);

            return (
              <div
                key={item.id}
                className="grid grid-cols-12 items-center border-b p-4 hover:bg-slate-50"
              >
                {/* CUSTOMER */}
                <div className="col-span-3">
                  <h3 className="font-bold">
                    {item.customer}
                  </h3>

                  <div className="mt-1 text-xs text-slate-500">
                    {item.id} · {item.company}
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                    <MapPin size={12} />
                    {item.city}, {item.country}
                  </div>
                </div>

                {/* PLAN */}
                <div className="col-span-2">
                  <div className="font-semibold">
                    {item.plan}
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    {item.channels} channels
                  </div>
                </div>

                {/* DEVICES */}
                <div className="col-span-1">
                  <div className="font-semibold">
                    {item.currentDevices}/{item.devices}
                  </div>

                  <div className="text-xs text-slate-500">
                    in use
                  </div>
                </div>

                {/* USAGE */}
                <div className="col-span-2">
                  <div className="font-semibold">
                    {item.streamingHours}
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    Heartbeat {item.lastHeartbeat}
                  </div>
                </div>

                {/* EXP */}
                <div className="col-span-2">
                  <div className="font-semibold">
                    {item.expiresAt}
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    {item.renewalAt}
                  </div>
                </div>

                {/* STATUS */}
                <div className="col-span-1">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                  >
                    {status.icon}
                    {status.label}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="col-span-1 flex justify-end">
                  <button className="rounded-xl p-2 hover:bg-slate-100">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM PANEL */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-3xl bg-emerald-50 p-5">
            <h3 className="font-bold text-emerald-700">
              Compliance
            </h3>

            <p className="mt-2 text-sm text-emerald-700">
              99.8% of licensed customers are currently reproducing protected content.
            </p>
          </div>

          <div className="rounded-3xl bg-amber-50 p-5">
            <h3 className="font-bold text-amber-700">
              Renewal Risk
            </h3>

            <p className="mt-2 text-sm text-amber-700">
              43 licenses require attention in the next 30 days.
            </p>
          </div>

          <div className="rounded-3xl bg-blue-50 p-5">
            <h3 className="font-bold text-blue-700">
              Growth Opportunity
            </h3>

            <p className="mt-2 text-sm text-blue-700">
              18 customers are close to their device or channel limits.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}