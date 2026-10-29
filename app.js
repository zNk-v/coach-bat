/* COACH BAT — Le Tunnel */
(() => {
  const TEL = "+33674502997";
  const MAIL = "coach.baptiste.performance@gmail.com";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ═══ Reflet spéculaire qui suit le pointeur ═══ */
  if (matchMedia("(hover: hover)").matches) {
    document.addEventListener("pointermove", e => {
      const el = e.target.closest?.(".glass");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
      el.style.setProperty("--hl", "1");
    }, { passive: true });
    document.addEventListener("pointerout", e => {
      const el = e.target.closest?.(".glass");
      if (el && !el.contains(e.relatedTarget)) el.style.removeProperty("--hl");
    });
  }

  /* ═══ Apparitions ═══ */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  document.querySelectorAll(".pains, .steps, .where, .reviews, .reels__grid").forEach(group => {
    [...group.children].forEach((c, i) => c.style.setProperty("--d", `${i * 60}ms`));
  });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  /* ═══ Formules : onglets ═══ */
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  const ink = document.querySelector(".tabs__ink");
  function placeInk() {
    const on = tabs.find(t => t.getAttribute("aria-selected") === "true");
    if (!on) return;
    ink.style.width = on.offsetWidth + "px";
    ink.style.height = on.offsetHeight + "px";
    ink.style.transform = `translate(${on.offsetLeft}px, ${on.offsetTop}px)`;
  }
  function selectTab(tab, focus) {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      const p = document.getElementById(t.getAttribute("aria-controls"));
      p.hidden = !on;
      if (on) { p.classList.remove("qfade"); void p.offsetWidth; p.classList.add("qfade"); }
    });
    if (focus) tab.focus();
    placeInk();
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => selectTab(t));
    t.addEventListener("keydown", e => {
      const k = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1 }[e.key];
      if (k) { e.preventDefault(); selectTab(tabs[(i + k + tabs.length) % tabs.length], true); }
      if (e.key === "Home") { e.preventDefault(); selectTab(tabs[0], true); }
      if (e.key === "End") { e.preventDefault(); selectTab(tabs[tabs.length - 1], true); }
    });
  });
  addEventListener("resize", placeInk, { passive: true });
  document.fonts?.ready.then(placeInk);
  placeInk();

  /* ═══ Pré-sélection de la formule dans le formulaire ═══ */
  const sel = document.getElementById("f-formule");
  function pick(label) {
    const opt = [...sel.options].find(o => o.textContent.trim() === label);
    if (opt) sel.value = opt.value || opt.textContent;
  }
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-pick]");
    if (a) pick(a.dataset.pick);
  });

  /* ═══ Le test : trouve ta formule ═══ */
  const Q = {
    mode: {
      q: "Comment veux-tu t'entraîner ?",
      o: [
        { b: "Avec moi à chaque séance", s: "En salle, chez toi ou dans ton entreprise", go: "qui" },
        { b: "Un programme + quelques séances avec moi", s: "Tu avances seul·e, je contrôle et je corrige", go: "rythme" },
        { b: "Seul·e, avec un programme et un suivi", s: "À distance, où tu veux, quand tu veux", go: "duree" },
      ],
    },
    qui: {
      q: "Avec qui ?",
      o: [
        { b: "Seul·e", s: "Toute mon attention pour toi", go: "horizon" },
        { b: "À deux", s: "Avec ton ou ta partenaire d'entraînement", r: "duo" },
        { b: "En petit groupe", s: "L'énergie du groupe, le prix en moins", r: "group" },
      ],
    },
    horizon: {
      q: "Sur combien de temps ?",
      o: [
        { b: "Je veux d'abord tester", s: "Une séance pour voir comment on bosse", r: "seance" },
        { b: "2 mois pour lancer la machine", s: "5 séances", r: "p5" },
        { b: "3 mois pour installer l'habitude", s: "10 séances", r: "p10" },
        { b: "6 mois pour me transformer", s: "20 séances", r: "p20" },
      ],
    },
    rythme: {
      q: "Combien de séances avec moi ?",
      o: [
        { b: "2 par mois", s: "Un point de contrôle toutes les deux semaines", r: "rubis" },
        { b: "1 par semaine", s: "Un rendez-vous fixe, chaque semaine", r: "saphir" },
        { b: "2 par semaine", s: "Le rythme d'une vraie transformation", r: "diamant" },
      ],
    },
    duree: {
      q: "Tu t'engages sur combien de temps ?",
      o: [
        { b: "Sans engagement", s: "J'arrête quand je veux", r: "l0" },
        { b: "3 mois", s: "Le temps de voir les premiers résultats", r: "l3" },
        { b: "6 mois", s: "Le temps de changer vraiment", r: "l6" },
        { b: "12 mois", s: "Le meilleur prix au mois", r: "l12" },
      ],
    },
  };
  const R = {
    seance: { tag: "À la séance", name: "Séance individuelle", price: "75 €", unit: "la séance d'1 h", pick: "Séance individuelle · 75 €",
      why: "Une heure ensemble pour découvrir ma façon de travailler. Si le courant passe, tu bascules sur un pack et tu paies l'heure moins cher.",
      list: ["1 heure en tête-à-tête", "En salle, chez toi ou en entreprise", "Aucun engagement"] },
    duo: { tag: "À la séance", name: "Duo", price: "90 €", unit: "la séance d'1 h, à deux", pick: "Séance duo · 90 €",
      why: "Tu t'entraînes avec quelqu'un qui te motive, et la séance revient à 45 € chacun.",
      list: ["1 heure pour deux personnes", "Exercices adaptés à chacun", "45 € par personne"] },
    group: { tag: "À la séance", name: "Small Group Training", price: "35 €", unit: "la séance d'1 h", pick: "Small Group Training · 35 €",
      why: "L'énergie d'un petit groupe, l'œil d'un coach, au prix le plus doux de la grille.",
      list: ["1 heure en petit groupe", "Encadrement par Baptiste", "Le tarif le plus accessible"] },
    p5: { tag: "Pack en salle", name: "Pack 5 séances", price: "350 €", unit: "soit 70 € / h", pick: "Pack 5 séances · 350 €",
      why: "Cinq séances en deux mois : assez pour poser les bases et sentir la différence.",
      list: ["5 séances individuelles d'1 h", "Valable 2 mois", "−7 % vs la séance à l'unité"] },
    p10: { tag: "Pack en salle", name: "Pack 10 séances", price: "650 €", unit: "soit 65 € / h", pick: "Pack 10 séances · 650 €",
      why: "Trois mois, c'est le temps qu'il faut pour que l'entraînement devienne une habitude.",
      list: ["10 séances individuelles d'1 h", "Valable 3 mois", "−13 % vs la séance à l'unité"] },
    p20: { tag: "Pack en salle", name: "Pack 20 séances", price: "1 200 €", unit: "soit 60 € / h", pick: "Pack 20 séances · 1200 €",
      why: "Six mois d'accompagnement pour transformer ton corps, au meilleur prix horaire.",
      list: ["20 séances individuelles d'1 h", "Valable 6 mois", "−20 % vs la séance à l'unité"] },
    rubis: { tag: "Coaching hybride", name: "Rubis", price: "180 €", unit: "/ mois", pick: "Hybride Rubis · 180 €/mois",
      why: "Tu t'entraînes en autonomie avec ton programme, et on se voit deux fois par mois pour corriger et faire progresser.",
      list: ["Programme personnalisé", "Suivi à distance", "2 séances toutes les 4 semaines", "Engagement 1 mois minimum"] },
    saphir: { tag: "Coaching hybride", name: "Saphir", price: "300 €", unit: "/ mois", pick: "Hybride Saphir · 300 €/mois",
      why: "Un rendez-vous fixe chaque semaine, ton programme entre les séances. C'est la formule la plus équilibrée.",
      list: ["Programme personnalisé", "Suivi à distance", "1 séance chaque semaine", "Engagement 1 mois minimum"] },
    diamant: { tag: "Coaching hybride", name: "Diamant", price: "440 €", unit: "/ mois", pick: "Hybride Diamant · 440 €/mois",
      why: "Deux séances par semaine avec moi, plus ton programme. L'encadrement le plus complet pour aller vite et loin.",
      list: ["Programme personnalisé", "Suivi à distance", "2 séances chaque semaine", "Engagement 1 mois minimum"] },
    l0: { tag: "Coaching en ligne", name: "En ligne", price: "150 €", unit: "/ mois, sans engagement", pick: "En ligne sans engagement · 150 €/mois",
      why: "Ton programme et mon suivi, sans contrainte de durée. Tu testes, tu restes si ça marche.",
      list: ["Programme personnalisé", "Suivi à distance", "Sans engagement"] },
    l3: { tag: "Coaching en ligne", name: "En ligne 3 mois", price: "130 €", unit: "/ mois", pick: "En ligne 3 mois · 130 €/mois",
      why: "Trois mois pour voir tes premiers vrais résultats, à un tarif réduit.",
      list: ["Programme personnalisé", "Suivi à distance", "−13 % vs sans engagement"] },
    l6: { tag: "Coaching en ligne", name: "En ligne 6 mois", price: "120 €", unit: "/ mois", pick: "En ligne 6 mois · 120 €/mois",
      why: "Six mois pour changer en profondeur, avec un programme qui évolue avec toi.",
      list: ["Programme personnalisé", "Suivi à distance", "−20 % vs sans engagement"] },
    l12: { tag: "Coaching en ligne", name: "En ligne 12 mois", price: "100 €", unit: "/ mois", pick: "En ligne 12 mois · 100 €/mois",
      why: "Un an d'accompagnement au meilleur prix. Tu ne repars plus de zéro.",
      list: ["Programme personnalisé", "Suivi à distance", "−33 % vs sans engagement"] },
  };

  const body = document.getElementById("quizBody");
  const back = document.getElementById("quizBack");
  const stepLbl = document.getElementById("quizStep");
  const bar = document.getElementById("quizBar");
  const barWrap = bar.parentElement;
  let path = ["mode"];
  const check = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';

  function setBar(p) {
    barWrap.style.setProperty("--q", p);
    barWrap.setAttribute("aria-valuenow", Math.round(p * 100));
  }

  function renderQ(focus) {
    const id = path[path.length - 1];
    const q = Q[id];
    const n = path.length;
    stepLbl.textContent = `Question ${n}`;
    back.hidden = n === 1;
    setBar((n - 1) / 3 + 0.04);
    const two = q.o.length === 4 ? " quiz__opts--2" : "";
    body.innerHTML = `<div class="qfade"><h3 class="quiz__q" tabindex="-1">${q.q}</h3>
      <div class="quiz__opts${two}">${q.o.map((o, i) =>
        `<button type="button" class="opt" data-i="${i}"><span class="opt__k">${"ABCD"[i]}</span><span><b>${o.b}</b><small>${o.s}</small></span></button>`).join("")}</div></div>`;
    if (focus) body.querySelector(".quiz__q").focus({ preventScroll: true });
  }

  function renderR(key) {
    const r = R[key];
    stepLbl.textContent = "Ta formule";
    back.hidden = false;
    setBar(1);
    body.innerHTML = `<div class="qfade result">
      <div><p class="result__tag">${r.tag} · recommandé pour toi</p>
        <h3 class="result__name neon-txt" tabindex="-1">${r.name}</h3>
        <p class="result__price">${r.price}<small>${r.unit}</small></p></div>
      <p class="result__why">${r.why}</p>
      <ul class="result__list">${r.list.map(l => `<li>${check}<span>${l}</span></li>`).join("")}</ul>
      <div class="result__cta">
        <a href="#contact" class="btn btn--neon" data-pick="${r.pick}">Je veux cette formule</a>
        <a href="tel:${TEL}" class="btn btn--glass">Appeler Baptiste</a>
      </div>
      <button type="button" class="result__redo">Refaire le test</button></div>`;
    body.querySelector(".result__name").focus({ preventScroll: true });
  }

  body.addEventListener("click", e => {
    const b = e.target.closest(".opt");
    if (b) {
      const o = Q[path[path.length - 1]].o[+b.dataset.i];
      b.classList.add("is-on");
      setTimeout(() => {
        if (o.go) { path.push(o.go); renderQ(true); }
        else { path.push("=" + o.r); renderR(o.r); }
      }, reduce ? 0 : 220);
      return;
    }
    if (e.target.closest(".result__redo")) { path = ["mode"]; renderQ(true); }
  });
  back.addEventListener("click", () => {
    path.pop();
    renderQ(true);
  });
  renderQ(false);

  /* ═══ Formulaire ═══ */
  const form = document.getElementById("leadForm");
  const fields = document.getElementById("formFields");
  const done = document.getElementById("formDone");
  const nom = document.getElementById("f-nom");
  const tel = document.getElementById("f-tel");

  function fieldErr(input, msg) {
    const f = input.closest(".field");
    f.classList.toggle("bad", !!msg);
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    document.getElementById("e-" + input.id.slice(2)).textContent = msg || "";
  }
  const telOk = v => v.replace(/\D/g, "").length >= 10;
  nom.addEventListener("blur", () => fieldErr(nom, nom.value.trim() ? "" : "Indique ton prénom pour que je sache qui rappeler."));
  tel.addEventListener("blur", () => fieldErr(tel, telOk(tel.value) ? "" : "Il manque des chiffres : ex. 06 12 34 56 78."));

  function showDone() {
    fields.hidden = true;
    done.hidden = false;
    done.focus();
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const okN = !!nom.value.trim(), okT = telOk(tel.value);
    fieldErr(nom, okN ? "" : "Indique ton prénom pour que je sache qui rappeler.");
    fieldErr(tel, okT ? "" : "Il manque des chiffres : ex. 06 12 34 56 78.");
    if (!okN) return nom.focus();
    if (!okT) return tel.focus();
    if (form._honey.value) return showDone();

    const data = Object.fromEntries(new FormData(form));
    delete data._honey;
    data._subject = `Nouveau contact site : ${data.nom} (${data.formule})`;
    data._template = "table";
    form.classList.add("is-sending");
    document.getElementById("formBtn").textContent = "Envoi…";
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${MAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(res.status);
      showDone();
    } catch {
      const txt = `Bonjour Baptiste, je suis ${data.nom} (${data.telephone}). Formule : ${data.formule}. Objectif : ${data.objectif}. ${data.message || ""}`;
      showDone();
      location.href = `sms:${TEL}?&body=${encodeURIComponent(txt)}`;
    } finally {
      form.classList.remove("is-sending");
    }
  });

  document.getElementById("yr").textContent = new Date().getFullYear();
})();
