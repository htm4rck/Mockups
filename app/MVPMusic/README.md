# MVP Music — Plataforma de Streaming Musical B2B para Locales Comerciales

> Modernización de plataforma de streaming musical B2B para locales comerciales, con reproducción resiliente, cache local, monitoreo en tiempo real, analítica de consumo y arquitectura cloud escalable.
>
> **Garantía de servicio:** Ningún local se queda sin música aunque tenga cortes de internet.

---

## 1. Aplicación para locales

La aplicación instalada en cada local se construye con **Electron + React**. Esta decisión cubre restaurantes, hoteles y tiendas con conexión inestable, ya que Electron permite cache local cifrado, control directo del player, logs de reproducción, watchdog y reproducción offline.

Para locales con conectividad estable y sin requerimiento de offline, existe una alternativa como **PWA Angular** ejecutada desde el navegador. Para despliegues en tablets o celulares, se contempla una **app móvil Android** en fases posteriores.

```mermaid
graph TD
    subgraph Local["Local / Restaurante"]
        EL[Electron App]
        EL --> PL[Player de música y video]
        EL --> CA[Cache local cifrado]
        EL --> OF[Modo offline controlado]
        EL --> HB[Heartbeat cada X segundos]
        EL --> LG[Logs de reproducción]
    end

    subgraph Alternativas["Alternativas de cliente"]
        PWA[PWA Angular\nConexión estable]
        AND[App Android\nTablets y móviles]
    end
```

---

## 2. Backend

El backend se implementa con **NestJS**, que provee velocidad de desarrollo, soporte nativo para WebSockets, colas de mensajería, APIs REST y un ecosistema Node maduro.

La base de datos principal es **PostgreSQL**. Se usa **Redis** para estado en tiempo real, cache y mensajería ligera. La mensajería asíncrona se gestiona con **RabbitMQ** en etapas iniciales, escalando a **Kafka** si el volumen de eventos lo requiere.

```mermaid
graph TD
    subgraph NestJS["Backend NestJS"]
        AU[Auth / Empresas / Locales]
        CT[Catálogo musical]
        PL[Playlists]
        SC[Programación por horario]
        LI[Licencias y suscripciones]
        TR[Tracking en tiempo real]
        AN[Analytics]
        NT[Notificaciones]
        AD[API Admin]
    end

    subgraph Infra["Infraestructura"]
        PG[(PostgreSQL)]
        RD[(Redis)]
        MQ[RabbitMQ / Kafka]
        ST[Object Storage\nS3 · R2 · Azure Blob]
        CDN[CDN\nCloudFront · Cloudflare · Azure CDN]
        OB[Observabilidad\nGrafana · Prometheus · Loki · Sentry]
        DK[Docker / Kubernetes]
    end

    NestJS --> PG
    NestJS --> RD
    NestJS --> MQ
    NestJS --> ST
    ST --> CDN
    NestJS --> OB
    NestJS --> DK
```

---

## 3. Entrega de audio

El audio no se sirve directamente desde el backend. Se almacena en **object storage** y se entrega a través de **CDN**, lo que garantiza baja latencia, alta disponibilidad y escalabilidad sin costo de egress innecesario.

```mermaid
graph LR
    UP[Carga de contenido] --> ST

    subgraph Storage["Object Storage"]
        ST[Cloudflare R2\nAWS S3\nAzure Blob]
    end

    subgraph Entrega["CDN / Entrega"]
        CF[Cloudflare CDN]
        CFF[CloudFront + MediaConvert\nSi hay video]
        AZ[Azure CDN\n⚠️ Sin Azure Media Services\nRetirado jun 2024]
        CS[Cloudflare Stream\nVideo: almacenamiento\ncodificación y entrega]
    end

    ST --> CF
    ST --> CFF
    ST --> AZ
    ST --> CS

    CF --> EL[Electron App]
    CFF --> EL
    AZ --> EL
    CS --> EL
```

> **Nota:** Azure Media Services fue retirado el 30 de junio de 2024. No se debe usar AMS como base de la solución de video.

---

## 4. Flujo de reproducción

```mermaid
sequenceDiagram
    participant E as Electron App
    participant API as NestJS API
    participant RD as Redis
    participant CDN as CDN / Storage

    E->>API: Heartbeat + estado actual
    API->>RD: Actualiza estado del local
    E->>API: Solicita playlist activa según horario
    API->>RD: Consulta cache de playlist
    RD-->>API: Respuesta (hit o miss)
    API-->>E: Playlist autorizada + tokens temporales
    E->>CDN: Descarga tracks con token firmado
    CDN-->>E: Audio MP3 / AAC
    E->>E: Reproduce y guarda en cache local
    E->>API: Log de reproducción (canción, minuto, local)
    API->>RD: Pub/Sub — evento de reproducción
```

---

## 5. Modo offline

```mermaid
stateDiagram-v2
    [*] --> Online
    Online --> Sincronizando: Playlist nueva disponible
    Sincronizando --> Online: Descarga completa
    Online --> Offline: Pérdida de conexión
    Offline --> Reproduciendo_Cache: Cache local disponible
    Reproduciendo_Cache --> Online: Conexión restaurada
    Reproduciendo_Cache --> Alerta_Expiracion: Cache > límite configurado\n24h / 48h / 72h
    Alerta_Expiracion --> Sin_Musica: Sin reconexión
    Sin_Musica --> [*]
```

El límite de reproducción offline es configurable por cliente (24, 48 o 72 horas). Pasado ese límite sin reconexión, el sistema emite una alerta y detiene la reproducción para cumplir con las políticas de licencias.

---

## 6. Usos de Redis

Redis gestiona estado efímero y comunicación en tiempo real. El contenido de audio vive exclusivamente en storage y CDN.

```mermaid
mindmap
  root((Redis))
    Sesiones de usuario
    Tokens temporales de reproducción
    Estado en vivo del local
    Heartbeats
    Cache de configuración por local
    Cache de playlists activas
    Rate limiting de API
    Locks de sincronización
    Pub/Sub de eventos en tiempo real
```

---

## 7. Capacidades del sistema

### En cada local

- Reproducción continua sin cortes.
- Descarga automática de playlists autorizadas.
- Modo offline con límite configurable: 24, 48 o 72 horas.
- Reintento automático de conexión si cae internet.
- Volumen máximo configurable por local desde administración.
- Programación por horario: mañana, tarde y noche con playlists distintas.
- Bloqueo de controles para que el usuario no cambie canciones no autorizadas.
- Reinicio automático del player si el proceso falla (watchdog).
- Alertas automáticas si el local deja de reproducir música.
- Arquitectura preparada para video y pantallas publicitarias.

### En administración

- Estado en tiempo real de locales conectados y desconectados.
- Mapa geográfico por país, ciudad, sede y estado operativo.
- Canción en reproducción ahora mismo en cada local, con minuto exacto.
- Historial completo de reproducción por local.
- Ranking de canciones y playlists más reproducidas.
- Horarios con mayor consumo de streaming.
- Locales con más desconexiones y locales en modo offline.
- Calidad de conexión por local y versión instalada del reproductor.
- Alertas por versión desactualizada del cliente.
- Métrica de cumplimiento: porcentaje del mes con música autorizada reproducida.
- Reportes para sustentar derechos y licencias ante proveedores.
- Exportación a Excel y PDF para clientes corporativos.

### Métricas operativas

| Métrica | Descripción |
|---------|-------------|
| Locales activos ahora | Conexiones activas en tiempo real |
| Locales offline | Con timestamp de última conexión |
| Canciones reproducidas hoy | Total global y por local |
| Horas de música reproducidas | Acumulado diario y mensual |
| Países y ciudades activas | Cobertura geográfica del servicio |
| Top canciones y playlists | Ranking de consumo |
| Locales con más fallas | Para soporte proactivo |
| Promedio de desconexión por ciudad | Indicador de calidad de red por zona |
| Tiempo promedio en modo offline | Indicador de resiliencia |
| Consumo CDN por país | Control de costos de infraestructura |
| Cumplimiento de licencias | Porcentaje de reproducción autorizada |
| Clientes próximos a vencer | Gestión de renovaciones |

---

## 8. Stack tecnológico

```mermaid
graph LR
    subgraph Cliente["Cliente"]
        A[Next.js\nAdmin Web]
        B[Electron + React\nPlayer Local]
        C[Android App\nFase 2]
    end

    subgraph Backend["Backend"]
        D[NestJS]
    end

    subgraph Datos["Datos"]
        E[(PostgreSQL)]
        F[(Redis)]
        G[RabbitMQ\nKafka en escala]
    end

    subgraph Storage["Contenido"]
        H[Cloudflare R2\nAWS S3\nAzure Blob]
        I[CDN\nCloudflare · CloudFront]
    end

    subgraph Ops["Operaciones"]
        J[Grafana · Prometheus\nLoki · Sentry]
        K[Docker Compose\nMVP]
        L[Kubernetes\nAzure Container Apps\nProducción]
    end

    A --> D
    B --> D
    C --> D
    D --> E
    D --> F
    D --> G
    D --> H
    H --> I
    I --> B
    D --> J
    K --> L
```

---

## 9. Roadmap de fases

```mermaid
gantt
    title Roadmap MVP Music
    dateFormat YYYY-MM
    section Fase 1 — Core
    API NestJS + Auth + Catálogo     :2025-01, 2M
    Reproductor Electron             :2025-02, 2M
    Cache local y modo offline       :2025-03, 2M
    Admin Web básico                 :2025-03, 2M
    section Fase 2 — Escala
    App móvil Android y iOS          :2025-05, 3M
    Analytics avanzado               :2025-06, 2M
    Exportación Excel y PDF          :2025-07, 1M
    section Fase 3 — Expansión
    Soporte video y pantallas        :2025-08, 3M
    Kubernetes y producción          :2025-09, 2M
```

---