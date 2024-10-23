'use strict';

window.sketchClass = class extends Sketch {
  desc = "256 log cabin quilt patterns. This space is too small to explain the generation.<br>Read the code for details, it's simple yet interesting.";

  load() {
    super.load();

    this.w = 4;
    this.h = 4;
    this.s = this.canvas.width / this.w;

    this.blocks = (new Array(this.w * this.h)).fill(0);

    this.nextChange = 1;
    this.duration = 3;
    this.oNum = 0;

    //use gray code to try and keep the pattern from changing too much between steps
    this.oGray = this.makeGrayCode(4, 4);
  }

  makeGrayCode(n, k) {
    //base n, k digits long

    let result = [];
    for (let digitCount = 0; digitCount < k; digitCount++) {
      if (digitCount === 0) {
        for (let i = 0; i < n; i++) {
          result.push(i.toString(n));
        }
      } else {
        const startSize = result.length;
        for (let i = 1; i < n; i++) {
          const reflect = i % 2; //0 = original order, 1 = reflect
          for (let j = 0; j < startSize; j++) {
            let src;
            if (reflect === 0) {
              src = j % startSize; 
            } else {
              src = (startSize - 1) - (j % startSize);
            }
            result.push(result[src]);
          }
        }
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < startSize; j++) {
            result[i * startSize + j] = i.toString(n) + result[i * startSize + j];
          }
        }
      }
    }
    return result;
  }

  update() {
    if (this.t >= this.nextChange) {
      this.nextChange = this.t + this.duration;

      //pick the current orientation to use
      const orientations = this.oGray[this.oNum % this.oGray.length].split('').map(v => parseInt(v));
      //an orientation is 4 digit base 4 number like 1302. 
      //each block has a 4 bit binary address 0000 0001 0010 0011, etc.
      //each 1 bit in the binary address of a block determins if the coresponding digit
      //  in the orientation applies to the block
      //every orientation digit that applies to the block adds to the rotation an amount
      //  equal to the value of that orientation digit.
      //rotations are in multiples of 90 degrees

      //for every block
      for (let bi = 0; bi < this.w * this.h; bi++) {
        //get the binary address of the block
        const blockOrientations = bi.toString(2).padStart(4, 0).split('').map(v => parseInt(v));

        let orientation = 0;
        //for every digit of the orientation
        for (let i = 0; i < 4; i++) {
          //if the binary digit of the address is a 1, add the orientation digit to the total
          if (blockOrientations[i] === 1) {
            orientation += orientations[i];
          }
        }
        //save the total orientation for display
        this.blocks[bi] = orientation;
      }

      this.oNum += 1;
    }
  }

  drawBlock(ctx) {
    /*
      +------
      |+----|
      ||+---|
      |||X|||
      |||-+||
      |||--+|
      |-----+
    */
    const s = this.s;
    const s2 = this.s / 2;
    const s4 = this.s / 4;
    const s8 = this.s / 8;
    const ll = 90;
    const ld = 35;
    ctx.fillStyle = `hsl(${0 * 360 / 6}, 50%, ${ld}%)`;
    ctx.fillRect(-s2, -s2, s, s8);
    ctx.fillStyle = `hsl(${1 * 360 / 6}, 50%, ${ld}%)`;
    ctx.fillRect(-s2, -s2 + s8, s8, s - s8);
    ctx.fillStyle = `hsl(${2 * 360 / 6}, 50%, ${ld}%)`;
    ctx.fillRect(-s2 + s8, -s2 + s8, s - s8, s8);
    ctx.fillStyle = `hsl(${3 * 360 / 6}, 50%, ${ld}%)`;
    ctx.fillRect(-s2 + s8, -s2 + 2 * s8, s8, s - 2 * s8);
    ctx.fillStyle = `hsl(${4 * 360 / 6}, 50%, ${ld}%)`;
    ctx.fillRect(-s2 + 2 * s8, -s2 + 2 * s8, s - 2 * s8, s8);
    ctx.fillStyle = `hsl(${5 * 360 / 6}, 50%, ${ld}%)`;
    ctx.fillRect(-s2 + 2 * s8, -s2 + 3 * s8, s8, s - 3 * s8);

    ctx.fillStyle = `hsl(0, 0%, 50%)`;
    ctx.fillRect(-s2 + 3 * s8, -s2 + 3 * s8, s4, s4);

    ctx.fillStyle = `hsl(${0 * 360 / 6}, 50%, ${ll}%)`;
    ctx.fillRect(-s2 + s8, s2 - s8, s - s8, s8);
    ctx.fillStyle = `hsl(${1 * 360 / 6}, 50%, ${ll}%)`;
    ctx.fillRect(s2 - s8, -s2 + s8, s8, s - 2 * s8);
    ctx.fillStyle = `hsl(${2 * 360 / 6}, 50%, ${ll}%)`;
    ctx.fillRect(-s2 + 2 * s8, s2 - 2 * s8, s - 3 * s8, s8);
    ctx.fillStyle = `hsl(${3 * 360 / 6}, 50%, ${ll}%)`;
    ctx.fillRect(s2 - 2 * s8, -s2 + 2 * s8, s8, s - 4 * s8);
    ctx.fillStyle = `hsl(${4 * 360 / 6}, 50%, ${ll}%)`;
    ctx.fillRect(-s2 + 3 * s8, s2 - 3 * s8, s - 5 * s8, s8);
    ctx.fillStyle = `hsl(${5 * 360 / 6}, 50%, ${ll}%)`;
    ctx.fillRect(s2 - 3 * s8, -s2 + 3 * s8, s8, s - 6 * s8);
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    
    this.blocks.forEach( (b, i) => {
      const xi = i % this.w;
      const yi = Math.floor(i / this.w);
      const x = xi * this.s;
      const y = yi * this.s;
      ctx.save();
      //move to block center
      ctx.translate(x + this.s / 2, y + this.s / 2);
      //apply rotation
      ctx.rotate(b * Math.PI / 2);
      this.drawBlock(ctx);
      ctx.restore();
    });
    
  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
