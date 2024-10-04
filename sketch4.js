'use strict';

window.sketchClass = class extends Sketch {
  desc = 'What? Am I repulsive or something?';

  load() {
    super.load();
    this.objs = [];
    this.objs.push({
      c: 'hsl(206, 100%, 74%)',
      r: 10
    });

    const count = 32;
    for (let x = 0; x < 512 / 32; x++) {
      for (let y = 0; y < 512 / 32; y++) {
        this.objs.push({
          c: 'yellow',
          r: 10,
          x: x * 32 - 256 + 16,
          y: y * 32 - 256 + 16,
          basex: x * 32 - 256 + 16,
          basey: y * 32 - 256 + 16,
          vx: 0,
          vy: 0
        });
      }
    }
  }

  update() {

    const main = this.objs[0];
    const walkRate = 0.5;
    const mainPathR = 150 + 20 * Math.cos(walkRate * this.t * Math.exp(1));
    main.x = mainPathR * Math.cos(this.t * 0.5 * walkRate);
    main.y = mainPathR * Math.sin(this.t * 0.5 * walkRate);

    this.objs.forEach( (o, i) => {
      if (i === 0) {return;}
      const dx = o.x - main.x;
      const dy = o.y - main.y;
      const dmain = Math.sqrt(dx * dx + dy * dy);
      const fmain = 400 / dmain;
      const anglemain = Math.atan2(dy, dx);
      let fx = fmain * Math.cos(anglemain);
      let fy = fmain * Math.sin(anglemain);

      const dxbase = o.x - o.basex;
      const dybase = o.y - o.basey;
      const dbase = Math.sqrt(dxbase * dxbase + dybase * dybase);
      const fbase = -0.1 * dbase;
      const anglebase = Math.atan2(dybase, dxbase);
      fx += fbase * Math.cos(anglebase);
      fy += fbase * Math.sin(anglebase);

      const dragFactor = 0.05;
      o.vx += fx - dragFactor * o.vx;
      o.vy += fy - dragFactor * o.vy;
      o.x += o.vx + this.lmap(Math.random(), 0, 1, -2, 2);
      o.y += o.vy + this.lmap(Math.random(), 0, 1, -2, 2);
    });
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'hsla(0, 0%, 0%, 1)';
    ctx.fillRect(0, 0, width, height);

    ctx.translate(width / 2, height / 2);

    this.objs.forEach( o => {
      ctx.fillStyle = o.c;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, 2 * Math.PI);
      ctx.fill();
    });
  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
