const sceneButton = document.getElementById('sceneButton');
const hint = document.getElementById('hint');
const messageScene = document.getElementById('messageScene');
const fineScene = document.getElementById('fineScene');
const envelopeScene = document.getElementById('envelopeScene');
const smallText = document.getElementById('smallText');
const mainText = document.getElementById('mainText');
const envelope = document.getElementById('envelope');

let step = 0;
let autoFlipTimer;
let busy = false;

const hints = [
  '',
  '',
  '',
  'Break the Amber Seal',
  '',
  '',
  '',
  ''
];

function setHint(text) {
  hint.textContent = text;
  hint.classList.remove('changing');
  void hint.offsetWidth;
  hint.classList.add('changing');
  window.setTimeout(() => {
    hint.classList.remove('changing');
  }, 380);
}

function setMessage(eyebrow, title) {
  smallText.textContent = eyebrow;
  mainText.textContent = title;
  messageScene.classList.remove('changing');
  void messageScene.offsetWidth;
  messageScene.classList.add('changing');
  window.setTimeout(() => {
    messageScene.classList.remove('changing');
  }, 440);
}

function showScene(scene) {
  [messageScene, fineScene, envelopeScene].forEach((item) => {
    const isActive = item === scene;
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-hidden', String(!isActive));
  });
}

function setBusy(duration = 500) {
  busy = true;
  window.setTimeout(() => {
    busy = false;
  }, duration);
}

function burstSeal() {
  const rect = sceneButton.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height * 0.47;

  for (let i = 0; i < 16; i += 1) {
    const bit = document.createElement('span');
    const angle = (Math.PI * 2 * i) / 16;
    const distance = 54 + Math.random() * 36;
    bit.className = 'burst';
    bit.style.left = `${centerX}px`;
    bit.style.top = `${centerY}px`;
    bit.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    bit.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
    sceneButton.appendChild(bit);
    window.setTimeout(() => bit.remove(), 760);
  }
}

function scheduleAutoFlip() {
  window.clearTimeout(autoFlipTimer);
  autoFlipTimer = window.setTimeout(() => {
    if (step === 6) {
      advance(true);
    }
  }, 3400);
}

function advance(isAuto = false) {
  if (busy && !isAuto) return;

  step += 1;
  window.clearTimeout(autoFlipTimer);

  if (step === 1) {
    setMessage('Told you,', "nothing interesting, don't click");
    setHint(hints[1]);
    setBusy(360);
    return;
  }

  if (step === 2) {
    setMessage('', 'Fine.');
    setHint(hints[2]);
    setBusy(360);
    return;
  }

  if (step === 3) {
    showScene(fineScene);
    fineScene.classList.add('morphing');
    setHint('');
    setBusy(980);

    window.setTimeout(() => {
      showScene(envelopeScene);
      setHint(hints[3]);
      triggerMagicalTheme();
    }, 700);
    return;
  }

  if (step === 4) {
    envelope.classList.add('seal-broken');
    burstSeal();
    setHint(hints[4]);
    setBusy(620);
    return;
  }

  if (step === 5) {
    envelope.classList.add('opened');
    setHint(hints[5]);
    setBusy(820);
    return;
  }

  if (step === 6) {
    envelope.classList.add('card-out');
    setHint(hints[6]);
    scheduleAutoFlip();
    setBusy(960);
    return;
  }

  if (step === 7) {
    envelope.classList.add('card-flipped');
    setHint(hints[7]);
    setBusy(1300);
    return;
  }

  if (step === 8) {
    envelope.classList.add('final-flipped');
    setHint('');
    sceneButton.setAttribute('aria-label', 'Birthday card revealed');
    setBusy(5000);
    startTypingAnimation();
    return;
  }

  if (step > 8) {
    step = 8;
  }
}

function startTypingAnimation() {
  const frontEyebrow = document.getElementById('frontEyebrow');
  const frontTitle = document.getElementById('frontTitle');
  const cardFront = document.getElementById('cardFront');

  // Start after the card flip completes (approx 750ms into the 1200ms flip animation)
  window.setTimeout(() => {
    // 1. Backspace frontTitle ("nothing here")
    let titleText = frontTitle.textContent;
    const titleInterval = window.setInterval(() => {
      if (titleText.length > 0) {
        titleText = titleText.slice(0, -1);
        frontTitle.textContent = titleText;
      } else {
        window.clearInterval(titleInterval);
        
        // 2. Backspace frontEyebrow ("told you")
        let eyebrowText = frontEyebrow.textContent;
        const eyebrowInterval = window.setInterval(() => {
          if (eyebrowText.length > 0) {
            eyebrowText = eyebrowText.slice(0, -1);
            frontEyebrow.textContent = eyebrowText;
          } else {
            window.clearInterval(eyebrowInterval);
            
            // 3. Switch cardFront to cursive mode styles
            cardFront.classList.add('cursive-mode');
            
            // 4. Type "you're welcome" into frontEyebrow character by character
            const targetEyebrowText = "you're welcome";
            let eyebrowIndex = 0;
            const typeEyebrowInterval = window.setInterval(() => {
              if (eyebrowIndex < targetEyebrowText.length) {
                frontEyebrow.textContent += targetEyebrowText[eyebrowIndex];
                eyebrowIndex++;
              } else {
                window.clearInterval(typeEyebrowInterval);
                
                // 5. Type "- Angad" into frontTitle character by character
                const targetTitleText = "- Angad";
                let titleIndex = 0;
                const typeTitleInterval = window.setInterval(() => {
                  if (titleIndex < targetTitleText.length) {
                    frontTitle.textContent += targetTitleText[titleIndex];
                    titleIndex++;
                  } else {
                    window.clearInterval(typeTitleInterval);
                  }
                }, 120);
              }
            }, 90);
          }
        }, 80);
      }
    }, 60);
  }, 750);
}

function triggerMagicalTheme() {
  document.body.classList.add('magical-theme');
  const ambientContainer = document.getElementById('ambientContainer');
  const sceneButton = document.getElementById('sceneButton');

  // Vibrant color palette for dewdrops
  const colors = [
    '#ff4f9d', // Pink glow
    '#7c69ff', // Violet glow
    '#ffb84d', // Gold glow
    '#ff75ac', // Rose glow
    '#69f0ae'  // Mint glow
  ];

  // 1. Generate 4 background dewdrops in the body
  for (let i = 0; i < 4; i++) {
    createDewdrop(ambientContainer, colors[i % colors.length], false);
  }

  // 2. Generate 3 glowing dewdrops inside the card scene panel (clipped inside the button)
  for (let i = 0; i < 3; i++) {
    createDewdrop(sceneButton, colors[(i + 2) % colors.length], true);
  }
}

function createDewdrop(parent, color, isPanel = false) {
  const dew = document.createElement('div');
  dew.className = 'dewdrop-patch';
  
  // Random sizing: background dewdrops can be larger, panel dewdrops smaller
  const minSize = isPanel ? 150 : 250;
  const maxSize = isPanel ? 280 : 450;
  const size = Math.floor(minSize + Math.random() * (maxSize - minSize));
  
  dew.style.width = `${size}px`;
  dew.style.height = `${size}px`;
  dew.style.background = `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 70%)`;
  
  // Random position:
  const left = Math.floor(Math.random() * 100);
  const top = Math.floor(Math.random() * 100);
  dew.style.left = `${left}%`;
  dew.style.top = `${top}%`;
  
  // Random delay to stagger the splashes
  const delay = Math.random() * 600;
  dew.style.animationDelay = `${delay}ms`;
  
  parent.appendChild(dew);
}

sceneButton.addEventListener('pointerup', (event) => {
  event.preventDefault();
  advance(false);
});

sceneButton.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    advance(false);
  }
});

setHint(hints[0]);
