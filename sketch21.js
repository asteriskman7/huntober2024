'use strict';

window.sketchClass = class extends Sketch {
  desc = "If you're annoyed that the void has not been destroyed,<br>use this trick I have often employed:<br>using your android, consult a book by Sigmond Freud<br>and become overjoyed that though you have toyed with the void<br>and become paranoid, you've managed to avoid<br>becoming a part of it's inner cycloid.";

  load() {
    super.load();
    this.stars = [];
    this.count = 10000;
    this.voidr = 50;
    this.voidx = 0;
    this.voidy = 0;

    for (let i = 0; i < this.count; i++) {
      const r = this.lmap(Math.random(), 0, 1, this.voidr, this.canvas.width * 0.9);
      const a = Math.random() * 2 * Math.PI;
      const x = r * Math.cos(a);
      const y = r * Math.sin(a);
      this.stars.push({
        r,
        a,
        x,
        y,
        alive: true
      });
    }
  }

  update() {
    this.voidr = 80 + 75 * Math.sin(this.t * 0.7);
    const s = this.lmap(this.voidr, 5, 155, 0, 100);
    this.voidx = -s / 2 + s * Math.random();
    this.voidy = -s / 2 + s * Math.random();
    this.stars.forEach( s => {
      const dx = this.voidx - s.x;
      const dy = this.voidy - s.y;
      s.r = Math.sqrt(dx * dx + dy * dy);
      const d = s.r - this.voidr;
      if (d <= 0 || d > this.canvas.width * 2) {
        s.alive = false;
        return;
      }
      s.a += 2 * Math.PI / (1000 * d / 200);
      s.r -= this.lmap(s.r, this.voidx, this.canvas.width * 0.7, 5, 1);
      s.x = this.voidx + s.r * Math.cos(s.a);
      s.y = this.voidy + s.r * Math.sin(s.a);
    });

    this.stars = this.stars.filter( s => s.alive );

    while (this.stars.length < this.count) {
      const r = this.lmap(Math.random(), 0, 1, this.canvas.width * 0.7, this.canvas.width * 0.9);
      const a = Math.random() * 2 * Math.PI;
      const x = r * Math.cos(a);
      const y = r * Math.sin(a);
      this.stars.push({
        r,
        a,
        x,
        y,
        alive: true
      });
    }
  }


  draw(ctx, width, height, t) {
    ctx.fillStyle = 'hsla(0, 0%, 0%, 0.1)';
    ctx.fillRect(0, 0, width, height);
    ctx.translate( width / 2, height / 2);

    this.stars.forEach( s => {
      const h = this.lmap(s.r, width * 0.7, this.voidr, 0, 180);
      ctx.fillStyle = `hsl(${h}, 50%, 50%)`;
      ctx.fillRect(s.x, s.y, 2, 2);
    });

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.voidx, this.voidy, this.voidr, 0, 2 * Math.PI);
    ctx.fill();
  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
