'use strict';

window.sketchClass = class extends Sketch {
  desc = 'Luckily, the apartment with a number that is odd and perfect is unlocked!';

  load() {
    super.load();
    this.gx = 0;
    this.doorNum = 101;
  }

  drawDark(ctx, width, height, xbase) {
    ctx.save();
    ctx.filter = 'blur(4px)';
    ctx.translate(xbase, 0);
    ctx.fillStyle = 'hsla(0, 0%, 0%, 0.4)';
    const lightHeight = 100;
    const bottomLength = 80;
    ctx.beginPath();
    ctx.moveTo(0, -lightHeight);
    ctx.lineTo(width / 2 - bottomLength, height);
    ctx.lineTo(width / 2 + 0.5, height);
    ctx.lineTo(width / 2 + 0.5, -lightHeight);
    ctx.lineTo(0, -lightHeight);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -lightHeight);
    ctx.lineTo(-width / 2 + bottomLength, height);
    ctx.lineTo(-width / 2 - 0.5, height);
    ctx.lineTo(-width / 2 - 0.5, -lightHeight);
    ctx.lineTo(0, -lightHeight);
    ctx.fill();

    ctx.restore();
  }

  drawTiles(ctx, width, height, xbase) {
    ctx.save();
    ctx.translate(xbase, 0);
    const tileSize = width / 16;
    const hTiles = width / tileSize;
    const vTiles = Math.ceil(height * 0.3 / tileSize);
    const yBase = height * 0.7;

    for (let x = 0; x < hTiles; x++) {
      for (let y = 0; y < vTiles; y++) {
        ctx.fillStyle = `hsl(0, 50%, ${(x + y) % 2 === 0 ? 100: 0}%)`;
        ctx.fillRect(x * tileSize, y * tileSize + yBase, tileSize, tileSize);
      }
    }

    ctx.restore();
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, width, height);
    const xf = 3.08 * Math.pow(Math.tan(((t * 0.5)%1) - 0.5), 3) + 0.5;
    const dx = -xf * (width + 40) + 40;

    ctx.fillStyle = 'blue';
    ctx.fillRect(0, height * 0.7, width, height);

    this.drawTiles(ctx, width, height, -dx);
    this.drawTiles(ctx, width, height, width - dx);
    this.drawTiles(ctx, width, height, -width - dx);

    
    let speed;
    if (this.lastxf !== undefined) {
      const testSpeed = Math.abs(xf - this.lastxf);
      if (testSpeed < 0.1) {
        speed = testSpeed;
      } else {
        speed = 0.053;
        this.doorNum += 2;
        if (this.doorNum > 9999) {
          this.doorNum = 101;
        }
      }
    } else {
      speed = 0;
    }

    //real min/max is 0, 0.053, glitch speed is 0.947
    this.gx = Math.max(-100, Math.min(this.gx + 8 - speed * (width + 40), 100));
    if (isNaN(this.gx)) {
      throw 'fit';
    }
    this.lastxf = xf;
    


    const door = '\ud83d\udeaa';
    const runner = '\ud83c\udfc3\ud83c\udffd\u200d\u2640\ufe0f';
    const chaser = '\ud83d\udc7b';
    ctx.font = '250px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = 'white';
    ctx.save();
    ctx.scale(-1, 1);
    ctx.fillText(door, dx, height * 0.7 + 20);
    const frameWidth = 50;
    ctx.fillStyle = 'black';
    ctx.fillRect(dx - frameWidth / 2, height * 0.27, frameWidth, 20);
    ctx.fillStyle = 'white';
    const frameThick = 3;
    ctx.fillRect(dx - frameWidth / 2 + frameThick, height * 0.27 + frameThick, frameWidth - frameThick * 2, 20 - frameThick * 2);
    ctx.restore();
    ctx.font = '14px Arial';
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'top';
    ctx.fillText(this.doorNum, -dx, height * 0.27 + 4);
    ctx.textBaseline = 'bottom';

    ctx.font = '200px Arial';
    const ry = height * 0.7 + 25 + speed * 300 * Math.sin(t*20);
    ctx.fillText(runner, width * 0.5, ry);

    ctx.font = '100px Arial';
    const cx = width * 1.0 - this.gx;
    const cy = height * 0.6 + 10 * Math.sin(t * 10);
    ctx.fillText(chaser, cx, cy);

    this.drawDark(ctx, width, height, -dx);
    this.drawDark(ctx, width, height, width - dx);
    this.drawDark(ctx, width, height, -width - dx);


  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
