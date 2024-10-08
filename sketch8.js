'use strict';

window.sketchClass = class extends Sketch {
  desc = '\ud83e\udea2\u0032\ufe0f\u20e3\u2696\ufe0f';

  load() {
    super.load();
    this.bodies = [];
    const blockSize = 2;
    this.blockSize = blockSize;

    this.bodies[0] = {
      d: 0,
      period: 1,
      s: 70 / blockSize,
      c: 'yellow',
      blocks: []
    };

    for (let x = 0; x < this.bodies[0].s; x++) {
      this.bodies[0].blocks[x] = [];
      for (let y = 0; y < this.bodies[0].s; y++) {
        this.bodies[0].blocks[x].push(
          {
            h: 60,
            s: 100,
            l: 30,
            ls: 50 * this.noise3([x + 0.2, y + 0.7, 10 + 0.5]) 
          }
        );
      }
    }

    this.bodies[1] = {
      d: 170,
      period: 1,
      s: 40 / blockSize,
      c: 'blue',
      blocks: []
    };

    for (let x = 0; x < this.bodies[1].s; x++) {
      this.bodies[1].blocks[x] = [];
      for (let y = 0; y < this.bodies[1].s; y++) {
        const color = [240, 120, 240][Math.floor(Math.random() * 3)];
        this.bodies[1].blocks[x].push(
          {
            h: color,
            s: 50,
            l: 50
          }
        );
      }
    }

    this.bodies[2] = {
      d: 70,
      period: 1/12,
      s: 20 / blockSize,
      c: 'gray',
      blocks: []
    };
    for (let x = 0; x < this.bodies[2].s; x++) {
      this.bodies[2].blocks[x] = [];
      for (let y = 0; y < this.bodies[2].s; y++) {
        this.bodies[2].blocks[x].push(
          {
            h: 0,
            s: 0,
            l: 50,
            ls: 10 * Math.sin(Math.random() * 2 * Math.PI)
          }
        );
      }
    }
  }

  between(testVal, val0, val1) {
    if (val0 <= val1) {
      return testVal >= val0 && testVal <= val1;
    } else {
      return testVal <= val0 && testVal >= val1;
    }
  }

  checkForBlock(bodyBlockX, bodyBlockY, sunBlockX, sunBlockY, otherBody) {
    /*
       ox0,oy0 +---+ ox1,oy0
               |   |
               |   |
       ox0,oy1 +---+ ox1,oy1
    */
    const ox0 = otherBody.x - otherBody.s * this.blockSize / 2;
    const ox1 = otherBody.x + otherBody.s * this.blockSize / 2;
    const oy0 = otherBody.y - otherBody.s * this.blockSize / 2;
    const oy1 = otherBody.y + otherBody.s * this.blockSize / 2;

    const dx = sunBlockX - bodyBlockX;
    const dy = sunBlockY - bodyBlockY;
    //figure out the line from the sun to the body
    if (dx === 0) {
      return sunBlockX >= ox0 && sunBlockX <= ox1;
    } else {

      const m = dy / dx;
      const b = sunBlockY - m * sunBlockX;
      //blocking if it intersects the left line, or the right line or vertical and between the x and y

      //still need to return false if the intersection point is past the body and sun

      //left intersection
      if (this.between(ox0, bodyBlockX, sunBlockX)) {
        const ly = m * ox0 + b;
        if (ly >= oy0 && ly <= oy1) {
          return true;
        }
      }
      //right intersection
      if (this.between(ox1, bodyBlockX, sunBlockX)) {
        const ry = m * ox1 + b;
        if (ry >= oy0 && ry <= oy1) {
          return true;
        }
      }

      //x = (y - b) / m
      //top intersection
      if (this.between(oy0, bodyBlockY, sunBlockY)) {
        const tx = (oy0 - b) / (m == 0 ? 0.0001 : m);
        if (tx >= ox0 && tx <= ox1) {
          return true;
        }
      }
      //bottom intersection
      if (this.between(oy1, bodyBlockY, sunBlockY)) {
        const bx = (oy1 - b) / m;
        if (bx >= ox0 && bx <= ox1) {
          return true;
        }
      }


      return false;
    }
  }

  update() {

    //update position
    const periodScale = 10;
    let prevX = 0;
    let prevY = 0;
    this.bodies.forEach( (body, i) => {
      const phase = 0; //(i === 2 ? Math.PI / 2 : 0) * (body.period * periodScale);
      body.x = prevX + body.d * Math.cos((this.t + phase) / (body.period * periodScale));
      body.y = prevY + body.d * Math.sin((this.t + phase) / (body.period * periodScale));
      prevX = body.x;
      prevY = body.y;
    });

    //update lighting
    const sun = this.bodies[0];
    const maxSun = this.bodies[0].s * this.bodies[0].s;
    this.bodies.forEach( (body, i) => {
      if (i === 0) {return;} //don't light the sun...

      const otherBody = i === 1 ? this.bodies[2] : this.bodies[1];

      //for every block in the body
      for (let x = 0; x < body.s; x++) {
        const bodyRow = body.blocks[x];
        for (let y = 0; y < body.s; y++) {
          const cell = bodyRow[y];
          const bodyBlockX = body.x - body.s * this.blockSize / 2 + x * this.blockSize;
          const bodyBlockY = body.y - body.s * this.blockSize / 2 + y * this.blockSize;

          //for every block in the sun
          let lightCount = 0;
          for (let sx = 0; sx < sun.s; sx++) {
            const sunRow = sun.blocks[x];
            for (let sy = 0; sy < sun.s; sy++) {
              const sunCell = sunRow[sy];
              const sunBlockX = sun.x - sun.s * this.blockSize / 2 + sx * this.blockSize;
              const sunBlockY = sun.y - sun.s * this.blockSize / 2 + sy * this.blockSize;
              //check if otherBody is between cell and sunCell
              const blocked = this.checkForBlock(bodyBlockX, bodyBlockY, sunBlockX, sunBlockY, otherBody);

              //increment light if not blocked
              if (!blocked) {
                lightCount += 1;
              }
            }
          }
          //set block luminosity
          const ambient = 10;
          cell.l = 50 * (lightCount + ambient) / (maxSun + ambient);
        }
      }
    });
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.translate(width / 2, height / 2);

    ctx.filter = 'blur(10px)';
    ctx.fillStyle = 'yellow';
    ctx.fillRect(-this.bodies[0].s * this.blockSize / 2, - this.bodies[0].s * this.blockSize / 2, this.bodies[0].s * this.blockSize, this.bodies[0].s * this.blockSize);
    ctx.filter = 'none';

    this.bodies.forEach( (body, i) => {
      const bodyOffsetX = body.x - (body.s * this.blockSize) / 2;
      const bodyOffsetY = body.y - (body.s * this.blockSize) / 2;
      const bodyd = Math.sqrt(body.x * body.x + body.y * body.y);
      for (let x = 0; x < body.s; x++) {
        const row = body.blocks[x];
        for (let y = 0; y < body.s; y++) {
          const cell = row[y];
          const cellAX = bodyOffsetX + x * this.blockSize;
          const cellAY = bodyOffsetY + y * this.blockSize;
          const d = Math.sqrt(cellAX * cellAX + cellAY * cellAY);
          let ls;
          if (i === 0) {
            ls = 50 * this.noise3([(x + 232) / 10, y / 10 , (0.1*(t +1000) )  ]) 
          } else {
            ls = cell.ls === undefined ? 0 : cell.ls;
          }
          const rd = bodyd - d;
          if (i == 2) {
          ls = ls;
          }
          if (i > 0 && rd < 0) {
            ls -= 30;
          }
          const l = cell.l + ls;
          //const l = rd;
          ctx.fillStyle = `hsl(${cell.h}, ${cell.s}%, ${l}%)`;
          ctx.fillRect(cellAX, cellAY, this.blockSize, this.blockSize);
        }
      }
    });

  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
