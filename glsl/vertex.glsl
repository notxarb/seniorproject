attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

uniform vec3 uAmbientColor;

uniform vec3 uLightingDirection;
uniform vec3 uDirectionalColor;

varying vec4 vColor;
varying vec3 vLightWeighting;

void main(void) {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
  if ( mod( ceil( aVertexPosition.x ) + ceil( aVertexPosition.y ), 2.0) ==  0.0 ) {
    vColor = vec4(0.8, 0.8, 0.8, 1.0);
  } else {
    vColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
  vec3 transformedNormal = uNMatrix * aVertexNormal;
  float directionalLightWeighting = abs(dot(uLightingDirection, transformedNormal));
  vLightWeighting = uAmbientColor + (uDirectionalColor * directionalLightWeighting);
}