'use strict';

window.sketchClass = class extends Sketch {
  desc = "A cryptid is just a friend you haven't met yet.";

  load() {
    super.load();

    this.msg = this.expand('{fullMsg}');
  }

  pick(a) {
    const i = Math.floor(Math.random() * a.length);
    return a[i];
  }

  expand(s) {
    const varVals = {
      typeOfDay: 'dark,bright,stormy,rainy,foggy,hot,cold,windy'.split`,`,
      timeOfDay: 'morning,night,afternoon,evening,day'.split`,`,
      earlyLate: 'Early,Late'.split`,`,
      when: '{earlyLate} one {typeOfDay} {timeOfDay},One {typeOfDay} {timeOfDay},Once upon a time'.split`,`,
      who: 'we,my friends and I,my family and I,my class'.split`,`,
      travelType: 'walking,running,skipping,dancing,sneaking,hiking,marching,trudging,treking,biking,riding,driving'.split`,`,
      travelSpeed: 'quickly,slowly,randomly'.split`,`,
      travelKind: 'distant,nearby,local,spooky,haunted,secluded,brand new'.split`,`,
      travelWhere: 'store,movies,store,church,graveyard,walmart,park,cave,forest,beach,city,bar,Wendy\'s,school,playground'.split`,`,
      sightType: 'scary,cute,funny,weird,awesome,amazing,unsettling,odd'.split`,`,
      size: 'large,small,huge,tiny,big,medium,gigantic,microscopic'.split`,`,
      color: 'red,orange,yellow,green,blue,purple,black,brown,pink,translucent,gray'.split`,`,
      animal: 'cat,dog,lion,goat,dragon,eagle,snake,man,horse,bear,sheep,squirrel,koala,bat,elephant,frog,giraffe,rabbit,lizard,moose,ostrich,porpoise,quail,rhino,tiger,walrus,zebra'.split`,`,
      feeling: 'scared,happy,amazed,shocked,angry,sad,disgusted,surprised,envious,embarassed,confused,disappointed'.split`,`,
      result: 'ran away,went closer,fell asleep,turned around,died,jumped,cried,screamed,gasped,yelled,fainted,blushed,laughed'.split`,`,
      fullMsg: ['{when}, {who} were {travelType} {travelSpeed} to the {travelKind} {travelWhere} when I saw a {sightType} sight! It was a {size} {color} creature with the head of a {animal}, the body of a {animal}, and the tail of a {animal}! I was so {feeling} that I {result}!']
    };
    //late one evening, my friends and I were walking along the street when we
    //saw a terrifying sight. It was a huge yellow creature with the head of a
    //fish, the body of a cat, and the tail of a lizard. We were so scared that we
    //ran away.

    while (s.indexOf('{') !== -1) {
      let msg = s;

      const matches = [...s.matchAll(/{([^}]+)}/g)];

      for (let i = matches.length - 1; i >= 0; i = i - 1) {
        const match = matches[i];
        const preString = msg.substr(0, match.index);
        const postString = msg.substr(match.index + match[0].length);
        const replaceString = this.pick(varVals[match[1]]);
        msg = preString + replaceString + postString;
      }

      s = msg;
    }

    return s;
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    ctx.font = '35px Grandstander';
    ctx.fillStyle = 'white';
    
    const margin = 10;
    const lineHeight = 40;
    const spaceSize = 8;
    let x = 10;
    let y = lineHeight;
    this.msg.split(' ').forEach( word => {
      const wordSize = ctx.measureText(word);
      if ((x + wordSize.width) > (width - margin)) {
        x = margin;
        y += lineHeight;
      }
      ctx.fillText(word, x, y);
      x += wordSize.width + spaceSize;
    });
  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
