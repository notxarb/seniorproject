var AmbientLight = function AmbientLight(r, g, b) {
  this.color = [r, g, b];
};

AmbientLight.prototype = {
  update: function update(r, g, b) {
    this.color = [r, g, b];
  }
}