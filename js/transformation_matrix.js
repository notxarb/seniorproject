var TransformationMatrix = function TransformationMatrix() {
  this.matrix = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
};

TransformationMatrix.prototype = {
  multiply_matrices: function multiply_matrices(a, b) {
    product = [];
    for (var i = 0; i < 4; i++) {
      product[i] = [];
      for (var j = 0; j < 4; j++) {
        product[i][j] = 0;
        for (var k = 0; k < 4; k++) {
          product[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    return product;
  },

  rotate: function rotate(x_rotation, y_rotation, z_rotation) {

    var x_matrix = [
      [ 1, 0, 0, 0 ],
      [ 0, Math.cos(x_rotation), -Math.sin(x_rotation), 0 ],
      [ 0, Math.sin(x_rotation), Math.cos(x_rotation), 0 ],
      [ 0, 0, 0, 1 ]
    ];

    var y_matrix = [
      [ Math.cos(y_rotation), 0, Math.sin(y_rotation), 0 ],
      [ 0, 1, 0, 0 ],
      [ -Math.sin(y_rotation), 0, Math.cos(y_rotation), 0 ],
      [ 0, 0, 0, 1 ]
    ];

    var z_matrix = [
      [ Math.cos(z_rotation), -Math.sin(z_rotation), 0, 0 ],
      [ Math.sin(z_rotation), Math.cos(z_rotation), 0, 0 ],
      [ 0, 0, 1, 0 ],
      [ 0, 0, 0, 1 ]
    ];

    return this.multiply_matrices(this.multiply_matrices(x_matrix, y_matrix),z_matrix);
  },

  translate:function translate(x_translation, y_translation, z_translation) {
    return [
      [1, 0, 0, x_translation],
      [0, 1, 0, y_translation],
      [0, 0, 1, z_translation],
      [0, 0, 0, 1],
    ];
  },

  create_transformation_matrix: function create_transformation_matrix() {
    var x_rotation = parseFloat(document.getElementById("x_rotation").value);
    var y_rotation = parseFloat(document.getElementById("y_rotation").value);
    var z_rotation = parseFloat(document.getElementById("z_rotation").value);
    var x_translation = parseFloat(document.getElementById("x_translation").value);
    var y_translation = parseFloat(document.getElementById("y_translation").value);
    var z_translation = parseFloat(document.getElementById("z_translation").value);
    this.matrix = this.multiply_matrices( this.translate(x_translation, y_translation, z_translation), this.rotate(x_rotation, y_rotation, z_rotation) );
    for (var row = 0; row < 4; row++) {
      for (var col = 0; col < 4; col++) {
        document.getElementById( "matrix" + row + col ).innerHTML = this.matrix[row][col];
      }
    }
  },

  to_mv_matrix: function to_mv_matrix() {
    // goes in like a vector space, reading down the columns not across rows
    var mv_matrix = new Array();
    for (var col = 0; col < 4; col++) {
      for (var row = 0; row < 4; row++) {
        mv_matrix.push(this.matrix[row][col]);
      }
    }
    return mv_matrix;
  }
};
