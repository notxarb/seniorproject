var gl;
var mv_matrix;
var p_matrix;
var ambient_light;
var directional_light;

var shaderProgram;

var equation;

function on_page_load(math_equation) {
  initialize_canvas();
  initialize_mv_matrix();
  initialize_p_matrix();
  initialize_ambient_light();
  initialize_directional_light();
  equation = new Equation(math_equation);
}

function initialize_canvas() {
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

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  initShaders();
}

function initialize_mv_matrix() {
  var x_rotation = parseFloat(document.getElementById("x_rotation").value);
  var y_rotation = parseFloat(document.getElementById("y_rotation").value);
  var z_rotation = parseFloat(document.getElementById("z_rotation").value);
  var x_translation = parseFloat(document.getElementById("x_translation").value);
  var y_translation = parseFloat(document.getElementById("y_translation").value);
  var z_translation = parseFloat(document.getElementById("z_translation").value);

  mv_matrix = new TransformationMatrix( x_rotation, y_rotation, z_rotation, x_translation, y_translation, z_translation );
}

function initialize_p_matrix() {
  var near   = parseFloat(document.getElementById("near_clip").value);
  var far    = parseFloat(document.getElementById("far_clip").value);
  var view   = parseFloat(document.getElementById("perspective_angle").value);
  var height = gl.viewportHeight;
  var width  = gl.viewportWidth;

  p_matrix = new PerspectiveMatrix(near, far, view, height, width);
}

function initialize_ambient_light() {
  var r = parseFloat(document.getElementById("ambient_lighting_red").value);
  var g = parseFloat(document.getElementById("ambient_lighting_green").value);
  var b = parseFloat(document.getElementById("ambient_lighting_blue").value);

  ambient_light = new AmbientLight(r, g, b);
}

function initialize_directional_light() {
  var r = parseFloat(document.getElementById("directional_lighting_red").value);
  var g = parseFloat(document.getElementById("directional_lighting_green").value);
  var b = parseFloat(document.getElementById("directional_lighting_blue").value);
  var x = parseFloat(document.getElementById("directional_lighting_x").value);
  var y = parseFloat(document.getElementById("directional_lighting_y").value);
  var z = parseFloat(document.getElementById("directional_lighting_z").value);

  directional_light = new DirectionalLight(r, g, b, x, y, z);
}

function update_transformation_matrix() {
  var x_rotation = parseFloat(document.getElementById("x_rotation").value);
  var y_rotation = parseFloat(document.getElementById("y_rotation").value);
  var z_rotation = parseFloat(document.getElementById("z_rotation").value);
  var x_translation = parseFloat(document.getElementById("x_translation").value);
  var y_translation = parseFloat(document.getElementById("y_translation").value);
  var z_translation = parseFloat(document.getElementById("z_translation").value);

  mv_matrix.create_transformation_matrix(x_rotation, y_rotation, z_rotation, x_translation, y_translation, z_translation);
  mv_matrix.create_normal_matrix();
  equation.draw();
}

function update_perspective_matrix() {
  var near   = parseFloat(document.getElementById("near_clip").value);
  var far    = parseFloat(document.getElementById("far_clip").value);
  var view   = parseFloat(document.getElementById("perspective_angle").value);
  var height = gl.viewportHeight;
  var width  = gl.viewportWidth;

  p_matrix.create_perspective_matrix(near, far, view, height, width);
  equation.draw();
}

function update_ambient_lighting() {
  var r = parseFloat(document.getElementById("ambient_lighting_red").value);
  var g = parseFloat(document.getElementById("ambient_lighting_green").value);
  var b = parseFloat(document.getElementById("ambient_lighting_blue").value);

  ambient_light.update(r, g, b);
  equation.draw();
}

function update_directional_lighing() {
  var r = parseFloat(document.getElementById("directional_lighting_red").value);
  var g = parseFloat(document.getElementById("directional_lighting_green").value);
  var b = parseFloat(document.getElementById("directional_lighting_blue").value);
  var x = parseFloat(document.getElementById("directional_lighting_x").value);
  var y = parseFloat(document.getElementById("directional_lighting_y").value);
  var z = parseFloat(document.getElementById("directional_lighting_z").value);

  directional_light.update(r, g, b, x, y, z);
  equation.draw();
}

function update_bounds() {
  equation.draw();
}
