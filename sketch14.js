'use strict';

window.sketchClass = class extends Sketch {
  desc = "If you count the seconds from a lightning flash until you hear thunder,<br>multiply by 9, sum up the digits of that number,<br>and keep adding the digits of the result until you get a single digit,<br>you'll always get 9!<br>That's because raindrops always come in multiples of nine.<br>Try counting them if you don't belive me!";

  load() {
    super.load();
    this.reset();
  }

  reset() {
    this.edges = [];
    this.tips = [];
    for (let i = 0; i < 3; i++) {
      const firstEdge = {
        x: this.lmap(Math.random(), 0, 1, 100, this.canvas.width - 100), 
        y: 0,
        a: Math.PI / 2,
        d: 10
      };
      this.edges.push(firstEdge);
      this.tips.push(this.getEdgeTip(firstEdge));
    }
  }

  getRndEdge(x, y) {
    const aRange = Math.PI * 0.9;
    return {
      x,
      y,
      a: this.lmap(Math.random(), 0, 1, Math.PI / 2 - aRange / 2, Math.PI / 2 + aRange / 2),
      d: this.lmap(Math.random(), 0, 1, 5, 50)
    };
  }

  getEdgeTip(e) {
    return {
      x: e.x + e.d * Math.cos(e.a),
      y: e.y + e.d * Math.sin(e.a)
    };
  }

  update() {
    const newTips = [];
    this.tips.forEach( t => {
      const r = Math.random();
      let pDie = newTips.length > 1 ? this.lmap(t.y, 0, this.canvas.height, 0, 1) : 0;
      let pDouble = this.lmap(t.y, 0, this.canvas.height, 1, pDie);
      if (this.tips.length > 5) {
        pDouble = 0;
      }
      if (t.y > this.canvas.height) {
        pDie = 1.0;
      }
      if (r < pDie) {
        //tip dies
      } else if (r < pDouble) {
        //2 tips
        const newEdge1 = this.getRndEdge(t.x, t.y);
        this.edges.push(newEdge1);
        const newTip1 = this.getEdgeTip(newEdge1);
        newTips.push(newTip1);
        const newEdge2 = this.getRndEdge(t.x, t.y);
        this.edges.push(newEdge2);
        const newTip2 = this.getEdgeTip(newEdge2);
        newTips.push(newTip2);
      } else {
        //1 tip
        const newEdge = this.getRndEdge(t.x, t.y);
        this.edges.push(newEdge);
        const newTip = this.getEdgeTip(newEdge);
        newTips.push(newTip);
      }

    });

    this.tips = newTips;

    if (this.tips.length === 0) {
      this.reset();
    }
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'white';
    this.edges.forEach( e => { 
      ctx.beginPath();
      ctx.moveTo(e.x, e.y);
      ctx.lineTo(e.x + e.d * Math.cos(e.a), e.y + e.d * Math.sin(e.a));
      ctx.stroke();
    });

  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
