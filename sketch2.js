'use strict';

window.sketchClass = class extends Sketch {
  desc = 'Yeah, but what if the moon broke up into 1000 pieces,<br> each traveling at a different velocity???';

  load() {
    super.load();
    this.bodies = [];

    const maxV = 10;
    const bodyCount = 1000;
    for (let i = 0; i < bodyCount; i++) {
      this.bodies.push({
        x: this.canvas.width * 0.4,
        y: 0,
        r: 2,
        vx: 0,
        vy: i * maxV / (2.5 * bodyCount),
        c: `hsl(${this.lmap(i, 0, bodyCount, 0, 270)}, 50%, 50%)`
      });
    }
  }

  update() {
    this.bodies.forEach( (body, i) => {

      const d2 = (body.x * body.x + body.y * body.y);
      const f = -1000 / d2;
      const angle = Math.atan2(body.y, body.x);
      const ax = f * Math.cos(angle);
      const ay = f * Math.sin(angle);
      //verlet
      body.x += body.vx + 0.5 * ax;
      body.y += body.vy + 0.5 * ay;
      body.vx += ax;
      body.vy += ay;

    });
  }

  draw(ctx, width, height, t) {
    if (t < 0.1) {
      ctx.fillStyle = 'black';
    } else {
      ctx.fillStyle = 'hsla(0, 0%, 0%, 0.01)';
    }
    ctx.fillRect(0, 0, width, height);

    ctx.translate(width / 2, height / 2);
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, 2 * Math.PI);
    ctx.fill();

    this.bodies.forEach( body => {
      ctx.fillStyle = body.c;
      ctx.fillRect(body.x - body.r/2, body.y - body.r/2, body.r, body.r);
    });
  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
