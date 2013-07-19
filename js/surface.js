var Surface = function Surface() {
  this.vertex_buffers = [];
  this.normal_buffers = [];
  this.counts = [];
  this.points = [];
}

Surface.prototype = {
  initialize_buffers: function initialize_buffers() {
    this.vertex_buffers = [];
    this.normal_buffers = [];
    this.counts = [];
    for(i=0; i < this.points.length - 1; i++) {
      var vertices = [];
      var normals = [];
      var count = 0;
      var push = false;
      var first = true;
      for(j=0; j < this.points[i].length; j++) {
        if ( this.points[i][j] instanceof Point && this.points[i][j].coordinates[2] >= -10 && this.points[i][j].coordinates[2] <= 10 ) {
          vertices = vertices.concat(this.points[i][j].coordinates)
          normals = normals.concat(this.points[i][j].normal)
          count += 1;
        }
        else
        {
          // if ( count > 2 ) {
          //   vertex_buffer = gl.createBuffer();
          //   gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
          //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
          //   this.vertex_buffers.push(vertex_buffer);

          //   normal_buffer = gl.createBuffer();
          //   gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
          //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
          //   this.normal_buffers.push(normal_buffer);

          //   this.counts.push(count);
          // }

          // vertices = [];
          // normals = [];
          // count = 0;
          if (!first && count > 0) {
            push = true;
          }
        }
        if ( this.points[i+1][j] instanceof Point && this.points[i+1][j].coordinates[2] >= -10 && this.points[i+1][j].coordinates[2] <= 10 ) {
          vertices = vertices.concat(this.points[i+1][j].coordinates)
          normals = normals.concat(this.points[i+1][j].normal)
          count += 1;
        }
        else
        {
          // if ( count  > 2 ) {
          //   vertex_buffer = gl.createBuffer();
          //   gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
          //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
          //   this.vertex_buffers.push(vertex_buffer);

          //   normal_buffer = gl.createBuffer();
          //   gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
          //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
          //   this.normal_buffers.push(normal_buffer);

          //   this.counts.push(count);
          // }

          // vertices = [];
          // normals = [];
          // count = 0;
          if (!first && count > 0) {
            push = true;
          }
        }
        if (push) {
          if ( count  > 2 ) {
            vertex_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            this.vertex_buffers.push(vertex_buffer);

            normal_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
            this.normal_buffers.push(normal_buffer);

            this.counts.push(count);
          }

          vertices = [];
          normals = [];
          count = 0;
          push = false;
          first = true;
        }
        else if (count > 0 ){
          first = false;
        }
      }
      if ( count > 2 ) {
        vertex_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        this.vertex_buffers.push(vertex_buffer);

        normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        this.normal_buffers.push(normal_buffer);

        this.counts.push(count);
      }
    }
  },

  draw: function draw() {
    for (i = 0; i < this.vertex_buffers.length; i++) {
      set_matrix_uniforms();
      
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffers[i]);
      gl.vertexAttribPointer(shader_program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.normal_buffers[i]);
      gl.vertexAttribPointer(shader_program.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.counts[i]);
    }
  }
}