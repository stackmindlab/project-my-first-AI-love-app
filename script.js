// =====================
// Cute pet GIF pools (local files)
// =====================
const catGIFs = [
  "img/cat1.gif",
  "img/cat2.gif",
  "img/cat3.gif"
];
const puppyGIFs = [
  "img/puppy1.gif",
  "img/puppy2.gif",
  "img/puppy3.gif"
];

function pickRandomGIF() {
  const pool = Math.random() < 0.5 ? catGIFs : puppyGIFs;
  return pool[Math.floor(Math.random() * pool.length)];
}

// =====================
// Pet names (ES + EN)
// =====================
const petNamesES = [
  "Mi amor", "Cariño", "Tesoro", "Papi", "Mi vida",
  "Corazón", "Bebé", "Amorcito", "Rey", "Cielo", "Amor"
];
const petNamesEN = [
  "Love", "Honey", "Sweetheart", "Baby", "My love",
  "Darling", "Cutie", "Babe", "King", "Sunshine"
];

// =====================
// Emojis (changes per step)
// =====================
const emojis = ["🥺","🤭","😍","🙃","😏","😜","💖","💘","😘","💞"];
function pickEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// =====================
// Language detection + name
// =====================
const qs = new URLSearchParams(location.search);
let LANG = (qs.get("lang") || "").toLowerCase();
if (!["es", "en"].includes(LANG)) {
  LANG = navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}
const customName = (qs.get("name") || "").trim();

function pickPetName() {
  if (customName) return customName;
  const pool = LANG === "en" ? petNamesEN : petNamesES;
  return pool[Math.floor(Math.random() * pool.length)];
}

// =====================
// Text bundles (your lines in ES + natural EN)
// =====================
const TEXTS = {
  es: {
    yes: "SÍ",
    no: "NO",
    successTitle: "¡GRACIAS POR DECIR QUE SÍ! ✨",
    successSub: "Te amo mucho ❤️",
    successBtn: "Volver al inicio",
    steps: [
      (n)=>`Oye, ${n}… te extraño. Si el corazón te dice “sí”, guárdalo ahí. ✨`,
      (n)=>`Significas muchísimo para mí, ${n}. Al respirar, ¿aparece un “sí” bajito? 💛`,
      (n)=>`Hoy te necesito un poquito, ${n}. En tu mente ¿sí o no? 🌙`,
      (n)=>`Imagina que escuchas mi voz un minuto, ${n}. ¿Se siente bien decir “sí” por dentro? 🎧`,
      (n)=>`Si el pecho se suaviza al pensar en nosotros, es una pista, ${n}. 💫`,
      (n)=>`Me importas más de lo que imaginas, ${n}. ¿Cuál es tu respuesta sincera solo en tu cabeza? 🌿`,
      (n)=>`Te extraño, ${n}. Si el “sí” parpadea aunque sea poquito, guárdalo para mí. 💗`,
      (n)=>`Eres importante para mí, ${n}. Deja que la intuición elija antes que la mente. ¿Es “sí”? 🌟`,
      (n)=>`Último latido, ${n}¿qué palabra ya está diciendo tu corazón? 😌`,
    ]
  },
  en: {
    yes: "YES",
    no: "NO",
    successTitle: "THANK YOU FOR SAYING YES! ✨",
    successSub: "I love you so much ❤️",
    successBtn: "Back to start",
    steps: [
      (n)=>`Hey, ${n}… I miss you. If your heart whispers “yes,” hold it there. ✨`,
      (n)=>`You mean so much to me, ${n}. When you breathe, does a quiet “yes” appear? 💛`,
      (n)=>`I need you a little today, ${n}. In your mind yes or no? 🌙`,
      (n)=>`Imagine hearing my voice for a minute, ${n}. Does an inside “yes” feel right? 🎧`,
      (n)=>`If your chest softens when you think of us, that’s a hint, ${n}. 💫`,
      (n)=>`I care more than you know, ${n}. What’s your honest answer just in your head? 🌿`,
      (n)=>`I miss you, ${n}. If “yes” flickers even a bit, keep it safe for me. 💗`,
      (n)=>`You’re important to me, ${n}. Let intuition choose before logic. Is it yes? 🌟`,
      (n)=>`One last heartbeat check, ${n}what’s the word your heart’s already saying? 😌`,
    ]
  }
};

// Build steps for the current language
function buildSteps(){
  const name = pickPetName();
  return TEXTS[LANG].steps.map(fn => ({
    title: fn(name),
    img: pickRandomGIF(),
    sub: ""
  }));
}

// =====================
// DOM elements (match your HTML ids)
// =====================
const titleEl   = document.getElementById("title");
const emojiEl   = document.getElementById("emoji");
const subEl     = document.getElementById("subtitle");
const imgEl     = document.getElementById("kitty");
const yesBtn    = document.getElementById("yesBtn");
const noBtn     = document.getElementById("noBtn");
const dotsEl    = document.getElementById("progress");

// set button labels initially
function setUIByLang(){
  yesBtn.textContent = TEXTS[LANG].yes;
  noBtn.textContent  = TEXTS[LANG].no;
}

// Language toggle button with clear label
(function addLangToggle(){
  const btn = document.createElement("button");
  btn.textContent = LANG === "es" ? "English" : "Español";
  Object.assign(btn.style, {
    position:"fixed", right:"14px", top:"12px", zIndex:99,
    padding:"8px 12px", borderRadius:"999px", border:"1px solid rgba(255,255,255,.2)",
    background:"rgba(255,255,255,.12)", color:"#fff", cursor:"pointer", fontWeight:"700",
    backdropFilter:"blur(8px)"
  });
  btn.addEventListener("click", ()=>{
    LANG = (LANG === "es") ? "en" : "es";
    // update URL for shareable language
    const u = new URL(location.href);
    u.searchParams.set("lang", LANG);
    history.replaceState({}, "", u.toString());
    // rebuild steps + refresh labels
    STEPS.length = 0;
    buildSteps().forEach(s => STEPS.push(s));
    setUIByLang();
    render();
    btn.textContent = LANG === "es" ? "English" : "Español";
  });
  document.body.appendChild(btn);
})();

// =====================
// State & render
// =====================
const STEPS = buildSteps();
let idx = 0;
let dodgeEnabled = false;

function drawDots(current){
  dotsEl.innerHTML="";
  for(let i=0;i<STEPS.length;i++){
    const dot=document.createElement("span");
    dot.className="dot" + (i===current?" active":"");
    dotsEl.appendChild(dot);
  }
}

function setImage(src){
  // Simple setter; local files should work. Add onerror fallback if needed.
  imgEl.src = src;
}

function resetNoPos(){
  noBtn.style.position = "";
  noBtn.style.left = "";
  noBtn.style.top = "";
  noBtn.style.transform = "";
}

function render(){
  const s = STEPS[idx];
  setImage(s.img);
  titleEl.textContent = s.title;
  emojiEl.textContent = pickEmoji();
  subEl.textContent   = s.sub;
  drawDots(idx);

  // Last step: make NO slippery (unclickable), but visible
  dodgeEnabled = (idx === STEPS.length - 1);
  if (!dodgeEnabled) resetNoPos();
}

// =====================
// YES / NO handlers
// =====================
function addRipple(e){
  const ripple=document.createElement("span");
  ripple.className="ripple";
  const rect=e.target.getBoundingClientRect();
  ripple.style.left=(e.clientX - rect.left)+"px";
  ripple.style.top=(e.clientY - rect.top)+"px";
  e.target.appendChild(ripple);
  setTimeout(()=>ripple.remove(),600);
}

function onYesClick(e){
  addRipple(e);
  const wrap=document.querySelector(".wrap");
  wrap.innerHTML=document.getElementById("successTpl").innerHTML;

  // Localize success screen (headline, subtitle, button)
  const h1Span = wrap.querySelector(".headline span");
  if (h1Span) h1Span.textContent = TEXTS[LANG].successTitle;

  const successSub=document.getElementById("successSubtitle");
  if (successSub) successSub.textContent = TEXTS[LANG].successSub;

  const backBtn = wrap.querySelector(".buttons .btn.yes");
  if (backBtn) backBtn.textContent = TEXTS[LANG].successBtn;

  confetti();
}

function onNoClick(e){
  e.preventDefault();
  if (dodgeEnabled) {
    playfulDodge(); // on last step: never allow click
    return;
  }
  if (idx < STEPS.length - 1) {
    idx++;
    render();
  }
}

// =====================
// NO button dodge logic
// =====================
function playfulDodge(){
  if (!dodgeEnabled) return;
  const r = noBtn.getBoundingClientRect();
  const vw = innerWidth, vh = innerHeight, pad = 14;
  const x = Math.max(pad, Math.min(vw - r.width  - pad, Math.random() * (vw - r.width)));
  const y = Math.max(pad, Math.min(vh - r.height - pad, Math.random() * (vh - r.height)));
  noBtn.style.position = "fixed";
  noBtn.style.left = x + "px";
  noBtn.style.top  = y + "px";
  noBtn.style.transform = "rotate(" + (Math.random()*10-5) + "deg)";
}

// =====================
// Confetti (uses your .confetti CSS)
// =====================
function confetti(){
  const em = ["✨","🎉","💖","🌸","🫶","💞"];
  for(let i=0;i<60;i++){
    const c=document.createElement("div");
    c.className="confetti";
    c.textContent=em[Math.floor(Math.random()*em.length)];
    c.style.left=Math.random()*100+"vw";
    c.style.animationDelay=(Math.random()*0.8)+"s";
    c.style.fontSize=(18 + Math.random()*14) + "px";
    document.body.appendChild(c);
    setTimeout(()=>c.remove(), 3600);
  }
}

// =====================
// Background HEARTS
// =====================
;(function hearts(){
  const area = document.getElementById("hearts");
  if (!area) return;
  const em = ["💖","✨","💘","🌸","💫","💞"];
  setInterval(() => {
    const h = document.createElement("div");
    h.className = "heart";
    h.textContent = em[Math.floor(Math.random()*em.length)];
    h.style.left = Math.random()*100 + "vw";
    h.style.animationDuration = (6 + Math.random()*7) + "s";
    h.style.fontSize = (16 + Math.random()*18) + "px";
    area.appendChild(h);
    setTimeout(()=>h.remove(), 13000);
  }, 800);
})();

// =====================
// Wire events + first paint
// =====================
yesBtn.addEventListener("click", onYesClick);

// Desktop (hover/move = dodge, click = next step)
noBtn.addEventListener("click", (e) => {
  if (!dodgeEnabled) onNoClick(e);
});
noBtn.addEventListener("mouseenter", playfulDodge);
noBtn.addEventListener("mousemove", playfulDodge);

// Mobile & tablets
noBtn.addEventListener("touchstart", (e) => {
  if (dodgeEnabled) {
    e.preventDefault(); // cancel tap only when dodging
    playfulDodge();
  }
}, { passive: false });

noBtn.addEventListener("touchend", (e) => {
  if (!dodgeEnabled) onNoClick(e);
});

setUIByLang();
render();

