var gl;
var p_matrix = new PerspectiveMatrix();
var mv_matrix = new TransformationMatrix();

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
  drawScene();
}

function update_directional_lighing() {
  drawScene();
}

function update_bounds() {
  drawScene();
}
