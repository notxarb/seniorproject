var PerspectiveMatrix = function PerspectiveMatrix() {
  this.matrix = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, -1, 0],
    [0, 0, -1, 1]
  ];
};

PerspectiveMatrix.prototype = {
  frustrum: function frustrum(near, far, view, height, width) {
    var cot = 1 / Math.tan(view / 2)
    return [
      [ cot * (width / height), 0, 0, 0 ],
      [ 0, cot, 0, 0],
      [ 0, 0, -(far + near) / (far - near), -2 * far * near / (far - near) ],
      [ 0, 0, -1, 0]
    ];
  },

  create_perspective_matrix: function create_perspective_matrix() {
    var near   = parseFloat(document.getElementById("near_clip").value);
    var far    = parseFloat(document.getElementById("far_clip").value);
    var view   = parseFloat(document.getElementById("perspective_angle").value);
    var height = gl.viewportHeight;
    var width  = gl.viewportWidth;
    this.matrix = this.frustrum( near, far, view, height, width );
  },

  to_p_matrix: function to_p_matrix() {
    // goes in like a vector space, reading down the columns not across rows
    var p_matrix = new Array();
    for (var col = 0; col < 4; col++) {
      for (var row = 0; row < 4; row++) {
        p_matrix.push(this.matrix[row][col]);
      }
    }
    return p_matrix;
  }
};
