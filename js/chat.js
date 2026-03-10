/* ================================================================
   VoyagePoint Travel — Chat Engine  (async / sequential)
   Supports: typing delays, wait pauses, GIFs, loading bars,
             soft prompts, store_response_only, continue_anyway
   ================================================================ */

const modal       = document.getElementById('chatWidget');
const startBtn    = document.getElementById('startChat');
const chatMessage = document.getElementById('chatMessage');
const chatOptions = document.getElementById('chatOptions');
const closeBtn    = document.getElementById('closeChat');
const minimizeBtn = document.getElementById('minimizeChat');

/* ── Step definitions ──────────────────────────────────────────── */

const nostalgiaFlow = [
  // — intro —
  { message: `Amy: Hi! I'm Amy, your travel-planning partner at VoyagePoint Travel.`},
  { message: `Amy: We specialize in nostalgia-centered travel —\nhelping people revisit meaningful destinations\nand relive important moments from earlier chapters of their lives.`,
    typing: 6000 },
  { message: `Amy: Unlike traditional travel agencies that focus mainly on flights and hotels,`,
    typing: 5000 },
  { message: `we also design nostalgia-rich experiences at the destination —`,
    typing: 5000 },
  { message: `such as revisiting meaningful landmarks,\nrecreating favorite routines,\nand finding places that still carry the same atmosphere.`,
    typing: 6000,
    show_gif: 'nostalgia.gif' },

  // — music soft-prompt —
  { message: `Amy: Before we continue —\ndoes music ever bring back memories for you?`,
    typing: 6000,
    soft_prompt: true,
    options: ['Very often', 'Sometimes', 'Rarely', 'Almost never'],
    store_response_only: true,
    continue_anyway: true },

  // — nostalgia bridge —
  { message: `Amy: Wonderful — we're from the same generation.`,
    typing: 5000 },
  { message: `Amy: Many of us grew up listening to songs like\n🎵 [Song 1] 🎵 [Song 2] 🎵 [Song 3]`,
    typing: 6000 },
  { message: `Amy: Traveling while listening to these songs\ncan make the experience even more meaningful and fun.`,
    typing: 6000,
    wait: 1200 },
  { message: `Amy: Take a moment to picture that trip you just mentioned.`,
    typing: 6000,
    wait: 2000 },
  { message: `Amy: Next, I'll ask a few questions\nto help us design your nostalgic journey.`,
    typing: 6000 },

  // — survey —
  { message: `Amy: What makes that travel experience feel nostalgic to you?\n(Please select one.)`,
    typing: 6000,
    options: [
      'It reminds me of an earlier, meaningful time in my life',
      'It brings back warm memories of the people and moments',
      'It makes me feel connected to who I was during that period'
    ],
    store_response_only: true },
  { message: `Amy: What season did you travel there?`,
    typing: 6000,
    options: ['Spring', 'Summer', 'Fall', 'Winter'],
    store_response_only: true },
  { message: `Amy: Who were you traveling with?`,
    typing: 6000,
    options: ['Family', 'Friends', 'Romantic partner', 'Alone'],
    store_response_only: true },
  { message: `Amy: Thinking back, what was the approximate budget range (in today's dollars)?`,
    typing: 6000,
    options: [
      'A. Not sure',
      'B. Under $1,000',
      'C. $1,000–$3,000',
      'D. $3,000–$6,000',
      'E. $6,000+'
    ],
    store_response_only: true },

  // — closing —
  { message: `Amy: Thank you for sharing these memories.`,
    typing: 5000 },
  { message: `Amy: I'm excited to help you recreate that meaningful journey.`,
    typing: 5000 },
  { message: `Amy: Based on the destination you shared,\nI will design a complete travel plan —\nincluding transportation, accommodations,\nand nostalgia-rich experiences at the location.`,
    typing: 6000 },
  { message: `Amy: I'll put everything together and return shortly\nwith your personalized nostalgia-centered travel plan.`,
    typing: 6000 }
];

const robotFlow = [
  // — intro —
  { message: `Amy: Hi! I'm Amy, your travel-planning partner at VoyagePoint Travel.`},
  { message: `Amy: We specialize in technology-driven travel planning — helping people make efficient, informed decisions using real-time data and smart tools.`,
    typing: 6000 },
  { message: `Amy: Unlike traditional travel agencies that rely mainly on manual coordination,`,
    typing: 5000 },
  { message: `we use up-to-date travel insights, optimized routing systems, and smart filtering tools`,
    typing: 5000 },
  { message: `to create practical, well-structured travel plans.`,
    typing: 6000,
    show_gif: 'modern.gif' },

  // — music soft-prompt —
  { message: `Amy: Before we continue —\ndoes music ever bring back memories for you?`,
    typing: 6000,
    soft_prompt: true,
    options: ['Very often', 'Sometimes', 'Rarely', 'Almost never'],
    store_response_only: true,
    continue_anyway: true },

  // — bridge —
  { message: `Amy: Traveling while listening to your favorite songs can make the experience more enjoyable and fun.`,
    typing: 5000 },
  { message: `Amy: These days, many people enjoy music like\n🎵 [Song 1] 🎵 [Song 2] 🎵 [Song 3]`,
    typing: 5000 },
  { message: `Amy: Take a moment to think about the destination you just mentioned.`,
    typing: 6000,
    wait: 1500 },
  { message: `Amy: Next, I'll ask a few quick questions\nto build the most effective and efficient plan for your future travel.`,
    typing: 6000,
    wait: 1500 },

  // — survey —
  { message: `Amy: What is most important to you when planning this trip?\n(Please select one.)`,
    typing: 6000,
    options: [
      'Finding the most efficient and cost-effective options',
      'Having clear, up-to-date information to make confident decisions',
      'Creating a well-organized itinerary that fits your schedule and goals'
    ],
    store_response_only: true },
  { message: `Amy: What season are you planning to travel?`,
    typing: 6000,
    options: ['Spring', 'Summer', 'Fall', 'Winter'],
    store_response_only: true },
  { message: `Amy: Who will you be traveling with?`,
    typing: 6000,
    options: ['Family', 'Friends', 'Romantic partner', 'Alone'],
    store_response_only: true },
  { message: `Amy: What is your approximate budget range?`,
    typing: 6000,
    options: [
      'A. Not sure',
      'B. Under $1,000',
      'C. $1,000–$3,000',
      'D. $3,000–$6,000',
      'E. $6,000+'
    ],
    store_response_only: true },

  // — closing —
  { message: `Amy: Thank you for sharing your preferences.`,
    typing: 5000 },
  { message: `Amy: Based on the destination and details you provided,\nI will design a complete travel plan —\nincluding transportation, accommodations,\nand optimized activity recommendations tailored to your needs.`,
    typing: 6000 },
  { message: `Amy: I'll organize everything and get back to you shortly\nwith your personalized, data-informed travel plan.`,
    typing: 6000 }
];

/* ── State ─────────────────────────────────────────────────────── */

let stepIndex   = 0;
let flowStarted = false;
const storedResponses = {};

function getSteps () {
  const s = document.body.getAttribute('data-script') || 'nostalgia';
  return s === 'robot' ? robotFlow : nostalgiaFlow;
}

/* ── DOM helpers ───────────────────────────────────────────────── */

function scrollBottom () { chatMessage.scrollTop = chatMessage.scrollHeight; }

function delay (ms) { return new Promise(r => setTimeout(r, ms)); }

function addBubble (text, cls) {
  const el = document.createElement('div');
  el.className = 'msg ' + cls;
  text.split('\n').forEach((line, i) => {
    if (i > 0) el.appendChild(document.createElement('br'));
    el.appendChild(document.createTextNode(line));
  });
  chatMessage.appendChild(el);
  scrollBottom();
  return el;
}

function addGif (src) {
  const img = document.createElement('img');
  img.src  = 'images/' + src;
  img.alt  = src;
  img.style.maxWidth = '100%';
  img.style.display  = 'block';
  img.style.margin   = '8px 0';
  chatMessage.appendChild(img);
  scrollBottom();
}

function showTyping () {
  const el = document.createElement('div');
  el.className = 'msg system typing';
  el.textContent = 'Amy is typing\u2026';
  el.id = '_typing';
  chatMessage.appendChild(el);
  scrollBottom();
}

function hideTyping () {
  const el = document.getElementById('_typing');
  if (el && el.parentNode) el.parentNode.removeChild(el);
}

function clearOptions () { chatOptions.innerHTML = ''; }

/* ── Loading bar (returns a Promise that resolves when done) ─── */

function showLoadingBar (cfg) {
  return new Promise(resolve => {
    const wrap = document.createElement('div');
    wrap.style.margin = '10px 0';

    const lbl = document.createElement('div');
    lbl.textContent    = cfg.text || 'Loading\u2026';
    lbl.style.fontSize = '0.9em';
    lbl.style.marginBottom = '4px';

    const outer = document.createElement('div');
    outer.style.cssText =
      'width:100%;background:#eee;height:8px;border-radius:4px;overflow:hidden';

    const inner = document.createElement('div');
    inner.style.cssText =
      'width:0%;height:100%;background:#4a90e2;border-radius:4px;transition:width 50ms linear';

    outer.appendChild(inner);
    wrap.appendChild(lbl);
    wrap.appendChild(outer);
    chatMessage.appendChild(wrap);
    scrollBottom();

    const dur   = cfg.duration || 1500;
    const start = Date.now();
    const tick  = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / dur) * 100);
      inner.style.width = pct + '%';
      if (pct >= 100) { clearInterval(tick); setTimeout(resolve, 400); }
    }, 40);
  });
}

/* ── Core flow engine (fully sequential via async / await) ───── */

async function runStep () {
  const steps = getSteps();
  if (stepIndex >= steps.length) return;

  const step = steps[stepIndex];
  clearOptions();

  /* 1 — typing indicator */
  if (step.typing) {
    showTyping();
    await delay(step.typing);
    hideTyping();
  }

  /* 2 — show message bubble */
  addBubble(step.message, 'system');

  /* 3 — show GIF right after bubble */
  if (step.show_gif) addGif(step.show_gif);

  /* 4 — wait / reflection pause */
  if (step.wait) await delay(step.wait);

  /* 5 — loading bar (auto-advances when animation finishes) */
  if (step.show_loading_bar) {
    await showLoadingBar(step.show_loading_bar);
    if (stepIndex < steps.length - 1) { stepIndex++; return runStep(); }
    showEnd();
    return;
  }

  /* 6 — interactive step (has options) → show buttons & wait for click */
  if (step.options && step.options.length) {
    showButtons(step);
    return;                       // flow pauses here; handleOption resumes
  }

  /* 7 — narrative step (no options) → auto-advance to next */
  if (stepIndex < steps.length - 1) { stepIndex++; return runStep(); }

  /* 8 — very last step with no options → done */
  showEnd();
}

/* ── Render option buttons ────────────────────────────────────── */

function showButtons (step) {
  clearOptions();
  step.options.forEach((label, i) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    if (step.soft_prompt) btn.classList.add('soft');
    btn.addEventListener('click', () => handleOption(i));
    chatOptions.appendChild(btn);
  });
}

/* ── Handle user selection ────────────────────────────────────── */

function handleOption (idx) {
  const steps = getSteps();
  const step  = steps[stepIndex];

  // always store internally
  storedResponses[stepIndex] = { index: idx, value: step.options[idx] };

  // show user bubble only when NOT store_response_only
  if (!step.store_response_only) {
    addBubble(step.options[idx], 'user');
  }

  clearOptions();

  // advance
  if (stepIndex < steps.length - 1) {
    stepIndex++;
    runStep();
  } else {
    showEnd();
  }
}

/* ── End-of-dialog marker ─────────────────────────────────────── */

function showEnd () {
  clearOptions();
  const d = document.createElement('div');
  d.textContent = '— End of dialog — Thank you!';
  d.className   = 'end';
  chatOptions.appendChild(d);
}

/* ── Modal controls ───────────────────────────────────────────── */

function openModal () {
  modal.classList.remove('hidden');
  modal.classList.remove('minimized');
  if (!flowStarted) { flowStarted = true; runStep(); }
}

function closeModal () { modal.classList.add('hidden'); }

startBtn    && startBtn.addEventListener('click', openModal);
closeBtn    && closeBtn.addEventListener('click', closeModal);
minimizeBtn && minimizeBtn.addEventListener('click', () => {
  modal.classList.toggle('minimized');
});
