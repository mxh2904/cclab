// CCLab Mini Project - 9.R Particle World Template

let NUM_OF_PARTICLES = 3; // Decide the initial number of particles.
let MAX_OF_PARTICLES = 500; // Decide the maximum number of particles.

let particles = [];

// 交流区参数
let EXCHANGE_X, EXCHANGE_Y, EXCHANGE_RADIUS;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  EXCHANGE_X = width / 2;
  EXCHANGE_Y = height / 2;
  EXCHANGE_RADIUS = 60;
}

function draw() {
  background(30);

  // 绘制交流区轮廓
  noFill();
  stroke(100, 200, 255, 80);
  strokeWeight(3);
  ellipse(EXCHANGE_X, EXCHANGE_Y, EXCHANGE_RADIUS * 2);
  noStroke();

  // 定时生成科学家信号粒子（左侧）
  if (frameCount % 30 === 0) {
    particles.push(new Particle(0, random(height), 'signal'));
  }
  // 定时生成外星回应粒子（右侧）
  if (frameCount % 60 === 0) {
    particles.push(new Particle(width, random(height), 'alien'));
  }

  // update and display
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.display();
    // 移除超出画布的粒子或完全透明的粒子
    if (p.x < -50 || p.x > width + 50 || p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  // limit the number of particles
  if (particles.length > MAX_OF_PARTICLES) {
    particles.splice(0, 1); // remove the first (oldest) particle
  }
}

class Particle {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type || 'signal';
    this.dia = this.type === 'signal' ? 20 : 28;
    this.speed = this.type === 'signal' ? 3 : 1.5;
    this.baseColor = this.type === 'signal' ? color(0, 200, 255) : color(180, 0, 255);
    this.angle = random(TWO_PI);
    this.alpha = 255;
  }
  update() {
    if (this.type === 'signal') {
      this.x += this.speed;
      this.y += random(-1, 1);
      // 透明度随x增加而降低
      this.alpha = map(this.x, 0, width, 255, 0);
    } else if (this.type === 'alien') {
      this.x -= this.speed;
      this.y += sin(this.angle) * 2;
      this.angle += 0.1;
      // 透明度随x减小而降低
      this.alpha = map(this.x, width, 0, 255, 0);
    }
  }
  display() {
    push();
    translate(this.x, this.y);
    noStroke();
    let c = color(red(this.baseColor), green(this.baseColor), blue(this.baseColor), constrain(this.alpha, 0, 255));
    fill(c);
    if (this.type === 'signal') {
      ellipse(0, 0, this.dia, this.dia);
      // 尾迹
      for (let i = 1; i < 5; i++) {
        fill(0, 200, 255, this.alpha / (i + 1));
        ellipse(-i * 8, 0, this.dia / 1.5, this.dia / 1.5);
      }
    } else if (this.type === 'alien') {
      beginShape();
      for (let a = 0; a < TWO_PI; a += PI / 6) {
        let r = this.dia + sin(a * 3 + frameCount * 0.1) * 5;
        let x = cos(a) * r;
        let y = sin(a) * r;
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    pop();
  }
}
