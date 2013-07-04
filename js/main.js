var gl;
var p_matrix = new PerspectiveMatrix();
var mv_matrix = new TransformationMatrix();
var ambient_light = new AmbientLight(0.5, 0.5, 0.5);
var directional_light = new DirectionalLight(0.5, 0.5, 0.5, 0.0, 0.0, -1.0);

function on_page_load() {
  var canvas = document.getElementById("canvas");
  try {
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch (e) {
  }
  if (!gl) {
    alert("Could not initialise WebGL, sorry :-(");
  }
  initShaders();
  initBuffers();

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  initialize_canvas();
  mv_matrix.create_transformation_matrix();
  p_matrix.create_perspective_matrix();
}

function initialize_canvas() {
  webGLStart()
}

function update_transformation_matrix() {
  mv_matrix.create_transformation_matrix();
  mv_matrix.create_normal_matrix();
  drawScene();
}

function update_perspective_matrix() {
  p_matrix.create_perspective_matrix();
  drawScene();
}

function update_ambient_lighting() {
  r = parseFloat(document.getElementById("ambient_lighting_red").value);
  g = parseFloat(document.getElementById("ambient_lighting_green").value);
  b = parseFloat(document.getElementById("ambient_lighting_blue").value);

  ambient_light.update(r, g, b);
  drawScene();
}

function update_directional_lighing() {
  r = parseFloat(document.getElementById("directional_lighting_red").value);
  g = parseFloat(document.getElementById("directional_lighting_green").value);
  b = parseFloat(document.getElementById("directional_lighting_blue").value);
  x = parseFloat(document.getElementById("directional_lighting_x").value);
  y = parseFloat(document.getElementById("directional_lighting_y").value);
  z = parseFloat(document.getElementById("directional_lighting_z").value);

  directional_light.update(r, g, b, x, y, z);
  drawScene();
}

function update_bounds() {
  drawScene();
}
