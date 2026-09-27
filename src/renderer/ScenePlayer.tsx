import { SceneCanvas } from './SceneCanvas'
import type { SceneDefinition, SceneRatio } from './scene'
import { useTimeline } from './useTimeline'
import { seconds } from '@/utils/time'

export interface ScenePlayerProps {
  scene: SceneDefinition
  ratio?: SceneRatio
  autoplay?: boolean
  compact?: boolean
}
export function ScenePlayer({ scene, ratio, autoplay = false, compact = false }: ScenePlayerProps) {
  const timeline = useTimeline(scene.duration, autoplay)
  return (
    <div className="scene-player">
      <SceneCanvas scene={scene} timeMs={timeline.time} ratio={ratio} compact={compact} />
      <div className="playback-controls">
        <button
          className="button"
          onClick={
            timeline.playing
              ? timeline.pause
              : timeline.time >= scene.duration
                ? timeline.replay
                : timeline.play
          }
          disabled={timeline.reduced}
          aria-label={timeline.playing ? 'Pausar escena' : 'Reproducir escena'}
        >
          {timeline.playing ? 'Pausar' : timeline.time >= scene.duration ? 'Repetir' : 'Reproducir'}{' '}
          <span aria-hidden="true">{timeline.playing ? 'Ⅱ' : '↗'}</span>
        </button>
        <input
          type="range"
          min="0"
          max={scene.duration}
          step="10"
          value={timeline.time}
          onChange={(e) => timeline.seek(Number(e.target.value))}
          aria-label="Posición de la escena"
        />
        <span className="timecode">
          {seconds(timeline.time)} / {seconds(scene.duration)}
        </span>
        {timeline.reduced && (
          <span className="micro-label">Movimiento reducido · estado final</span>
        )}
      </div>
    </div>
  )
}
