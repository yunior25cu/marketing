import { ShaderMaterial } from 'three'

/** Subtle data grid, never used as an unmotivated full-screen effect. */
export function createDataFieldMaterial() {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 }, uStrength: { value: 0.25 } },
    vertexShader:
      'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `varying vec2 vUv;
      uniform float uTime; uniform float uStrength;
      void main(){
        vec2 grid = abs(fract(vUv * vec2(24.0, 12.0)) - 0.5);
        float line = smoothstep(0.47, 0.5, max(grid.x, grid.y));
        float wave = 0.5 + 0.5 * sin(vUv.x * 14.0 - uTime * 0.0009);
        gl_FragColor = vec4(0.18, 0.30, 0.24, line * wave * uStrength);
      }`,
  })
}
