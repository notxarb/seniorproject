var DirectionalLight = function DirectionalLight(r, g, b, x, y, z) {
  this.color = [r, g, b];
  this.vector = [x, y, z];
};

DirectionalLight.prototype = {
  update: function update(r, g, b, x, y, z) {
    this.color = [r, g, b];
    this.vector = [x, y, z];
  },
  
  unit_vector: function unit_vector() {
    length = Math.sqrt(this.vector[0] * this.vector[0] + this.vector[1] * this.vector[1] + this.vector[2] * this.vector[2] );
    return (length > 0) ? [ this.vector[0] / length, this.vector[1] / length, this.vector[2] / length ] : this.vector;
  }
}