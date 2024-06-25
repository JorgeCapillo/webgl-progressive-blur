precision highp float;

uniform vec2 uImageSize;
uniform vec2 uPlaneSize;
uniform vec2 uViewportSize;
uniform float uBlurStrength;
uniform float uTime;
uniform sampler2D tMap;

varying vec2 vUv;

/*
  by @arthurstammet
  https://shadertoy.com/view/tdXXRM
*/
float tvNoise (vec2 p, float ta, float tb) {
  return fract(sin(p.x * ta + p.y * tb) * 5678.);
}
vec3 draw(sampler2D image, vec2 uv) {
  return texture2D(image,vec2(uv.x, uv.y)).rgb;   
}
float rand(vec2 co){
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
/*
  inspired by https://www.shadertoy.com/view/4tSyzy
  @anastadunbar
*/
vec3 blur(vec2 uv, sampler2D image, float blurAmount){
  vec3 blurredImage = vec3(0.);
  float gradient = smoothstep(0.8, 0.0, 3.4 - (gl_FragCoord.y / uViewportSize.y) / uViewportSize.y) * uBlurStrength + smoothstep(0.8, 0.0, (gl_FragCoord.y / uViewportSize.y) / uViewportSize.y) * uBlurStrength;
  #define repeats 40.
  for (float i = 0.; i < repeats; i++) { 
    vec2 q = vec2(cos(degrees((i / repeats) * 360.)), sin(degrees((i / repeats) * 360.))) * (rand(vec2(i, uv.x + uv.y)) + blurAmount); 
    vec2 uv2 = uv + (q * blurAmount * gradient);
    blurredImage += draw(image, uv2) / 2.;
    q = vec2(cos(degrees((i / repeats) * 360.)), sin(degrees((i / repeats) * 360.))) * (rand(vec2(i + 2., uv.x + uv.y + 24.)) + blurAmount); 
    uv2 = uv + (q * blurAmount * gradient);
    blurredImage += draw(image, uv2) / 2.;
  }
  return blurredImage / repeats;
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

  float t = uTime + 123.0;
  float ta = t * 0.654321;
  float tb = t * (ta * 0.123456);
  vec4 noise = vec4(1. - tvNoise(uv, ta, tb));
  
  vec4 final = vec4(blur(uv, tMap, 0.08), 1.);

  final = final - noise * 0.08;

  gl_FragColor = final;
}