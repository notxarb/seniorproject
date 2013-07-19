var Equation = function Equation(equation) {
  if (equation) {
    this.equation = equation;
  }
  else {
    this.equation = 'this.factorial(x + y) / (this.factorial(x) * this.factorial(y) * 40)';
  }
  
  this.points = [];
  this.surfaces = [];
  this.generate_google_link();
  this.generate_points();
  this.smooth_edges();
  this.generate_normals();
  this.generate_surfaces();
}

Equation.prototype = {
  generate_points: function generate_points() {
    if (this.equation instanceof Array)
    {
      this.points = [];
      var row;
      for ( u = -Math.PI; u <= Math.PI + 0.025; u+= 0.025 ) {
        row = [];
        for ( v = -Math.PI; v <= Math.PI; v+= 0.025 ) {
          x = eval(this.equation[0]);
          y = eval(this.equation[1]);
          z = eval(this.equation[2]);
          if (isNaN(x) || isNaN(y) || isNaN(z) || x > 10.0 || x < -10.0 || y > 10.0 || y < -10.0 || z > 10.0 || z < -10.0) {
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
          if (isNaN(z) || z > 10.0 || z < -10.0) {
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
          length = Math.sqrt(sum_cross[0] * sum_cross[0] + sum_cross[1] * sum_cross[1] + sum_cross[2] * sum_cross[2]);
          this.points[i][j].set_normal( sum_cross[0] / length, sum_cross[1] / length, sum_cross[2] / length );
        }
      }
    }
  },
  smooth_edges: function smooth_edges() {
    if (!(this.equation instanceof Array))
    {
      var x_min;
      var x_max;
      var x_dir;
      var y_min;
      var y_max;
      var y_dir;
      for ( i = 0; i < this.points.length; i++ ) {
        for ( j = 0; j < this.points[i].length; j++ ) {
          if (this.points[i][j] instanceof Point) {
            if (i > 0 && i < this.points.length - 1) {
              if ( !(this.points[i - 1][j] instanceof Point) && (this.points[i + 1][j] instanceof Point) ) {
                // should try shifting x toward x - .05
                x_min = this.points[i][j].coordinates[0] - 0.1;
                x_max = this.points[i][j].coordinates[0];
                x_dir = "left";
              }
              else if ( (this.points[i - 1][j] instanceof Point) && !(this.points[i + 1][j] instanceof Point) ) {
                // should try shifting x toward x + .05
                x_min = this.points[i][j].coordinates[0];
                x_max = this.points[i][j].coordinates[0] + 0.1;
                x_dir = "right";
              }
              else
              {
                // nothing
                x_min = null;
                x_max = null;
              }
            }
            else {
              x_min = null;
              x_max = null;
            }
            if (j > 0 && j < this.points[i].length - 1) {
              if ( !(this.points[i][j - 1] instanceof Point) && (this.points[i][j + 1] instanceof Point) ) {
                // should try shifting y toward y - .05
                y_min = this.points[i][j].coordinates[1] - 0.1;
                y_max = this.points[i][j].coordinates[1];
                y_dir = "down";
              }
              else if ( (this.points[i][j - 1] instanceof Point) && !(this.points[i][j + 1] instanceof Point) ) {
                // should try shifting y toward y + .05
                y_min = this.points[i][j].coordinates[1];
                y_max = this.points[i][j].coordinates[1] + 0.1;
                y_dir = "up";
              }
              else
              {
                // nothing
                y_min = null;
                y_max = null;
              }
            }
            else {
              y_min = null;
              y_max = null;
            }
            // move things around
            if (x_min || y_min) {
              var x;
              var y;
              var z;
              if (x_min && !y_min) {
                y = this.points[i][j].coordinates[1];
                for (rounds = 0; rounds < 30; rounds += 1) {
                  x = (x_min + x_max) / 2;
                  z = eval(this.equation);
                  if (isNaN(z) || z > 10.0 || z < -10.0) {
                    if (x_dir == "left"){
                      x_min = (x_min + x_max) / 2;
                    } 
                    else {
                      x_max = (x_min + x_max) / 2;
                    }
                  }
                  else {
                    if (x_dir == "left"){
                      x_max = (x_min + x_max) / 2;
                    } 
                    else {
                      x_min = (x_min + x_max) / 2;
                    }
                  }
                }
                if (x_dir == "left") {
                  x = x_max;
                  z = eval(this.equation);
                  this.points[i][j].coordinates = [x, y, z];
                }
                else
                {
                  x = x_min;
                  z = eval(this.equation);
                  this.points[i][j].coordinates = [x, y, z];
                }
              }
              if (!x_min && y_min) {
                x = this.points[i][j].coordinates[0];
                for (rounds = 0; rounds < 30; rounds += 1) {
                  y = (y_min + y_max) / 2;
                  z = eval(this.equation);
                  if (isNaN(z) || z > 10.0 || z < -10.0) {
                    if (y_dir == "down"){
                      y_min = (y_min + y_max) / 2;
                    } 
                    else {
                      y_max = (y_min + y_max) / 2;
                    }
                  }
                  else {
                    if (y_dir == "down"){
                      y_max = (y_min + y_max) / 2;
                    } 
                    else {
                      y_min = (y_min + y_max) / 2;
                    }
                  }
                }
                if (y_dir == "down") {
                  y = y_max;
                  z = eval(this.equation);
                  this.points[i][j].coordinates = [x, y, z];
                }
                else
                {
                  y = y_min;
                  z = eval(this.equation);
                  this.points[i][j].coordinates = [x, y, z];
                }
              }
              if (x_min && y_min) {
                for (rounds = 0; rounds < 30; rounds += 1) {
                  x = (x_min + x_max) / 2;
                  y = (y_min + y_max) / 2;
                  z = eval(this.equation);
                  if (isNaN(z) || z > 10.0 || z < -10.0) {
                    if (x_dir == "left"){
                      x_min = (x_min + x_max) / 2;
                    } 
                    else {
                      x_max = (x_min + x_max) / 2;
                    }
                    if (y_dir == "down"){
                      y_min = (y_min + y_max) / 2;
                    } 
                    else {
                      y_max = (y_min + y_max) / 2;
                    }
                  }
                  else {
                    if (y_dir == "down"){
                      y_max = (y_min + y_max) / 2;
                    } 
                    else {
                      y_min = (y_min + y_max) / 2;
                    }
                    if (x_dir == "left"){
                      x_max = (x_min + x_max) / 2;
                    } 
                    else {
                      x_min = (x_min + x_max) / 2;
                    }
                  }
                }
                if (x_dir == "left") {
                  x = x_max;
                }
                else {
                  x = x_min;
                }
                if (y_dir == "down") {
                  y = y_max;
                }
                else {
                  y = y_min;
                }
                z = eval(this.equation);
                this.points[i][j].coordinates = [x, y, z];

              }
            }
          }
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
  generate_google_link: function generate_google_link() {
    if (!(this.equation instanceof Array)) {
      var url = "http://www.google.com/search?q=" + encodeURIComponent(this.equation);
      var element = document.getElementById("google_link");
      if (element) {
        element.style.display = '';
        element.href = url;
      } 
    }
  }
}