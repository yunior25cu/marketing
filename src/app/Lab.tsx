import { useState } from 'react'
import { formats, ratios } from '@/compositions/formats'
import { colors } from '@/brand/tokens/colors'
import { motionTokens } from '@/brand/tokens/motion'
import { ConnectionGraph } from '@/primitives/Connection'
import { Counter } from '@/primitives/Counter'
import { DataTicker } from '@/primitives/DataTicker'
import { DocumentCard } from '@/primitives/DocumentCard'
import { EventMarker } from '@/primitives/Event'
import { FlowLine } from '@/primitives/FlowLine'
import { KineticText } from '@/primitives/KineticText'
import { MetricCounter } from '@/primitives/Metric'
import { SignalPulse } from '@/primitives/Signal'
import { StatusIndicator } from '@/primitives/Status'
import { ScenePlayer } from '@/renderer/ScenePlayer'
import type { SceneRatio } from '@/renderer/scene'
import { saleFlow } from '@/scenes/SaleFlow'
import { inventoryFlow } from '@/scenes/InventoryFlow'
import { accountingFlow } from '@/scenes/AccountingFlow'
import { CampaignConsole } from './CampaignConsole'
import './lab.css'

const scenes = [saleFlow, inventoryFlow, accountingFlow]
export function Lab() {
  const [sceneIndex, setSceneIndex] = useState(0)
  const [ratio, setRatio] = useState<SceneRatio>('16:9')
  return (
    <main className="lab shell">
      <header className="lab__header">
        <a className="wordmark" href="/">
          BALAXYS<span>✳</span>
        </a>
        <span className="micro-label">INTERNAL CREATIVE LAB / V0.1</span>
        <a className="micro-label" href="/">
          VOLVER AL INICIO ↗
        </a>
      </header>
      <section className="lab__hero">
        <span className="eyebrow">
          <i className="live-dot" /> BRAND OPERATING SYSTEM / LIVE
        </span>
        <h1>
          EL SISTEMA
          <br />
          <em>EN PRUEBA.</em>
        </h1>
        <p>Tokens, componentes, escenas y campaña en un mismo lenguaje operativo.</p>
      </section>
      <nav className="lab__nav" aria-label="Secciones del laboratorio">
        <a href="#tokens">01 / TOKENS</a>
        <a href="#tipo">02 / TIPO</a>
        <a href="#motion">03 / MOTION</a>
        <a href="#primitives">04 / PRIMITIVES</a>
        <a href="#scenes">05 / SCENES</a>
        <a href="#campaigns">06 / CAMPAIGNS</a>
        <a href="#campaign-console">07 / CONSOLE</a>
      </nav>
      <section id="tokens" className="lab-section">
        <div className="lab-section__head">
          <span className="eyebrow">01 / COLOR</span>
          <h2>
            La señal tiene
            <br />
            un significado.
          </h2>
          <p>Obsidian y Graphite construyen el entorno. Signal Lime aparece cuando algo cambia.</p>
        </div>
        <div className="swatches">
          {Object.entries(colors).map(([name, hex]) => (
            <div className="swatch" key={name}>
              <div className="swatch__color" style={{ backgroundColor: hex }} />
              <div className="swatch__meta">
                <span>{name}</span>
                <code>{hex}</code>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section id="tipo" className="lab-section">
        <div className="lab-section__head">
          <span className="eyebrow">02 / TIPOGRAFÍA</span>
          <h2>
            Claridad antes
            <br />
            que efecto.
          </h2>
          <p>
            Geist da estructura a titulares y UI. Geist Mono diferencia datos, tiempos e
            identificadores.
          </p>
        </div>
        <div className="type-spec">
          <div>
            <span className="micro-label">GEIST SANS / DISPLAY</span>
            <strong>Una venta nunca es sólo una venta.</strong>
          </div>
          <div>
            <span className="micro-label">GEIST MONO / DATA</span>
            <strong className="mono">VENTA #18492 → STOCK 18 / 17</strong>
          </div>
        </div>
      </section>
      <section id="motion" className="lab-section">
        <div className="lab-section__head">
          <span className="eyebrow">03 / MOTION</span>
          <h2>
            El tiempo ordena
            <br />
            la causa y el efecto.
          </h2>
          <p>Cuatro escalas. La propagación nunca empieza antes del evento de origen.</p>
        </div>
        <div className="motion-grid">
          {Object.entries(motionTokens.durations).map(([name, ms]) => (
            <div key={name}>
              <span className="micro-label">{name}</span>
              <strong className="mono">{ms} ms</strong>
              <div
                className="motion-grid__bar"
                style={{ width: `${Math.round((ms / motionTokens.durations.scene) * 100)}%` }}
              />
            </div>
          ))}
        </div>
      </section>
      <section id="primitives" className="lab-section">
        <div className="lab-section__head">
          <span className="eyebrow">04 / PRIMITIVES</span>
          <h2>
            Las piezas mínimas
            <br />
            del lenguaje.
          </h2>
          <p>Componentes reutilizables para mostrar eventos, entidades, cantidades y relaciones.</p>
        </div>
        <div className="primitive-grid">
          <div>
            <span className="micro-label">01 / SIGNAL PULSE</span>
            <SignalPulse active />
          </div>
          <div>
            <span className="micro-label">02 / STATUS</span>
            <StatusIndicator label="Evento activo" status="active" />
          </div>
          <div>
            <span className="micro-label">03 / COUNTER</span>
            <Counter current={2} total={4} />
          </div>
          <div>
            <span className="micro-label">04 / EVENT</span>
            <EventMarker id="E-02" label="Inventario actualizado" active time="1.6S" />
          </div>
          <div>
            <span className="micro-label">05 / METRIC</span>
            <MetricCounter label="Stock" before="18" after="17" active />
          </div>
          <div>
            <span className="micro-label">06 / FLOW LINE</span>
            <FlowLine progress={0.7} />
          </div>
          <div className="primitive-grid__wide">
            <span className="micro-label">07 / DOCUMENT</span>
            <DocumentCard
              kind="VENTA"
              id="#18492"
              rows={[
                { label: 'Artículo', value: 'A-104' },
                { label: 'Estado', value: 'CONFIRMADA' },
              ]}
              active
            />
          </div>
          <div className="primitive-grid__wide">
            <span className="micro-label">08 / KINETIC TEXT</span>
            <KineticText lines={['UN EVENTO.', 'UNA CADENA.']} accent={1} />
          </div>
          <div className="primitive-grid__full">
            <span className="micro-label">09 / CONNECTION GRAPH</span>
            <ConnectionGraph
              labels={['Venta', 'Inventario', 'Cobro', 'Registro']}
              activeIndex={2}
            />
          </div>
          <div className="primitive-grid__full">
            <span className="micro-label">10 / DATA TICKER</span>
            <DataTicker
              items={[
                { label: 'VENTA', value: '#18492' },
                { label: 'STOCK', value: '18 → 17' },
                { label: 'ESTADO', value: 'CONFIRMADA' },
              ]}
            />
          </div>
        </div>
      </section>
      <section id="scenes" className="lab-section">
        <div className="lab-section__head">
          <span className="eyebrow">05 / SCENES</span>
          <h2>
            Una escena.
            <br />
            Cuatro formatos.
          </h2>
          <p>La misma definición adapta la composición de 16:9 a 9:16 sin duplicar contenido.</p>
        </div>
        <div className="lab-selectors">
          <div className="ratio-switch" role="group" aria-label="Elegir escena">
            {scenes.map((scene, i) => (
              <button
                key={scene.id}
                className={sceneIndex === i ? 'is-active' : ''}
                onClick={() => setSceneIndex(i)}
              >
                {scene.kicker.split('/ ')[1]}
              </button>
            ))}
          </div>
          <div className="ratio-switch" role="group" aria-label="Elegir formato">
            {ratios.map((item) => (
              <button
                key={item}
                className={ratio === item ? 'is-active' : ''}
                onClick={() => setRatio(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <span className="micro-label">
            {formats[ratio].width} × {formats[ratio].height}
          </span>
        </div>
        <div className="lab-scene">
          <ScenePlayer key={`${sceneIndex}-${ratio}`} scene={scenes[sceneIndex]} ratio={ratio} />
        </div>
      </section>
      <section id="campaigns" className="lab-section lab-section--last">
        <div className="lab-section__head">
          <span className="eyebrow">06 / CAMPAIGNS</span>
          <h2>
            NO SON
            <br />
            <span className="signal-text">MÓDULOS.</span>
          </h2>
          <p>
            Primera aplicación: una secuencia exacta de diez segundos compuesta con las piezas del
            sistema.
          </p>
        </div>
        <a href="/campaigns/launch-01" className="button button--signal">
          Abrir campaña 01 <span>↗</span>
        </a>
      </section>
      <CampaignConsole />
    </main>
  )
}
