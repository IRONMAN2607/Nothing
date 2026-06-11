(function () {
  'use strict';

  /* -----------------------------------------------------------------
     DOM CACHE — query once, reuse everywhere
     ----------------------------------------------------------------- */
  const sceneButton = document.getElementById('sceneButton');
  const hint = document.getElementById('hint');
  const messageScene = document.getElementById('messageScene');
  const fineScene = document.getElementById('fineScene');
  const envelopeScene = document.getElementById('envelopeScene');
  const smallText = document.getElementById('smallText');
  const mainText = document.getElementById('mainText');
  const envelope = document.getElementById('envelope');
  const ambientContainer = document.getElementById('ambientContainer');
  const frontEyebrow = document.getElementById('frontEyebrow');
  const frontTitle = document.getElementById('frontTitle');
  const cardFront = document.getElementById('cardFront');

  let step = 0;
  let autoFlipTimer;
  /** Intentional debounce flag — prevents rapid clicks from skipping animation steps */
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

  /* -----------------------------------------------------------------
     UTILITY FUNCTIONS
     ----------------------------------------------------------------- */

  function setHint(text) {
    hint.textContent = text;
    hint.classList.remove('changing');
    void hint.offsetWidth;
    hint.classList.add('changing');
    window.setTimeout(function () {
      hint.classList.remove('changing');
    }, 380);
  }

  function setMessage(eyebrow, title) {
    smallText.textContent = eyebrow;
    mainText.textContent = title;
    messageScene.classList.remove('changing');
    void messageScene.offsetWidth;
    messageScene.classList.add('changing');
    window.setTimeout(function () {
      messageScene.classList.remove('changing');
    }, 440);
  }

  function showScene(scene) {
    var scenes = [messageScene, fineScene, envelopeScene];
    for (var i = 0; i < scenes.length; i++) {
      var isActive = scenes[i] === scene;
      scenes[i].classList.toggle('active', isActive);
      scenes[i].setAttribute('aria-hidden', String(!isActive));
    }
  }

  function setBusy(duration) {
    busy = true;
    window.setTimeout(function () {
      busy = false;
    }, duration || 500);
  }

  /* -----------------------------------------------------------------
     BURST PARTICLES — uses DocumentFragment for batch DOM insertion
     ----------------------------------------------------------------- */

  function burstSeal() {
    var rect = sceneButton.getBoundingClientRect();
    var centerX = rect.width / 2;
    var centerY = rect.height * 0.47;
    var fragment = document.createDocumentFragment();
    var particles = [];

    for (var i = 0; i < 16; i++) {
      var bit = document.createElement('span');
      var angle = (Math.PI * 2 * i) / 16;
      var distance = 54 + Math.random() * 36;
      bit.className = 'burst';
      bit.style.left = centerX + 'px';
      bit.style.top = centerY + 'px';
      bit.style.setProperty('--x', Math.cos(angle) * distance + 'px');
      bit.style.setProperty('--y', Math.sin(angle) * distance + 'px');
      fragment.appendChild(bit);
      particles.push(bit);
    }

    sceneButton.appendChild(fragment);

    // Single cleanup timer instead of 16 individual timers
    window.setTimeout(function () {
      for (var j = 0; j < particles.length; j++) {
        if (particles[j].parentNode) {
          particles[j].parentNode.removeChild(particles[j]);
        }
      }
    }, 760);
  }

  /* -----------------------------------------------------------------
     AUTO-FLIP TIMER
     ----------------------------------------------------------------- */

  function scheduleAutoFlip() {
    window.clearTimeout(autoFlipTimer);
    autoFlipTimer = window.setTimeout(function () {
      if (step === 6) {
        advance(true);
      }
    }, 3400);
  }

  /* -----------------------------------------------------------------
     MAIN STATE MACHINE
     ----------------------------------------------------------------- */

  function advance(isAuto) {
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

      window.setTimeout(function () {
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

  /* -----------------------------------------------------------------
     TYPING ANIMATION — uses cached DOM refs
     ----------------------------------------------------------------- */

  function startTypingAnimation() {
    // Start after the card flip completes (approx 750ms into the 1200ms flip animation)
    window.setTimeout(function () {
      // 1. Backspace frontTitle ("nothing here")
      var titleText = frontTitle.textContent;
      var titleInterval = window.setInterval(function () {
        if (titleText.length > 0) {
          titleText = titleText.slice(0, -1);
          frontTitle.textContent = titleText;
        } else {
          window.clearInterval(titleInterval);

          // 2. Backspace frontEyebrow ("told you")
          var eyebrowText = frontEyebrow.textContent;
          var eyebrowInterval = window.setInterval(function () {
            if (eyebrowText.length > 0) {
              eyebrowText = eyebrowText.slice(0, -1);
              frontEyebrow.textContent = eyebrowText;
            } else {
              window.clearInterval(eyebrowInterval);

              // 3. Switch cardFront to cursive mode styles
              cardFront.classList.add('cursive-mode');

              // 4. Type "you're welcome" into frontEyebrow character by character
              var targetEyebrowText = "you're welcome";
              var eyebrowIndex = 0;
              var typeEyebrowInterval = window.setInterval(function () {
                if (eyebrowIndex < targetEyebrowText.length) {
                  frontEyebrow.textContent += targetEyebrowText[eyebrowIndex];
                  eyebrowIndex++;
                } else {
                  window.clearInterval(typeEyebrowInterval);

                  // 5. Type "- Angad" into frontTitle character by character
                  var targetTitleText = "- Angad";
                  var titleIndex = 0;
                  var typeTitleInterval = window.setInterval(function () {
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

  /* -----------------------------------------------------------------
     MAGICAL THEME — background dewdrop effects
     ----------------------------------------------------------------- */

  function triggerMagicalTheme() {
    document.body.classList.add('magical-theme');

    // Vibrant color palette for dewdrops
    var colors = [
      '#ff4f9d', // Pink glow
      '#7c69ff', // Violet glow
      '#ffb84d', // Gold glow
      '#ff75ac', // Rose glow
      '#69f0ae'  // Mint glow
    ];

    // 1. Generate 4 background dewdrops in the body
    for (var i = 0; i < 4; i++) {
      createDewdrop(ambientContainer, colors[i % colors.length], false);
    }

    // 2. Generate 3 glowing dewdrops inside the card scene panel
    for (var j = 0; j < 3; j++) {
      createDewdrop(sceneButton, colors[(j + 2) % colors.length], true);
    }
  }

  /* -----------------------------------------------------------------
     DEWDROP CREATION — batched style assignment
     ----------------------------------------------------------------- */

  function createDewdrop(parent, color, isPanel) {
    var dew = document.createElement('div');
    dew.className = 'dewdrop-patch';

    // Random sizing: background dewdrops can be larger, panel dewdrops smaller
    var minSize = isPanel ? 150 : 250;
    var maxSize = isPanel ? 280 : 450;
    var size = minSize + Math.random() * (maxSize - minSize);

    var left = Math.random() * 100;
    var top = Math.random() * 100;
    var delay = Math.random() * 600;

    // Batch all style assignments at once to minimize style recalculations
    Object.assign(dew.style, {
      width: size + 'px',
      height: size + 'px',
      background: 'radial-gradient(circle, ' + color + ' 0%, rgba(255,255,255,0) 70%)',
      left: left + '%',
      top: top + '%',
      animationDelay: delay + 'ms'
    });

    parent.appendChild(dew);
  }

  /* -----------------------------------------------------------------
     EVENT LISTENERS
     ----------------------------------------------------------------- */

  sceneButton.addEventListener('pointerup', function (event) {
    event.preventDefault();
    advance(false);
  });

  sceneButton.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      advance(false);
    }
  });

  /* -----------------------------------------------------------------
     INITIALIZATION
     ----------------------------------------------------------------- */

  setHint(hints[0]);

})();
