// Wait for document to be ready before initializing p5
document.addEventListener('DOMContentLoaded', function() {
  // 采用p5.js的实例模式，避免全局变量冲突
  let myp5 = new p5(function(p) {
    // 使用p前缀访问p5函数，避免全局命名空间冲突
    
    // 基本变量声明
    let currentScene = 0;
    let bgm;
    let bgImages = {};
    let font;
    let isTransitioning = false;
    let fadeValue = 0;
    let fadeDirection = 1; // 1 for fade in, -1 for fade out
    let transitionSpeed = 3;
    let initialized = false;
    let characters = {
      narrator: { color: '#FFFFFF' },
      alexander: { color: '#5DC1B9' },
      william: { color: '#FF7E79' },
      drK: { color: '#5DC1B9' },
      drC: { color: '#FF7E79' },
      automatedVoice: { color: '#AAAAFF' },
      kael: { color: '#5DC1B9' },
      cyra: { color: '#FF7E79' },
      anonymousMessage: { color: '#AAFFAA' }
    };
    
    // 选择分支状态
    let storyBranch = null;
    let choiceButtons = [];
    let showChoices = false;
    let choiceSelected = false;
    let interactionButtons = [];
    let showInteractionMenu = false;
    let currentInteractionMenu = "";
    
    // 全局变量用于存储下一个场景目标
    let nextSceneTarget = null;
    
    // 全局变量用于存储音效
    let soundEffects = {};

    // 创建默认背景图像
    function createDefaultImage(r, g, b) {
      let img = p.createImage(100, 100);
      img.loadPixels();
      for (let i = 0; i < img.pixels.length; i += 4) {
        img.pixels[i] = r;      // R
        img.pixels[i + 1] = g;  // G
        img.pixels[i + 2] = b;  // B
        img.pixels[i + 3] = 255;// A
      }
      img.updatePixels();
      return img;
    }
    
    const mainScenes = [
    {
      type: "title",
      title: "Not an Apology",
      subtitle: "Click to start",
      bgColor: "#000000",
      bgImage: "pic1"
    },
    {
      type: "text",
      speaker: "narrator",
      content: "Still not awake, Alexander? Unbelievable. The great commander, asleep on the job. This has to be recorded. Historic moment, can't miss it!",
      bgColor: "#121212",
      bgImage: "pic3"
    },
    {
      type: "text",
      speaker: "alexander",
      content: "Who's the damn crow squawking in my ear… William—of course it's you. Out of respect for our years in the field together, I'm giving you ten seconds to delete that video. Otherwise, I'd be more than happy to remind you who's got rank here.",
      bgColor: "#121212",
      bgImage: "pic4"
    },
    {
      type: "text",
      speaker: "william",
      content: "Alright, alright, I surrender! It's gone, my friend. Wiped clean. But seriously, you'll want to hear this. The investigation just made some progress. The data synced to your terminal a few minutes ago.",
      bgColor: "#121212",
      bgImage: "pic4"
    },
    {
      type: "text",
      speaker: "alexander",
      content: "Well now, that's a surprise. Looks like those coffee-sipping freeloaders finally managed to come up with something halfway decent.",
      bgColor: "#121212",
      bgImage: "pic4"
    },
    {
      type: "text",
      speaker: "alexander",
      content: "Why are there so many emails?",
      bgColor: "#121212",
      bgImage: "pic9"
    },
    {
      type: "text",
      speaker: "alexander",
      content: "Wait a second… Kael and Cyra? Those names sound familiar. Are they who I ran into on my way to work this morning?",
      bgColor: "#121212",
      bgImage: "pic10"
    },
    {
      type: "interaction",
      content: "Terminal Menu",
      options: [
        { text: "About ACTB", target: "about_actb" },
        { text: "Case Brief", target: "case_brief" },
        { text: "Heptapods", target: "heptapods" },
        { text: "Finish", target: 8 }
      ],
      bgColor: "#121212",
      bgImage: "pic9"
    },
    {
      type: "image",
      content: "",
      bgColor: "#121212",
      bgImage: "pic12"
    },
    {
      type: "text",
      speaker: "alexander",
      content: "Finally ready.",
      bgColor: "#121212",
      bgImage: "pic13"
    },
    {
      type: "text",
      speaker: "narrator",
      content: "[Recovered Video Log #56]",
      bgColor: "#121212",
      bgImage: "pic2"
    },
    {
      type: "text",
      speaker: "drK",
      content: "Hm… Oh, excellent. The camera's working. Alright, starting now.",
      bgColor: "#121212",
      bgImage: "pic2"
    },
    {
      type: "text",
      speaker: "drK",
      content: "Hello, viewers. This is Day 56 of our work communicating with the Heptapods. I've been paired with Dr. Cyra Lindholm, who, frankly, is already getting a grasp of their language, while I'm still struggling to conjugate a thought.",
      bgColor: "#121212",
      bgImage: "pic2"
    },
    {
      type: "text",
      speaker: "drC",
      content: "Well, some of us are just built different.",
      bgColor: "#121212",
      bgImage: "pic2"
    },
    {
      type: "text",
      speaker: "drK",
      content: "Who asked you? This is supposed to be my debrief, alright?",
      bgColor: "#121212",
      bgImage: "pic2"
    },
    {
      type: "text",
      speaker: "drC",
      content: "Fine, fine.",
      bgColor: "#121212",
      bgImage: "pic2"
    },
    {
      type: "text",
      speaker: "drK",
      content: "Anyway. Today, Dr. Cyra Lindholm and I discussed the basic structure of the human body with our interstellar friends.",
      bgColor: "#121212",
      bgImage: "pic2"
    },
    {
      type: "text",
      speaker: "drC",
      content: "You're seriously recording this?",
      bgColor: "#121212",
      bgImage: "pic2"
    },
    {
      type: "text",
      speaker: "drK",
      content: "Of course. Don't you want the world to see our mind-blowing work? You're not stopping me. You never do.",
      bgColor: "#121212",
      bgImage: "pic2"
    },
    {
      type: "text",
      speaker: "drC",
      content: "...You're right. As usual.",
      bgColor: "#121212",
      bgImage: "pic2"
    },
    {
      type: "text",
      speaker: "drK",
      content: "Great. Moving on. Today's topic: DNA—genetic engineering, to be precise. Wild stuff, right? A linguist and a tech geek walking aliens through molecular biology. So exciting.",
      bgColor: "#121212",
      bgImage: "pic2"
    },
    {
      type: "image",
      content: "DNA Diagram",
      bgColor: "#121212",
      bgImage: "pic14",
      centerImage: true
    },
    {
      type: "text",
      speaker: "drK",
      content: "This is what we showed them. How we locate DNA, from the cell, down to the nucleus. I think they will understand, especially with Cyra's attempt to draw it in their language.",
      bgColor: "#121212",
      bgImage: "pic14",
      centerImage: true
    },
    {
      type: "text",
      speaker: "drC",
      content: "We dumped all of the Top Secret onto them in a single afternoon. Kinda crazy, right? I'm almost starting to feel a little guilty.",
      bgColor: "#121212",
      bgImage: "pic14",
      centerImage: true
    },
    {
      type: "text",
      speaker: "drK",
      content: "Haha, no worries at all. It's all for the future of humankind. For a higher civilization. Isn't that what you always say?",
      bgColor: "#121212",
      bgImage: "pic2"
    },
    {
      type: "text",
      speaker: "drC",
      content: "Completely right! Humanity should be grateful to us.",
      bgColor: "#121212",
      bgImage: "pic2"
    },
    {
      type: "text",
      speaker: "drK",
      content: "Sure, we could've kept this under wraps for as long as we want. But let's be honest, revealing our perfect work now is more satisfying than waiting for someone else to dig it up.",
      bgColor: "#121212",
      bgImage: "pic2"
    },
    {
      type: "text",
      speaker: "drC",
      content: "Correction—it's set to unlock exactly ten years from today. Not eleven.",
      bgColor: "#121212",
      bgImage: "pic2"
    },
    {
      type: "text",
      speaker: "drK",
      content: "Well, well, my fortune teller. Look who's the time oracle now.",
      bgColor: "#121212",
      bgImage: "pic2"
    },
    {
      type: "text",
      speaker: "drC",
      content: "It's a shame they're leaving tomorrow. We won't be here to witness what humanity becomes through them.",
      bgColor: "#121212",
      bgImage: "pic2"
    },
    {
      type: "text",
      speaker: "drK",
      content: "No matter. We took the first step. That's all that counts.",
      bgColor: "#121212",
      bgImage: "pic2"
    },
    {
      type: "text",
      speaker: "drC",
      content: "Indeed. And now, an early goodbye. Looking forward to seeing you in prison in ten years.",
      bgColor: "#121212",
      bgImage: "pic2"
    },
    {
      type: "text",
      speaker: "drK",
      content: "Appointed^^",
      bgColor: "#121212",
      bgImage: "pic2"
    },
    {
      type: "interaction",
      content: "Video finished",
      options: [
        { text: "Wait", target: 33 },
        { text: "Exit", target: 38 }
      ],
      bgColor: "#121212",
      bgImage: "pic15"
    },
    {
      type: "text",
      speaker: "drK",
      content: "Hm? Still watching? Investigator, you're just as persistent as we were. Here's a little reward for your patience: a few pieces of truth. To be honest, I hate the feeling of knowing everything. If we can't change the course, why not be the ones who speed it up? For a higher civilization. I do enjoy saying that.",
      bgColor: "#121212",
      bgImage: "pic15"
    },
    {
      type: "interaction",
      content: "Continue?",
      options: [
        { text: "Wait", target: 35 },
        { text: "Exit", target: 38 }
      ],
      bgColor: "#121212",
      bgImage: "pic15"
    },
    {
      type: "text",
      speaker: "drK",
      content: "What, still here? Don't tell me you've started predicting we'd say one more thing. Relax. This time... even the future has gone quiet.",
      bgColor: "#121212",
      bgImage: "pic15"
    },
    {
      type: "interaction",
      content: "Continue?",
      options: [
        { text: "Wait", target: 37 },
        { text: "Exit", target: 38 }
      ],
      bgColor: "#121212",
      bgImage: "pic15"
    },
    {
      type: "text",
      speaker: "drC",
      content: "Alright, let me offer the final farewell. We've said all the things you were meant to hear. Good child, it's time to return to the path fate has drawn for you.",
      bgColor: "#121212",
      bgImage: "pic15"
    },
    {
      type: "text",
      speaker: "alexander",
      content: "......This is insane. William, look— William? No, no, no...what the hell is this? William, please... wake up.",
      bgColor: "#121212",
      bgImage: "pic3"
    },
    {
      type: "image",
      content: "",
      bgColor: "#121212",
      bgImage: "pic11"
    },
    {
      type: "text",
      speaker: "alexander",
      content: "Medical department? I have an emergency over here. Hello? Hello?! Can you hear me?",
      bgColor: "#121212",
      bgImage: "pic11"
    },
    {
      type: "text",
      speaker: "automatedVoice",
      content: "Your request has been received. Incident status: Unregistered event. Dispatch is in progress.",
      bgColor: "#121212",
      bgImage: "pic11",
      sfx: "explosion"
    },
    {
      type: "text",
      speaker: "kael",
      content: "You're awake? You were out cold. We thought you'd sleep all the way to the last stop.",
      bgColor: "#121212",
      bgImage: "pic8"
    },
    {
      type: "text",
      speaker: "cyra",
      content: "You nodded off while we were talking. We didn't want to disturb you.",
      bgColor: "#121212",
      bgImage: "pic8"
    },
    {
      type: "text",
      speaker: "alexander",
      content: "Wait… you… Kael? Cyra? You were just… you turned yourselves in, didn't you? ACTB, the footage, the explosion— all of it—",
      bgColor: "#121212",
      bgImage: "pic8"
    },
    {
      type: "text",
      speaker: "cyra",
      content: "Easy now. We'll meet again. See you in the next thirteen minutes.",
      bgColor: "#121212",
      bgImage: "pic8"
    },
    {
      type: "choice",
      content: "What will you do?",
      choices: [
        { text: "Stop them. Demand answers.", target: "branch1" },
        { text: "Accept it. Let things run their course.", target: "branch2" }
      ],
      bgColor: "#121212",
      bgImage: "pic8"
    }
  ];
  
  // 分支1: 拦住他们
  const branch1Scenes = [
    {
      type: "text",
      speaker: "alexander",
      content: "What did you do? You're the ones who put those images in my head, aren't you? The blood, the signals, the footage... That wasn't coincidence. It was all part of your plan, wasn't it?",
      bgColor: "#121212",
      bgImage: "pic8"
    },
    {
      type: "text",
      speaker: "kael",
      content: "Calm down, Mr. Alexander. You simply saw too much, too soon.",
      bgColor: "#121212",
      bgImage: "pic8"
    },
    {
      type: "text",
      speaker: "cyra",
      content: "Every time you get close to the truth, time tries to correct you. It's not us. It's time itself.",
      bgColor: "#121212",
      bgImage: "pic8"
    },
    {
      type: "text",
      speaker: "alexander",
      content: "I reject this so-called plan. There's no way you just happened to be on that train. You've known all along, haven't you?",
      bgColor: "#121212",
      bgImage: "pic8"
    },
    {
      type: "text",
      speaker: "cyra",
      content: "Of course we have. This is a path I've already walked. You can try to break free, but remember this: denial is just another form of embedding.",
      bgColor: "#121212",
      bgImage: "pic8"
    },
    {
      type: "text",
      speaker: "narrator",
      content: "System announcement: Now arriving: Central Square Station. Please gather your belongings and watch your step.",
      bgColor: "#121212",
      bgImage: "pic8"
    },
    {
      type: "text",
      speaker: "narrator",
      content: "As the crowd noise swells, you look up suddenly",
      bgColor: "#121212",
      bgImage: "pic8"
    },
    {
      type: "text",
      speaker: "alexander",
      content: "They... where did they go?",
      bgColor: "#121212",
      bgImage: "pic8"
    },
    {
      type: "text",
      speaker: "william",
      content: "Well, well, look who's back. Pulled another all-nighter, Agent? You look like hell.",
      bgColor: "#121212",
      bgImage: "pic4"
    },
    {
      type: "text",
      speaker: "alexander",
      content: "Did you see them? Kael and Cyra. They were just on the train with me. This isn't a dream. I know what I saw.",
      bgColor: "#121212",
      bgImage: "pic4"
    },
    {
      type: "text",
      speaker: "william",
      content: "You're overworked. You can barely put a sentence together. I told you, man, you need real rest.",
      bgColor: "#121212",
      bgImage: "pic4"
    },
    {
      type: "text",
      speaker: "alexander",
      content: "No. William, you can't leave. Stay in the office. Don't go anywhere. Just stay with me. Please.",
      bgColor: "#121212",
      bgImage: "pic4"
    },
    {
      type: "text",
      speaker: "william",
      content: "Alright, alright. Take a breath. Here, drink this. You look like you ran across the city.",
      bgColor: "#121212",
      bgImage: "pic4"
    },
    {
      type: "text",
      speaker: "narrator",
      content: "William offers you a cup of something he mixed himself. Still catching your breath, you take a sip without thinking.",
      bgColor: "#121212",
      bgImage: "pic4"
    },
    {
      type: "text",
      speaker: "alexander",
      content: "This... this isn't just an energy drink. What did you put in here?",
      bgColor: "#121212",
      bgImage: "pic4"
    },
    {
      type: "text",
      speaker: "william",
      content: "Just something mild. I use it when I can't sleep. No side effects, promise. Take a nap, man. And quit staring at me like I caused the end of the world. I'm not ready for posthumous fame just yet.",
      bgColor: "#121212",
      bgImage: "pic4"
    },
    {
      type: "text",
      speaker: "narrator",
      content: "",
      bgColor: "#121212",
      bgImage: "pic11",
      manualAdvance: true
    },
    {
      type: "ending",
      title: "Ending: The Dissenter",
      subtitle: "You fought the structure. You screamed at silence. You broke free, only to find yourself standing at the edge with no map and no reply.",
      bgColor: "#000000",
      bgImage: "pic3"
    }
  ];
  
  // 分支2: 顺其自然
  const branch2Scenes = [
    {
      type: "text",
      speaker: "alexander",
      content: "......Thirteen minutes. Alright. I'll wait for you.",
      bgColor: "#121212",
      bgImage: "pic8"
    },
    {
      type: "text",
      speaker: "cyra",
      content: "You've done well.",
      bgColor: "#121212",
      bgImage: "pic8"
    },
    {
      type: "text",
      speaker: "kael",
      content: "Congratulations, Alexander. You've reached the true beginning.",
      bgColor: "#121212",
      bgImage: "pic8"
    },
    {
      type: "text",
      speaker: "alexander",
      content: "But I have to say, I don't believe this is fate. This is just… a structure.",
      bgColor: "#121212",
      bgImage: "pic8"
    },
    {
      type: "text",
      speaker: "cyra",
      content: "If you'd like, you can call it poetry.",
      bgColor: "#121212",
      bgImage: "pic8"
    },
    {
      type: "text",
      speaker: "kael",
      content: "Or call it truth.",
      bgColor: "#121212",
      bgImage: "pic8"
    },
    {
      type: "text",
      speaker: "narrator",
      content: "",
      bgColor: "#121212",
      bgImage: "pic4",
      manualAdvance: true
    },
    {
      type: "text",
      speaker: "anonymousMessage",
      content: "You have understood the structure. Now, time will step aside for you.",
      bgColor: "#121212",
      bgImage: "pic9"
    },
    {
      type: "text",
      speaker: "alexander",
      content: "...... Just a short rest. I'll wait for them to return.",
      bgColor: "#121212",
      bgImage: "pic9"
    },
    {
      type: "text",
      speaker: "drC",
      content: "I've seen the shape of the future.",
      bgColor: "#121212",
      bgImage: "pic16"
    },
    {
      type: "text",
      speaker: "drK",
      content: "Is it a circle?",
      bgColor: "#121212",
      bgImage: "pic16"
    },
    {
      type: "text",
      speaker: "drC",
      content: "More like a closed loop. We knew the ending from the very beginning.",
      bgColor: "#121212",
      bgImage: "pic16"
    },
    {
      type: "text",
      speaker: "drK",
      content: "Then why keep going?",
      bgColor: "#121212",
      bgImage: "pic16"
    },
    {
      type: "text",
      speaker: "drC",
      content: "Because I want to see how it unfolds.",
      bgColor: "#121212",
      bgImage: "pic16"
    },
    {
      type: "ending",
      title: "Ending: The Observer",
      subtitle: "You didn't resist. You didn't surrender. You listened, and saw the shape underneath the noise.",
      bgColor: "#000000",
      bgImage: "pic3"
    }
  ];
  
  // 交互选择场景
  const interactionScenes = {
    // About ACTB
    about_actb: {
      type: "text",
      speaker: "alexander",
      content: "I don't want to doubt minds as brilliant as theirs, but this is getting hard to believe.",
      bgColor: "#121212",
      bgImage: "pic5",
      backTarget: "terminal_menu"
    },
    
    // Case Brief
    case_brief: {
      type: "text",
      speaker: "alexander",
      content: "Why would they do that...? This doesn't feel like some attention-grabbing stunt.",
      bgColor: "#121212",
      bgImage: "pic6",
      backTarget: "terminal_menu"
    },
    
    // Heptapods
    heptapods: {
      type: "text",
      speaker: "alexander",
      content: "Does anyone actually care about the difference between linear and nonlinear?",
      bgColor: "#121212",
      bgImage: "pic7",
      backTarget: "terminal_menu"
    },
    
    // Terminal Menu
    terminal_menu: {
      type: "interaction",
      content: "Terminal Menu",
      options: [
        { text: "About ACTB", target: "about_actb" },
        { text: "Case Brief", target: "case_brief" },
        { text: "Heptapods", target: "heptapods" },
        { text: "Finish", target: 8 }
      ],
      bgColor: "#121212",
      bgImage: "pic9"
    },
    
    // Ending Choice
    ending_choice: {
      type: "interaction",
      content: "Choose your path",
      options: [
        { text: "Reopen the Loop", tooltip: "Return to the beginning. You'll remember nothing.", target: "restart" },
        { text: "Cut the Thread", tooltip: "You've reached the final point of fate.", target: "credits" }
      ],
      bgColor: "#121212",
      bgImage: "pic3"
    }
  };
    
    // 致谢场景
    const creditsScene = {
      type: "ending",
      title: "END",
      subtitle: "Inspired by Ted Chiang's \"Story of Your Life\"",
      bgColor: "#000000",
      bgImage: "pic1"
    };
    
    // 辅助函数：加载图片
    function loadImage(key, path) {
      p.loadImage(path, 
        function(img) {
          bgImages[key] = img;
        },
        function() {
          // Silently handle failure
        }
      );
    }

    // 获取当前场景
    function getCurrentScene() {
      try {
        if (storyBranch === null) {
          // 主线剧情
          if (currentScene >= mainScenes.length) {
            return mainScenes[mainScenes.length - 1];
          }
          return mainScenes[currentScene];
        } else if (storyBranch === "branch1") {
          // 分支1剧情
          if (currentScene >= branch1Scenes.length) {
            return branch1Scenes[branch1Scenes.length - 1];
          }
          return branch1Scenes[currentScene];
        } else if (storyBranch === "branch2") {
          // 分支2剧情
          if (currentScene >= branch2Scenes.length) {
            return branch2Scenes[branch2Scenes.length - 1];
          }
          return branch2Scenes[currentScene];
        } else if (storyBranch === "credits") {
          // 致谢场景
          return creditsScene;
        } else if (interactionScenes[storyBranch]) {
          // 交互场景
          return interactionScenes[storyBranch];
        } else {
          return mainScenes[0]; // 回到主线开始
        }
      } catch (e) {
        return mainScenes[0]; // 出错时回到主线开始
      }
    }
    
    // 绘制背景
    function drawBackground(scene) {
      try {
        // 设置背景颜色
        if (scene.bgColor) {
          p.background(scene.bgColor);
        } else {
          p.background(0); // 默认黑色背景
        }
        
        // 绘制背景图像
        if (scene.bgImage && bgImages[scene.bgImage]) {
          let img = bgImages[scene.bgImage];
          
          // 计算图像缩放比例以填充屏幕
          let scaleX = p.width / img.width;
          let scaleY = p.height / img.height;
          let scale = Math.max(scaleX, scaleY); // 选择较大的缩放比例以填充屏幕
          
          // 计算居中位置
          let newWidth = img.width * scale;
          let newHeight = img.height * scale;
          let x = (p.width - newWidth) / 2;
          let y = (p.height - newHeight) / 2;
          
          // 绘制调整大小后的图像
          p.image(img, x, y, newWidth, newHeight);
          
          // 如果是中心图片模式
          if (scene.centerImage) {
            // 添加半透明黑色覆盖层
            p.fill(0, 150);
            p.rect(0, 0, p.width, p.height);
            
            // 在屏幕中央显示原始大小图像
            let centerX = (p.width - img.width) / 2;
            let centerY = (p.height - img.height) / 2;
            p.image(img, centerX, centerY);
          }
        }
      } catch (e) {
        // Silently handle error
      }
    }
    
    // 绘制标题场景
    function drawTitle(scene) {
      try {
        p.fill(255);
        p.textSize(45);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(scene.title, p.width/2, p.height/2 - 30);
        
        p.textSize(20);
        p.text(scene.subtitle, p.width/2, p.height/2 + 30);
      } catch (e) {
        // Silently handle error
      }
    }
    
    // 绘制对话文本场景
    function drawText(scene) {
      try {
        // 绘制文本框背景
        p.fill(0, 180);
        p.rect(0, p.height - 200, p.width, 200);
        
        // 绘制角色名称
        if (scene.speaker && scene.speaker !== "narrator") {
          p.fill(characters[scene.speaker] ? characters[scene.speaker].color : 255);
          p.textSize(22);
          p.textAlign(p.LEFT, p.TOP);
          p.text(scene.speaker, 50, p.height - 180);
        }
        
        // 绘制对话内容
        p.fill(255);
        p.textSize(18);
        p.textAlign(p.LEFT, p.TOP);
        
        // 处理多行文本
        let lines = [];
        let words = scene.content.split(' ');
        let currentLine = "";
        let maxWidth = p.width - 100;
        
        for (let i = 0; i < words.length; i++) {
          let testLine = currentLine + words[i] + ' ';
          if (p.textWidth(testLine) > maxWidth) {
            lines.push(currentLine);
            currentLine = words[i] + ' ';
          } else {
            currentLine = testLine;
          }
        }
        lines.push(currentLine); // 添加最后一行
        
        // 绘制文本行
        for (let i = 0; i < lines.length; i++) {
          p.text(lines[i], 50, p.height - 140 + i * 25);
        }
      } catch (e) {
        // Silently handle error
      }
    }
    
    // 绘制结局场景
    function drawEnding(scene) {
      try {
        p.fill(255);
        p.textSize(35);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(scene.title, p.width/2, p.height/2 - 60);
        
        p.textSize(18);
        
        // 处理副标题多行文本
        let lines = [];
        let words = scene.subtitle.split(' ');
        let currentLine = "";
        let maxWidth = p.width - 200;
        
        for (let i = 0; i < words.length; i++) {
          let testLine = currentLine + words[i] + ' ';
          if (p.textWidth(testLine) > maxWidth) {
            lines.push(currentLine);
            currentLine = words[i] + ' ';
          } else {
            currentLine = testLine;
          }
        }
        lines.push(currentLine); // 添加最后一行
        
        // 绘制文本行
        for (let i = 0; i < lines.length; i++) {
          p.text(lines[i], p.width/2, p.height/2 + 20 + i * 25);
        }
      } catch (e) {
        // Silently handle error
      }
    }
    
    // 绘制选择场景
    function drawChoice(scene) {
      try {
        // 显示选择标题
        p.fill(255);
        p.textSize(28);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(scene.content, p.width/2, p.height/2 - 100);
        
        // 显示选择按钮
        showChoices = true;
        
        // 更新按钮文本
        for (let i = 0; i < Math.min(choiceButtons.length, scene.choices.length); i++) {
          choiceButtons[i].text = scene.choices[i].text;
        }
        
        // 绘制按钮
        for (let i = 0; i < Math.min(choiceButtons.length, scene.choices.length); i++) {
          const btn = choiceButtons[i];
          
          // 按钮背景
          p.fill(30, 30, 40, 200);
          p.stroke(100, 100, 120);
          p.strokeWeight(2);
          p.rect(btn.x - btn.width/2, btn.y - btn.height/2, btn.width, btn.height, 10);
          
          // 按钮文本
          p.noStroke();
          p.fill(255);
          p.textSize(18);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(btn.text, btn.x, btn.y);
        }
      } catch (e) {
        // Silently handle error
      }
    }
    
    // 绘制图像场景
    function drawImage(scene) {
      try {
        // 绘制图像标题
        p.fill(255);
        p.textSize(24);
        p.textAlign(p.CENTER, p.TOP);
        p.text(scene.content, p.width/2, 30);
      } catch (e) {
        // Silently handle error
      }
    }
    
    // 绘制交互菜单场景
    function drawInteraction(scene) {
      try {
        // 显示交互菜单标题
        p.fill(255);
        p.textSize(28);
        p.textAlign(p.CENTER, p.TOP);
        p.text(scene.content, p.width/2, 50);
        
        // 启用交互菜单
        showInteractionMenu = true;
        
        // 如果菜单发生变化，重新创建按钮
        if (currentInteractionMenu !== scene.content && scene.options) {
          // 更新当前菜单
          currentInteractionMenu = scene.content;
          
          // 创建新的交互按钮
          interactionButtons = [];
          for (let i = 0; i < scene.options.length; i++) {
            interactionButtons.push({
              text: scene.options[i].text,
              tooltip: scene.options[i].tooltip || "",
              x: p.width / 2,
              y: 150 + i * 70,
              width: 300,
              height: 50,
              action: function() { handleInteraction(i, scene); }
            });
          }
        }
        
        // 绘制返回按钮（如果有）
        if (scene.backTarget) {
          p.fill(50, 50, 60, 200);
          p.stroke(100, 100, 120);
          p.strokeWeight(2);
          p.rect(30, 30, 120, 50, 10);
          
          p.noStroke();
          p.fill(255);
          p.textSize(18);
          p.textAlign(p.CENTER, p.CENTER);
          p.text("Back", 90, 55);
        }
        
        // 绘制交互按钮
        for (let i = 0; i < interactionButtons.length; i++) {
          const btn = interactionButtons[i];
          
          // 按钮背景
          p.fill(30, 30, 40, 200);
          p.stroke(100, 100, 120);
          p.strokeWeight(2);
          p.rect(btn.x - btn.width/2, btn.y - btn.height/2, btn.width, btn.height, 10);
          
          // 按钮文本
          p.noStroke();
          p.fill(255);
          p.textSize(18);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(btn.text, btn.x, btn.y);
          
          // 显示提示文本（如果有）
          if (btn.tooltip && p.mouseX > btn.x - btn.width/2 && p.mouseX < btn.x + btn.width/2 && 
              p.mouseY > btn.y - btn.height/2 && p.mouseY < btn.y + btn.height/2) {
            p.fill(0, 200);
            p.rect(p.mouseX + 10, p.mouseY - 10, p.textWidth(btn.tooltip) + 20, 30, 5);
            
            p.fill(255);
            p.textAlign(p.LEFT, p.CENTER);
            p.text(btn.tooltip, p.mouseX + 20, p.mouseY + 5);
          }
        }
      } catch (e) {
        // Silently handle error
      }
    }
    
    p.draw = function() {
      try {
        if (!initialized) {
          p.background(0);
          p.fill(255);
          p.textSize(24);
          p.textAlign(p.CENTER, p.CENTER);
          p.text("Loading...", p.width / 2, p.height / 2);
          return;
        }
        
        // 处理过渡动画
        if (isTransitioning) {
          handleTransition();
          return;
        }
        
        // 获取当前场景
        const scene = getCurrentScene();
        
        // 绘制场景背景
        drawBackground(scene);
        
        // 根据场景类型渲染内容
        switch(scene.type) {
          case "title":
            drawTitle(scene);
            break;
          case "text":
            drawText(scene);
            break;
          case "ending":
            drawEnding(scene);
            break;
          case "choice":
            drawChoice(scene);
            break;
          case "image":
            drawImage(scene);
            break;
          case "interaction":
            drawInteraction(scene);
            break;
        }
        
        // 播放场景音效（如果有）
        if (scene.sfx && !isTransitioning) {
          playSound(scene.sfx);
          scene.sfx = null; // 确保只播放一次
        }
      } catch (e) {
        // Silently handle error
      }
    };

    // 处理过渡动画
    function handleTransition() {
      try {
        // 更新淡入淡出值
        fadeValue += fadeDirection * transitionSpeed;
        
        // 检查是否完成淡入淡出
        if (fadeValue <= 0 || fadeValue >= 255) {
          if (fadeDirection === -1) {
            // 已完成淡出，处理场景转换逻辑
            fadeDirection = 1; // 切换到淡入
            
            let nextScene = null;
            // 处理特殊场景跳转
            if (typeof nextSceneTarget === "string") {
              storyBranch = nextSceneTarget;
              currentScene = 0;
              nextSceneTarget = null;
            } else if (typeof nextSceneTarget === "number") {
              currentScene = nextSceneTarget;
              nextSceneTarget = null;
            } else {
              // 正常递增
              currentScene++;
            }
          } else {
            // 已完成淡入，结束过渡
            isTransitioning = false;
          }
          
          // 限制 fadeValue 范围
          fadeValue = p.constrain(fadeValue, 0, 255);
        }
        
        // 获取当前场景
        let scene = getCurrentScene();
        
        // 绘制过渡效果
        if (fadeDirection === -1) {
          // 淡出效果
          drawBackground(scene);
          
          // 根据场景类型渲染内容
          switch(scene.type) {
            case "title":
              drawTitle(scene);
              break;
            case "text":
              drawText(scene);
              break;
            case "ending":
              drawEnding(scene);
              break;
            case "choice":
              drawChoice(scene);
              break;
            case "image":
              drawImage(scene);
              break;
            case "interaction":
              drawInteraction(scene);
              break;
          }
          
          // 叠加黑色遮罩
          p.fill(0, fadeValue);
          p.rect(0, 0, p.width, p.height);
        } else {
          // 淡入效果
          drawBackground(scene);
          
          // 根据场景类型渲染内容
          switch(scene.type) {
            case "title":
              drawTitle(scene);
              break;
            case "text":
              drawText(scene);
              break;
            case "ending":
              drawEnding(scene);
              break;
            case "choice":
              drawChoice(scene);
              break;
            case "image":
              drawImage(scene);
              break;
            case "interaction":
              drawInteraction(scene);
              break;
          }
          
          // 叠加黑色遮罩（逐渐消失）
          p.fill(0, 255 - fadeValue);
          p.rect(0, 0, p.width, p.height);
        }
      } catch (e) {
        // Silently handle error
      }
    }
    
    // 触发场景转换
    function transitionToScene(target) {
      if (!isTransitioning) {
        isTransitioning = true;
        fadeDirection = -1; // 从淡出开始
        fadeValue = 0;
        nextSceneTarget = target;
      }
    }
    
    // 处理选择事件
    function handleChoice(index) {
      if (showChoices) {
        const scene = getCurrentScene();
        if (scene.type === "choice" && index < scene.choices.length) {
          const target = scene.choices[index].target;
          
          // 播放音效（如果有）
          playSound("choice");
          
          // 设置分支并转换到场景
          storyBranch = target;
          currentScene = 0;
          transitionToScene(null);
          
          // 重置选择状态
          showChoices = false;
        }
      }
    }
    
    // 处理交互事件
    function handleInteraction(index, scene) {
      if (showInteractionMenu && index < scene.options.length) {
        const target = scene.options[index].target;
        
        // 播放音效（如果有）
        playSound("interaction");
        
        // 判断目标类型
        if (typeof target === "number") {
          // 数字表示主场景的索引
          storyBranch = null;
          transitionToScene(target);
        } else if (target === "restart") {
          // 重新开始游戏
          storyBranch = null;
          currentScene = 0;
          transitionToScene(null);
        } else if (target === "credits") {
          // 进入致谢画面
          storyBranch = "credits";
          currentScene = 0;
          transitionToScene(null);
        } else {
          // 字符串表示特定场景或分支
          transitionToScene(target);
        }
        
        // 重置交互状态
        showInteractionMenu = false;
      }
    }
    
    // 播放音效
    function playSound(type) {
      try {
        if (soundEffects[type]) {
          // 如果有预加载的音效，直接播放
          p.userStartAudio().then(function() {
            soundEffects[type].play();
          }).catch(function(err) {
            // Silently handle error
          });
        } else {
          // 未找到音效
          if (type === "explosion") {
            // 屏幕闪烁
            p.background(255, 0, 0, 100);
            setTimeout(function() {
              p.background(0);
            }, 300);
          }
        }
      } catch (e) {
        // Silently handle error
      }
    }
    
    p.mousePressed = function() {
      try {
        // 确保音频已启动
        p.userStartAudio().then(function() {
          if (bgm && typeof bgm.loop === 'function' && !bgm.isPlaying()) {
            bgm.loop();
          }
        }).catch(function(err) {
          // Silently handle error
        });
        
        // 如果正在过渡中，忽略点击
        if (isTransitioning) {
          return false;
        }
        
        // 获取当前场景
        const scene = getCurrentScene();
        
        // 处理选择界面
        if (scene.type === "choice" && showChoices) {
          for (let i = 0; i < choiceButtons.length; i++) {
            const btn = choiceButtons[i];
            if (p.mouseX > btn.x - btn.width/2 && 
                p.mouseX < btn.x + btn.width/2 && 
                p.mouseY > btn.y - btn.height/2 && 
                p.mouseY < btn.y + btn.height/2) {
              btn.action();
              return false;
            }
          }
          return false;
        }
        
        // 处理交互菜单
        if (scene.type === "interaction" && showInteractionMenu) {
          // 检查返回按钮
          if (scene.backTarget && p.mouseX > 30 && p.mouseX < 150 && p.mouseY > 30 && p.mouseY < 80) {
            transitionToScene(scene.backTarget);
            return false;
          }
          
          // 检查交互按钮
          for (let i = 0; i < interactionButtons.length; i++) {
            const btn = interactionButtons[i];
            if (p.mouseX > btn.x - btn.width/2 && 
                p.mouseX < btn.x + btn.width/2 && 
                p.mouseY > btn.y - btn.height/2 && 
                p.mouseY < btn.y + btn.height/2) {
              btn.action();
              return false;
            }
          }
          return false;
        }
        
        // 处理文本场景的返回（About ACTB, Case Brief, Heptapods）
        if (scene.type === "text" && scene.backTarget) {
          transitionToScene(scene.backTarget);
          return false;
        }
        
        // 处理手动前进的场景
        if (scene.manualAdvance) {
          // 手动前进
          transitionToScene(null);
          return false;
        }
        
        // 处理普通场景前进（包括image类型）
        if (!isTransitioning) {
          // 如果已经到达当前分支的最后一个场景，处理特殊逻辑
          let isLastScene = false;
          
          if (storyBranch === "branch1" && currentScene >= branch1Scenes.length - 1) {
            // 展示结局选择
            storyBranch = "ending_choice";
            currentScene = 0;
            isLastScene = true;
            transitionToScene(null);
          } else if (storyBranch === "branch2" && currentScene >= branch2Scenes.length - 1) {
            // 展示结局选择
            storyBranch = "ending_choice";
            currentScene = 0;
            isLastScene = true;
            transitionToScene(null);
          } else if (storyBranch === null && currentScene >= mainScenes.length - 1) {
            // 主线剧情结束，不再往下
            return false;
          } else if (!isLastScene) {
            // 开始过渡到下一个场景
            transitionToScene(null);
          }
        }
        
        return false; // 防止默认行为
      } catch (e) {
        // Silently handle error
        return false;
      }
    };
    
    p.windowResized = function() {
      try {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        updateButtonPositions();
      } catch (e) {
        // Silently handle error
      }
    };
    
    p.keyPressed = function() {
      try {
        // 如果按下空格、Enter或右箭头，向前推进
        if (p.keyCode === 32 || p.keyCode === 13 || p.keyCode === 39) {
          p.mousePressed(); // 复用鼠标点击逻辑
          return false; // 防止默认行为
        }
        
        // ESC键返回（如果在交互菜单中）
        if (p.keyCode === 27 && showInteractionMenu) {
          const scene = getCurrentScene();
          if (scene.backTarget) {
            transitionToScene(scene.backTarget);
            return false;
          }
        }
      } catch (e) {
        // Silently handle error
      }
      return true;
    };
    
    // 辅助函数：禁用调试日志
    function showDebugLog(message) {
      // 空函数，禁用所有调试日志
    }
    
    // 更新按钮位置
    function updateButtonPositions() {
      // 选择按钮
      choiceButtons[0].x = p.width / 2 - 150;
      choiceButtons[0].y = p.height / 2 + 50;
      choiceButtons[1].x = p.width / 2 + 150;
      choiceButtons[1].y = p.height / 2 + 50;
      
      // 交互菜单按钮 - 动态定位
      const buttonCount = interactionButtons.length;
      if (buttonCount > 0) {
        const buttonHeight = 50;
        const padding = 15;
        const totalHeight = buttonCount * buttonHeight + (buttonCount - 1) * padding;
        let startY = p.height / 2 - totalHeight / 2;
        
        for (let i = 0; i < buttonCount; i++) {
          interactionButtons[i].x = p.width / 2;
          interactionButtons[i].y = startY + i * (buttonHeight + padding) + buttonHeight / 2;
          interactionButtons[i].width = 250;
          interactionButtons[i].height = buttonHeight;
        }
      }
    }
    
    p.preload = function() {
      try {
        // 加载字体
        font = p.loadFont('https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', 
          function() {
            // Silently handle success
          },
          function(err) {
            // Silently handle error
          }
        );
        
        // 初始化音乐对象
        bgm = {
          loop: function() { },
          isPlaying: function() { return false; }
        };
        
        // 创建默认背景图像
        bgImages["default"] = createDefaultImage(0, 0, 50);   // 深蓝色
        bgImages["pic1"] = createDefaultImage(0, 0, 50);      // 替代pic1
        bgImages["pic2"] = createDefaultImage(20, 10, 40);    // 替代pic2
        bgImages["pic3"] = createDefaultImage(30, 15, 60);    // 替代pic3
        bgImages["pic4"] = createDefaultImage(25, 25, 45);    // 替代pic4
        bgImages["pic5"] = createDefaultImage(35, 20, 50);    // 替代pic5
        bgImages["pic6"] = createDefaultImage(40, 25, 55);    // 替代pic6
        bgImages["pic7"] = createDefaultImage(45, 30, 60);    // 替代pic7
        bgImages["pic8"] = createDefaultImage(50, 35, 65);    // 替代pic8
        bgImages["pic9"] = createDefaultImage(55, 40, 70);    // 替代pic9
        bgImages["pic10"] = createDefaultImage(60, 45, 75);   // 替代pic10
        bgImages["pic11"] = createDefaultImage(65, 50, 80);   // 替代pic11
        bgImages["pic12"] = createDefaultImage(70, 55, 85);   // 替代pic12
        bgImages["pic13"] = createDefaultImage(75, 60, 90);   // 替代pic13
        bgImages["pic14"] = createDefaultImage(80, 65, 95);   // 替代pic14
        bgImages["pic15"] = createDefaultImage(85, 70, 100);  // 替代pic15
        bgImages["pic16"] = createDefaultImage(90, 75, 105);  // 替代pic16
        
        // 尝试加载音乐
        try {
          p.loadSound('bgm/bgm1.mp3', 
            function(sound) { 
              bgm = sound; 
            }, 
            function() { 
              // Silently handle error
            }
          );
          
          // 加载音效
          p.loadSound('sfx/explosion.mp3', 
            function(sound) {
              soundEffects["explosion"] = sound;
            },
            function() {
              // Silently handle error
            }
          );
          
          p.loadSound('sfx/choice.mp3', 
            function(sound) {
              soundEffects["choice"] = sound;
            },
            function() {
              // Silently handle error
            }
          );
          
          p.loadSound('sfx/interaction.mp3', 
            function(sound) {
              soundEffects["interaction"] = sound;
            },
            function() {
              // Silently handle error
            }
          );
        } catch (e) {
          // Silently handle error
        }
        
        // 尝试加载图片
        try {
          loadImage("pic1", "srcpic/pic1.jpeg");
          loadImage("pic2", "srcpic/pic2.jpg");
          loadImage("pic3", "srcpic/pic3.jpg");
          loadImage("pic4", "srcpic/pic4.jpg");
          loadImage("pic5", "srcpic/pic5.jpg");
          loadImage("pic6", "srcpic/pic6.jpg");
          loadImage("pic7", "srcpic/pic7.jpg");
          loadImage("pic8", "srcpic/pic8.jpg");
          loadImage("pic9", "srcpic/pic9.jpg");
          loadImage("pic10", "srcpic/pic10.jpg");
          loadImage("pic11", "srcpic/pic11.jpg");
          loadImage("pic12", "srcpic/pic12.jpg");
          loadImage("pic13", "srcpic/pic13.jpg");
          loadImage("pic14", "srcpic/pic14.jpg");
          loadImage("pic15", "srcpic/pic15.jpg");
          loadImage("pic16", "srcpic/pic16.jpg");
        } catch (e) {
          // Silently handle error
        }
        
      } catch (e) {
        // Silently handle error
      }
    };
    
    p.setup = function() {
      try {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.textAlign(p.CENTER, p.CENTER);
        
        if (font) {
          p.textFont(font);
        }
        
        // 设置按钮
        setupButtons();
        
        // 尝试播放音乐
        try {
          if (bgm && typeof bgm.loop === 'function') {
            p.userStartAudio().then(function() {
              bgm.loop();
            }).catch(function(err) {
              // Silently handle error
            });
          }
        } catch (e) {
          // Silently handle error
        }
        
        initialized = true;
        
        // 通知HTML页面p5.js已初始化
        if (typeof window.p5InitialSetup === 'function') {
          window.p5InitialSetup();
        }
      } catch (e) {
        // Silently handle error
      }
    };
    
    // 设置交互按钮
    function setupButtons() {
      // 选择按钮
      choiceButtons = [
        { 
          text: "", 
          x: p.width / 2 - 150, 
          y: p.height / 2 + 50, 
          width: 280, 
          height: 60, 
          action: function() { handleChoice(0); }
        },
        { 
          text: "", 
          x: p.width / 2 + 150, 
          y: p.height / 2 + 50, 
          width: 280, 
          height: 60, 
          action: function() { handleChoice(1); }
        }
      ];
      
      // 交互菜单按钮
      interactionButtons = [];
    }
  });
});