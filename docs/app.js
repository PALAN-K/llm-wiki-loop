/**
 * llm-wiki-loop Showcase Application Logic
 * Interactive Terminal Typing, Dynamic Wheel Scroll Animation, and Copy handlers.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Terminal Typing Simulation
  const cmdElem = document.getElementById('typing-cmd');
  const outputElem = document.getElementById('term-output');
  const cursorElem = document.getElementById('cursor');
  const commandText = 'npx llm-wiki-loop init';
  let charIdx = 0;

  function typeCommand() {
    if (charIdx < commandText.length) {
      cmdElem.textContent += commandText.charAt(charIdx);
      charIdx++;
      setTimeout(typeCommand, 60 + Math.random() * 40);
    } else {
      setTimeout(() => {
        cursorElem.style.display = 'none';
        outputElem.style.display = 'block';
      }, 400);
    }
  }

  setTimeout(typeCommand, 800);

  // 2. Copy Command Handler
  const copyBtn = document.getElementById('btn-copy-term');
  const copyText = document.getElementById('copy-text');

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('npx llm-wiki-loop init').then(() => {
      copyText.textContent = 'Copied!';
      setTimeout(() => {
        copyText.textContent = 'Copy';
      }, 2000);
    });
  });

  // 3. Interactive Wheel / Step Switcher
  const stepButtons = document.querySelectorAll('.wheel-step');
  const displayCards = document.querySelectorAll('.display-card');
  const wheelBox = document.getElementById('wheel-interactive-box');
  let currentStep = 1;
  const totalSteps = 4;

  function setActiveStep(stepNumber) {
    currentStep = stepNumber;
    stepButtons.forEach(btn => {
      if (parseInt(btn.getAttribute('data-step')) === stepNumber) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    displayCards.forEach((card, idx) => {
      if (idx + 1 === stepNumber) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  stepButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.getAttribute('data-step'));
      setActiveStep(step);
    });
  });

  // Wheel Scroll Listener on the Wheel Interactive Box
  let isWheelThrottled = false;
  wheelBox.addEventListener('wheel', (e) => {
    // Only intercept when mouse is over the container
    if (isWheelThrottled) return;

    if (e.deltaY > 20) {
      // Scroll down
      if (currentStep < totalSteps) {
        e.preventDefault();
        setActiveStep(currentStep + 1);
        throttleWheel();
      }
    } else if (e.deltaY < -20) {
      // Scroll up
      if (currentStep > 1) {
        e.preventDefault();
        setActiveStep(currentStep - 1);
        throttleWheel();
      }
    }
  }, { passive: false });

  function throttleWheel() {
    isWheelThrottled = true;
    setTimeout(() => {
      isWheelThrottled = false;
    }, 450);
  }

  // 4. Auto-rotate steps every 5 seconds if idle
  let autoTimer = setInterval(() => {
    let nextStep = currentStep >= totalSteps ? 1 : currentStep + 1;
    setActiveStep(nextStep);
  }, 4500);

  wheelBox.addEventListener('mouseenter', () => {
    clearInterval(autoTimer);
  });
});
