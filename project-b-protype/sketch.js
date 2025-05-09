class AlienArchive {
  constructor(script) {
    this.script = script; 
    this.currentIndex = 0;
    this.timer = 0;
    this.unlocked = false;
  }

  update() {
    // 简化处理解锁条件，例如按下空格解锁下一段
    if (keyIsPressed && key === ' ') {
      this.unlocked = true;
    }
  }

  display() {
    background(0);
    fill(255);
    textSize(16);
    textAlign(LEFT, TOP);

    let current = this.script[this.currentIndex];
    if (this.unlocked && current) {
      this.drawDialogue(current);
    } else {
      text("<< Press SPACE to decode next segment >>", 50, 50);
    }
  }

  drawDialogue(segment) {
    let speakerColor = segment.speaker === "Dr. C" ? color(150, 200, 255) : color(255, 200, 150);
    fill(speakerColor);
    text(`${segment.speaker}:`, 50, 50);
    fill(255);
    text(segment.content, 50, 80, 500);
  }

  next() {
    if (this.unlocked && this.currentIndex < this.script.length - 1) {
      this.currentIndex++;
      this.unlocked = false;
    }
  }
}

let archive;
let script = [
  { speaker: "Dr. K", content: "Hello viewers, this is the fifty sixth day me working with Dr. C...", delay: 0 },
  { speaker: "Dr. C", content: "I said there's a real knack for this stuff in the business tho.", delay: 0 },
  { speaker: "Dr. K", content: "Alright, let's keep going. So, today we're diving into DNA...", delay: 0 },

];

function setup() {
  createCanvas(600, 400);
  archive = new AlienArchive(script);
}

function draw() {
  archive.update();
  archive.display();
}

function keyPressed() {
  if (key === ' ') {
    archive.next();
  }
}
