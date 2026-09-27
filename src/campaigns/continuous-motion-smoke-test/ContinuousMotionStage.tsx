import { CameraLayer } from '@/primitives/CameraLayer'
import { KineticText } from '@/primitives/KineticText'
import { cameraAt, interpolate } from '@/motion/continuous'
import type { SceneRatio } from '@/renderer/scene'
import { continuousCameraPath, continuousState } from './definition'
import './continuous-motion.css'

export function ContinuousMotionStage({ timeMs, ratio }: { timeMs: number; ratio: SceneRatio }) {
  const state = continuousState(timeMs)
  const camera = cameraAt(continuousCameraPath, state.time)
  const portrait = ratio === '9:16'
  const priceX = interpolate(1170, 1085, state.documentDraw)
  const priceY = interpolate(505, 400, state.documentDraw)
  const fragmentX = interpolate(portrait ? 420 : 385, portrait ? 380 : 915, state.fragmentTravel)
  const fragmentY = portrait
    ? interpolate(680, 960, state.fragmentTravel) - Math.sin(state.fragmentTravel * Math.PI) * 100
    : interpolate(455, 495, state.fragmentTravel) - Math.sin(state.fragmentTravel * Math.PI) * 150
  const fragmentScale = interpolate(1, 0.08, state.fragmentTravel)
  const viewBox = portrait ? '0 0 900 1600' : '0 0 1600 900'
  return (
    <div
      className={`continuous-stage ${portrait ? 'continuous-stage--portrait' : ''}`}
      data-render-stage
      data-motion-time={state.time}
      data-camera-scale={camera.scale.toFixed(3)}
      data-camera-x={camera.x.toFixed(3)}
      data-camera-y={camera.y.toFixed(3)}
      data-camera-focus={camera.focus.toFixed(3)}
      data-continuity="continuous"
    >
      <CameraLayer
        camera={camera}
        className="continuous-stage__camera"
        label="Composición en transformación continua"
      >
        <svg
          className="continuous-stage__art"
          viewBox={viewBox}
          role="img"
          aria-labelledby="continuous-title continuous-description"
        >
          <title id="continuous-title">Una venta nunca es sólo una venta</title>
          <desc id="continuous-description">
            El stock 18 se transforma en 17. La unidad retirada traza el valor de venta, que pasa a
            un documento y revela una estructura contable conectada.
          </desc>
          <defs>
            <clipPath id="price-reveal" clipPathUnits="userSpaceOnUse">
              <rect x="0" y="-78" width={570 * state.valueReveal} height="100" />
            </clipPath>
          </defs>
          <g
            className="continuous-stage__persistent"
            data-persistent="stock"
            transform={portrait ? 'translate(70 180)' : undefined}
          >
            <text className="continuous-stage__eyebrow" x="220" y="350">
              INVENTARIO / SKU A-104
            </text>
            <text className="continuous-stage__stock" x="220" y="500">
              1
            </text>
            <text
              className="continuous-stage__stock"
              x="350"
              y="500"
              transform={`translate(0 ${-75 * state.stockChange})`}
              opacity={1 - state.stockChange}
            >
              8
            </text>
            <text
              className="continuous-stage__stock continuous-stage__stock--next"
              x="350"
              y="500"
              transform={`translate(0 ${75 * (1 - state.stockChange)})`}
              opacity={state.stockChange}
            >
              7
            </text>
            <text className="continuous-stage__small" x="226" y="555">
              UNIDAD DISPONIBLE
            </text>
          </g>
          <g
            transform={`translate(${fragmentX} ${fragmentY}) scale(${fragmentScale})`}
            opacity={state.fragmentTravel}
            data-persistent="fragment-to-line"
          >
            <text className="continuous-stage__fragment" x="0" y="0">
              8
            </text>
          </g>
          <path
            className="continuous-stage__continuity"
            d={
              portrait
                ? 'M 436 660 C 650 760 220 850 410 1070 L 550 1070'
                : 'M 366 477 C 540 477 590 390 735 420 C 870 448 920 500 1092 500 L 1210 500'
            }
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - state.lineDraw}
            data-persistent="value-line"
          />
          <g transform={portrait ? 'translate(-650 620) scale(.9)' : undefined}>
            <g
              transform={`translate(${priceX} ${priceY})`}
              clipPath="url(#price-reveal)"
              data-persistent="sale-value"
            >
              <text className="continuous-stage__price" x="0" y="0">
                $13.490
              </text>
            </g>
            <g
              className="continuous-stage__document"
              opacity={0.45 + state.documentDraw * 0.55}
              data-persistent="document"
            >
              <rect
                x="1010"
                y="280"
                width="410"
                height="330"
                rx="2"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={1 - state.documentDraw}
              />
              <path
                d="M 1050 335 H 1375"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={1 - state.documentDraw}
              />
              <text x="1050" y="320" className="continuous-stage__eyebrow">
                VENTA / #18492
              </text>
              <text x="1050" y="455" className="continuous-stage__small">
                TOTAL
              </text>
              <path
                d="M 1050 500 H 1375 M 1050 535 H 1330"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={1 - state.documentDraw}
              />
            </g>
            <g
              className="continuous-stage__ledger"
              opacity={state.ledgerReveal}
              data-persistent="accounting-entry"
            >
              <path d="M 1050 660 H 1410 M 1050 700 H 1410 M 1050 740 H 1410 M 1210 640 V 765" />
              <text x="1050" y="640" className="continuous-stage__eyebrow">
                REGISTRO / DEBE · HABER
              </text>
              <text x="1070" y="690">
                $13.490
              </text>
              <text x="1230" y="730">
                1.1.04
              </text>
            </g>
          </g>
          <g
            className="continuous-stage__map"
            opacity={state.mapReveal}
            data-persistent="continuity-link"
          >
            <path
              d={
                portrait
                  ? 'M 400 770 C 600 880 220 1030 430 1140 S 530 1310 620 1420'
                  : 'M 295 585 C 295 745 600 795 790 720 S 1010 650 1090 610'
              }
            />
            <circle cx={portrait ? 400 : 295} cy={portrait ? 770 : 585} r="8" />
            <circle cx={portrait ? 430 : 785} cy={portrait ? 1140 : 720} r="8" />
            <text x={portrait ? 300 : 220} y={portrait ? 810 : 630}>
              STOCK
            </text>
            <text x={portrait ? 430 : 660} y={portrait ? 1350 : 775}>
              VENTA
            </text>
            <text x={portrait ? 500 : 1060} y={portrait ? 1460 : 800}>
              CONTABILIDAD
            </text>
          </g>
          <g
            className="continuous-stage__brand"
            opacity={state.closingProgress}
            data-persistent="brand-signature"
            transform={portrait ? 'translate(-800 800) scale(.9)' : undefined}
          >
            <path d="M 1420 610 C 1490 660 1500 720 1440 760" />
            <text x="1450" y="790">
              BALAXYS
            </text>
          </g>
        </svg>
        <div className="continuous-stage__closing" style={{ opacity: state.closingProgress }}>
          <KineticText
            lines={['UNA VENTA', 'NUNCA ES SÓLO', 'UNA VENTA.']}
            granularity="word"
            revealProgress={state.closingReveal}
            scale={interpolate(0.94, 1, state.closingProgress)}
            tracking="-0.07em"
            className="continuous-stage__kinetic"
          />
        </div>
      </CameraLayer>
      <div className="continuous-stage__frame" aria-hidden="true">
        <span>BALAXYS / CONTINUOUS TRANSFORMATION</span>
        <span>10.0 S · DATOS DE DEMOSTRACIÓN</span>
      </div>
      <p className="sr-only">
        Escena única. Inventario 18 pasa a 17; una unidad traza el valor $13.490. El valor forma el
        documento de venta 18492 y la estructura contable continúa desde ese mismo trazo. Los
        elementos permanecen conectados hasta la firma Balaxys.
      </p>
    </div>
  )
}
