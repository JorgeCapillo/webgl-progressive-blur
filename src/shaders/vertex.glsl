precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uScroll;


varying vec2 vUv;
varying float vTime;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vTime = uTime;
  vPosition = position;

  vec3 p = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}