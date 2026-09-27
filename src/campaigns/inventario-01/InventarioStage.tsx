import { useLayoutEffect, useRef, useState } from 'react'
import { formats } from '@/compositions/formats'
import { DataTicker } from '@/primitives/DataTicker'
import { DocumentCard } from '@/primitives/DocumentCard'
import { EventMarker } from '@/primitives/Event'
import { KineticText } from '@/primitives/KineticText'
import { MetricCounter } from '@/primitives/Metric'
import { SignalPulse } from '@/primitives/Signal'
import { StatusIndicator } from '@/primitives/Status'
import type { SceneRatio } from '@/renderer/scene'
import { saleStockLink } from '@/scenes/SaleStockLink'
import type { Inventario01Frame } from './definition'
import { inventario01, inventario01Frame, inventario01Summary } from './definition'
import './inventario.css'

type Layout = 'horizontal' | 'vertical'

// Las tres fases quedan montadas: los cortes no pagan el montaje y lo invisible no se pinta.
const reveal = (visibility: number, distance = 24) => ({
  opacity: visibility,
  visibility: visibility > 0 ? ('visible' as const) : ('hidden' as const),
  transform: `translateY(${((1 - visibility) * distance).toFixed(2)}px)`,
})

function Pulse({ active, ring }: { active: boolean; ring: number | null }) {
  return (
    <span className="inv-pulse">
      <SignalPulse active={active} />
      {ring !== null && (
        <span
          className="inv-pulse__ring"
          style={{
            opacity: 0.85 * (1 - ring),
            transform: `translate(-50%, -50%) scale(${(1 + ring * 2.4).toFixed(3)})`,
          }}
        />
      )}
    </span>
  )
}

function Statement({
  beats,
  accent,
  beat,
}: {
  beats: readonly (readonly string[])[]
  accent: number
  beat: number
}) {
  return (
    <>
      {beats.map((lines, index) => (
        <div key={lines.join(' ')} className={`inv-beat inv-beat--${index === 0 ? 'a' : 'b'}`}>
          <KineticText
            lines={[...lines]}
            accent={index === 0 ? -1 : accent}
            visibleCount={index < beat ? lines.length : 0}
          />
        </div>
      ))}
    </>
  )
}

function Zones({ demo }: { demo: Inventario01Frame['demo'] | null }) {
  const [sale, stock] = inventario01.copy.zones
  return (
    <>
      <div className={`inv-zone inv-zone--sale ${demo?.confirmed ? 'is-active' : ''}`}>
        <span className="micro-label">{sale}</span>
        <Pulse active={Boolean(demo?.confirmed)} ring={demo?.pulses.sale ?? null} />
      </div>
      <div className={`inv-zone inv-zone--stock ${demo?.stockChanged ? 'is-active' : ''}`}>
        <span className="micro-label">{stock}</span>
        <Pulse active={Boolean(demo?.stockChanged)} ring={demo?.pulses.stock ?? null} />
      </div>
    </>
  )
}

function Demo({ demo, layout }: { demo: Inventario01Frame['demo']; layout: Layout }) {
  const axis = layout === 'horizontal' ? 'X' : 'Y'
  const eventStart = inventario01.phases[1].from
  return (
    <section className="inv-demo" style={reveal(demo.visibility)}>
      <div className={`inv-doc ${demo.linked ? 'is-linked' : ''}`}>
        <DocumentCard
          kind={saleStockLink.document.kind}
          id={saleStockLink.document.id}
          rows={[
            { label: 'Artículo', value: 'A-104' },
            { label: 'Cantidad', value: '3' },
            { label: 'Estado', value: demo.confirmed ? 'CONFIRMADA' : 'BORRADOR' },
          ]}
          active={demo.confirmed}
        />
      </div>
      <div className="inv-link">
        <span className="inv-link__caption micro-label" style={{ opacity: demo.caption }}>
          {demo.linked ? 'ORIGEN · VENTA #18492' : 'SALIDA · 3 UNIDADES'}
        </span>
        <span className="inv-link__track" />
        <span
          className="inv-link__fill"
          style={{ transform: `scale${axis}(${demo.link.toFixed(4)})` }}
        />
        <span
          className="inv-link__rider"
          style={{
            transform: `translate${axis}(${(demo.link * 100).toFixed(3)}%)`,
            opacity: demo.token,
          }}
        >
          <span className="inv-token mono">−3 · A-104</span>
        </span>
      </div>
      <div className="inv-stock">
        <MetricCounter
          label="Existencias · A-104"
          before="18"
          after="15"
          active={demo.stockChanged}
          note={demo.stockChanged ? 'Salida de 3 unidades' : 'Saldo actual'}
        />
      </div>
      <div className="inv-ledger">
        <div className="inv-ledger__row inv-ledger__row--head micro-label">
          <span>Mov.</span>
          <span>Tipo</span>
          <span>Cant.</span>
          <span>Origen</span>
          <span>Saldo</span>
        </div>
        <div className="inv-ledger__row mono">
          <span>—</span>
          <span className="inv-ledger__wide">SALDO ANTERIOR</span>
          <span>18</span>
        </div>
        <div
          className="inv-ledger__row inv-ledger__row--new mono"
          style={reveal(demo.movement, 16)}
        >
          <span>M-0417</span>
          <span>SALIDA</span>
          <span>−3</span>
          <span className={`inv-ledger__origin ${demo.linked ? 'signal-text' : ''}`}>
            <Pulse active={demo.linked} ring={demo.pulses.origin} />
            VENTA #18492
          </span>
          <span className="signal-text">15</span>
        </div>
      </div>
      {layout === 'horizontal' && (
        <div className="inv-log">
          {saleStockLink.events.map((event) => (
            <EventMarker
              key={event.id}
              id={event.id.toUpperCase()}
              label={event.label}
              active={demo.sceneTime >= event.at}
              time={`${((eventStart + event.at) / 1000).toFixed(1)}S`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export function InventarioStage({ timeMs, ratio }: { timeMs: number; ratio: SceneRatio }) {
  const layout: Layout = ratio === '9:16' ? 'vertical' : 'horizontal'
  const design = formats[layout === 'vertical' ? '9:16' : '16:9']
  const viewportRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const update = () => setScale(viewport.clientWidth / design.width)
    update()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [design.width])
  const frame = inventario01Frame(timeMs)
  const { copy } = inventario01
  return (
    <div
      className={`inv-stage inv-stage--${layout}`}
      role="group"
      aria-label={`Campaña ${inventario01.title} de ${inventario01.duration / 1000} segundos`}
    >
      <p className="inv-sr">{inventario01Summary}</p>
      <div
        className="inv-viewport"
        ref={viewportRef}
        style={{ aspectRatio: `${design.width} / ${design.height}` }}
      >
        <div
          className={`inv-frame inv-frame--${layout}`}
          data-render-stage
          aria-hidden="true"
          style={{ width: design.width, height: design.height, transform: `scale(${scale})` }}
        >
          <div className="inv-frame__divider" />
          <header className="inv-frame__header">
            <span className="eyebrow">BALAXYS / BUSINESS IN MOTION</span>
            <span style={reveal(frame.demo.visibility, 0)}>
              <StatusIndicator
                label={frame.demo.status}
                status={frame.demo.confirmed ? 'active' : 'idle'}
              />
            </span>
          </header>
          <Zones demo={frame.phase === 'event' ? frame.demo : null} />
          <section className="inv-statement" style={reveal(frame.premise.visibility)}>
            <Statement
              beats={copy.premise.beats}
              accent={copy.premise.accent}
              beat={frame.premise.beat}
            />
          </section>
          <Demo demo={frame.demo} layout={layout} />
          <section
            className="inv-statement inv-statement--close"
            style={reveal(frame.close.visibility)}
          >
            <Statement
              beats={copy.close.beats}
              accent={copy.close.accent}
              beat={frame.close.beat}
            />
            <div className="inv-trail" style={reveal(frame.close.trail, 16)}>
              <DataTicker items={[...copy.trail]} />
              <span className="inv-signature">
                BALAXYS <b>✳</b>
              </span>
            </div>
          </section>
          <footer className="inv-frame__footer">
            <span className="micro-label">{copy.disclosure}</span>
            <span className="mono">
              {(frame.time / 1000).toFixed(1)} / {(inventario01.duration / 1000).toFixed(1)}S
            </span>
          </footer>
        </div>
      </div>
    </div>
  )
}
