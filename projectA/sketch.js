/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/


let pg1, pg2;
//红色透明度
let a = 0;
//抖动范围
let rate = 1;
//呼吸
let squareSize = 256;
let angle = 0;
let posX, posY;
let speedX = 2;
let speedY = 2;
let breathSpeed = 0.5;
let maxSize = 256;
let minSize = 206;
let ss = 1;
let shakeX;

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.id("p5-canvas");
    canvas.parent("p5-canvas-container");
  
  pg1 = createGraphics(width, height);
  pg2 = createGraphics(width, height);
  
  //中心点
  posX = width / 2;
  posY = height / 2;
  //速度
  speedX = random(-2, 2);
  speedY = random(-2, 2);

  draw1();
  draw2();
}

function draw() {
  background(255);
  


  //移动
  posX += speedX;
  posY += speedY;

  //吸引
  let distance = dist(mouseX, mouseY, posX, posY);
  if (distance < 150 ) {
    // 平滑吸附
    posX = lerp(posX, mouseX, 0.1);
    posY = lerp(posY, mouseY, 0.1);
    
    // 近距离时改变大小
    if (distance < 30) {
      squareSize = minSize + maxSize * abs(sin(frameCount*0.5));
      //squareSize = lerp(squareSize, map(distance, 0, 100, minSize * 0.9, maxSize), 0.1);
    }else{
      squareSize = minSize;
    }
  } else if (abs(speedX) > 2 || abs(speedY) > 2) {
    speedX = random(-2, 2);
    speedY = random(-2, 2);
  }

  //反弹
  if (posX < 100 || posX > width - 100) {
    speedX *= -1;
  }
  if (posY < 100 || posY > height - 100) {
    speedY *= -1;
  }

  angle += 0.005;
  ss = map(squareSize, minSize, minSize+maxSize, 1, 0.9);
  //console.log(squareSize);
  //ss = 0.2;
  rate = map(a, 0, 255, 0, 5);
  let shakeX = random(-rate, rate);
  let shakeY = random(-rate, rate);

  //绘制背景和图形
  image(pg1, 0, 0);  // 蓝色背景
  if (a > 0) {  // 只在有透明度时绘制红色背景
    tint(255, a);
    image(pg2, 0, 0);
    noTint();
  }
  
  // 绘制黑色图形
  push();
  translate(posX + shakeX, posY + shakeY);
 // translate(posX, posY);
  scale(ss);
  rotate(angle);
  fill(0);
  noStroke();
  beginShape();
  vertex(184-posX, 46-posY);
  vertex(77-posX, 118-posY);
  vertex(86-posX, 296-posY);
  vertex(232-posX, 370-posY);
  vertex(320-posX, 255-posY);
  vertex(318-posX, 98-posY);
  endShape(CLOSE);
  pop();

  if (frameCount % 2 == 0 && a > 0) a--;
}

//控制红色背景
function mousePressed() {
  a += 50;
}

//背景绘制
function draw1() {
  let color1 = color(129, 135, 149);
  let color2 = color(52, 120, 198);
  for (let i = 0; i < height; i++) {
    pg1.stroke(lerpColor(color1, color2, i/height));
    pg1.line(0, i, width, i);
  }
}

function draw2() {
  let color1 = color(225, 162, 68);
  let color2 = color(255, 0, 0);
  for (let r = width * 2; r > 0; r--) {
    pg2.fill(lerpColor(color1, color2, r/(width * 2)));
    pg2.noStroke();
    pg2.ellipse(width / 2, height / 2, r, r);
  }
}