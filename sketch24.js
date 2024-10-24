'use strict';

//much of the code I originally wrote here: https://jsfiddle.net/asteriskman/7fsc5r3w/

window.sketchClass = class extends Sketch {
  desc = "Mama??!";

  load() {
    super.load();
    this.initMap();
    this.initPlayer();
  }

  initPlayer() {

    const xi = 15;
    const yi = 15;

    this.p = {
      xti: xi,
      yti: yi,
      x: xi + 0.5,
      y: yi + 0.5,
      xt: xi + 0.5,
      yt: yi + 0.5,
      a: 0,
      at: 0,
      d: 0
    };

    this.level[this.p.xti][this.p.yti] = 0;
  }

  initMap() {
    this.level = [];
    const w = 30;
    const h = 30;
    const AIR = 0;
    const WALL = 1;
    const BLOCK = 2;
    for (let x = 0; x < w; x++) {
      const col = [];
      for (let y = 0; y < h; y++) {
        if (x === 0 || y === 0 || x === w - 1 || y === h - 1) {
          col.push(WALL);
        } else {
          col.push(Math.random() > 0.7 ? BLOCK : AIR);
        }
      }
      this.level.push(col);
    }
  }

  normalizeAngle(a) {
    //given an arbitrary angle, move it into the range 0 to 2Pi
    const p2 = 2 * Math.PI;
    return a - p2 * Math.floor(a / p2);
  }
  
  castRay(fromx, fromy, a) {
    let distToH = Infinity;
    let distToV = Infinity;
    
    a = this.normalizeAngle(a);
        
    //calculate distance to vertical edges
    const deltaDistH = Math.abs(1 / Math.sin(a));
    let sideDistH;
    let ydir;
    if (a < Math.PI) {
      //pointing down
      sideDistH = (Math.ceil(fromy) - fromy) / Math.sin(a);
      ydir = 0;
    } else {
      //poiting up      
      sideDistH = (fromy - Math.floor(fromy)) / Math.sin(2 * Math.PI - a)
      ydir = -1;
    }
    
    distToH = sideDistH;
    
    let newY = Math.round(fromy + distToH * Math.sin(a)) + ydir;
    let newX = Math.floor(fromx + distToH * Math.cos(a));
    
    let cellH;
    const maxTries = Math.sqrt(2) * this.level.length;    
    
    for (let tries = 0; tries < maxTries; tries++) {
      if (newX >= 0 && newX < this.level.length && newY >= 0 && newY < this.level.length) {
        if (this.level[newX][newY] === 0) {
          distToH += deltaDistH;
          newY = Math.round(fromy + distToH * Math.sin(a)) + ydir;
          newX = Math.floor(fromx + distToH * Math.cos(a));
        } else {
          cellH = {x: newX, y: newY};
          break;
        }
      } else {
        distToH = Infinity;
      }
    }     
       

    //calculate distance to horizontal edges
    const deltaDistV = Math.abs(1 / Math.cos(a));
    let sideDistV;
    let xdir;
    if (a > 3 * Math.PI / 2 || a < Math.PI / 2) {
      //pointing right      
      sideDistV = (Math.ceil(fromx) - fromx) / Math.cos(a);
      xdir = 0;
    } else {
      //pointing left
      sideDistV = (fromx - Math.floor(fromx)) / Math.cos(Math.PI - a);
      xdir = -1;
    }
    
    distToV = sideDistV;
    newY = Math.floor(fromy + distToV * Math.sin(a));
    newX = Math.round(fromx + distToV * Math.cos(a)) + xdir;
    
    let cellV;    
        
    for (let tries = 0; tries < maxTries; tries++) {
      if (newX >= 0 && newX < this.level.length && newY >= 0 && newY < this.level.length) {
        if (this.level[newX][newY] === 0) {
          distToV += deltaDistV;
          newY = Math.floor(fromy + distToV * Math.sin(a));
          newX = Math.round(fromx + distToV * Math.cos(a)) + xdir;
        } else {
          cellV = {x: newX, y: newY};
          break;
        }
      } else {
        distToV = Infinity;
      }
    }
   
   //shortest intersection is smaller of the 2
   if (distToH < distToV) {
     return {d: distToH, c: cellH};
   } else {
     return {d: distToV, c: cellV};
   }     
  }

  updateTarget() {

    //0=e, 1=s, 2=w, 3=n
    const dirDeltas = [
      {dx: 1, dy: 0},
      {dx: 0, dy: 1},
      {dx: -1, dy: 0},
      {dx: 0, dy: -1}
    ];

    //~about~ 90% chance to go straight, 10% to turn and 1% to reverse
    const straightCount = 100;
    const turnCount = 10;
    const reverseCount = 1;

    const dirBag = [];
    for (let i = 0; i < straightCount; i++) { dirBag.push(this.p.d); }
    for (let i = 0; i < turnCount; i++) { dirBag.push((this.p.d + 1) % 4 ); }
    for (let i = 0; i < turnCount; i++) { dirBag.push((this.p.d + 3) % 4 ); }
    for (let i = 0; i < reverseCount; i++) { dirBag.push((this.p.d + 2) % 4 ); }

    while (true) {
      const bagIndex = Math.floor(Math.random() * dirBag.length);
      const newDir = dirBag[bagIndex];
      dirBag.splice(bagIndex, 1);

      const nd = dirDeltas[newDir];
      const nxi = this.p.xti + nd.dx;
      const nyi = this.p.yti + nd.dy;
      if (this.level[nxi][nyi] === 0) {
        this.p.at = Math.atan2(nd.dy, nd.dx);
        this.p.xti = nxi;
        this.p.yti = nyi;
        this.p.xt = nxi + 0.5;
        this.p.yt = nyi + 0.5;
        this.p.d = newDir;
        console.log(this.p);
        return;
      }
      
      if (dirBag.length === 0) {
        //this happens if the initial position is in a 1x1 room
        this.initMap();
        this.initPlayer();
        return;
      }
    }
  }

  getAngleDiff(a, b) {
    return Math.atan2(Math.sin(b - a), Math.cos(b - a));
  }

  update() {
    const p = this.p;
    const speed = 0.05;
    const aspeed = 0.05;
    const ad = this.getAngleDiff(p.at, p.a); 
    if (Math.abs(ad) < aspeed * 2) {
      p.a = Math.atan2(p.yt - p.y, p.xt - p.x);
      const md = Math.abs(p.x - p.xt) + Math.abs(p.y - p.yt);
      const actualSpeed = md > speed ? speed : speed / 1;
      if (md < (speed * 2)) {
        this.updateTarget();
      } else {
        p.x += actualSpeed * Math.cos(p.a);
        p.y += actualSpeed * Math.sin(p.a);
      }
    } else {
      const angleSign = - Math.sign(ad);
      p.a += angleSign * aspeed;
    }
  }

  draw3d(ctx, width, height) {
    //draw sky
    ctx.fillStyle = '#7ee2ee';
    ctx.fillRect(0, 0, width, height * 0.5);

    //draw floor
    ctx.fillStyle = '#786848';
    ctx.fillRect(0, height * 0.5, width, height * 0.5);

    const cellHues = [40, 100, 200];

    //process rays
    const fov = 1 * Math.PI / 3;    
    const fovSteps = 100;
    let stepNum = 0;
    const rectWidth = width / fovSteps;
    for (let da = - fov / 2; da < fov / 2; da += fov / fovSteps) {
      const rayAngle = this.p.a + da;
      //get distance and coord of nearest solid block at angle rayAngle
      let ray = this.castRay(this.p.x, this.p.y, rayAngle);
      let rayDist = ray.d;
      let rayCell = ray.c;
      
      let cellColorIndex = this.level[rayCell.x][rayCell.y];
      let rayEndx = this.p.x + rayDist * Math.cos(rayAngle);
      let rayEndy = this.p.y + rayDist * Math.sin(rayAngle);
      const hue = cellHues[cellColorIndex];
      //correct for fisheye
      const correctedRayDist = rayDist * Math.cos(da);
      //set brightness based on distance
      const lum = 60 * 1 / (correctedRayDist + 1);
      const color = `hsl(${hue}, 50%, ${lum}%)`;
      
      //draw ray in 2d map
      /*
      ctx.strokeStyle = color;      
      ctx.beginPath();
      ctx.moveTo(this.p.x * s, this.p.y * s);
      ctx.lineTo(rayEndx * s, rayEndy * s);
      ctx.stroke();
      */
      
      //draw vertical strip
      const rectLeft = stepNum * rectWidth;
      const rectHeight = height / correctedRayDist;
      const rectVSpace = (height - rectHeight) / 2;
      ctx.fillStyle = color;
      //increase width by 1 so that there are not gaps between rectangles when they are very narrow
      ctx.fillRect(rectLeft, rectVSpace, rectWidth + 1, rectHeight);

      stepNum++;
    }    

    const pop = '\ud83c\udf6d';
    ctx.font = '200px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(pop, width / 2, height);
  }

  draw2d(ctx, width, height) {
    ctx.fillStyle = 'gray';
    ctx.fillRect(-width, -height, 3 * width, 3 * height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    const cellHues = [40, 100, 200];
    //draw the 2d map
    const s = Math.floor(width / this.level.length);
    const gap = 1;
    for (let x = 0; x < this.level.length; x++) {
      const col = this.level[x];
      for (let y = 0; y < col.length; y++) {
        const cell = col[y];        
        ctx.fillStyle = `hsl(${cellHues[cell]}, 50%, 50%)`;
        ctx.fillRect(x * s + gap, y * s + gap, s - gap, s - gap);
      }
    }
    
    //draw player
    ctx.fillStyle = 'hsl(334, 100%, 80%)';
    ctx.beginPath();
    const pr = 0.2;
    ctx.arc(this.p.x * s, this.p.y * s, pr * s, 0, Math.PI * 2);
    ctx.fill();
    
    //draw angle marker
    const amr = 0.3;
    const amx = this.p.x + amr * Math.cos(this.p.a);
    const amy = this.p.y + amr * Math.sin(this.p.a);
    
    ctx.beginPath();
    ctx.moveTo(this.p.x * s, this.p.y * s);
    ctx.lineTo(amx * s, amy * s);
    ctx.stroke();  
  }

  draw(ctx, width, height, t) {
    this.draw3d(ctx, width, height);

    //draw minimap overlay
    const mmx = width - 50;
    const mmy = 50;
    const mmr = 50;
    const mmso = 3;
    //add shadow
    ctx.fillStyle = 'hsla(0, 0%, 0%, 0.4)';
    ctx.filter = 'blur(1px)';
    ctx.beginPath();
    ctx.arc(mmx + mmso, mmy + mmso, mmr, 0, 2 * Math.PI);
    ctx.fill();
    ctx.filter = 'none';

    //make clip region and get map drawn
    ctx.beginPath();
    ctx.arc(mmx, mmy, mmr, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();
    const s = Math.floor(width / this.level.length);
    ctx.save();
    ctx.translate(mmx - this.p.x * s, mmy - this.p.y * s);
    this.draw2d(ctx, width, height);
    ctx.restore();
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(mmx, mmy, mmr, 0, 2 * Math.PI);
    ctx.stroke();

    //add highlight
    const hlo = 10;
    const hls = 2 * Math.PI / 16;
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'hsla(0, 0%, 100%, 0.3)';
    ctx.beginPath();
    ctx.arc(mmx + hlo, mmy + hlo, mmr, -hls + 5 * Math.PI / 4, hls + 5 * Math.PI / 4);
    ctx.stroke();

  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
