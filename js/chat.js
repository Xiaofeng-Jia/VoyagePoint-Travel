const modal = document.getElementById('chatWidget');
const startBtn = document.getElementById('startChat');
const chatMessage = document.getElementById('chatMessage');
const chatOptions = document.getElementById('chatOptions');
const closeBtn = document.getElementById('closeChat');
const minimizeBtn = document.getElementById('minimizeChat');

const nostalgiaSteps = [
  {
    message: `Hey! I’m Amy, your travel agency. I was just listening to my favorite mixtape on my Walkman and daydreaming about beaches and neon sunsets. I love planning trips — it makes life feel like an MTV music video. Tell me… what kind of getaway are you in the mood for?`,
    options: ["Something totally chill.", "I’m looking for an adventure.", "Just browsing, thanks."]
  },
  {
    message: `A chill trip sounds like the perfect vibe. Sometimes I just want to grab a cassette camera and relax somewhere the only decision is which song to play next. Beachy sunshine? Or somewhere quiet where you can just journal and breathe?`,
    options: ["Beach, please!", "Low-key is the way to be.", "Other options."]
  },
  {
    message: `Beaches! Yes! The ocean always makes me feel like life is bigger than this tiny town I’m in. Miami and Hawaii are both on my ‘places to escape to before turning 21’ list. Which one sounds more like you?`,
    options: ["Hawaii", "Miami", "Somewhere else"]
  },
  {
    message: `Miami is so cool — palm trees, night breeze, and dancing with friends until your hair smells like ocean air. I know a hotel there with a rooftop pool that feels like a scene from a movie. Want me to check if we can still get in?`,
    options: ["Let’s do it!", "Not feeling it."]
  },
  {
    message: `Yesss! I’m checking now — looks like we’ve still got a chance! I’ll send you everything — like passing notes in class but way cooler. Thanks for dreaming with me. Talk soon, I’ll bring the mixtape.`,
    options: []
  }
];

const robotSteps = [
  {
    message: `Hi there! I’m Amy. I’d love to help you find your next trip. What kind of travel experience are you hoping for today?`,
    options: ["Relaxing trip", "Adventurous trip", "Just browsing"]
  },
  {
    message: `No problem! Would you like a beach getaway, or something more quiet and secluded?`,
    options: ["Beach destination", "Secluded destination", "Other options."]
  },
  {
    message: `I have a few tropical ideas in mind — for example, Miami or Hawaii. Which would you like to explore?`,
    options: ["Hawaii", "Miami", "Somewhere else"]
  },
  {
    message: `Miami is lovely — there’s a package with a rooftop pool and gorgeous views. Would you like me to check whether it's available?`,
    options: ["Yes, check availability", "No, show me something else."]
  },
  {
    message: `Great news — there’s still availability. To move forward, I’ll need a few details from you. I’ll email you all the details shortly. Thank you! Hope to talk again soon.`,
    options: []
  }
];

// Correct answers for each dialog (1-based in spec -> convert to 0-based indices)
const nostalgiaAnswers = [0, 0, 1, 0]; // corresponds to steps 1..4
const robotAnswers = [0, 0, 1, 0];

function getAnswers() {
  const script = document.body.getAttribute('data-script');
  return script === 'robot' ? robotAnswers : nostalgiaAnswers;
}

function getSteps() {
  const script = document.body.getAttribute('data-script');
  return script === 'robot' ? robotSteps : nostalgiaSteps;
}

let stepIndex = 0;
// history holds rendered messages so reopening the dialog shows past conversation
let history = [];
let lastPushedStep = -1; // track which system steps we've already pushed into history

function openModal() {
  // do not reset stepIndex or history so previous dialog is visible
  // if no history yet, render the current step which will push its system message
  renderStep();
  modal.classList.remove('hidden');
  // ensure it's expanded when opened
  modal.classList.remove('minimized');
}

function closeModal() {
  modal.classList.add('hidden');
}

function renderHistory() {
  chatMessage.innerHTML = '';
  history.forEach(item => {
    const el = document.createElement('div');
    el.className = 'msg ' + (item.type === 'user' ? 'user' : 'system');
    el.textContent = item.text;
    chatMessage.appendChild(el);
  });
  // scroll to bottom
  chatMessage.scrollTop = chatMessage.scrollHeight;
}

function renderStep() {
  const steps = getSteps();
  const step = steps[stepIndex];

  // push system message for this step into history if not yet pushed
  if (lastPushedStep < stepIndex) {
    history.push({ type: 'system', text: step.message });
    lastPushedStep = stepIndex;
  }

  renderHistory();
  chatOptions.innerHTML = '';

  if (step.options && step.options.length) {
    step.options.forEach((opt, index) => {
      const btn = document.createElement('button');
      btn.textContent = opt;
      // store index for validation
      btn.dataset.index = index;
      btn.addEventListener('click', () => handleOption(index, btn));
      chatOptions.appendChild(btn);
    });
  } else {
    // final message — show a simple acknowledgment in options area
    const done = document.createElement('div');
    done.textContent = '— End of dialog — Thank you!';
    done.className = 'end';
    chatOptions.appendChild(done);
  }
}

function handleOption(selectedIndex, btnEl) {
  const steps = getSteps();
  const answers = getAnswers();
  const correct = answers[stepIndex];

  // If no correct answer specified for this step, allow progression
  if (typeof correct === 'undefined') {
    if (stepIndex < steps.length - 1) {
      stepIndex += 1;
      renderStep();
    } else {
      closeModal();
    }
    return;
  }

  if (selectedIndex === correct) {
    // record user selection in history
    const step = steps[stepIndex];
    history.push({ type: 'user', text: step.options[selectedIndex] });

    // correct — advance
    if (stepIndex < steps.length - 1) {
      stepIndex += 1;
      renderStep();
    } else {
      // push final system message into history (if not already pushed) then close
      // renderStep will handle pushing the final system message if appropriate
      renderStep();
      // optionally keep the modal open so user can see final message; close after short delay
      setTimeout(() => closeModal(), 1000);
    }
  } else {
    // incorrect — no action (click has no effect)
    return;
  }
}

startBtn && startBtn.addEventListener('click', openModal);
closeBtn && closeBtn.addEventListener('click', closeModal);
minimizeBtn && minimizeBtn.addEventListener('click', () => {
  modal.classList.toggle('minimized');
});
