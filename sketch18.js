'use strict';

window.sketchClass = class extends Sketch {
  desc = "Truchet tiles made from bones?<br>Les Catacombes de Paris sont bizarres!";

  load() {
    super.load();
    this.gridSize = 64;
    this.w = this.canvas.width / this.gridSize;
    this.h = this.canvas.height / this.gridSize;


    this.grid = new Array(this.w * this.h);
    for (let i = 0; i < this.w * this.h; i++) {
      this.grid[i] = {
        t0: -1,
        t1: 0,
        sa: 0,
        da: Math.PI/2,
        a: 0, 
        done: true
      }
    }

    this.updateList = [];
  }

  getRandomUpdateIndex() {
    if (this.updateList.length === 0) {
      console.log('reset update list');
      this.updateList = new Array(this.w * this.h);
      for (let i = 0; i < this.w * this.h; i++) {
        this.updateList[i] = i;
      }
    }
    const listIndex = Math.floor(Math.random() * this.updateList.length);
    const updateIndex = this.updateList[listIndex];
    this.updateList.splice(listIndex, 1);
    return updateIndex;
  }

  update() {
  
    
    if (this.allDone) {
      const i = this.getRandomUpdateIndex();
      const duration = 0.25;
      [this.grid[i].sa, this.grid[i].da] = [this.grid[i].da, this.grid[i].sa];
      this.grid[i].t0 = this.t;
      this.grid[i].t1 = this.t + duration;
      this.grid[i].done = false;
    }
    
    this.allDone = true;
    this.grid.forEach( g => {
      if (this.t < g.t1) {
        const f = (this.t - g.t0) / (g.t1 - g.t0);
        g.a = g.sa + (g.da - g.sa) * f;
        this.allDone = false;
      } else {
        g.a = g.da;
        g.done = true;
      }
    });
   
  }

  //adapted from https://asteriskman7.github.io/darktober2020/sketch20.js
  drawBone(ctx, x, y, s, a) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.lineWidth = 4 * s / 300;

    ctx.beginPath();
    ctx.moveTo(-s/2, -s*0.1);
    ctx.lineTo( s/2, -s*0.1);
    ctx.arc(s*0.6, -s*0.1 + s * 0.05, s*0.1, 5 * Math.PI / 4, 8.6 * Math.PI / 4);
    ctx.arc(s*0.6,  s*0.1 - s * 0.05, s*0.1, 7 * Math.PI / 4, 11 * Math.PI / 4);

    ctx.lineTo(s/2, s*0.1);
    ctx.lineTo(-s/2, s*0.1);

    ctx.arc(-s*0.6,  s*0.1 - s * 0.05, s*0.1, 1 * Math.PI / 4, 5 * Math.PI / 4);
    ctx.arc(-s*0.6, -s*0.1 + s * 0.05, s*0.1, 3.4 * Math.PI / 4, 7 * Math.PI / 4);

    ctx.lineTo(-s/2, -s*0.1);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    if (true) {
    ctx.fillStyle = 'hsl(56, 6%, 81%)';
    ctx.strokeStyle = 'hsl(56, 6%, 39%)';
    } else {
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
    }

    for (let x = 0; x < this.w; x++) {
      for (let y = 0; y < this.h; y++) {
        const i = x + y * this.w;
        const l = this.lmap(this.rnd(x + y * 342342), 0, 1, 60, 99);
        ctx.fillStyle = `hsl(56, 6%, ${l}%)`;
        if (false) {
          const a = Math.PI/4 + this.grid[i].a;
          this.drawBone(ctx, x * this.gridSize + this.gridSize / 2, y * this.gridSize + this.gridSize / 2, this.gridSize * 0.9, a);
        } else {
          ctx.save();
          ctx.translate(x * this.gridSize + this.gridSize / 2, y * this.gridSize + this.gridSize / 2);
          const a2 = this.grid[i].a;
          ctx.rotate(a2);
          this.drawBone(ctx, -this.gridSize / 4, -this.gridSize / 4, this.gridSize * 0.45, Math.PI/4 + Math.PI/2);
          this.drawBone(ctx,  this.gridSize / 4,  this.gridSize / 4, this.gridSize * 0.45, Math.PI/4 + Math.PI/2);
          ctx.restore();
        }
      }
    }


  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
