'use strict';

window.sketchClass = class extends Sketch {
  desc = 'Would you look at that.<br>It\'s a forest bat!';

  createTexture(ctx, texw, texh, seed, h, s, l) {
    const canvas = document.createElement('canvas');
    canvas.width = texw;
    canvas.height = texh;
    const context = canvas.getContext('2d');

    const imageData = context.createImageData(texw, texh);
    const data = imageData.data;

    const rgb = this.hslToRgb(h, s, l);

    for (let i = 0; i < data.length; i += 4) {
      seed = this.rnd(seed);
      data[i + 0] = seed * 10 + rgb.r;
      data[i + 1] = seed * 10 + rgb.g;
      data[i + 2] = seed * 10 + rgb.b;
      data[i + 3] = 255; // Full opacity
    }

    context.putImageData(imageData, 0, 0);
    return ctx.createPattern(canvas, 'repeat');
  }

  drawTree(ctx, x, y, scale, seed) {
    ctx.save();
    //0, 0 is tree base
    ctx.translate(x, y);

    const h = 94 + this.lmap(this.rnd(seed), 0, 1, -5, 5);
    const s = 60 + this.lmap(this.rnd(seed+10), 0, 1, -5, 5);
    const l = 60 + this.lmap(this.rnd(seed+20), 0, 1, -5, 5);
    const color = `hsl(${h}, ${s}%, ${l}%)`;

    ctx.fillStyle = color;

    const height = 300 * scale * this.lmap(this.rnd(seed+30), 0, 1, 0.9, 1.1);
    const width = 200 * scale;
    const trunkWidth = width * 0.15;

    ctx.fillRect(-trunkWidth /2, -height, trunkWidth, height);

    ctx.beginPath();
    ctx.arc(  0, -height, 100, 0, 2 * Math.PI);
    ctx.arc( 75, -height, 100, 0, 2 * Math.PI);
    ctx.arc(-75, -height, 100, 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();
  }

  drawGrass(ctx, x, y, scale, seed) {
    ctx.save();
    ctx.translate(x, y);
    const h = 94 + this.lmap(this.rnd(seed), 0, 1, -5, 5);
    const s = 60 + this.lmap(this.rnd(seed+10), 0, 1, -5, 5);
    const l = 50 + this.lmap(this.rnd(seed+20), 0, 1, -5, 5);
    const color = `hsl(${h}, ${s}%, ${l}%)`;

    ctx.fillStyle = color;
    const height = 40 * scale * this.lmap(this.rnd(seed+30), 0, 1, 0.9, 1.1);
    const width = 70 * scale * this.lmap(this.rnd(seed+40), 0, 1, 0.9, 1.1);

    ctx.beginPath();
    ctx.moveTo(-width/2, 0);
    ctx.lineTo(-width/2 - 15 * scale, -height);
    ctx.lineTo(-width/2 + 15 * scale, -height * 0.3);
    ctx.lineTo(0, -height);
    ctx.lineTo(width/2 - 15 * scale, -height * 0.3);
    ctx.lineTo(width/2 + 15 * scale, 0);

    ctx.lineTo(-width/2,0);
    ctx.fill();

    ctx.restore();
  }

  load() {
    super.load();

    this.objects = [];
    const maxZ = 10;
    for (let z = 0; z <= maxZ; z++) {
      const hoffset = this.rnd(z);
      const scale = this.lmap(z, 0, maxZ, 0.1, 1.0);
      const hcount = 5;
      for (let x = 0; x < (hcount + 1); x++) {
        this.objects.push( {
          type: 'tree',
          x: (x - hoffset) * this.canvas.width / hcount,
          y: this.lmap(z, 0, maxZ, this.canvas.height / 2, this.canvas.height),
          scale: scale,
          seed: z * 1000 + x
        });
      }
      for (let x = 0; x < (hcount*1.5 + 1); x++) {
        this.objects.push( {
          type: 'grass',
          x: (x - hoffset) * this.canvas.width / (hcount * 1.5),
          y: this.lmap(z, 0, maxZ, this.canvas.height / 2, this.canvas.height),
          scale: scale,
          seed: z * 2000 + x
        });
      }
    }
  }

  draw(ctx, width, height, t) {
    //if (t > 0.04) {return;} //draw once
    ctx.fillStyle = 'hsl(94, 82%, 79%)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'hsl(94, 82%, 39%)';
    ctx.fillRect(0, 200, width, height);

    //ctx.fillStyle = this.createTexture(ctx, 100, 100, 10, 94, 0.8, 0.8);
    ctx.fillStyle = 'hsl(94, 82%, 60%)';
    const shadowOffsetX = '4px';
    const shadowOffsetY = '4px';
    const shadowBlur = '0px';
    const shadowColor = 'hsla(0, 0%, 0%, 0.6)';
    ctx.filter = `drop-shadow(${shadowOffsetX} ${shadowOffsetY} ${shadowBlur} ${shadowColor})`;

    ctx.fillStyle = 'hsl(60, 60%, 50%)';
    ctx.beginPath();
    ctx.arc(350, 30, 40, 0, 2 * Math.PI);
    ctx.fill();
    const bat = '\ud83e\udd87';
    ctx.font = '40px Arial';

    this.objects.forEach( (o, i) => {
      if (o.type === 'tree') {
        this.drawTree(ctx, o.x, o.y, o.scale, o.seed);
      } else {
        this.drawGrass(ctx, o.x, o.y, o.scale, o.seed);
      }

      if (i == 130) {
        ctx.fillText(bat, width - (this.t * 200) % (width + 50), 360 + 7 * Math.sin(10*this.t));
      }
    });
    ctx.fillStyle = 'hsla(0, 0%, 0%, 0.4)';
    ctx.filter = `none`;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'hsl(60, 60%, 50%)';
    ctx.beginPath();
    ctx.arc(350, 30, 40, 0, 2 * Math.PI);
    ctx.fill();
  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
