class DancingTree {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.trunkHeight = 120;    // 树干高度
    this.angle = 0;            // 摆动角度
    this.branchAngles = [PI/4, -PI/4, PI/6, -PI/6];  // 分支角度
    this.color = {
      trunk: color(101, 67, 33),  // 树干颜色
      leaves: color(34, 139, 34)  // 叶子颜色
    };
  }

  update() {
    // 树的摆动动画
    this.angle = sin(frameCount * 0.05) * 0.1;
    
    // 保持在画布范围内
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    
    // 绘制树干
    strokeWeight(15);
    stroke(this.color.trunk);
    line(0, 0, 0, -this.trunkHeight);
    
    // 绘制分支和叶子
    this.drawBranch(-this.trunkHeight, 0.7);
    
    pop();
  }
  
  // 辅助方法：绘制分支
  drawBranch(startY, scale) {
    if (scale < 0.3) return;
    
    let branchLength = this.trunkHeight * scale;
    
    for (let angle of this.branchAngles) {
      push();
      translate(0, startY);
      rotate(angle + sin(frameCount * 0.05 + startY) * 0.1);
      
      // 绘制分支
      strokeWeight(15 * scale);
      stroke(this.color.trunk);
      line(0, 0, 0, -branchLength);
      
      // 绘制叶子
      if (scale < 0.5) {
        noStroke();
        fill(this.color.leaves);
        for (let i = 0; i < 3; i++) {
          push();
          translate(0, -branchLength * i/3);
          rotate(sin(frameCount * 0.05 + startY + i) * 0.2);
          ellipse(10, 0, 20 * scale, 15 * scale);
          ellipse(-10, 0, 20 * scale, 15 * scale);
          pop();
        }
      } else {
        // 递归绘制更小的分支
        this.drawBranch(-branchLength, scale * 0.6);
      }
      
      pop();
    }
  }
} 