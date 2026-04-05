class DataNetwork {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.nodes = [];
      this.signals = [];
      this.mouse = { x: null, y: null, radius: 150 };
      
      this.init();
      this.animate();
      
      window.addEventListener('resize', () => this.resize());
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.x;
        this.mouse.y = e.y;
      });
      window.addEventListener('mouseout', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    }
  
    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.initNodes();
    }
  
    initNodes() {
      this.nodes = [];
      this.signals = [];
      // Less nodes than particles, giving a more structured neural net feel
      const numberOfNodes = (window.innerWidth * window.innerHeight) / 25000;
      
      for (let i = 0; i < numberOfNodes; i++) {
        this.nodes.push(new Node(this.canvas, this.ctx));
      }
    }
  
    init() {
      this.resize();
    }
  
    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw Connections & Update Nodes
      for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].update();
        this.nodes[i].draw();
        
        for (let j = i; j < this.nodes.length; j++) {
          const dx = this.nodes[i].x - this.nodes[j].x;
          const dy = this.nodes[i].y - this.nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 - distance/1000})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
            this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
            this.ctx.stroke();
            this.ctx.closePath();

            // Randomly generate data signals along lines
            if (Math.random() < 0.002) {
                this.signals.push(new Signal(this.nodes[i], this.nodes[j], this.ctx));
            }
          }
        }
        
        // Mouse interaction line
        if (this.mouse.x != null) {
          const dx = this.nodes[i].x - this.mouse.x;
          const dy = this.nodes[i].y - this.mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < this.mouse.radius) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(157, 78, 221, ${0.4 - distance/this.mouse.radius})`;
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            this.ctx.stroke();
            this.ctx.closePath();
          }
        }
      }

      // Update and Draw Signals
      for (let i = this.signals.length - 1; i >= 0; i--) {
        this.signals[i].update();
        this.signals[i].draw();
        if (this.signals[i].progress >= 1) {
            this.signals.splice(i, 1);
        }
      }
      
      requestAnimationFrame(() => this.animate());
    }
  }
  
  class Node {
    constructor(canvas, ctx) {
      this.canvas = canvas;
      this.ctx = ctx;
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
    }
  
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
  
      if (this.x > this.canvas.width || this.x < 0) this.speedX = -this.speedX;
      if (this.y > this.canvas.height || this.y < 0) this.speedY = -this.speedY;
    }
  
    draw() {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
      this.ctx.fill();
    }
  }

  class Signal {
    constructor(startNode, endNode, ctx) {
      this.startNode = startNode;
      this.endNode = endNode;
      this.ctx = ctx;
      this.progress = 0;
      this.speed = Math.random() * 0.02 + 0.01;
    }

    update() {
        this.progress += this.speed;
    }

    draw() {
        if (this.progress > 1) return;
        const x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
        const y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, 2, 0, Math.PI * 2);
        this.ctx.fillStyle = '#00ff66';
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = '#00ff66';
        this.ctx.fill();
        this.ctx.shadowBlur = 0; // reset
    }
  }
  
  // Terminal Typewriter Effect
  function typeWriter() {
    const textLines = [
        "Connecting to data lake...",
        "Fetching Unity Catalog permissions...",
        "Validating schemas...",
        "Optimizing DAG sequences...",
        "Data pipeline ready. Awaiting instructions."
    ];
    let lineIdx = 0;
    let charIdx = 0;
    let currentText = "";
    let isDeleting = false;
    const typeElement = document.getElementById('typewriter');
    if (!typeElement) return;

    function type() {
        const fullLine = textLines[lineIdx];
        
        if (isDeleting) {
            currentText = fullLine.substring(0, charIdx - 1);
            charIdx--;
        } else {
            currentText = fullLine.substring(0, charIdx + 1);
            charIdx++;
        }

        typeElement.textContent = currentText;

        let typeSpeed = isDeleting ? 30 : 60;

        if (!isDeleting && charIdx === fullLine.length) {
            typeSpeed = 2000; // Pause at end of line
            isDeleting = true;
            // Stop logic if it's the last line, just leave it there
            if(lineIdx === textLines.length - 1) {
                return; // Stop animation on last line
            }
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            lineIdx = (lineIdx + 1) % textLines.length;
            typeSpeed = 500; // Pause before new line
        }

        setTimeout(type, typeSpeed);
    }
    
    setTimeout(type, 1000); // Start delay
  }

  // Name Decrypt Animation
  function initDecryptAnimation() {
      const nameElement = document.getElementById("hacker-name");
      if(!nameElement) return;
      
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
      let interval = null;

      function triggerEffect(target) {
          let iteration = 0;
          clearInterval(interval);
          
          interval = setInterval(() => {
              target.innerText = target.innerText
              .split("")
              .map((letter, index) => {
                  if(index < iteration) {
                      return target.dataset.value[index];
                  }
                  return letters[Math.floor(Math.random() * 43)];
              })
              .join("");
              
              if(iteration >= target.dataset.value.length){ 
              clearInterval(interval);
              }
              
              iteration += 1 / 3;
          }, 30);
      }
      
      // Trigger on hover
      nameElement.onmouseover = event => triggerEffect(event.target);
      // Trigger once on load
      setTimeout(() => triggerEffect(nameElement), 500);
  }

  // Initialize on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    initDecryptAnimation();
    const canvas = document.getElementById('particles');
    if (canvas) {
      new DataNetwork(canvas);
    }

    typeWriter();
  
    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Add CSS for fade-in elements dynamically
    const style = document.createElement('style');
    style.innerHTML = `
      .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
      }
      .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
    
    // Apply fade-in to elements
    const elementsToAnimate = document.querySelectorAll('.experience-item, .skill-category, .project-card');
    elementsToAnimate.forEach(el => {
      el.classList.add('fade-in');
      observer.observe(el);
    });
  });
