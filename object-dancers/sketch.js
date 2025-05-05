/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;

function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new SwayingTreeDancer(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class SwayingTreeDancer {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    // 调整树的属性
    this.trunkHeight = 120;   // 树干高度
    this.trunkWidth = 12;     // 树干宽度
    this.branchLength = 40;   // 树枝长度
    this.swingSpeed = 0.02;   // 树干摇摆速度
    this.swingAmount = 0.3;   // 树干摇摆幅度
    this.leafSize = 15;       // 叶子大小
    this.branchSwingSpeed = 0.05;  // 树枝摇摆速度
    this.branchSwingAmount = 0.2;  // 树枝摇摆幅度
    
    // 叶子动作参数
    this.leafSwingSpeed = 0.1;     // 叶子摇摆速度
    this.leafSwingAmount = 0.8;    // 叶子摇摆幅度
    this.leafRotationSpeed = 0.15; // 叶子旋转速度
    this.leafFloatSpeed = 0.15;    // 叶子浮动速度
    this.leafFloatAmount = 4;      // 叶子浮动幅度
  }

  update() {
    // 更新树干摇摆状态
    this.swingAngle = sin(frameCount * this.swingSpeed) * this.swingAmount;
    // 更新树枝摇摆状态
    this.branchSwingAngle = sin(frameCount * this.branchSwingSpeed) * this.branchSwingAmount;
    // 更新叶子摇摆状态
    this.leafSwingAngle = sin(frameCount * this.leafSwingSpeed) * this.leafSwingAmount;
    // 更新叶子旋转状态
    this.leafRotation = sin(frameCount * this.leafRotationSpeed) * 0.4;
    // 更新叶子浮动状态
    this.leafFloat = sin(frameCount * this.leafFloatSpeed) * this.leafFloatAmount;
  }

  display() {
    push();
    translate(this.x, this.y);
    
    
    // 绘制树干和树冠
    push();
    rotate(this.swingAngle);
    
    // 绘制树干
    fill(139, 69, 19); // 棕色树干
    rect(-this.trunkWidth/2, -this.trunkHeight, this.trunkWidth, this.trunkHeight);
    
    // 绘制树冠
    push();
    translate(0, -this.trunkHeight + 20);
    noStroke();
    fill(34, 139, 34, 100);
    ellipse(0, 0, 140, 140);
    pop();
    
    // 绘制左侧树枝（2个）
    for(let i = 0; i < 2; i++) {
      let yPos = map(i, 0, 1, -this.trunkHeight + 30, -this.trunkHeight/3);
      
      push();
      translate(-this.trunkWidth/2, yPos);
      rotate(5*PI/4 + this.branchSwingAngle * (i + 1) * 0.5); // 225度角 + 树枝摇摆
      stroke(139, 69, 19);
      strokeWeight(3);
      line(0, 0, this.branchLength, 0);
      
      // 添加两片叶子
      for(let j = 0; j < 2; j++) {
        push();
        // 调整叶子位置，让它们分布更均匀
        let leafPos = map(j, 0, 1, this.branchLength * 0.5, this.branchLength * 0.9);
        translate(leafPos, 0);
        
        // 叶子的运动方式
        let leafAngle = this.leafSwingAngle * (i + 1) * 0.5 + 
                       this.leafRotation * (j + 1) * 0.3;
        rotate(leafAngle);
        
        // 添加浮动效果
        translate(0, this.leafFloat * (j + 1) * 0.4);
        
        noStroke();
        fill(34, 139, 34, 200);
        ellipse(0, 0, this.leafSize, this.leafSize);
        pop();
      }
      pop();
    }
    
    // 绘制右侧树枝（3个）
    for(let i = 0; i < 3; i++) {
      let yPos = map(i, 0, 2, -this.trunkHeight + 10, -this.trunkHeight/4);
      
      push();
      translate(this.trunkWidth/2, yPos);
      rotate(-PI/4 + this.branchSwingAngle * (i + 1) * 0.5); // -45度角 + 树枝摇摆
      stroke(139, 69, 19);
      strokeWeight(3);
      line(0, 0, this.branchLength, 0);
      
      // 添加两片叶子
      for(let j = 0; j < 2; j++) {
        push();
        // 调整叶子位置，让它们分布更均匀
        let leafPos = map(j, 0, 1, this.branchLength * 0.5, this.branchLength * 0.9);
        translate(leafPos, 0);
        
        // 叶子的运动方式
        let leafAngle = this.leafSwingAngle * (i + 1) * 0.5 + this.leafRotation * (j + 1) * 0.3;
        rotate(leafAngle);
        
        // 添加浮动效果
        translate(0, this.leafFloat * (j + 1) * 0.4);
        
        noStroke();
        fill(34, 139, 34, 200);
        ellipse(0, 0, this.leafSize, this.leafSize);
        pop();
      }
      pop();
    }
    pop();
    
    pop();
  }
}

/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/