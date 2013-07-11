var Point = function Point(x, y, z) {
  this.coordinates = [x, y, z];
}

Point.prototype = {
  set_normal: function set_normal(x, y, z) {
    this.normal = [x, y, z];
  },
  cross: function cross(a, b) {
    var vector_a = this.vector(a);
    var vector_b = this.vector(b);
    var cross = [ vector_a[1] * vector_b[2] - vector_b[1] * vector_a[2], vector_a[2] * vector_b[0] - vector_a[0] * vector_b[2], vector_a[0] * vector_b[1] - vector_a[1] * vector_b[0] ];
    var length = Math.sqrt(cross[0] * cross[0] + cross[1] * cross[1] + cross[2] * cross[2]);
    return [ cross[0] / length, cross[1] / length, cross[2] / length ];
  },
  vector: function vector(a) {
    return [ a.coordinates[0] - this.coordinates[0], a.coordinates[1] - this.coordinates[1], a.coordinates[2] - this.coordinates[2] ];
  }
}
