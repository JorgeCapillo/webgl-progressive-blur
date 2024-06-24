precision highp float;

uniform vec2 uImageSize;
uniform vec2 uPlaneSize;
uniform vec2 uViewportSize;
uniform float uBlurStrength;
uniform sampler2D tMap;

varying vec2 vUv;
varying float vTime;
varying vec3 vPosition;

float noise21 (vec2 p, float ta, float tb) {
  return fract(sin(p.x*ta+p.y*tb)*5678.);
}
vec3 draw(sampler2D image, vec2 uv) {
  return texture2D(image,vec2(uv.x, uv.y)).rgb;   
}
float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
vec3 blur(vec2 uv, sampler2D image, float bluramount){
  vec3 blurred_image = vec3(0.);
  float d = smoothstep(0.8, 0.0, 3.4 - (gl_FragCoord.y / uViewportSize.y) / uViewportSize.y) * uBlurStrength + smoothstep(0.8, 0.0, (gl_FragCoord.y / uViewportSize.y) / uViewportSize.y) * uBlurStrength;
  #define repeats 40.
  for (float i = 0.; i < repeats; i++) { 
    vec2 q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) *  (rand(vec2(i,uv.x+uv.y))+bluramount); 
    vec2 uv2 = uv+(q * bluramount * d);
    blurred_image += draw(image, uv2)/2.;
    q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) *  (rand(vec2(i+2.,uv.x+uv.y+24.))+bluramount); 
    uv2 = uv+(q * bluramount * d);
    blurred_image += draw(image, uv2)/2.;
  }
  return blurred_image / repeats;
}

void main() {
  vec2 ratio = vec2(
    min((uPlaneSize.x / uPlaneSize.y) / (uImageSize.x / uImageSize.y), 1.0),
    min((uPlaneSize.y / uPlaneSize.x) / (uImageSize.y / uImageSize.x), 1.0)
  );

  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  float t = vTime + 123.0;
  float ta = t * 0.654321;
  float tb = t * (ta * 0.123456);
  
  vec4 final = vec4(blur(uv, tMap, 0.08), 1.);

  vec4 noise = vec4(1. - noise21(uv, ta, tb));
  float noiseF = 0.08;
  final = final - noise * noiseF;

  gl_FragColor = final;
}