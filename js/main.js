var gl;
var mv_matrix;
var p_matrix;
var ambient_light;
var directional_light;

var shader_program;

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
    alert("WebGL isn't working");
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  initialize_shaders();
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

function get_shader(id) {
  var shader_script = new XMLHttpRequest();
  shader_script.open("GET", "/glsl/" + id + ".glsl", false);
  shader_script.send();

  var shader;
  if (id == "fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  }
  if (id == "vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  }

  gl.shaderSource(shader, shader_script.responseText);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
  }

  return (shader) ? shader : null;
}

function initialize_shaders() {
  var fragment_shader = get_shader("fragment");
  var vertex_shader = get_shader("vertex");

  shader_program = gl.createProgram();
  gl.attachShader(shader_program, vertex_shader);
  gl.attachShader(shader_program, fragment_shader);
  gl.linkProgram(shader_program);

  if (!gl.getProgramParameter(shader_program, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }

  gl.useProgram(shader_program);

  shader_program.vertexPositionAttribute = gl.getAttribLocation(shader_program, "aVertexPosition");
  gl.enableVertexAttribArray(shader_program.vertexPositionAttribute);
  shader_program.vertexNormalAttribute = gl.getAttribLocation(shader_program, "aVertexNormal");
  gl.enableVertexAttribArray(shader_program.vertexNormalAttribute);

  shader_program.pMatrixUniform = gl.getUniformLocation(shader_program, "uPMatrix");
  shader_program.mvMatrixUniform = gl.getUniformLocation(shader_program, "uMVMatrix");
  shader_program.nMatrixUniform = gl.getUniformLocation(shader_program, "uNMatrix");
  shader_program.ambientColorUniform = gl.getUniformLocation(shader_program, "uAmbientColor");
  shader_program.lightingDirectionUniform = gl.getUniformLocation(shader_program, "uLightingDirection");
  shader_program.directionalColorUniform = gl.getUniformLocation(shader_program, "uDirectionalColor");
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

function set_matrix_uniforms() {
  gl.uniformMatrix4fv(shader_program.pMatrixUniform, false, p_matrix.to_p_matrix());
  gl.uniformMatrix4fv(shader_program.mvMatrixUniform, false, mv_matrix.to_mv_matrix());
  gl.uniformMatrix3fv(shader_program.nMatrixUniform, false, mv_matrix.to_normal_matrix());
  gl.uniform3fv(shader_program.ambientColorUniform, ambient_light.color);
  gl.uniform3fv(shader_program.lightingDirectionUniform, directional_light.unit_vector());
  gl.uniform3fv(shader_program.directionalColorUniform, directional_light.color);
}

var autorotate = window.setInterval( function() {
    x_rotation = parseFloat(document.getElementById("x_rotation").value);
    y_rotation = parseFloat(document.getElementById("y_rotation").value);
    z_rotation = parseFloat(document.getElementById("z_rotation").value);
    if (x_rotation < 6.28) {
      x_rotation += 0.04;
      document.getElementById("x_rotation").value = x_rotation;
    }
    else if (y_rotation < 6.28) {
      y_rotation += 0.04;
      document.getElementById("y_rotation").value = y_rotation;
    }
    else if (z_rotation < 6.28) {
      z_rotation += 0.04;
      document.getElementById("z_rotation").value = z_rotation;
    }
    else
    {
      window.clearInterval(autorotate);
    }
    update_transformation_matrix();
  },
  40
);
