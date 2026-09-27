import { useId } from 'react'
import { colors as c } from '@/brand/tokens/colors'
import { useReducedMotion } from '@/renderer/useTimeline'
import type { SceneRatio } from '@/renderer/scene'
import { curvePoint, ease, facturacionFrame, mix } from './definition'
import './facturacion.css'

const summary =
  'Secuencia conceptual: una venta origina un comprobante fiscal electrónico; firma, envío a DGI y respuesta. El documento conserva su relación con la operación. La respuesta fiscal no representa aprobación ni dispara las conexiones operativas.'

export function FacturacionStage({ timeMs, ratio }: { timeMs: number; ratio: SceneRatio }) {
  const reduced = useReducedMotion()
  const id = useId().replace(/:/g, '')
  const f = facturacionFrame(reduced ? 10000 : timeMs, ratio)
  const { t, l, document: doc, discover, close, x, y, docScale, camera } = f
  const gate = ease(t, 3950, 4550) * (1 - ease(t, 6750, 7500))
  const outbound = t < 5600 ? ease(t, 4400, 4520) * (1 - ease(t, 5350, 5600)) : 0
  const inbound = ease(t, 5980, 6090) * (1 - ease(t, 6700, 6900))
  const transmission = ease(t, 4050, 4550) * (1 - ease(t, 5350, 5900))
  const arrival = ease(t, 5250, 5650) * (1 - ease(t, 5850, 6250))
  const sx = l.docX + (f.narrow ? 0 : 145)
  const sy = l.docY + (f.narrow ? 185 : 0)
  const gx = l.gateX
  const gy = l.gateY
  const route = `M ${sx} ${sy} C ${sx + (f.narrow ? 0 : 130)} ${sy + (f.narrow ? 130 : 0)} ${gx} ${gy - 100} ${gx} ${gy}`
  const routePoint = (p: number) =>
    `${curvePoint([sx, sx + (f.narrow ? 0 : 130), gx, gx], p)} ${curvePoint([sy, sy + (f.narrow ? 130 : 0), gy - 100, gy], p)}`
  const segments = [
    [-145, -185, 110, -185],
    [110, -185, 145, -145],
    [145, -145, 145, 185],
    [145, 185, -145, 185],
    [-145, 185, -145, -185],
  ]
  const lineWidth = l.w * 0.6
  const cam = `translate(${l.w / 2} ${l.h / 2}) translate(${(camera.x * l.w) / 100} ${(camera.y * l.h) / 100}) scale(${camera.scale}) translate(${-l.w / 2} ${-l.h / 2})`
  return (
    <div
      className="fe-stage"
      style={{ aspectRatio: `${l.w}/${l.h}` }}
      role="img"
      aria-label={summary}
      data-render-stage
      data-continuity="continuous"
      data-ratio={ratio}
    >
      <svg viewBox={`0 0 ${l.w} ${l.h}`} aria-hidden="true">
        <defs>
          <clipPath id={`${id}-closing`}>
            <rect
              x={l.closeX - 10}
              y={l.closeY - 130}
              width={(l.w - l.closeX) * close}
              height={440}
            />
          </clipPath>
          <clipPath id={`${id}-sale`}>
            <rect x={0} y={l.docY - 190} width={l.w} height={240 * (1 - doc)} />
          </clipPath>
        </defs>
        <rect width={l.w} height={l.h} fill={c.obsidian} />
        <g stroke={c.line} strokeWidth="1" opacity="0.28">
          <path d={`M 48 90 H ${l.w - 48} M 48 ${l.h - 86} H ${l.w - 48}`} />
          <path d={`M ${l.w / 2} 90 V ${l.h - 86}`} opacity="0.35" />
        </g>
        <text x="56" y="60" className="fe-micro" fill={c.mist}>
          OPERACIÓN / URUGUAY
        </text>
        <text x={l.w - 56} y="60" textAnchor="end" className="fe-micro" fill={c.muted}>
          CFE / UY
        </text>
        <g transform={cam}>
          <g aria-hidden="true" opacity={transmission * 0.78} data-object="transmission-field">
            {[-1, 0, 1].map((lane, index) => {
              const offset = lane * (f.narrow ? 52 : 74)
              const endX = gx + offset
              const startX = f.narrow ? sx + offset * 0.22 : sx + offset
              const startY = f.narrow ? sy - 35 : sy + offset
              const endY = f.narrow ? gy - 110 + offset * 0.1 : gy + offset * 0.42
              return (
                <path
                  key={lane}
                  d={`M ${startX} ${startY} C ${mix(startX, endX, 0.34)} ${startY - (f.narrow ? 45 : 15)} ${mix(startX, endX, 0.72)} ${endY + (f.narrow ? 60 : 15)} ${endX} ${endY}`}
                  fill="none"
                  stroke={index === 1 ? c.signal : c.mist}
                  strokeWidth={index === 1 ? 2.5 : 1}
                  strokeDasharray={index === 1 ? '1 1' : '2 14'}
                  pathLength="1"
                  strokeDashoffset={1 - f.send}
                  opacity={index === 1 ? 0.9 : 0.42}
                />
              )
            })}
            <path
              d={`M ${gx - 28} ${gy - (f.narrow ? 190 : 205)} L ${gx} ${gy - (f.narrow ? 225 : 240)} L ${gx + 28} ${gy - (f.narrow ? 190 : 205)}`}
              fill="none"
              stroke={c.signal}
              strokeWidth="2"
              opacity={arrival}
              transform={`translate(0 ${mix(18, 0, arrival)})`}
            />
          </g>
          <g clipPath={`url(#${id}-sale)`}>
            <text
              x={l.docX}
              y={l.docY + 15}
              textAnchor="middle"
              fontSize={f.narrow ? 175 : 210}
              fontWeight="600"
              letterSpacing="-12"
              fill={c.bone}
              transform={`translate(0 ${-doc * 80})`}
            >
              VENTA
            </text>
          </g>
          <g opacity={1 - close}>
            <text
              x={l.docX}
              y={l.docY - 260}
              textAnchor="middle"
              className="fe-caption"
              fill={c.mist}
              opacity={ease(t, 150, 500) * (1 - ease(t, 1350, 1850))}
            >
              TODO EMPIEZA ACÁ.
            </text>
          </g>
          <g opacity={gate} data-object="fiscal-plane">
            <path d={route} stroke={c.line} strokeWidth="2" fill="none" />
            <path
              d={route}
              stroke={c.signal}
              strokeWidth="3"
              fill="none"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={1 - f.send}
            />
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={
                  f.narrow
                    ? `M ${gx - 185} ${gy + i * 18} Q ${gx} ${gy + 70 + i * 18} ${gx + 185} ${gy + i * 18}`
                    : `M ${gx + i * 18} ${gy - 175} Q ${gx + 70 + i * 18} ${gy} ${gx + i * 18} ${gy + 175}`
                }
                stroke={i === 0 ? c.bone : c.line}
                strokeWidth={i === 0 ? 3 : 1}
                fill="none"
              />
            ))}
            <text
              x={gx + (f.narrow ? 0 : 85)}
              y={gy + (f.narrow ? 150 : 15)}
              textAnchor={f.narrow ? 'middle' : 'start'}
              fontSize="62"
              fontWeight="550"
              fill={c.bone}
            >
              DGI
            </text>
            <text
              x={gx + (f.narrow ? 0 : 85)}
              y={gy + (f.narrow ? 185 : 52)}
              textAnchor={f.narrow ? 'middle' : 'start'}
              className="fe-micro"
              fill={c.mist}
            >
              URUGUAY
            </text>
            <g transform={`translate(${routePoint(f.send)})`} opacity={outbound}>
              {[0, 1, 2].map((i) => (
                <path key={i} d={`M ${-26 + i * 10} -16 V 16`} stroke={c.signal} strokeWidth="6" />
              ))}
            </g>
            <g transform={`translate(${routePoint(1 - f.response)})`} opacity={inbound}>
              <circle r="14" fill={c.bone} />
              <circle r="25" stroke={c.signal} strokeWidth="2" fill="none" />
            </g>
            <g opacity={arrival * 0.72} transform={`translate(${gx} ${gy})`} aria-hidden="true">
              {[0, 1, 2].map((ring) => (
                <ellipse
                  key={ring}
                  rx={mix(30, 132 + ring * 34, arrival)}
                  ry={mix(14, 58 + ring * 14, arrival)}
                  fill="none"
                  stroke={ring === 0 ? c.signal : c.mist}
                  strokeWidth={ring === 0 ? 2 : 1}
                  opacity={1 - ring * 0.22}
                  transform={`rotate(${f.narrow ? 0 : -10})`}
                />
              ))}
            </g>
            <text
              x={f.narrow ? l.docX + 190 : (l.docX + l.gateX) / 2}
              y={f.narrow ? 925 : Math.max(l.docY, l.gateY) + 205}
              textAnchor="middle"
              className="fe-caption"
              fill={c.bone}
            >
              {t < 5850 ? 'ENVÍO' : 'RESPUESTA'}
            </text>
          </g>
          <g data-object="document" transform={`translate(${x} ${y}) scale(${docScale})`}>
            <rect x="-143" y="-183" width="286" height="366" fill={c.obsidian} opacity={doc} />
            {segments.map((s, i) => {
              const ax = -lineWidth / 2 + (i * lineWidth) / 5
              return (
                <path
                  key={i}
                  d={`M ${mix(ax, s[0], doc)} ${mix(90, s[1], doc)} L ${mix(ax + lineWidth / 5 - 8, s[2], doc)} ${mix(90, s[3], doc)}`}
                  stroke={i === 0 || i === 4 ? c.signal : c.bone}
                  strokeWidth={mix(7, 3, doc)}
                  fill="none"
                  pathLength="1"
                  strokeDasharray="1"
                  strokeDashoffset={1 - ease(t, 120 + i * 40, 440 + i * 40)}
                />
              )
            })}
            <path
              d="M 110 -185 V -145 H 145"
              stroke={c.line}
              strokeWidth="2"
              fill="none"
              opacity={doc}
            />
            <g opacity={ease(t, 2200, 2850)}>
              <text x="-112" y="-112" className="fe-micro" fill={c.mist}>
                e-FACTURA
              </text>
              <text
                x="-117"
                y="-22"
                fontSize="92"
                fontWeight="550"
                letterSpacing={mix(15, -5, ease(t, 2500, 3000))}
                fill={c.bone}
              >
                CFE
              </text>
              {[0, 1, 2].map((i) => (
                <path
                  key={i}
                  d={`M -110 ${18 + i * 24} H ${i === 2 ? 10 : 105}`}
                  stroke={i === 2 ? c.signal : c.line}
                  strokeWidth={i === 2 ? 4 : 2}
                  pathLength="1"
                  strokeDasharray="1"
                  strokeDashoffset={1 - ease(t, 2100 + i * 160, 2650 + i * 160)}
                />
              ))}
            </g>
            <g opacity={f.signature}>
              <path
                d="M -108 115 H -85 V 103 H -62 V 127 H -39 V 103 H -16 V 127 H 7 V 103 H 30 V 115 H 80"
                stroke={c.signal}
                strokeWidth="3"
                fill="none"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={1 - f.signature}
              />
              <text x="-108" y="162" fontSize="14" className="fe-mono" fill={c.mist}>
                FIRMA ELECTRÓNICA
              </text>
            </g>
            <path
              d="M -145 185 H 145 V -145"
              stroke={c.signal}
              strokeWidth="5"
              fill="none"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={1 - ease(t, 6700, 7040)}
            />
            <circle cx="145" cy="185" r={mix(0, 8, ease(t, 6700, 6850))} fill={c.signal} />
            <text
              x="0"
              y="225"
              textAnchor="middle"
              fontSize="18"
              className="fe-mono"
              fill={c.mist}
              opacity={ease(t, 6700, 7000) * (1 - discover)}
            >
              RESPUESTA RECIBIDA
            </text>
          </g>
          <g data-object="operational-links" opacity={discover}>
            {l.nodes.map(([nx, ny], i) => {
              const vertical = Math.abs(nx - x) < 80
              const portX = vertical ? x : x + (nx > x ? 145 : -145) * docScale
              const portY = vertical ? y + 185 * docScale : y
              const path = vertical
                ? `M ${portX} ${portY} C ${portX} ${portY + 60} ${nx} ${ny - 60} ${nx} ${ny}`
                : `M ${portX} ${portY} C ${portX + (nx > x ? 70 : -70)} ${portY} ${nx} ${ny} ${nx} ${ny}`
              return (
                <g key={i}>
                  <path d={path} fill="none" stroke={c.line} strokeWidth="2" />
                  <path d={path} fill="none" stroke={c.muted} strokeWidth="1" />
                  <circle cx={nx} cy={ny} r={5} fill={c.mist} />
                  <text
                    x={nx}
                    y={ny > y + 80 ? ny + 32 : ny - 24}
                    textAnchor="middle"
                    className="fe-node"
                    fill={c.mist}
                  >
                    {['VENTA', 'CONTABILIDAD', 'CUENTA CLIENTE'][i]}
                  </text>
                </g>
              )
            })}
          </g>
        </g>
        <path
          d={`M ${x - 145 * docScale} ${y - 185 * docScale} V ${l.closeY - 130} H ${l.closeX}`}
          fill="none"
          stroke={c.signal}
          strokeWidth="2"
          opacity={ease(t, 8050, 8350)}
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - ease(t, 8050, 8700)}
        />
        <g clipPath={`url(#${id}-closing)`} data-object="resolution">
          <text x={l.closeX} y={l.closeY - 74} className="fe-caption" fill={c.mist}>
            FACTURACIÓN ELECTRÓNICA
          </text>
          <text
            x={l.closeX}
            y={l.closeY + 30}
            fontSize={l.title}
            fontWeight="580"
            letterSpacing="-5"
            fill={c.bone}
          >
            PARTE DE
          </text>
          <text
            x={l.closeX}
            y={l.closeY + 30 + l.title}
            fontSize={l.title}
            fontWeight="580"
            letterSpacing="-5"
            fill={c.bone}
          >
            TU OPERACIÓN.
          </text>
          <path
            d={`M ${l.closeX} ${l.closeY + 65 + l.title} H ${l.closeX + 80}`}
            stroke={c.signal}
            strokeWidth="5"
          />
          <text
            x={l.closeX}
            y={l.closeY + 139 + l.title}
            fontSize="42"
            fontWeight="620"
            letterSpacing="-1"
            fill={c.bone}
          >
            BALAXYS
          </text>
        </g>
        <text x="56" y={l.h - 48} className="fe-disclosure" fill={c.muted}>
          SECUENCIA CONCEPTUAL · EN REVISIÓN
        </text>
        <text x="56" y={l.h - 24} className="fe-disclosure" fill={c.muted}>
          Funciones según plan y configuración.
        </text>
        <path d={`M ${l.w - 140} ${l.h - 53} H ${l.w - 56}`} stroke={c.line} strokeWidth="2" />
        <path
          d={`M ${l.w - 140} ${l.h - 53} H ${l.w - 140 + (84 * t) / 10000}`}
          stroke={c.signal}
          strokeWidth="2"
        />
      </svg>
    </div>
  )
}
