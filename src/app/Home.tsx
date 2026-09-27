import { useState } from 'react'
import { ConnectionGraph } from '@/primitives/Connection'
import { DataTicker } from '@/primitives/DataTicker'
import { DocumentCard } from '@/primitives/DocumentCard'
import { KineticText } from '@/primitives/KineticText'
import { ScenePlayer } from '@/renderer/ScenePlayer'
import { saleFlow } from '@/scenes/SaleFlow'
import { inventoryFlow } from '@/scenes/InventoryFlow'
import { accountingFlow } from '@/scenes/AccountingFlow'
import './home.css'

const scenes = [saleFlow, inventoryFlow, accountingFlow]

export function Home() {
  const [active, setActive] = useState(0)
  return (
    <>
      <header className="site-header shell">
        <a href="/" className="wordmark" aria-label="Balaxys, inicio">
          BALAXYS<span>✳</span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#principio">El principio</a>
          <a href="#sistema">El sistema</a>
          <a href="/lab">Laboratorio</a>
        </nav>
        <a href="/campaigns/launch-01" className="header-link">
          Ver campaña <span>↗</span>
        </a>
      </header>
      <main>
        <section className="hero shell">
          <div className="hero__top">
            <span className="eyebrow">
              <i className="live-dot" /> BUSINESS IN MOTION / 001
            </span>
            <span className="eyebrow">EL SISTEMA VISUAL DE BALAXYS</span>
          </div>
          <h1>
            UNA VENTA
            <br />
            <span>NUNCA ES SÓLO</span>
            <br />
            UNA <em>VENTA.</em>
          </h1>
          <div className="hero__bottom">
            <p>
              Una operación cambia existencias, crea relaciones y deja registros. Balaxys visualiza
              esa cadena.
            </p>
            <a className="button button--signal" href="#sistema">
              Explorar el flujo <span>↗</span>
            </a>
          </div>
          <div className="hero__axis" aria-hidden="true">
            <span>EVENTO</span>
            <span>→</span>
            <span>CONSECUENCIA</span>
          </div>
        </section>
        <div className="hero-ticker">
          <div className="shell">
            <DataTicker
              items={[
                { label: 'ORIGEN', value: 'VENTA #18492' },
                { label: 'CAMBIO', value: 'STOCK 18 → 17' },
                { label: 'RELACIÓN', value: 'CUENTA POR COBRAR' },
                { label: 'REGISTRO', value: 'ASIENTO ASOCIADO' },
              ]}
            />
          </div>
        </div>
        <section id="principio" className="principle shell">
          <div className="section-head">
            <span className="eyebrow">01 / EL PRINCIPIO</span>
            <p>
              La operación no vive en pantallas aisladas. Cada evento inicia una secuencia que se
              puede leer.
            </p>
          </div>
          <div className="principle__content">
            <KineticText
              lines={['NO ILUSTRAMOS', 'EMPRESAS.', 'MOSTRAMOS CÓMO', 'FUNCIONAN.']}
              accent={3}
            />
            <div className="principle__side">
              <div className="principle__number">
                01 <span>→</span> 04
              </div>
              <p>
                De un hecho puntual a sus consecuencias. Un lenguaje comercial construido con
                eventos, documentos y estados.
              </p>
            </div>
          </div>
          <ConnectionGraph
            labels={['Venta', 'Inventario', 'Cuenta por cobrar', 'Contabilidad']}
            activeIndex={3}
          />
        </section>
        <section id="sistema" className="system-section">
          <div className="shell">
            <div className="section-head">
              <div>
                <span className="eyebrow">02 / DATA CHOREOGRAPHY</span>
                <h2>
                  Cuando algo cambia,
                  <br />
                  todo se conecta.
                </h2>
              </div>
              <p>
                Elegí una secuencia. Cada escena comparte las mismas reglas visuales y conserva la
                relación entre origen y consecuencia.
              </p>
            </div>
            <div className="scene-tabs" role="tablist" aria-label="Escenas de operación">
              {scenes.map((scene, index) => (
                <button
                  role="tab"
                  aria-selected={active === index}
                  className={active === index ? 'is-active' : ''}
                  key={scene.id}
                  onClick={() => setActive(index)}
                >
                  <span className="mono">0{index + 1}</span>
                  {scene.kicker.split('/ ')[1]}
                  <span>↗</span>
                </button>
              ))}
            </div>
            <ScenePlayer key={scenes[active].id} scene={scenes[active]} autoplay />
            <div className="system-section__note">
              <span className="eyebrow">UNA GRAMÁTICA. MÚLTIPLES SECUENCIAS.</span>
              <span className="micro-label">
                DATOS DE DEMOSTRACIÓN / VALIDAR CAPACIDADES CON PRODUCTO
              </span>
            </div>
          </div>
        </section>
        <section className="origin shell">
          <div className="section-head">
            <span className="eyebrow">03 / ORIGEN VISIBLE</span>
            <p>
              Los documentos no aparecen por magia. Tienen una causa, un estado y un lugar en la
              secuencia.
            </p>
          </div>
          <div className="origin__layout">
            <div>
              <span className="micro-label">DOCUMENTO / EVENTO / RELACIÓN</span>
              <h2>
                EL DATO
                <br />
                TIENE
                <br />
                <em>HISTORIA.</em>
              </h2>
              <a className="button" href="/lab">
                Abrir el laboratorio <span>↗</span>
              </a>
            </div>
            <div className="origin__visual grid-field">
              <div className="origin__crosshair">+</div>
              <DocumentCard
                kind="VENTA"
                id="#18492"
                rows={[
                  { label: 'Artículo', value: 'A-104' },
                  { label: 'Cantidad', value: '01' },
                  { label: 'Estado', value: 'CONFIRMADA' },
                ]}
                active
              />
              <div className="origin__annotation">
                <span className="micro-label">ENTRADA / 01</span>
                <b className="mono">VENTA → STOCK → REGISTRO</b>
              </div>
            </div>
          </div>
        </section>
        <section className="closing">
          <div className="shell">
            <span className="eyebrow">BALAXYS / BUSINESS IN MOTION</span>
            <h2>
              NO SON
              <br />
              <em>MÓDULOS.</em>
              <br />
              ES UNA EMPRESA
              <br />
              EN MOVIMIENTO.
            </h2>
            <div className="closing__actions">
              <p>Una idea. Una secuencia. Un sistema visual que puede crecer.</p>
              <a href="/campaigns/launch-01" className="button button--signal">
                Ver campaña de 10 segundos <span>↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer shell">
        <a href="/" className="wordmark">
          BALAXYS<span>✳</span>
        </a>
        <span className="micro-label">BUSINESS IN MOTION / BRAND OS V0.1</span>
        <a className="micro-label" href="/lab">
          LABORATORIO ↗
        </a>
      </footer>
    </>
  )
}
