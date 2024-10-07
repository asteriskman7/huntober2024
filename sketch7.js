'use strict';

window.sketchClass = class extends Sketch {
  desc = "I'm starting to think that the superstition about a <br>bird in the house being good luck might not be very accurate.";

  load() {
    super.load();
    this.bird = {state: 'done'};
    this.cracks = [];
  }

  update() {
    switch (this.bird.state) {
      case 'flyin': {
        const f = (this.t - this.bird.t0) / this.bird.flyTime;
        this.bird.x = this.lmap(f, 0, 1, this.bird.x0, this.bird.xt);
        this.bird.y = this.lmap(f, 0, 1, this.bird.y0, this.bird.yt);
        if (f >= 1) {
          this.bird.state = 'peck';
        }
        break;
      }
      case 'peck': {
        const peckTime = 32 * (this.t - (this.bird.t0 + this.bird.flyTime));
        this.bird.x = this.bird.xt + 10 * Math.sin(peckTime);

        if (peckTime > (8 * Math.PI)) {
          this.cracks.push({
            x: this.bird.x - 85,
            y: this.bird.y - 160,
            seed: Math.random()
          });
          this.bird.x0 = this.bird.xt;
          this.bird.y0 = this.bird.yt;
          this.bird.xt = -50;
          this.bird.yt = this.lmap(Math.random(), 0, 1, 200, 400);
          this.bird.t0 = this.t;
          this.bird.flyTime = this.lmap(Math.random(), 0, 1, 0.4, 1);
          this.bird.state = 'flyout';
        }
        break;
      }
      case 'flyout': {
        const f = (this.t - this.bird.t0) / this.bird.flyTime;
        this.bird.x = this.lmap(f, 0, 1, this.bird.x0, this.bird.xt);
        this.bird.y = this.lmap(f, 0, 1, this.bird.y0, this.bird.yt);
        if (f >= 1) {
          this.bird.state = 'done';
        }
        break;
      }
      case 'done': {
        this.bird.x0 = 600;
        this.bird.y0 = Math.random() * 500;
        this.bird.xt = this.lmap(Math.random(), 0, 1, 250, 400);
        this.bird.yt = this.lmap(Math.random(), 0, 1, 300, 470);
        this.bird.x = this.bird.x0;
        this.bird.y = this.bird.y0;
        this.bird.t0 = this.t;
        this.bird.flyTime = this.lmap(Math.random(), 0, 1, 1, 3);
        this.bird.state = 'flyin';
        break;
      }
      default: {
        throw `unknown state ${this.bird.state}`;
      }
    }
  }

  drawCrack(ctx, crack) {
    //adapted from darktober 2020 day 16
    ctx.save();
    ctx.translate(crack.x, crack.y);
    //ctx.scale(0.25, 0.25);
    const scale = 0.25;

    const da = Math.PI * 2 / 15;
    ctx.strokeStyle = 'white';
    let a = (crack.seed) * Math.PI * 2;
    const angles = [];
    const rstart = [];
    const rend = [];
    while (angles.length < 15) {
      angles.push(a);
      rstart.push(scale * (30 + 15 * Math.sin(a * 33333)));
      rend.push(scale * (100 + 50 * Math.cos(a * 9999)));
      a += da + da * 0.5 * Math.sin(a * 7777);
    }

    angles.forEach( (a, i) => {
      const nextA = angles[(i+1) % angles.length];
      ctx.beginPath();
      ctx.moveTo(rend[i] * Math.cos(a), rend[i] * Math.sin(a));
      ctx.lineTo(rstart[i] * Math.cos(a), rstart[i] * Math.sin(a));
      ctx.lineTo(rstart[i] * Math.cos(nextA), rstart[i] * Math.sin(nextA));
      ctx.lineTo(rend[i] * Math.cos(nextA), rend[i] * Math.sin(nextA));
      for (let j = 1; j < 4; j++) {
        const d2 = rstart[i] + scale * (30 * j + 25 * Math.sin(a * 321));
        ctx.moveTo(d2 * Math.cos(a), d2 * Math.sin(a));
        ctx.lineTo(d2 * Math.cos(nextA), d2 * Math.sin(nextA));
      }
      ctx.stroke();
    });

    ctx.restore();
  
  }

  draw(ctx, width, height, t, mousePoint) {
    const bird = '\ud83e\udd9c';
    const tree = '\ud83c\udf33';
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    ctx.font = '200px Arial';
    ctx.fillStyle = 'blue';

    ctx.filter = 'blur(2px)';
    //sun sky
    const sunx = 350;
    const suny = 330;
    const skyGrad = ctx.createRadialGradient(sunx, suny, 50, sunx, suny, 500);
    skyGrad.addColorStop(0, 'orange');
    skyGrad.addColorStop(1, 'blue');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);
    //sun
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(sunx, suny, 50, 0, 2 * Math.PI);
    ctx.fill();
    //grass
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 300, width, height);
    //tree
    ctx.filter = 'blur(1px)';
    ctx.fillText(tree, 40, 300);
    ctx.filter = 'none';

    //bird
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(bird, this.bird.x, this.bird.y);

    //cracks
    this.cracks.forEach( crack => {
      this.drawCrack(ctx, crack);
    });

    //wall
    ctx.fillStyle = 'red';
    const windoww = 300;
    const windowh = 250;
    const windowx = width / 2 - windoww / 2;
    const windowy = 100;
    ctx.fillRect(0, 0, windowx, height);
    ctx.fillRect(0, 0, width, windowy);
    ctx.fillRect(0, windowy + windowh, width, height);
    ctx.fillRect(windowx + windoww, 0, width, height);
    //window frame
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(windowx - 4, windowy);
    ctx.lineTo(windowx + windoww, windowy);
    ctx.lineTo(windowx + windoww, windowy + windowh);
    ctx.lineTo(windowx, windowy + windowh);
    ctx.lineTo(windowx, windowy);
    ctx.moveTo(windowx + windoww / 2, windowy);
    ctx.lineTo(windowx + windoww / 2, windowy + windowh);
    ctx.moveTo(windowx, windowy + windowh / 2);
    ctx.lineTo(windowx + windoww, windowy + windowh / 2);
    ctx.stroke();
    //floor
    ctx.fillStyle = 'cyan';
    ctx.fillRect(0, 450, width, 200);
    //ceiling

    ctx.fillStyle = 'hsla(0, 0%, 0%, 0.4)';
    ctx.fillRect(0, 0, width, height);

    //ctx.font = '14px Arial';
    //ctx.fillText(`${this.mousePoint.x.toFixed(0)}, ${this.mousePoint.y.toFixed(0)}`, 10, 20);
  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
