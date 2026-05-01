'use client';
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  BarChart3,
  Camera,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Filter,
  MapPin,
  MessageSquare,
  Paperclip,
  Plus,
  RefreshCcw,
  Search,
  Settings,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  UserCheck,
  Users,
  X,
  Zap,
} from 'lucide-react';

const priorities = {
  CRITICAL: { label: 'Crítica', cls: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  HIGH: { label: 'Alta', cls: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  MEDIUM: { label: 'Media', cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  LOW: { label: 'Baja', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
};

const statuses = {
  NEW: { label: 'Nueva', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
  TRIAGED: { label: 'Clasificada', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  ASSIGNED: { label: 'Asignada', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  IN_PROGRESS: { label: 'En proceso', cls: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  PENDING_INFO: { label: 'Pendiente info', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  ESCALATED: { label: 'Escalada', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
  RESOLVED: { label: 'Resuelta', cls: 'bg-green-50 text-green-700 border-green-200' },
  CLOSED: { label: 'Cerrada', cls: 'bg-zinc-100 text-zinc-700 border-zinc-200' },
};

const sampleIncidents: Array<{
  id: string;
  title: string;
  category: string;
  branch: string;
  location: string;
  priority: keyof typeof priorities;
  status: keyof typeof statuses;
  assignedGroup: string;
  assignedTo: string;
  reporter: string;
  slaProgress: number;
  responseDue: string;
  resolutionDue: string;
  createdAt: string;
  updatedAt: string;
  photos: number;
  comments: number;
  impact: string;
  urgency: string;
  description: string;
}> = [
  {
    id: 'INC-2026-1048',
    title: 'Caja no imprime comprobantes electrónicos',
    category: 'TI / Punto de venta',
    branch: 'Surco',
    location: 'Caja 03',
    priority: 'CRITICAL',
    status: 'ESCALATED',
    assignedGroup: 'Soporte POS',
    assignedTo: 'Juan Pérez',
    reporter: 'María Torres',
    slaProgress: 92,
    responseDue: '15 min',
    resolutionDue: '4 h',
    createdAt: 'Hoy 09:12',
    updatedAt: 'Hoy 10:44',
    photos: 3,
    comments: 8,
    impact: 'Alto',
    urgency: 'Alta',
    description: 'La caja 03 no logra imprimir comprobantes. Las ventas quedan registradas pero el cliente no recibe ticket físico.',
  },
  {
    id: 'INC-2026-1047',
    title: 'Diferencia de stock físico vs sistema',
    category: 'Inventario / Stock',
    branch: 'Miraflores',
    location: 'Almacén reserva',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignedGroup: 'Inventario',
    assignedTo: 'Ana Salazar',
    reporter: 'Carlos Díaz',
    slaProgress: 61,
    responseDue: '30 min',
    resolutionDue: '8 h',
    createdAt: 'Hoy 08:35',
    updatedAt: 'Hoy 09:55',
    photos: 2,
    comments: 5,
    impact: 'Alto',
    urgency: 'Media',
    description: 'Producto con lote L-2026-443 registra 24 unidades en sistema, pero físicamente solo existen 18.',
  },
  {
    id: 'INC-2026-1046',
    title: 'Pedido ecommerce pagado no aparece para despacho',
    category: 'Ecommerce / Validación',
    branch: 'San Isidro',
    location: 'Backoffice',
    priority: 'HIGH',
    status: 'ASSIGNED',
    assignedGroup: 'Integraciones',
    assignedTo: 'Luis Romero',
    reporter: 'Patricia León',
    slaProgress: 37,
    responseDue: '30 min',
    resolutionDue: '8 h',
    createdAt: 'Hoy 07:50',
    updatedAt: 'Hoy 08:10',
    photos: 1,
    comments: 4,
    impact: 'Medio',
    urgency: 'Alta',
    description: 'El pedido figura pagado en ecommerce, pero no se sincronizó al módulo de entregas.',
  },
  {
    id: 'INC-2026-1045',
    title: 'Cliente reporta error al validar DNI',
    category: 'CRM / Clientes',
    branch: 'Surco',
    location: 'Caja 01',
    priority: 'MEDIUM',
    status: 'PENDING_INFO',
    assignedGroup: 'CRM',
    assignedTo: 'Rosa Vega',
    reporter: 'Diego Rojas',
    slaProgress: 48,
    responseDue: '4 h',
    resolutionDue: '2 días',
    createdAt: 'Ayer 16:20',
    updatedAt: 'Hoy 08:01',
    photos: 0,
    comments: 6,
    impact: 'Medio',
    urgency: 'Media',
    description: 'Validación de documento falla para un cliente frecuente. Se solicita captura del mensaje exacto.',
  },
  {
    id: 'INC-2026-1044',
    title: 'Ubicación de picking no encontrada',
    category: 'Logística / Ubicaciones',
    branch: 'Ate',
    location: 'Pasillo B-12',
    priority: 'MEDIUM',
    status: 'TRIAGED',
    assignedGroup: 'Logística',
    assignedTo: 'Pendiente',
    reporter: 'Jorge Ramos',
    slaProgress: 22,
    responseDue: '4 h',
    resolutionDue: '2 días',
    createdAt: 'Ayer 14:10',
    updatedAt: 'Ayer 15:40',
    photos: 4,
    comments: 2,
    impact: 'Bajo',
    urgency: 'Alta',
    description: 'Operario no encuentra ubicación registrada para mercadería comprometida.',
  },
  {
    id: 'INC-2026-1043',
    title: 'Solicitud duplicada por error de carga masiva',
    category: 'Operación / Carga masiva',
    branch: 'Centro',
    location: 'Administración',
    priority: 'LOW',
    status: 'RESOLVED',
    assignedGroup: 'Operaciones',
    assignedTo: 'Mónica Castro',
    reporter: 'Henry Ruiz',
    slaProgress: 100,
    responseDue: '1 día',
    resolutionDue: '5 días',
    createdAt: '23 Abr 11:15',
    updatedAt: '24 Abr 10:30',
    photos: 0,
    comments: 3,
    impact: 'Bajo',
    urgency: 'Baja',
    description: 'Se detectó duplicidad y se cerró mediante limpieza controlada.',
  },
];

const timeline = [
  { time: '09:12', title: 'Incidencia creada', desc: 'Registrada desde POS Surco Caja 03', icon: FileText },
  { time: '09:14', title: 'SLA asignado', desc: 'Prioridad crítica: respuesta 15 min / resolución 4 h', icon: Clock3 },
  { time: '09:18', title: 'Clasificación automática', desc: 'Categoría sugerida: TI / Punto de venta', icon: Sparkles },
  { time: '09:22', title: 'Asignada a Soporte POS', desc: 'Responsable: Juan Pérez', icon: UserCheck },
  { time: '10:31', title: 'Escalada por SLA', desc: 'Se superó el 80% del SLA de resolución', icon: ShieldAlert },
];

function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}>{children}</span>;
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

function StatCard({ icon: Icon, label, value, hint, tone = 'slate' }: {
  icon: React.ElementType;
  label: string;
  value: string;
  hint: string;
  tone?: 'slate' | 'blue' | 'red' | 'green';
}) {
  const tones = {
    slate: 'bg-slate-50 text-slate-700',
    blue: 'bg-blue-50 text-blue-700',
    red: 'bg-red-50 text-red-700',
    green: 'bg-green-50 text-green-700',
  };
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
          <p className="mt-1 text-xs text-slate-400">{hint}</p>
        </div>
        <div className={`rounded-2xl p-3 ${tones[tone]}`}><Icon size={20} /></div>
      </div>
    </Card>
  );
}

function SlaBar({ value }: { value: number }) {
  const text = value >= 90 ? 'Crítico' : value >= 70 ? 'Riesgo' : 'En tiempo';
  const cls = value >= 90 ? 'bg-red-500' : value >= 70 ? 'bg-orange-400' : 'bg-blue-500';
  return (
    <div className="min-w-[130px]">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-slate-500">{text}</span>
        <span className="font-semibold text-slate-700">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${cls}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function IncidentForm({ onClose }: { onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-slate-950/40 p-4 backdrop-blur-sm">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mx-auto max-w-5xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Nueva incidencia</h2>
            <p className="text-sm text-slate-500">Registro rápido con clasificación, evidencia y SLA automático.</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button>
        </div>
        <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_.8fr]">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Título</label>
              <input className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Ej. Caja no imprime comprobantes" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Descripción</label>
              <textarea className="mt-1 h-28 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Describe qué ocurrió, desde cuándo y qué impacto tiene..." />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div><label className="text-sm font-semibold text-slate-700">Categoría</label><select className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"><option>TI / Punto de venta</option><option>Inventario / Stock</option><option>Logística / Entrega</option><option>CRM / Clientes</option></select></div>
              <div><label className="text-sm font-semibold text-slate-700">Impacto</label><select className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"><option>Alto</option><option>Medio</option><option>Bajo</option></select></div>
              <div><label className="text-sm font-semibold text-slate-700">Urgencia</label><select className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"><option>Alta</option><option>Media</option><option>Baja</option></select></div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div><label className="text-sm font-semibold text-slate-700">Sucursal</label><select className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"><option>Surco</option><option>Miraflores</option><option>San Isidro</option><option>Ate</option></select></div>
              <div><label className="text-sm font-semibold text-slate-700">Ubicación</label><input className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Caja 03" /></div>
              <div><label className="text-sm font-semibold text-slate-700">Origen</label><select className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"><option>Web</option><option>Móvil</option><option>POS</option><option>API</option></select></div>
            </div>
            <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center">
              <Camera className="mx-auto text-slate-400" />
              <p className="mt-2 font-semibold text-slate-700">Adjuntar fotos o evidencia</p>
              <p className="text-sm text-slate-400">Arrastra archivos o usa la cámara desde móvil</p>
            </div>
          </div>
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 text-blue-700"><Sparkles size={18} /><b>Sugerencia automática</b></div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Prioridad estimada</span><Badge className={priorities.CRITICAL.cls}>Crítica</Badge></div>
                <div className="flex justify-between"><span className="text-slate-500">Grupo sugerido</span><b>Soporte POS</b></div>
                <div className="flex justify-between"><span className="text-slate-500">SLA respuesta</span><b>15 min</b></div>
                <div className="flex justify-between"><span className="text-slate-500">SLA resolución</span><b>4 horas</b></div>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="font-bold text-slate-950">Reglas activas</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• Si Impacto Alto + Urgencia Alta → Crítica</li>
                <li>• Categoría POS → asigna Soporte POS</li>
                <li>• Crítica → notifica líder regional</li>
                <li>• SLA al 80% → escalamiento automático</li>
              </ul>
            </Card>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50">Cancelar</button>
              <button onClick={onClose} className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm hover:bg-blue-700">Crear incidencia</button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailDrawer({ incident, onClose }: { incident: typeof sampleIncidents[0] | null; onClose: () => void }) {
  if (!incident) return null;
  const priority = priorities[incident.priority as keyof typeof priorities];
  const status = statuses[incident.status as keyof typeof statuses];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm">
      <motion.aside initial={{ x: 560 }} animate={{ x: 0 }} transition={{ type: 'spring', damping: 28, stiffness: 240 }} className="ml-auto h-full w-full max-w-[560px] overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 p-5 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge className={status.cls}>{status.label}</Badge>
                <Badge className={priority.cls}><span className={`mr-2 h-2 w-2 rounded-full ${priority.dot}`} />{priority.label}</Badge>
              </div>
              <h2 className="mt-3 text-xl font-bold text-slate-950">{incident.id}</h2>
              <p className="text-sm text-slate-500">{incident.title}</p>
            </div>
            <button onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button>
          </div>
        </div>
        <div className="space-y-5 p-5">
          <Card className="p-4">
            <h3 className="font-bold text-slate-950">Resumen</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{incident.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-400">Categoría</p><b>{incident.category}</b></div>
              <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-400">Sucursal</p><b>{incident.branch}</b></div>
              <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-400">Ubicación</p><b>{incident.location}</b></div>
              <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-400">Reportado por</p><b>{incident.reporter}</b></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-950">SLA</h3>
              <Badge className={incident.slaProgress >= 90 ? 'border-red-200 bg-red-50 text-red-700' : 'border-blue-200 bg-blue-50 text-blue-700'}>{incident.slaProgress}% consumido</Badge>
            </div>
            <div className="mt-4"><SlaBar value={incident.slaProgress} /></div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-400">Respuesta</p><b>{incident.responseDue}</b></div>
              <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-400">Resolución</p><b>{incident.resolutionDue}</b></div>
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="font-bold text-slate-950">Acciones rápidas</h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">Tomar atención</button>
              <button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Pedir información</button>
              <button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Escalar</button>
              <button className="rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700">Resolver</button>
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="font-bold text-slate-950">Timeline</h3>
            <div className="mt-4 space-y-4">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-blue-50 p-2 text-blue-700"><Icon size={16} /></div>
                      {index < timeline.length - 1 && <div className="mt-2 h-10 w-px bg-slate-200" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-950">{item.time} · {item.title}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="font-bold text-slate-950">Comentarios</h3>
            <div className="mt-3 space-y-3">
              <div className="rounded-2xl bg-slate-50 p-3 text-sm"><b>Juan Pérez:</b> Se validó cola de impresión. Parece ser error de driver.</div>
              <div className="rounded-2xl bg-blue-50 p-3 text-sm"><b>María Torres:</b> El cliente requiere comprobante físico para retiro.</div>
              <textarea className="h-20 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500" placeholder="Agregar comentario interno o público..." />
            </div>
          </Card>
        </div>
      </motion.aside>
    </motion.div>
  );
}

function WorkflowPanel() {
  const steps = ['NEW', 'TRIAGED', 'ASSIGNED', 'IN_PROGRESS', 'PENDING_INFO', 'RESOLVED', 'CLOSED'];
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Workflow de incidencias</h2>
          <p className="text-sm text-slate-500">Flujo base con pausa de SLA y escalamiento automático.</p>
        </div>
        <Badge className="border-blue-200 bg-blue-50 text-blue-700"><Settings size={14} className="mr-1" />Configurable</Badge>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-7">
        {steps.map((s, idx) => (
          <div key={s} className="relative rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-semibold text-slate-400">Paso {idx + 1}</div>
            <div className="mt-1 text-sm font-bold text-slate-800">{statuses[s as keyof typeof statuses].label}</div>
            {idx < steps.length - 1 && <div className="absolute -right-2 top-1/2 hidden h-0.5 w-4 bg-slate-300 md:block" />}
          </div>
        ))}
      </div>
    </Card>
  );
}

function SlaConfigPanel() {
  const rows = [
    ['Crítica', '15 min', '4 horas', '50% / 80%', 'Soporte líder + gerente'],
    ['Alta', '30 min', '8 horas', '70% / 90%', 'Líder de grupo'],
    ['Media', '4 horas', '2 días hábiles', '80% / 100%', 'Responsable asignado'],
    ['Baja', '1 día hábil', '5 días hábiles', '100%', 'Responsable asignado'],
  ];
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 p-5">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Políticas SLA</h2>
          <p className="text-sm text-slate-500">Matriz de respuesta, resolución y escalamiento.</p>
        </div>
        <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"><Plus size={16} className="mr-1 inline" />Nueva regla</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr><th className="p-4">Prioridad</th><th className="p-4">Respuesta</th><th className="p-4">Resolución</th><th className="p-4">Alertas</th><th className="p-4">Escala a</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-t border-slate-100">
                <td className="p-4 font-bold text-slate-900">{r[0]}</td><td className="p-4">{r[1]}</td><td className="p-4">{r[2]}</td><td className="p-4">{r[3]}</td><td className="p-4">{r[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default function IncidentManagementDemo() {
  const [selected, setSelected] = useState(sampleIncidents[0]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [priority, setPriority] = useState('ALL');

  const filtered = useMemo(() => sampleIncidents.filter((i) => {
    const matchesQuery = `${i.id} ${i.title} ${i.category} ${i.branch}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === 'ALL' || i.status === status;
    const matchesPriority = priority === 'ALL' || i.priority === priority;
    return matchesQuery && matchesStatus && matchesPriority;
  }), [query, status, priority]);

  const openDetail = (incident: typeof sampleIncidents[0]) => { setSelected(incident); setShowDrawer(true); };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-sm"><Zap size={22} /></div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950">Tordo Incidents</h1>
              <p className="text-sm text-slate-500">Demo completa · incidencias, evidencia, workflow y SLA</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"><RefreshCcw size={16} className="mr-2 inline" />Actualizar</button>
            <button onClick={() => setShowForm(true)} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"><Plus size={16} className="mr-2 inline" />Nueva incidencia</button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={AlertTriangle} label="Incidencias abiertas" value="42" hint="+8 registradas hoy" tone="blue" />
          <StatCard icon={Clock3} label="SLA en riesgo" value="9" hint="3 críticas escaladas" tone="red" />
          <StatCard icon={CheckCircle2} label="Resueltas hoy" value="16" hint="72% dentro de SLA" tone="green" />
          <StatCard icon={Users} label="Grupos activos" value="7" hint="TI, POS, Inventario, Logística" tone="slate" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_.8fr]">
          <Card className="overflow-hidden">
            <div className="border-b border-slate-200 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Bandeja de incidencias</h2>
                  <p className="text-sm text-slate-500">Vista operativa para mesa de control y responsables.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="border-slate-200 bg-slate-50 text-slate-600"><Filter size={13} className="mr-1" />Filtros activos</Badge>
                  <Badge className="border-blue-200 bg-blue-50 text-blue-700"><Eye size={13} className="mr-1" />Simulación</Badge>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_180px_180px_48px]">
                <div className="relative"><Search className="absolute left-3 top-3.5 text-slate-400" size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500" placeholder="Buscar por ID, título, categoría o sucursal" /></div>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-3 outline-none"><option value="ALL">Todos los estados</option>{(Object.keys(statuses) as (keyof typeof statuses)[]).map((s) => <option key={s} value={s}>{statuses[s].label}</option>)}</select>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-3 outline-none"><option value="ALL">Todas prioridades</option>{(Object.keys(priorities) as (keyof typeof priorities)[]).map((p) => <option key={p} value={p}>{priorities[p].label}</option>)}</select>
                <button className="rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"><SlidersHorizontal className="mx-auto" size={18} /></button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                  <tr><th className="p-4">Incidencia</th><th className="p-4">Prioridad</th><th className="p-4">Estado</th><th className="p-4">Ubicación</th><th className="p-4">Responsable</th><th className="p-4">SLA</th><th className="p-4"></th></tr>
                </thead>
                <tbody>
                  {filtered.map((i) => (
                    <tr key={i.id} onClick={() => openDetail(i)} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50">
                      <td className="p-4"><div className="font-bold text-slate-950">{i.id}</div><div className="mt-1 max-w-[280px] truncate text-slate-500">{i.title}</div><div className="mt-2 flex gap-2 text-xs text-slate-400"><span><Paperclip size={12} className="mr-1 inline" />{i.photos}</span><span><MessageSquare size={12} className="mr-1 inline" />{i.comments}</span></div></td>
                      <td className="p-4"><Badge className={priorities[i.priority].cls}><span className={`mr-2 h-2 w-2 rounded-full ${priorities[i.priority].dot}`} />{priorities[i.priority].label}</Badge></td>
                      <td className="p-4"><Badge className={statuses[i.status].cls}>{statuses[i.status].label}</Badge></td>
                      <td className="p-4"><div className="font-semibold text-slate-800">{i.branch}</div><div className="text-xs text-slate-400"><MapPin size={12} className="mr-1 inline" />{i.location}</div></td>
                      <td className="p-4"><div className="font-semibold text-slate-800">{i.assignedTo}</div><div className="text-xs text-slate-400">{i.assignedGroup}</div></td>
                      <td className="p-4"><SlaBar value={i.slaProgress} /></td>
                      <td className="p-4"><button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-white">Ver</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-bold text-slate-950">Dashboard SLA</h2><p className="text-sm text-slate-500">Salud operativa de atención.</p></div>
                <BarChart3 className="text-blue-600" />
              </div>
              <div className="mt-5 space-y-4">
                {[['Dentro de SLA', 72], ['En riesgo', 19], ['Vencidas', 9]].map(([label, value]) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-sm"><span className="text-slate-500">{label}</span><b>{value}%</b></div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-500" style={{ width: `${value}%` }} /></div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <h2 className="text-lg font-bold text-slate-950">Carga por grupo</h2>
              <div className="mt-4 space-y-3">
                {['Soporte POS', 'Inventario', 'Logística', 'Integraciones'].map((g, idx) => (
                  <div key={g} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"><span className="font-semibold text-slate-700">{g}</span><Badge className="border-slate-200 bg-white text-slate-700">{[12, 9, 7, 5][idx]} abiertas</Badge></div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <h2 className="text-lg font-bold text-slate-950">Reglas inteligentes</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="rounded-2xl bg-blue-50 p-3">Categoría POS → asignar a Soporte POS</div>
                <div className="rounded-2xl bg-red-50 p-3">SLA &gt; 80% + Crítica → escalar automáticamente</div>
                <div className="rounded-2xl bg-amber-50 p-3">Pendiente info → pausar SLA de resolución</div>
              </div>
            </Card>
          </div>
        </div>

        <WorkflowPanel />
        <SlaConfigPanel />
      </main>

      {showDrawer && <DetailDrawer incident={selected} onClose={() => setShowDrawer(false)} />}
      {showForm && <IncidentForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
