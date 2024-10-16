'use strict';

window.sketchClass = class extends Sketch {
  desc = 'There once was a world full of light,<br>Where it never would darken to night,<br>The people all cry,<br>As it burns out their eye<br>Though the plants thought it was alright.';

  load() {
    super.load();

    this.c0List = ['#FF0000', '#00FF00', '#0000FF'];
    this.c1List = ['#FF000000', '#00FF0000', '#0000FF00'];
 
    this.initLights();

  }

  initLights() {
    this.lights = [];
    const initCount = 1;
    for (let i = 0; i < initCount; i = i + 1) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const ci = Math.floor(Math.random() * 3);
      const a = 2 * Math.PI * Math.random();
      const dx = Math.cos(a);
      const dy = Math.sin(a);
      this.lights.push({x, y, ci, dx, dy});
    }
  }

  update() {
    const dd = 5;
    this.lights.forEach( l => {
      l.x += dd * l.dx;
      l.y += dd * l.dy;
      let newLight;

      if (l.y < 0) {
        l.y = 0;
        newLight = {...l};
        l.dy *= -1;
      }
      if (l.y >= this.canvas.height) {
        l.y = this.canvas.height - 1;
        newLight = {...l};
        l.dy *= -1;
      }
      if (l.x < 0) {
        l.x = 0;
        newLight = {...l};
        l.dx *= -1;
      }
      if (l.x >= this.canvas.width) {
        l.x = this.canvas.width - 1;
        newLight = {...l};
        l.dx *= -1;
      }

      if (newLight !== undefined) {
        newLight.dx *= -1;
        newLight.dy *= -1;
        newLight.ci = (l.ci + 1) % 3;
        this.lights.push(newLight);
      }
    });

    const lightLimit = 3000;
    if (this.lights.length > lightLimit) {
      this.initLights();
    }
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = 'lighter';

    const r = 30;
    this.lights.forEach( l => {
      const lg = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, r);
      lg.addColorStop(0.5, this.c0List[l.ci]);
      lg.addColorStop(1, this.c1List[l.ci]);
      ctx.fillStyle = lg;
      ctx.beginPath();
      ctx.arc(l.x, l.y, r, 0, 2 * Math.PI);
      ctx.fill();
    });

  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
