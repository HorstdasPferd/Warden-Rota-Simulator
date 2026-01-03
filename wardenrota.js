/**
 * LOTRO Warden Rota Planner
 * Main application logic
 * Requires: gambits.js
 */

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const CONFIG = {
  MAX_SLOTS: 200,
  CAST_TIME: {
    skill: 0.5,
    mastery: 0.5,
    execute: 0.8
  },
  LIMITS: {
    maxSkills: 5,
    maxMasteries: 3
  }
};

const SKILL_CLASS = { 1: "spear", 2: "shield", 3: "fist", 4: "execute" };
const SKILL_NAME = { 1: "Spear", 2: "Shield", 3: "Fist", 4: "Execute" };

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const state = {
  // Timeline state
  timelineData: [],
  timelineHistory: [],
  timelineBuild: [],
  executedGambits: [],
  
  // Playback state
  isPlaying: false,
  lastTickTime: 0,
  currentTime: 0,
  playIndex: 0,
  cooldowns: {},
  
  // Gambit tester state
  gambitSequence: [],
  
  // Active effects tracking
  activeEffects: [],
  
  // Character configuration
  charConfig: {
    traits: {},
    traceries: {}
  },
  
  // Palette elements
  paletteMasteries: {}
};

// ============================================================================
// DOM REFERENCES
// ============================================================================

const dom = {
  masteryList: document.getElementById("mastery-list"),
  skillList: document.getElementById("skill-list"),
  timeline: document.getElementById("timeline"),
  slider: document.getElementById("cd-slider"),
  cdValue: document.getElementById("cd-value"),
  effectsList: document.getElementById("effects-list"),
  
  // Gambit tester
  gambitSlots: document.querySelectorAll(".gambit-slot"),
  gambitIcon: document.getElementById("gambit-tooltip-icon"),
  gambitLink: document.getElementById("gambit-tooltip-link"),
  gambitBack: document.getElementById("gambit-back"),
  gambitClear: document.getElementById("gambit-clear"),
  gambitDuration: document.getElementById("gambit-duration"),
  
  // Timeline tooltip
  timelineTooltip: document.getElementById("timelinetooltip"),
  
  // Character panel
  charPanel: document.getElementById("character-panel"),
  charBtn: document.getElementById("character-btn"),
  closeChar: document.getElementById("close-character"),
  traitsList: document.getElementById("traits-list"),
  traceriesList: document.getElementById("traceries-list"),
  
  // Buttons
  buttons: {
    play: null,
    pause: null,
    stop: null,
    clear: null,
    undo: null,
    reverse: null,
    export: null,
    import: null,
    addSlot: document.getElementById("add-slot-btn"),
    loadPreset: document.getElementById("load-preset-btn"),
    savePreset: document.getElementById("save-preset-btn"),
    deletePreset: document.getElementById("delete-preset-btn")
  },
  
  // Selectors
  presetSelector: document.getElementById("preset-selector"),
  
  // Timer
  timer: document.getElementById("timer"),
  
  // Mobile controls
  toggleTimeline: document.getElementById("toggle-timeline-btn"),
  toggleTooltips: document.getElementById("toggle-tooltips-btn"),
  timelineArea: document.getElementById("timeline-area"),
  tooltipsArea: document.getElementById("tooltips")
};

// ============================================================================
// CHARACTER CONFIGURATION
// ============================================================================

const CHARACTER_DATA = {
  baseDurations: {
    // Light DoTs (16s base)
    "31": 16, "313": 16, "3131": 16,
    "123": 16, "1231": 16, "12312": 16,
    // Fist DoTs (16s base)
    "32": 16, "323": 16, "3231": 16, "31313": 16,
    // Shield Buffs (30s base)
    "21": 30, "212": 30, "21212": 30,
    "213": 30, "2132": 30,
    "23": 30, "232": 30, "2323": 30, "23232": 30,
    "1321": 30, "13213": 30,
    // Short buffs
    "2312": 10
  },
  
  traceries: [
    {
      id: "shield_gambit_buff",
      name: "Shield Gambit Buff Duration",
      bonus: 11,
      target: ["21", "212", "21212", "213", "2132", "23", "232", "2323", "23232"]
    },
    {
      id: "shield_tactics_immunity",
      name: "Shield Tactics Immunity Duration",
      bonus: 11,
      target: ["2312"]
    },
    {
      id: "gambit_debuff",
      name: "Gambit Debuff Duration",
      bonus: 11,
      target: ["123", "1231", "12312"]
    },
    {
      id: "fist_dot",
      name: "Fist Gambit DoT Duration",
      bonus: 8,
      target: ["31", "313", "3131", "32", "323", "3231", "31313"]
    },
    {
      id: "spear_dot",
      name: "Spear Gambit DoT Duration",
      bonus: 8,
      target: ["123", "1231", "12312"]
    }
  ],
  
  traits: [
    {
      id: "blue_bonus",
      name: "Blue Line: Shield Duration",
      bonus: 10,
      target: ["21", "212", "21212", "213", "2132", "23", "232", "2323", "23232"]
    },
    {
      id: "red_bleed",
      name: "Red Line: Bleed Duration",
      bonus: 5,
      target: ["31", "313", "3131", "123", "1231", "12312"]
    }
  ]
};

// ============================================================================
// PRESET CONFIGURATIONS
// ============================================================================

const DEFAULT_PRESETS = {
  blue: [
    { index: 0, id: "2" }, { index: 1, id: "3" }, { index: 2, id: "2" },
    { index: 3, id: "32" }, { index: 4, id: "4" },
    { index: 5, id: "2" }, { index: 6, id: "1" }, { index: 7, id: "2" },
    { index: 8, id: "12" }, { index: 9, id: "4" }
  ],
  red: [
    { index: 0, id: "1" }, { index: 1, id: "3" }, { index: 2, id: "1" },
    { index: 3, id: "3" }, { index: 4, id: "4" },
    { index: 5, id: "3" }, { index: 6, id: "2" }, { index: 7, id: "3" },
    { index: 8, id: "2" }, { index: 9, id: "4" }
  ]
};

let PRESETS = { ...DEFAULT_PRESETS };

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const utils = {
  getCastTime(entry) {
    return CONFIG.CAST_TIME[entry.type] || 0.5;
  },
  
  getCooldownTime(entry) {
    if (entry.type === "mastery") return parseFloat(dom.slider.value);
    if (entry.type === "execute") return CONFIG.CAST_TIME.execute;
    return CONFIG.CAST_TIME.skill;
  },
  
  isAvailable(entry, time) {
    return !state.cooldowns[entry.id] || state.cooldowns[entry.id] <= time;
  },
  
  expandInput(id) {
    if (MASTERY_MAP[id]) return MASTERY_MAP[id];
    return [parseInt(id)];
  },
  
  getEntryType(id) {
    if (MASTERY_MAP[id]) return "mastery";
    if (id === "4") return "execute";
    return "skill";
  },
  
  findGambit(seq) {
    for (let len = Math.min(seq.length, 5); len >= 2; len--) {
      const key = seq.slice(0, len).join("");
      if (GAMBIT_DB[key]) return { key, data: GAMBIT_DB[key], length: len };
    }
    return null;
  },
  
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${minutes.toString().padStart(2, "0")}:${secs.padStart(4, "0")}`;
  }
};

// ============================================================================
// CHARACTER CONFIG FUNCTIONS
// ============================================================================

const characterConfig = {
  load() {
    try {
      const saved = window.localStorage.getItem("warden_char_config");
      if (saved) {
        state.charConfig = JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error loading character config:", e);
    }
  },
  
  save() {
    try {
      window.localStorage.setItem("warden_char_config", JSON.stringify(state.charConfig));
    } catch (e) {
      console.error("Error saving character config:", e);
    }
  },
  
  getDuration(gambitId) {
    let duration = CHARACTER_DATA.baseDurations[gambitId];
    if (!duration) return null;
    
    // Add trait bonuses
    CHARACTER_DATA.traits.forEach(trait => {
      if (state.charConfig.traits[trait.id] && trait.target.includes(gambitId)) {
        duration += trait.bonus;
      }
    });
    
    // Add tracery bonuses
    CHARACTER_DATA.traceries.forEach(tracery => {
      if (state.charConfig.traceries[tracery.id] && tracery.target.includes(gambitId)) {
        duration += tracery.bonus;
      }
    });
    
    return duration;
  },
  
  renderPanel() {
    if (!dom.traitsList || !dom.traceriesList) return;
    
    // Render traits
    dom.traitsList.innerHTML = "";
    CHARACTER_DATA.traits.forEach(trait => {
      const div = document.createElement("div");
      div.className = "config-item";
      div.innerHTML = `
        <div class="config-icon"></div>
        <label>
          <input type="checkbox" data-type="trait" data-id="${trait.id}" 
                 ${state.charConfig.traits[trait.id] ? "checked" : ""}>
          ${trait.name} (+${trait.bonus}s)
        </label>
      `;
      dom.traitsList.appendChild(div);
    });
    
    // Render traceries
    dom.traceriesList.innerHTML = "";
    CHARACTER_DATA.traceries.forEach(tracery => {
      const div = document.createElement("div");
      div.className = "config-item";
      div.innerHTML = `
        <div class="config-icon"></div>
        <label>
          <input type="checkbox" data-type="tracery" data-id="${tracery.id}" 
                 ${state.charConfig.traceries[tracery.id] ? "checked" : ""}>
          ${tracery.name} (+${tracery.bonus}s)
        </label>
      `;
      dom.traceriesList.appendChild(div);
    });
    
    // Add event listeners
    [...dom.traitsList.querySelectorAll("input"), ...dom.traceriesList.querySelectorAll("input")]
      .forEach(input => {
        input.onchange = (e) => {
          const type = e.target.dataset.type;
          const id = e.target.dataset.id;
          const checked = e.target.checked;
          
          if (type === "trait") state.charConfig.traits[id] = checked;
          else state.charConfig.traceries[id] = checked;
          
          characterConfig.save();
        };
      });
  }
};

// ============================================================================
// TIMELINE FUNCTIONS
// ============================================================================

const timeline = {
  saveState() {
    const stateSnapshot = [];
    const slots = dom.timeline.querySelectorAll(".timeline-slot");
    
    slots.forEach((slot, idx) => {
      const entry = state.timelineData[idx];
      if (entry) {
        stateSnapshot.push({ index: idx, id: entry.id, type: entry.type });
      }
    });
    
    state.timelineHistory.push(stateSnapshot);
  },
  
  restoreState(stateSnapshot) {
    const slots = dom.timeline.querySelectorAll(".timeline-slot");
    
    slots.forEach(slot => slot.innerHTML = "");
    state.timelineData = [];
    
    stateSnapshot.forEach(({ index, id, type }) => {
      if (index < slots.length) {
        const slot = slots[index];
        this.renderSlot(slot, id);
        state.timelineData[index] = { type, id, element: slot };
      }
    });
  },
  
  renderSlot(slotElement, id) {
    slotElement.innerHTML = "";
    if (!id) return;
    
    let imgSrc = null;
    let labelText = "";
    
    if (MASTERY_MAP[id]) {
      imgSrc = `img/base/mastery${id}.png`;
      labelText = id;
    } else {
      const skillNum = parseInt(id);
      const mapping = {
        1: { src: "img/base/spear.png", label: "1" },
        2: { src: "img/base/shield.png", label: "2" },
        3: { src: "img/base/fist.png", label: "3" },
        4: { src: "img/base/execute.png", label: "" }
      };
      
      if (mapping[skillNum]) {
        imgSrc = mapping[skillNum].src;
        labelText = mapping[skillNum].label;
      } else {
        return;
      }
    }
    
    const img = document.createElement("img");
    img.src = imgSrc;
    
    if (labelText) {
      const label = document.createElement("div");
      label.className = "slot-label";
      label.textContent = labelText;
      slotElement.appendChild(label);
    }
    
    slotElement.appendChild(img);
  },
  
  addSlot() {
    const slots = dom.timeline.querySelectorAll(".timeline-slot");
    if (slots.length >= CONFIG.MAX_SLOTS) return;
    
    const slot = document.createElement("div");
    slot.className = "timeline-slot";
    slot.dataset.index = slots.length;
    slot.addEventListener("dragover", ev => ev.preventDefault());
    slot.addEventListener("drop", handlers.onDropTimeline);
    dom.timeline.appendChild(slot);
  },
  
  addSlotIfNeeded() {
    const slots = dom.timeline.querySelectorAll(".timeline-slot");
    const filled = Array.from(slots).filter(s => s.children.length > 0).length;
    
    if (filled >= slots.length && slots.length < CONFIG.MAX_SLOTS) {
      this.addSlot();
    }
  },
  
  clear() {
    this.saveState();
    const slots = dom.timeline.querySelectorAll(".timeline-slot");
    slots.forEach(slot => slot.innerHTML = "");
    state.timelineData = [];
  },
  
  undoLast() {
    const slots = dom.timeline.querySelectorAll(".timeline-slot");
    
    for (let i = slots.length - 1; i >= 0; i--) {
      if (state.timelineData[i]) {
        this.saveState();
        slots[i].innerHTML = "";
        state.timelineData[i] = undefined;
        return;
      }
    }
  },
  
  reverseLast() {
    if (state.timelineHistory.length === 0) return;
    const lastState = state.timelineHistory.pop();
    this.restoreState(lastState);
  },
  
  markSlot(slot, ok) {
    slot.classList.remove("ok", "error");
    slot.classList.add(ok ? "ok" : "error");
  },
  
  resetVisuals() {
    state.timelineData.forEach(e => e?.element.classList.remove("ok", "error"));
  }
};

// ============================================================================
// PLAYBACK FUNCTIONS
// ============================================================================

const playback = {
  start() {
    if (state.isPlaying) return;
    
    Object.keys(state.cooldowns).forEach(k => delete state.cooldowns[k]);
    state.playIndex = 0;
    state.currentTime = 0;
    state.lastTickTime = performance.now();
    state.isPlaying = true;
    state.timelineBuild = [];
    state.executedGambits = [];
    
    timeline.resetVisuals();
    activeEffects.clear();
    
    // Calculate start times
    let t = 0;
    state.timelineData.forEach(entry => {
      if (entry) {
        entry.startTime = t;
        entry.triggered = false;
        t += utils.getCastTime(entry);
      }
    });
    
    this.updateTimer();
    requestAnimationFrame(this.step.bind(this));
  },
  
  step(now) {
    if (!state.isPlaying) return;
    
    const delta = (now - state.lastTickTime) / 1000;
    state.lastTickTime = now;
    state.currentTime += delta;
    
    this.updateTimer();
    activeEffects.update(state.currentTime);
    
    // Find next filled entry
    let entry = state.timelineData[state.playIndex];
    while (!entry && state.playIndex < state.timelineData.length) {
      state.playIndex++;
      entry = state.timelineData[state.playIndex];
    }
    
    if (!entry || state.playIndex >= state.timelineData.length) {
      state.isPlaying = false;
      return;
    }
    
    if (!entry.triggered && state.currentTime >= entry.startTime) {
      entry.triggered = true;
      let ok = true;
      
      if (entry.type === "mastery") {
        const cdEnd = state.cooldowns[entry.id] || 0;
        if (state.currentTime < cdEnd) ok = false;
        
        state.cooldowns[entry.id] = state.currentTime + parseFloat(dom.slider.value);
        palette.startCooldown(entry.id, parseFloat(dom.slider.value));
      }
      
      timeline.markSlot(entry.element, ok);
      
      // Update timeline build
      if (ok && entry.type !== "execute") {
        state.timelineBuild.push(...utils.expandInput(entry.id));
      }
      
      if (entry.type === "execute") {
        const found = utils.findGambit(state.timelineBuild);
        if (found) {
          state.executedGambits.push(found.data);
          activeEffects.add(found.key, found.data);
        }
        state.timelineBuild = [];
      }
      
      tooltips.renderTimeline();
      state.playIndex++;
    }
    
    requestAnimationFrame(this.step.bind(this));
  },
  
  pause() {
    state.isPlaying = false;
  },
  
  stop() {
    state.isPlaying = false;
    state.playIndex = 0;
    state.currentTime = 0;
    state.timelineBuild = [];
    state.executedGambits = [];
    
    palette.resetCooldowns();
    tooltips.renderTimeline();
    this.updateTimer();
    timeline.resetVisuals();
  },
  
  updateTimer() {
    if (dom.timer) {
      dom.timer.textContent = utils.formatTime(state.currentTime);
    }
  }
};

// ============================================================================
// PALETTE FUNCTIONS
// ============================================================================

const palette = {
  init() {
    this.renderMasteries();
    this.renderSkills();
    
    if (dom.slider && dom.cdValue) {
      dom.cdValue.textContent = `${dom.slider.value}s`;
      dom.slider.addEventListener("input", () => {
        dom.cdValue.textContent = `${dom.slider.value}s`;
      });
    }
  },
  
  renderMasteries() {
    Object.entries(MASTERY_MAP).forEach(([key, seq]) => {
      const item = document.createElement("div");
      item.className = "mastery-item";
      item.dataset.mastery = key;
      item.setAttribute("draggable", true);
      
      const img = document.createElement("img");
      img.src = `img/base/mastery${key}.png`;
      img.alt = key;
      img.style.width = "30px";
      img.style.height = "30px";
      
      const label = document.createElement("div");
      label.className = "mastery-label";
      label.textContent = `${seq.join("")}  ${SKILL_NAME[seq[0]]} / ${SKILL_NAME[seq[1]]}`;
      
      item.appendChild(img);
      item.appendChild(label);
      
      dom.masteryList.appendChild(item);
      state.paletteMasteries[key] = item;
    });
  },
  
  renderSkills() {
    [1, 2, 3, 4].forEach(n => {
      const item = document.createElement("div");
      item.className = "palette-item skill-item";
      item.dataset.skill = n;
      item.setAttribute("draggable", true);
      
      const img = document.createElement("img");
      img.src = `img/base/${SKILL_CLASS[n]}.png`;
      img.alt = SKILL_NAME[n];
      
      const label = document.createElement("div");
      label.className = "palette-label";
      label.textContent = SKILL_NAME[n];
      
      item.appendChild(img);
      item.appendChild(label);
      
      dom.skillList.appendChild(item);
    });
  },
  
  startCooldown(id, duration) {
    const item = state.paletteMasteries[id];
    if (!item) return;
    
    const old = item.querySelector(".mastery-cd-overlay");
    if (old) old.remove();
    
    const overlay = document.createElement("div");
    overlay.className = "mastery-cd-overlay";
    item.appendChild(overlay);
    
    const start = performance.now();
    
    function update() {
      const elapsed = (performance.now() - start) / 1000;
      const remaining = Math.max(0, duration - elapsed);
      overlay.textContent = remaining.toFixed(1) + "s";
      
      if (remaining > 0 && state.isPlaying) {
        requestAnimationFrame(update);
      } else {
        overlay.remove();
      }
    }
    
    update();
  },
  
  resetCooldowns() {
    Object.values(state.paletteMasteries).forEach(item => {
      const overlay = item.querySelector(".mastery-cd-overlay");
      if (overlay) overlay.remove();
    });
  }
};

// ============================================================================
// GAMBIT TESTER FUNCTIONS
// ============================================================================

const gambitTester = {
  render() {
    dom.gambitSlots.forEach((slot, i) => {
      slot.innerHTML = "";
      const id = state.gambitSequence[i];
      if (!id) return;
      
      const img = document.createElement("img");
      img.src = MASTERY_MAP[id]
        ? `img/base/mastery${id}.png`
        : `img/base/${SKILL_CLASS[id]}.png`;
      
      slot.appendChild(img);
    });
  },
  
  updateTooltip() {
    const gambit = utils.findGambit(state.gambitSequence);
    
    if (!gambit) {
      if (dom.gambitIcon) dom.gambitIcon.src = "";
      if (dom.gambitLink) dom.gambitLink.hidden = true;
      if (dom.gambitDuration) dom.gambitDuration.style.display = "none";
      return;
    }
    
    if (dom.gambitIcon) {
      dom.gambitIcon.src = gambit.data.tooltip || gambit.data.icon;
    }
    
    if (dom.gambitLink) {
      if (gambit.data.wiki) {
        dom.gambitLink.href = gambit.data.wiki;
        dom.gambitLink.hidden = false;
      } else {
        dom.gambitLink.hidden = true;
      }
    }
    
    if (dom.gambitDuration) {
      const duration = characterConfig.getDuration(gambit.key);
      if (duration) {
        dom.gambitDuration.textContent = `Duration: ${duration}s`;
        dom.gambitDuration.style.display = "block";
      } else {
        dom.gambitDuration.style.display = "none";
      }
    }
  },
  
  clear() {
    state.gambitSequence = [];
    this.render();
    this.updateTooltip();
  },
  
  back() {
    state.gambitSequence.pop();
    this.render();
    this.updateTooltip();
  },
  
  addInput(id) {
    const isMastery = !!MASTERY_MAP[id];
    const masteryCount = state.gambitSequence.filter(x => MASTERY_MAP[x]).length;
    const skillCount = state.gambitSequence.filter(x => !MASTERY_MAP[x]).length;
    
    if (isMastery && masteryCount >= CONFIG.LIMITS.maxMasteries) return;
    if (!isMastery && skillCount >= CONFIG.LIMITS.maxSkills) return;
    
    utils.expandInput(id).forEach(v => state.gambitSequence.push(String(v)));
    this.render();
    this.updateTooltip();
  }
};

// ============================================================================
// TOOLTIP FUNCTIONS
// ============================================================================

const tooltips = {
  renderTimeline() {
    if (!dom.timelineTooltip) return;
    
    dom.timelineTooltip.innerHTML = "";
    
    // Render executed gambits
    if (state.executedGambits.length) {
      const done = document.createElement("div");
      done.className = "timeline-gambits-done";
      
      state.executedGambits.forEach(g => {
        const img = document.createElement("img");
        img.src = g.icon;
        img.width = 32;
        img.height = 32;
        done.appendChild(img);
      });
      
      dom.timelineTooltip.appendChild(done);
    }
    
    // Render current gambit
    const live = document.createElement("div");
    live.className = "timeline-gambit-live";
    
    const gambit = utils.findGambit(state.timelineBuild);
    if (gambit) {
      const img = document.createElement("img");
      img.src = gambit.data.tooltip || gambit.data.icon;
      img.style.maxWidth = "100%";
      live.appendChild(img);
      
      const duration = characterConfig.getDuration(gambit.key);
      if (duration) {
        const dDiv = document.createElement("div");
        dDiv.style.marginTop = "8px";
        dDiv.style.color = "#4f9";
        dDiv.style.fontWeight = "bold";
        dDiv.textContent = `Duration: ${duration}s`;
        live.appendChild(dDiv);
      }
    }
    
    dom.timelineTooltip.appendChild(live);
  }
};

// ============================================================================
// ACTIVE EFFECTS FUNCTIONS
// ============================================================================

const activeEffects = {
  add(key, data) {
    const duration = characterConfig.getDuration(key);
    if (!duration || duration <= 0) return;
    
    const item = document.createElement("div");
    item.className = "effect-item";
    
    const img = document.createElement("img");
    img.src = data.icon;
    item.appendChild(img);
    
    const overlay = document.createElement("div");
    overlay.className = "effect-overlay";
    overlay.textContent = duration.toFixed(1) + "s";
    item.appendChild(overlay);
    
    if (dom.effectsList) {
      dom.effectsList.appendChild(item);
    }
    
    state.activeEffects.push({
      key,
      startTime: state.currentTime,
      duration,
      element: item,
      overlay
    });
  },
  
  update(time) {
    for (let i = state.activeEffects.length - 1; i >= 0; i--) {
      const effect = state.activeEffects[i];
      const elapsed = time - effect.startTime;
      const remaining = effect.duration - elapsed;
      
      if (remaining <= 0) {
        if (effect.element && effect.element.parentNode) {
          effect.element.remove();
        }
        state.activeEffects.splice(i, 1);
      } else if (effect.overlay) {
        effect.overlay.textContent = remaining.toFixed(1) + "s";
      }
    }
  },
  
  clear() {
    state.activeEffects = [];
    if (dom.effectsList) dom.effectsList.innerHTML = "";
  }
};

// ============================================================================
// IMPORT/EXPORT FUNCTIONS
// ============================================================================

const importExport = {
  export() {
    const exportData = [];
    state.timelineData.forEach((entry, idx) => {
      if (entry) {
        exportData.push({ index: idx, id: entry.id });
      }
    });
    
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "warden-rota.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  
  import() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt,.json";
    
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = event => {
        try {
          const text = event.target.result;
          const data = JSON.parse(text);
          if (!Array.isArray(data)) throw new Error("Invalid format");
          
          timeline.saveState();
          this.loadData(data);
        } catch (e) {
          alert("Error loading timeline: " + e.message);
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  },
  
  loadData(data) {
    const initialSlots = dom.timeline.querySelectorAll(".timeline-slot");
    initialSlots.forEach(slot => slot.innerHTML = "");
    state.timelineData = [];
    
    data.forEach(item => {
      const idx = item.index;
      const id = item.id;
      
      while (idx >= dom.timeline.querySelectorAll(".timeline-slot").length && 
             dom.timeline.querySelectorAll(".timeline-slot").length < CONFIG.MAX_SLOTS) {
        timeline.addSlot();
      }
      
      const currentSlots = dom.timeline.querySelectorAll(".timeline-slot");
      if (idx < currentSlots.length) {
        const slot = currentSlots[idx];
        timeline.renderSlot(slot, id);
        state.timelineData[idx] = {
          type: utils.getEntryType(id),
          id: id,
          element: slot
        };
      }
    });
  }
};

// ============================================================================
// PRESET MANAGEMENT
// ============================================================================

const presets = {
  load() {
    try {
      const saved = window.localStorage.getItem("warden_presets");
      if (saved) {
        const custom = JSON.parse(saved);
        PRESETS = { ...DEFAULT_PRESETS, ...custom };
      }
    } catch (e) {
      console.error("Error loading presets:", e);
    }
  },
  
  save() {
    const customPresets = {};
    Object.keys(PRESETS).forEach(k => {
      if (!DEFAULT_PRESETS[k]) {
        customPresets[k] = PRESETS[k];
      }
    });
    
    try {
      window.localStorage.setItem("warden_presets", JSON.stringify(customPresets));
    } catch (e) {
      console.error("Error saving presets:", e);
    }
  },
  
  updateSelector() {
    if (!dom.presetSelector) return;
    
    while (dom.presetSelector.options.length > 1) {
      dom.presetSelector.remove(1);
    }
    
    Object.keys(PRESETS).forEach(name => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name.charAt(0).toUpperCase() + name.slice(1);
      dom.presetSelector.appendChild(opt);
    });
  },
  
  loadPreset(name) {
    if (PRESETS[name]) {
      timeline.saveState();
      importExport.loadData(PRESETS[name]);
    }
  },
  
  saveNew() {
    const name = prompt("Enter a name for the new preset:");
    if (!name) return;
    
    const key = name.trim().toLowerCase();
    if (!key) return;
    
    if (DEFAULT_PRESETS[key]) {
      alert("Cannot overwrite default presets.");
      return;
    }
    
    const currentData = [];
    state.timelineData.forEach((entry, idx) => {
      if (entry) {
        currentData.push({ index: idx, id: entry.id });
      }
    });
    
    if (currentData.length === 0) {
      alert("Timeline is empty.");
      return;
    }
    
    PRESETS[key] = currentData;
    this.save();
    this.updateSelector();
    
    if (dom.presetSelector) {
      dom.presetSelector.value = key;
    }
  },
  
  delete() {
    if (!dom.presetSelector) return;
    
    const key = dom.presetSelector.value;
    if (!key) {
      alert("Please select a preset to delete.");
      return;
    }
    
    if (DEFAULT_PRESETS[key]) {
      alert("Cannot delete default presets.");
      return;
    }
    
    if (!confirm(`Are you sure you want to delete preset "${key}"?`)) return;
    
    delete PRESETS[key];
    this.save();
    this.updateSelector();
    dom.presetSelector.selectedIndex = 0;
  }
};

// ============================================================================
// EVENT HANDLERS
// ============================================================================

const handlers = {
  onDropTimeline(ev) {
    ev.preventDefault();
    const id = ev.dataTransfer.getData("text/plain");
    
    timeline.saveState();
    timeline.renderSlot(ev.currentTarget, id);
    timeline.addSlotIfNeeded();
    
    const slotIndex = parseInt(ev.currentTarget.dataset.index);
    state.timelineData[slotIndex] = {
      type: utils.getEntryType(id),
      id: id,
      element: ev.currentTarget
    };
  },
  
  onDropGambit(ev) {
    ev.preventDefault();
    const id = ev.dataTransfer.getData("text/plain");
    if (!id) return;
    
    gambitTester.addInput(id);
  },
  
  setupDragDrop() {
    document.querySelectorAll(".palette-item, .mastery-item").forEach(item => {
      item.addEventListener("dragstart", ev => {
        ev.dataTransfer.setData("text/plain", item.dataset.skill ?? item.dataset.mastery);
      });
    });
    
    dom.gambitSlots.forEach(slot => {
      slot.addEventListener("dragover", ev => ev.preventDefault());
      slot.addEventListener("drop", this.onDropGambit);
    });
  }
};

// ============================================================================
// UI SETUP
// ============================================================================

const ui = {
  setupButtons() {
    const allButtons = document.querySelectorAll("button");
    
    dom.buttons.play = Array.from(allButtons).find(b => b.textContent === "Play");
    dom.buttons.pause = Array.from(allButtons).find(b => b.textContent === "Pause");
    dom.buttons.stop = Array.from(allButtons).find(b => b.textContent === "Stop");
    dom.buttons.clear = Array.from(allButtons).find(b => b.textContent === "Clear");
    dom.buttons.undo = Array.from(allButtons).find(b => b.textContent === "Undo");
    dom.buttons.reverse = Array.from(allButtons).find(b => b.textContent === "Reverse");
    dom.buttons.export = Array.from(allButtons).find(b => b.textContent === "Export");
    dom.buttons.import = Array.from(allButtons).find(b => b.textContent === "Import");
    
    if (dom.buttons.play) dom.buttons.play.onclick = () => playback.start();
    if (dom.buttons.pause) dom.buttons.pause.onclick = () => playback.pause();
    if (dom.buttons.stop) dom.buttons.stop.onclick = () => playback.stop();
    if (dom.buttons.clear) dom.buttons.clear.onclick = () => timeline.clear();
    if (dom.buttons.undo) dom.buttons.undo.onclick = () => timeline.undoLast();
    if (dom.buttons.reverse) dom.buttons.reverse.onclick = () => timeline.reverseLast();
    if (dom.buttons.export) dom.buttons.export.onclick = () => importExport.export();
    if (dom.buttons.import) dom.buttons.import.onclick = () => importExport.import();
    if (dom.buttons.addSlot) dom.buttons.addSlot.onclick = () => timeline.addSlot();
    
    if (dom.buttons.loadPreset) {
      dom.buttons.loadPreset.onclick = () => {
        const val = dom.presetSelector ? dom.presetSelector.value : "";
        if (val) presets.loadPreset(val);
      };
    }
    if (dom.buttons.savePreset) dom.buttons.savePreset.onclick = () => presets.saveNew();
    if (dom.buttons.deletePreset) dom.buttons.deletePreset.onclick = () => presets.delete();
    
    if (dom.gambitBack) dom.gambitBack.onclick = () => gambitTester.back();
    if (dom.gambitClear) dom.gambitClear.onclick = () => gambitTester.clear();
    
    if (dom.charBtn && dom.charPanel && dom.closeChar) {
      dom.charBtn.onclick = () => {
        dom.charPanel.hidden = false;
        characterConfig.renderPanel();
      };
      dom.closeChar.onclick = () => dom.charPanel.hidden = true;
    }
  },
  
  setupTimeline() {
    for (let i = 0; i < 10; i++) {
      const slot = document.createElement("div");
      slot.className = "timeline-slot";
      slot.dataset.index = i;
      slot.addEventListener("dragover", ev => ev.preventDefault());
      slot.addEventListener("drop", handlers.onDropTimeline);
      dom.timeline.appendChild(slot);
    }
  },
  
  setupLegend() {
    const legendToggle = document.getElementById("legend-toggle");
    const legendPopup = document.getElementById("legend-popup");
    const legendClose = document.getElementById("close-legend");
    
    if (legendToggle && legendPopup && legendClose) {
      legendToggle.onclick = () => legendPopup.hidden = false;
      legendClose.onclick = () => legendPopup.hidden = true;
    }
  },
  
  setupMobileControls() {
    if (dom.toggleTimeline && dom.timelineArea) {
      dom.toggleTimeline.onclick = () => {
        const isHidden = dom.timelineArea.style.display === "none";
        dom.timelineArea.style.display = isHidden ? "" : "none";
        dom.toggleTimeline.classList.toggle("active", isHidden);
        dom.toggleTimeline.textContent = isHidden ? "Timeline: ON" : "Timeline: OFF";
      };
    }
    
    if (dom.toggleTooltips && dom.tooltipsArea) {
      dom.toggleTooltips.onclick = () => {
        const isHidden = dom.tooltipsArea.style.display === "none";
        dom.tooltipsArea.style.display = isHidden ? "" : "none";
        dom.toggleTooltips.classList.toggle("active", isHidden);
        dom.toggleTooltips.textContent = isHidden ? "Tester: ON" : "Tester: OFF";
      };
    }
  }
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Load saved configurations
  characterConfig.load();
  presets.load();
  
  // Setup UI components
  palette.init();
  ui.setupTimeline();
  ui.setupButtons();
  ui.setupLegend();
  ui.setupMobileControls();
  handlers.setupDragDrop();
  
  // Initialize presets selector
  presets.updateSelector();
  
  // Initial render
  gambitTester.render();
  gambitTester.updateTooltip();
});
