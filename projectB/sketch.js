

let archive;
let script = [
  { speaker: "Dr. K", content: "Hello viewers, this is the fifty sixth day me working with Dr. C...", delay: 0 },
  { speaker: "Dr. C", content: "I said there's a real knack for this stuff in the business tho.", delay: 0 },
  { speaker: "Dr. K", content: "Alright, let's keep going. So, today we're diving into DNA...", delay: 0 },

];
let startTime;

function setup() {
  let canvas = createCanvas(700, 400);
  textFont("Georgia");
  archive = new AlienArchive(script);
  startTime = millis();
  canvas.parent("p5-canvas-container");
}

function draw() {
  background(10);
  archive.update();
  archive.display();
}

class AlienArchive {
  constructor(script) {
    this.script = script;
    this.currentIndex = 0;
    this.segmentStart = millis(); // 当前段开始时间
    this.displayDuration = 5000; // 每段显示时长（5秒）
    this.s = random(10, 50);
    this.c = color(random(100, 255),random(100, 255));
  }

  update() {
    let now = millis();
    if (this.currentIndex < this.script.length) {
      if (now - this.segmentStart > this.displayDuration) {
        this.currentIndex++;
        this.segmentStart = now;
      }
    }
  }

  display() {
    if (this.currentIndex >= this.script.length) {
      fill(180);
      textSize(18);
      text("<< END OF DECODED TRANSMISSION >>", 50, height / 2);
      return;
    }

    let segment = this.script[this.currentIndex];
    this.drawDialogue(segment);
  }

  drawDialogue(segment) {
    let speakerColor = segment.speaker === "Dr. C" ? color(150, 200, 255) : color(255, 200, 150);
    let toneStyle = this.getToneStyle(segment.tone);

    fill(speakerColor);
    textSize(16);
    textStyle(BOLD);
    text(`${segment.speaker}:`, 50, 50);

    fill(toneStyle.color);
    textSize(toneStyle.size);
    //textSize(30);
    textStyle(toneStyle.style);
    text(segment.content, 50, 80, 600);
  }

  getToneStyle(tone) {
    switch (tone) {
      case "serious":
        return { color: color(255), size: 16, style: NORMAL };
      case "excited":
        return { color: color(255, 100, 100), size: 18, style: BOLD };
      case "ironic":
        return { color: color(200, 200, 255), size: 16, style: ITALIC };
      case "playful":
        return { color: color(255, 255, 100), size: 17, style: ITALIC };
      default:
        return { color: color(200), size: 16, style: NORMAL };
    }
  }
}
