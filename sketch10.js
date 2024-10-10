'use strict';

window.sketchClass = class extends Sketch {
  desc = "If you halve in a day,<br>you're in a bad way,<br>but at least you can say,<br>you'll take forever to go away!";

  load() {
    super.load();
    this.graphData = [[], [], [], []];
    this.shiftCount = 0;

    this.blockColors = 'red,orange,yellow,green'.split(',');
    this.blockHues = [0, 30, 60, 90];
    this.blocks = [];
    this.particles = [];

    for (let x = 0; x < 100; x++) {
      for (let y = 0; y < 100; y++) {
        const dx = Math.abs(50 - x);
        const dy = Math.abs(50 - y);
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d <= 50) {
        const block = {
          x,
          y,
          type: 0,
          d
        };
        this.blocks.push(block);
        }
      }
    }
  }

  update() {
    this.particles.forEach( p => {
      const pspeed = 100;
      const pt = (this.t - p.t0) * pspeed;
      p.x = p.x0 + pt * Math.cos(p.angle);
      p.y = p.y0 + pt * Math.sin(p.angle);

      p.alive = pt < 100;
    });

    this.particles = this.particles.filter( p => p.alive );

    let pCounts = (new Array(4)).fill(0);
    const decayChance = [0.1, 0.01, 0.001, 0];
    this.blocks.forEach( b => {
      if (Math.random() < decayChance[b.type]) {
        //circular decay. but final decay is disabled by 0 chance
        b.type = (b.type + 1) % 4;
        this.particles.push( {
          x0: b.x,
          y0: b.y,
          x: b.x,
          y: b.y,
          angle: Math.random() * 2 * Math.PI,
          t0: this.t,
          alive: true
        });
      } else {
        pCounts[b.type] += 1;
      }
    });

    for (let i = 0; i < 4; i++) {
      this.graphData[i].push(100 * pCounts[i] / this.blocks.length);
      if (this.graphData[i].length > (512 - 20)) {
        this.graphData[i].shift();
        if (i === 0) {
          this.shiftCount++;
        }
      }
    }
  }

  drawGraph(ctx, width, height) {
    ctx.save();
    ctx.fillStyle = 'hsl(0, 0%, 50%)';
    ctx.fillRect(0, 0, width, 100);

    //0,0 is bottom left of graph window
    ctx.translate(0, 100);
    //positive y goes up
    ctx.scale(1, -1);

    //grid
    ctx.strokeStyle = 'hsl(0, 0%, 35%)';
    ctx.beginPath();
    ctx.moveTo(15, 60);
    ctx.lineTo(width, 60);
    ctx.moveTo(15, 40);
    ctx.lineTo(width, 40);
    ctx.moveTo(15, 80);
    ctx.lineTo(width, 80);
    ctx.stroke();

    ctx.beginPath();
    for (let x = 1; x <= 1 + (width) / 20; x++) {
      const xpos = x * 20 - (this.shiftCount % 20);
      if (xpos > 20) {
        ctx.moveTo(xpos, 15);
        ctx.lineTo(xpos, 100);
      }
    }
    ctx.stroke();

    //axies
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(width, 20);
    ctx.lineTo(20, 20);
    ctx.lineTo(20, 100);
    ctx.stroke();

    //data
    this.graphData.forEach( (g, gi) => {
      ctx.strokeStyle = this.blockColors[gi];
      ctx.beginPath();
      g.forEach( (d, i) => {
        if (i === 0) {
          ctx.moveTo(i + 20, d * 80 / 100 + 20);
        } else {
          ctx.lineTo(i + 20, d * 80 / 100 + 20);
        }
      });
      ctx.stroke();
    });

    //legend
    ctx.font = '12px Monospaced';
    ctx.fillStyle = this.blockColors[0];
    ctx.fillRect(25, 5, 5, 5);
    ctx.fillStyle = this.blockColors[1];
    ctx.fillRect(55, 5, 5, 5);
    ctx.fillStyle = this.blockColors[2];
    ctx.fillRect(85, 5, 5, 5);
    ctx.fillStyle = this.blockColors[3];
    ctx.fillRect(115, 5, 5, 5);
    ctx.fillStyle = 'black';
    ctx.fillText('=>', 35, 12);
    ctx.fillText('=>', 65, 12);
    ctx.fillText('=>', 95, 12);

    //labels
    ctx.scale(1, -1);
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('%', 8, -55);
    ctx.fillText('time', width / 2, -5);


    ctx.restore();
  }

  drawMaterial(ctx, width, height) {
    ctx.save();

    const size = 3;
    const offsetx = width / 2 - (100 * size / 2);
    const offsety = 150;
    this.blocks.forEach( b => {
      ctx.fillStyle = this.blockColors[b.type];
      const l = this.lmap(b.d / 50, 0, 1, 75, 15);
      const a = this.lmap(Math.pow(b.d / 50, 100), 0, 1, 1.0, 0.2);
      ctx.fillStyle = `hsla(${this.blockHues[b.type]}, 50%, ${l}%, ${a})`;
      ctx.fillRect(b.x * size + offsetx, b.y * size + offsety, size, size);
    });

    ctx.restore();
  }

  drawParticles(ctx, width, height) {
    ctx.save();

    ctx.fillStyle = 'hsla(60, 50%, 50%, 1.0)';
    const size = 3;
    const offsetx = width / 2 - (100 * size / 2);
    const offsety = 150;
    this.particles.forEach( p => {
      const cx = p.x * size + offsetx;
      const cy = p.y * size + offsety;
      ctx.fillRect(cx, cy, 1, 1);
    });

    ctx.restore();
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    this.drawMaterial(ctx, width, height);
    this.drawParticles(ctx, width, height);
    this.drawGraph(ctx, width, height);

  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
