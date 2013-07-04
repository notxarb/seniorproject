
var p_matrix = new PerspectiveMatrix();
var mv_matrix = new TransformationMatrix();

function on_page_load() {
  mv_matrix.create_transformation_matrix();
  p_matrix.create_perspective_matrix();
  initialize_canvas();
}

function initialize_canvas() {
  webGLStart()
}

function update_transformation_matrix() {
  mv_matrix.create_transformation_matrix();
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
