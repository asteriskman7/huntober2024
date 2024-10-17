'use strict';

window.sketchClass = class extends Sketch {
  desc = "When you're stuck in the backrooms, take a minute to enjoy the peace.<br>Maybe don't take two minutes though.";

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.translate(width / 2, height / 2);

    const cx = 10 * Math.pow(Math.sin(this.t + 0.3), 3);
    const cy = 20 * Math.pow(Math.sin(this.t * 2.32), 4);

    const cNear = 'hsl(52, 33%, 79%)';
    const cFar = 'hsl(27, 6%, 0%)';
    const nearStop = 1;
    const farStop = 0.05 + 0.02 * Math.sin(this.t * 3);
    
    const gt = ctx.createLinearGradient(cx, cy, 0, -height / 2);
    gt.addColorStop(farStop, cFar);
    gt.addColorStop(nearStop, cNear);
    const gr = ctx.createLinearGradient(cx, cy, width / 2, 0);
    gr.addColorStop(farStop, cFar);
    gr.addColorStop(nearStop, cNear);
    const gb = ctx.createLinearGradient(cx, cy, 0, height / 2);
    gb.addColorStop(farStop, cFar);
    gb.addColorStop(nearStop, cNear);
    const gl = ctx.createLinearGradient(cx, cy, -width / 2, 0);
    gl.addColorStop(farStop, cFar);
    gl.addColorStop(nearStop, cNear);


    ctx.fillStyle = gt;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(-width/2,-height/2);
    ctx.lineTo( width/2,-height/2);
    ctx.lineTo(cx, cy);
    ctx.fill();

    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(width / 2, -height/2);
    ctx.lineTo(width / 2, height / 2);
    ctx.lineTo(cx, cy);
    ctx.fill();

    ctx.fillStyle = gb;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(width / 2, height/2);
    ctx.lineTo(-width / 2, height / 2);
    ctx.lineTo(cx, cy);
    ctx.fill();

    ctx.fillStyle = gl;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(-width / 2, -height/2);
    ctx.lineTo(-width / 2, height / 2);
    ctx.lineTo(cx, cy);
    ctx.fill();


    const ocount = 3;
    for (let i = 0; i < ocount; i++) {
      const orbitR = this.lmap(Math.sin(this.t * 0.5213), -1, 1, 1, 50);
      const os = 0.9 + 0.1 * Math.sin(this.t);
      const ox = cx + os * orbitR * Math.cos(this.t * 3 + 2 * Math.PI * i / ocount);
      const oy = cy + os * orbitR * Math.sin(this.t + 2 * Math.PI * i / ocount);
      const or = 20 * os;

      const og = ctx.createRadialGradient(ox, oy, 0, ox, oy, or);
      const h = 360 * i / ocount;
      og.addColorStop(0.6, `hsla(${h}, 80%, 75%, 0.1)`);
      og.addColorStop(1, `hsla(${h}, 80%, 75%, 0.0)`);
      ctx.fillStyle = og;
      ctx.beginPath();
      ctx.arc(ox, oy, or, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
