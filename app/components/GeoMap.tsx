'use client';

import { useEffect, useRef } from 'react';

export type RegionStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL';

export interface RegionMetric {
  id: string;
  country: string;
  city: string;
  coords: [number, number]; // [lat, lng]
  locations: number;
  activeNow: number;
  streamHours: string;
  avgLatency: number;
  cacheUsage: number;
  compliance: number;
  incidents: number;
  topPlaylist: string;
  growth: number;
  status: RegionStatus;
}

const STATUS_COLOR: Record<RegionStatus, string> = {
  HEALTHY: '#34d399',
  WARNING: '#fbbf24',
  CRITICAL: '#f87171',
};

const STATUS_GLOW: Record<RegionStatus, string> = {
  HEALTHY: 'rgba(52,211,153,0.35)',
  WARNING: 'rgba(251,191,36,0.35)',
  CRITICAL: 'rgba(248,113,113,0.35)',
};

interface Props {
  regions: RegionMetric[];
  selected: RegionMetric;
  onSelect: (r: RegionMetric) => void;
}

export default function GeoMap({ regions, selected, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('leaflet').Map | null>(null);
  const markersRef = useRef<Map<string, import('leaflet').CircleMarker>>(new Map());
  const linesRef = useRef<import('leaflet').Polyline[]>([]);

  // Build the map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let L: typeof import('leaflet');

    async function init() {
      L = (await import('leaflet')).default;

      // Fix default icon paths broken by webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(containerRef.current!, {
        center: [-5, -50],
        zoom: 3,
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: false,
      });

      // Dark tile layer (CartoDB Dark Matter)
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { subdomains: 'abcd', maxZoom: 19 }
      ).addTo(map);

      // Attribution small
      L.control.attribution({ prefix: false, position: 'bottomright' })
        .addAttribution('© <a href="https://carto.com/">CARTO</a>')
        .addTo(map);

      mapRef.current = map;

      // Draw connection lines from Lima (hub = regions[0])
      const hub = regions[0];
      regions
        .filter((r) => r.id !== hub.id && r.city !== 'Madrid')
        .forEach((r) => {
          const line = L.polyline([hub.coords, r.coords], {
            color: 'rgba(99,179,237,0.5)',
            weight: 1.5,
            dashArray: '6 4',
          }).addTo(map);
          linesRef.current.push(line);
        });

      // Draw markers
      regions.forEach((region) => {
        const color = STATUS_COLOR[region.status];
        const glow = STATUS_GLOW[region.status];
        const isRoadmap = region.city === 'Madrid';

        // Outer glow ring
        if (!isRoadmap) {
          L.circleMarker(region.coords, {
            radius: 18,
            color: 'transparent',
            fillColor: glow,
            fillOpacity: 0.3,
            interactive: false,
          }).addTo(map);
        }

        // Main dot
        const marker = L.circleMarker(region.coords, {
          radius: isRoadmap ? 6 : 9,
          color: '#ffffff',
          weight: 1.5,
          fillColor: color,
          fillOpacity: isRoadmap ? 0.5 : 1,
        }).addTo(map);

        // Tooltip
        marker.bindTooltip(
          `<div style="
            background:#0f172a;
            border:1px solid rgba(255,255,255,0.12);
            border-radius:12px;
            padding:10px 14px;
            color:#f1f5f9;
            font-family:system-ui,sans-serif;
            font-size:12px;
            min-width:140px;
            box-shadow:0 8px 32px rgba(0,0,0,0.5);
          ">
            <div style="font-weight:700;font-size:14px;margin-bottom:6px">${region.city}</div>
            <div style="color:#94a3b8;margin-bottom:2px">${region.country}</div>
            ${!isRoadmap ? `
              <div style="margin-top:8px;display:flex;flex-direction:column;gap:3px">
                <div style="display:flex;justify-content:space-between;gap:16px">
                  <span style="color:#64748b">Active</span>
                  <span style="font-weight:600">${region.activeNow}</span>
                </div>
                <div style="display:flex;justify-content:space-between;gap:16px">
                  <span style="color:#64748b">Latency</span>
                  <span style="font-weight:600">${region.avgLatency}ms</span>
                </div>
                <div style="display:flex;justify-content:space-between;gap:16px">
                  <span style="color:#64748b">Status</span>
                  <span style="font-weight:700;color:${color}">${region.status}</span>
                </div>
              </div>
            ` : '<div style="color:#fbbf24;margin-top:6px;font-weight:600">🗺 Roadmap</div>'}
          </div>`,
          {
            permanent: false,
            direction: 'top',
            offset: [0, -12],
            opacity: 1,
            className: 'leaflet-tooltip-custom',
          }
        );

        marker.on('click', () => onSelect(region));
        markersRef.current.set(region.id, marker);
      });
    }

    init();

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current.clear();
      linesRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Highlight selected marker
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const region = regions.find((r) => r.id === id)!;
      const isSelected = id === selected.id;
      marker.setStyle({
        radius: isSelected ? 13 : region.city === 'Madrid' ? 6 : 9,
        weight: isSelected ? 3 : 1.5,
        color: isSelected ? STATUS_COLOR[region.status] : '#ffffff',
      } as Parameters<typeof marker.setStyle>[0]);
    });
  }, [selected, regions]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full rounded-3xl"
      style={{ minHeight: 420 }}
    />
  );
}
