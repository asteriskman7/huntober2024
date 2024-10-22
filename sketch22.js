'use strict';

window.sketchClass = class extends Sketch {
  desc = `The edge of the ${'\u2588'.repeat(10)} ${'\u2588'.repeat(3)} is infinitely rough so the random reflection angle here is accurate.`;

  load() {
    super.load();
    this.point = {x: 0, y: 0, a: 2 * Math.PI * Math.random()};
    this.lastPoint = {...this.point};
    this.firstDraw = true;
    this.stuckCount = 0;
    this.h = 0;
    this.c2 = document.createElement('canvas');
    this.c2.width = this.canvas.width;
    this.c2.height = this.canvas.height;
    this.ctx2 = this.c2.getContext('2d');
  }

  checkPoint(x0, y0) {
    const maxIter = 100;
    let iter = 0;
    let x = x0;
    let y = y0;
    while (true) {
      const x1 = x * x - y * y + x0;
      const y1 = 2 * x * y + y0;
      x = x1;
      y = y1;
      const d2 = x * x + y * y;

      if (d2 > 4) { return false; }

      iter++;
      
      if (iter >= maxIter) { return true; }
    }
  }

  update() {
    const s = 0.05;
    const testx = this.point.x + s * Math.cos(this.point.a);
    const testy = this.point.y + s * Math.sin(this.point.a);

    if (this.checkPoint(testx, testy)) {
      this.lastPoint = {...this.point};
      this.point.x = testx;
      this.point.y = testy;
      this.stuckCount = 0;
    } else { 
      this.point.a = 2 * Math.PI * Math.random();
      this.stuckCount++;
      this.h = (this.h + 1) % 360;
    }

    if (this.stuckCount > 10) {
      this.point = {x: 0, y: 0, a: 2 * Math.PI * Math.random()};
      this.lastPoint = {...this.point};
    }
  }

  draw(ctx, width, height, t) {
    const ctx2 = this.ctx2;

    if (this.firstDraw) {
      ctx2.fillStyle = 'black';
      ctx2.fillRect(0, 0, width, height);
      this.firstDraw = false;
    }
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);


    ctx2.save();
    //0,0 at center
    ctx2.translate(width / 2, height / 2);
    //bounds go from -2 to 2 in x and y
    ctx2.scale(width / 4, height / 4);

    ctx2.strokeStyle = `hsl(${this.h}, 50%, 50%)`;
    ctx2.lineWidth = 0.01;
    ctx2.beginPath();
    ctx2.moveTo(this.lastPoint.x, this.lastPoint.y);
    ctx2.lineTo(this.point.x, this.point.y);
    ctx2.stroke();
    ctx2.restore();

    ctx.drawImage(this.c2, 0, 0);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(width / 4, height / 4);

    ctx.fillStyle = 'white';
    ctx.fillRect(this.point.x - 0.015, this.point.y - 0.015, 0.03, 0.03);

    ctx.restore();


  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
