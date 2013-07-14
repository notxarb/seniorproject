var Equation = function Equation(equation) {
  if (equation) {
    this.equation = equation;
  }
  else {
    this.equation = 'this.factorial(x + y) / (this.factorial(x) * this.factorial(y) * 40)';
  }
  
  this.points = [];
  this.surfaces = [];
  this.generate_points();
  this.generate_normals();
  this.generate_surfaces();
}

Equation.prototype = {
  generate_points: function generate_points() {
    if (this.equation instanceof Array)
    {
      this.points = [];
      var row;
      for ( u = -Math.PI; u <= Math.PI + 0.1; u+= 0.1 ) {
        row = [];
        for ( v = -Math.PI; v <= Math.PI; v+= 0.1 ) {
          x = eval(this.equation[0]);
          y = eval(this.equation[1]);
          z = eval(this.equation[2]);
          if (isNaN(x) || isNaN(y) || isNaN(z)) {
            row.push(null);
          }
          else {
            point = new Point(x, y, z);
            point.u = u;
            point.v = v;
            row.push(point);
          }
        }
        this.points.push(row);
      }

    }
    else
    {
      this.points = [];
      var row;
      for ( x = -10.0; x <= 10.0; x+= 0.1 ) {
        row = [];
        for ( y = -10.0; y <= 10.0; y+= 0.1 ) {
          z = eval(this.equation);
          if (isNaN(z)) {
            row.push(null);
          }
          else {
            row.push(new Point(x, y, z));
          }
        }
        this.points.push(row);
      }
    }
  },
  factorial: function factorial(x) {
    return (x <= 1) ? 1 : (x * factorial(x - 1)) ;
  },
  generate_surfaces: function generate_surfaces() {
    this.surfaces.push(new Surface());
    this.surfaces[0].points = this.points;
    for ( i = 0; i < this.surfaces.length; i++ ){
      this.surfaces[i].initialize_buffers();
    }
  },
  generate_normals: function generate_normals() {
    for ( i = 0; i < this.points.length; i++ ) {
      for ( j = 0; j < this.points[i].length; j++ ) {
        if (this.points[i][j] instanceof Point) {
          var crosses = [];
          // is there a next i?
          if (i < this.points.length - 1) {
            // is there a next j?
            if (j < this.points[i].length - 1) {
              // upper-right
              if (this.points[i][j] instanceof Point && this.points[i][j+1] instanceof Point && this.points[i+1][j] instanceof Point) {
                crosses.push(this.points[i][j].cross(this.points[i][j+1], this.points[i+1][j]));
              }
            }
            // is there a previous j?
            if (j > 0) {
              // lower-right
              if (this.points[i][j] instanceof Point && this.points[i+1][j] instanceof Point && this.points[i][j-1] instanceof Point) {
                crosses.push(this.points[i][j].cross(this.points[i+1][j], this.points[i][j-1]));
              }
            }
          }
          // is there a previous i?
          if (i > 0) {
            // is there a next j?
            if (j < this.points[i].length - 1) {
              // upper-left
              if (this.points[i][j] instanceof Point && this.points[i-1][j] instanceof Point && this.points[i][j+1] instanceof Point) {
                crosses.push(this.points[i][j].cross(this.points[i-1][j], this.points[i][j+1]));
              }
            }
            // is there a previous j?
            if (j > 0) {
              // lower-left
              if (this.points[i][j] instanceof Point && this.points[i][j-1] instanceof Point && this.points[i-1][j] instanceof Point) {
                crosses.push(this.points[i][j].cross(this.points[i][j-1], this.points[i-1][j]));
              }
            }
          }
          var sum_cross = [0,0,0];
          for ( k = 0; k < crosses.length; k++ ) {
            sum_cross[0] += crosses[k][0];
            sum_cross[1] += crosses[k][1];
            sum_cross[2] += crosses[k][2];
          }
          this.points[i][j].set_normal( sum_cross[0] / crosses.length, sum_cross[1] / crosses.length, sum_cross[2] / crosses.length );
        }
      }
    }
  },
  draw: function draw() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    for ( i = 0; i < this.surfaces.length; i++ ){
      this.surfaces[i].draw();
    }
  },
  detect_asymptotes: function detect_asymptotes() {
    
  }
}