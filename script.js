document.getElementById("form-somatotip").addEventListener("submit", function(e) {
  e.preventDefault();

  try {
    const altura = parseFloat(this.altura.value);   // cm
    const pes = parseFloat(this.pes.value);         // kg
    const edat = parseInt(this.edat.value, 10);     // anys
    const activitat = this.activitat.value || "—";

    if (isNaN(altura) || isNaN(pes)) {
      alert("Omple l'alçada i el pes correctament.");
      return;
    }

    const imc = pes / ((altura / 100) ** 2);

    // Categoria IMC
    let cat;
    if (imc < 18.5)      cat = "baix";
    else if (imc < 25)   cat = "normal";
    else                 cat = "alt";

    // Somatotip orientatiu segons IMC
    let somatotip;
    if (imc < 18.5)      somatotip = "Ectomorf";
    else if (imc < 25)   somatotip = "Mesomorf";
    else                 somatotip = "Endomorf";

    // Tip segons categoria (coloreado por CSS)
    const tipEl = document.getElementById("tip");
    let tipText = "";
    let tipClass = "normal";
    if (cat === "baix") { tipText = "Consell: IMC baix, et recomanem que guanyis pes de forma saludable."; tipClass = "baix"; }
    else if (cat === "alt") { tipText = "Consell: IMC alt, intenta mantenir hàbits saludables i controlar el pes."; tipClass = "alt"; }
    else { tipText = "El teu IMC és dins del rang normal. Mantén hàbits actius i alimentació equilibrada."; tipClass = "normal"; }
    tipEl.textContent = tipText;
    tipEl.className = "tip " + tipClass;

    // Resultats
    document.getElementById("resultat").textContent = `Resultat: IMC ${imc.toFixed(1)} → ${cat}`;
    document.getElementById("explicacio-imc").innerHTML =
      `Somatotip orientatiu: ${somatotip} (activitat: ${activitat})<br><br>` +
      "Què és l'IMC? És l'Índex de Massa Corporal i es calcula dividint el pes (kg) per l'alçada al quadrat (m²). " +
      "Serveix per estimar si el pes és baix, normal o alt en adults.";

    // Menors: nota + taula segons gènere
const notaDetails = document.getElementById("nota-details");
const tablaHome = document.getElementById("tabla-home");
const tablaDona = document.getElementById("tabla-dona");
const genere = (document.getElementById("genere")?.value) || "";

// helper: resaltar fila de la edad
function highlightAgeRow(table, age) {
  if (!table) return;
  table.querySelectorAll("tbody tr").forEach(tr => tr.classList.remove("hl"));
  const target = Array.from(table.querySelectorAll("tbody tr"))
    .find(tr => (tr.cells[0]?.textContent || "").trim().startsWith(`${age} anys`));
  if (target) target.classList.add("hl");
}

if (!isNaN(edat) && edat < 18) {
  notaDetails.style.display = "block"; // mostrar acordeón

  if (genere === "Dona") {
    tablaDona.style.display = "table";
    tablaHome.style.display = "none";
    highlightAgeRow(tablaDona, edat);
  } else if (genere === "Home") {
    tablaHome.style.display = "table";
    tablaDona.style.display = "none";
    highlightAgeRow(tablaHome, edat);
  } else {
    tablaHome.style.display = "none";
    tablaDona.style.display = "none";
  }
} else {
  notaDetails.style.display = "none"; // ocultar acordeón si es mayor de edad
}

    document.getElementById("panel-resultat").style.display = "block";
  } catch (err) {
    console.error(err);
    alert("Hi ha hagut un error al calcular. Revisa que el codi estigui complet i ben tancat.");
  }
});



// Cerrar otros acordeones cuando se abre uno
document.querySelectorAll('#faq details').forEach((det) => {
  det.addEventListener('toggle', () => {
    if (det.open) {
      document.querySelectorAll('#faq details').forEach((other) => {
        if (other !== det) other.removeAttribute('open');
      });
    }
  });
});

// Carrusel Testimonis
(() => {
  const root = document.querySelector('#testimonis .carousel');
  if (!root) return;

  const track = root.querySelector('.car-track');
  const slides = Array.from(track.children);
  const prevBtn = root.querySelector('.prev');
  const nextBtn = root.querySelector('.next');
  const dotsWrap = root.querySelector('.car-dots');

  // Crear dots
  dotsWrap.innerHTML = slides.map((_,i)=>
    `<button class="dot" aria-label="Anar al testimoni ${i+1}" aria-selected="${i===0}"></button>`
  ).join('');
  const dots = Array.from(dotsWrap.querySelectorAll('.dot'));

  let idx = 0, autoplay, startX = 0, dx = 0;

  function update() {
    track.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d,i)=> d.setAttribute('aria-selected', i===idx));
  }

  function next(){ idx = (idx + 1) % slides.length; update(); }
  function prev(){ idx = (idx - 1 + slides.length) % slides.length; update(); }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  dots.forEach((d,i)=> d.addEventListener('click', () => { idx = i; update(); }));

  // Autoplay (pausa en hover/focus)
  function play(){ autoplay = setInterval(next, 10000); }
  function stop(){ clearInterval(autoplay); }
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', play);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', play);
  play();

  // Swipe móvil
  track.addEventListener('touchstart', (e)=> { startX = e.touches[0].clientX; dx = 0; stop(); }, {passive:true});
  track.addEventListener('touchmove', (e)=> { dx = e.touches[0].clientX - startX; }, {passive:true});
  track.addEventListener('touchend', ()=> {
    if (dx > 50) prev();
    else if (dx < -50) next();
    play();
  });

  // Inicio
  update();
})();

// Opcional: cambiar tabla al cambiar "Gènere" si ja han posat edat < 18
const genereSel = document.getElementById("genere");
if (genereSel) {
  genereSel.addEventListener("change", () => {
    const edatInput = document.querySelector('input[name="edat"]');
    const edatVal = parseInt(edatInput?.value || "", 10);
    if (!isNaN(edatVal) && edatVal < 18) {
      // Recalcula para mostrar la tabla correcta sin recargar
      document.getElementById("form-somatotip")
        .dispatchEvent(new Event("submit", { cancelable: true }));
    }
  });
}

// Calculadora de dietes (simple i orientativa)
document.getElementById("dietes-form")?.addEventListener("submit", function(e){
  e.preventDefault();

  const pes = parseFloat(this.pes.value);
  const activitat = this.activitat.value;   // baix | mig | alt
  const objectiu = this.objectiu.value;     // perdre | mantenir | guanyar
  if (isNaN(pes)) return;

  // Estimació ràpida de manteniment per kg segons activitat
  // baix ~22 kcal/kg, mig ~26, alt ~30
  const factorAct = activitat === "baix" ? 22 : activitat === "mig" ? 26 : 30;
  let kcalMant = pes * factorAct;

  // Ajust per objectiu: -15% perdre, 0% mantenir, +15% guanyar
  let kcalObj = Math.round(
    objectiu === "perdre" ? kcalMant * 0.85 :
    objectiu === "guanyar" ? kcalMant * 1.15 :
    kcalMant
  );

  // Macros orientatius (percentatges simples)
  let pProt = 0.25, pGreix = 0.30, pHid = 0.45;
  if (objectiu === "perdre") { pProt = 0.30; pGreix = 0.30; pHid = 0.40; }
  if (objectiu === "guanyar") { pProt = 0.25; pGreix = 0.25; pHid = 0.50; }

  const kcalProt = Math.round(kcalObj * pProt);
  const kcalGreix = Math.round(kcalObj * pGreix);
  const kcalHid = Math.round(kcalObj * pHid);
  // grams aproximats (4 kcal/g proteïna i hidrats, 9 kcal/g greix)
  const gProt = Math.round(kcalProt / 4);
  const gHid = Math.round(kcalHid / 4);
  const gGreix = Math.round(kcalGreix / 9);

  const out = document.getElementById("dietes-resultat");
  document.getElementById("dietes-kcal").textContent =
    `Objectiu: ${objectiu}. Estimació de calories diàries: ${kcalObj.toLocaleString()} kcal (manteniment aprox. ${Math.round(kcalMant).toLocaleString()} kcal).`;

  const list = document.getElementById("dietes-macros");
  list.innerHTML = `
    <li>Proteïnes: ${gProt} g/dia (~${kcalProt} kcal)</li>
    <li>Hidrats de carboni: ${gHid} g/dia (~${kcalHid} kcal)</li>
    <li>Greixos: ${gGreix} g/dia (~${kcalGreix} kcal)</li>
  `;

  out.style.display = "block";
});

// TEST DE VIDA (verás el texto del botón cambiar una vez al cargar)
const _btnDietes = document.getElementById("dietes-btn");
if (_btnDietes) _btnDietes.textContent = "Calcula calories i macros";

document.getElementById("dietes-form")?.addEventListener("submit", function(e){
  e.preventDefault();

  const pes = parseFloat(this.pes.value);
  const activitat = this.activitat.value;   // baix | mig | alt
  const objectiu = this.objectiu.value;     // perdre | mantenir | guanyar
  if (isNaN(pes)) return;

  // Manteniment aproximat (kcal/kg segons activitat)
  const factorAct = activitat === "baix" ? 22 : activitat === "mig" ? 26 : 30;
  const kcalMant = pes * factorAct;

  // Ajust segons objectiu
  const kcalObj = Math.round(
    objectiu === "perdre" ? kcalMant * 0.85 :
    objectiu === "guanyar" ? kcalMant * 1.15 :
    kcalMant
  );

  // Macros orientatius
  let pProt = 0.25, pGreix = 0.30, pHid = 0.45;
  if (objectiu === "perdre")  { pProt = 0.30; pGreix = 0.30; pHid = 0.40; }
  if (objectiu === "guanyar") { pProt = 0.25; pGreix = 0.25; pHid = 0.50; }

  const kcalProt = Math.round(kcalObj * pProt);
  const kcalGreix = Math.round(kcalObj * pGreix);
  const kcalHid  = Math.round(kcalObj * pHid);

  const gProt = Math.round(kcalProt / 4);
  const gHid  = Math.round(kcalHid  / 4);
  const gGreix= Math.round(kcalGreix/ 9);

  document.getElementById("dietes-kcal").textContent =
    `Objectiu: ${objectiu}. Calories diàries estimades: ${kcalObj.toLocaleString()} kcal ` +
    `(manteniment ~${Math.round(kcalMant).toLocaleString()} kcal).`;

  document.getElementById("dietes-macros").innerHTML = `
    <li>Proteïnes: ${gProt} g/dia (~${kcalProt} kcal)</li>
    <li>Hidrats de carboni: ${gHid} g/dia (~${kcalHid} kcal)</li>
    <li>Greixos: ${gGreix} g/dia (~${kcalGreix} kcal)</li>
  `;

  document.getElementById("dietes-resultat").style.display = "block";
});

// ---------- UTILIDADES PDF ----------
function buildMenuSemana(objetivo, kcal) {
  // Ajustes de raciones por objetivo (muy orientativos)
  const plusCarbs = objetivo === "guanyar" ? " + 1 ració d'hidrats" : objetivo === "perdre" ? " (ració petita)" : "";
  const plusFats  = objetivo === "perdre" ? " (greix moderat)" : "";
  const plusProt  = objetivo === "guanyar" ? " + 1 ració proteïna" : "";

  const base = [
    {d:"Esmorzar", v:`Iogurt + civada + fruita${plusCarbs}`},
    {d:"Dinar",    v:`Plat únic: llegum/cereal + proteïna magra + verdures${plusFats}`},
    {d:"Sopar",    v:`Ous/peix/carn magra + verdures + pa o arròs integral${plusCarbs}${plusProt}`},
    {d:"Snack",    v:`Fruita / iogurt / fruits secs (petita ració)`}
  ];
  // 7 días con pequeñas variaciones
  const dias = ["Dilluns","Dimarts","Dimecres","Dijous","Divendres","Dissabte","Diumenge"];
  const vari = [
    ["Iogurt grec + maduixes", "Arròs integral + pollastre + amanida", "Truita d’espinacs + amanida", "Poma / nous"],
    ["Llet o vegetal + torrades", "Cigrons amb verdures + tonyina", "Salmó + verdures + arròs", "Iogurt natural"],
    ["Iogurt + civada + plàtan", "Pasta integral + gall dindi + amanida", "Llenties estofades + amanida", "Pastanaga + hummus"],
    ["Batuts llet + fruita", "Brou + arròs + ou dur + amanida", "Truita francesa + pa integral", "Fruita de temporada"],
    ["Iogurt + granola", "Quinoa + pollastre + amanida", "Peix blanc + patata + amanida", "Iogurt + nous"],
    ["Torrades integrals + ou", "Arròs + llenties + amanida", "Hamburguesa magra + verdures", "Fruita / fruits secs"],
    ["Iogurt + fruita", "Pasta integral + tonyina + amanida", "Pollastre al forn + verdures", "Iogurt / formatge tendre"],
  ];
  return dias.map((dia, i) => ({
    dia,
    esmorzar: vari[i][0],
    dinar:    vari[i][1],
    sopar:    vari[i][2],
    snack:    vari[i][3]
  }));
}

function buildEjercicio(objetivo) {
  if (objetivo === "perdre") {
    return [
      "3–4 dies/setm cardio moderat (30–40') + 2 dies força total cos.",
      "Passos diaris: 8–10k. 1–2 sessions HIIT curtes opcional.",
      "Força: 2–3 sèries per exercici, 8–12 repeticions."
    ];
  }
  if (objetivo === "guanyar") {
    return [
      "4–5 dies/setm de força (push/pull/legs o torç/peus).",
      "Cardio lleu 2 dies (20–25') per salut.",
      "Progressió de càrregues setmanal; 6–12 repeticions."
    ];
  }
  // mantenir
  return [
    "3 dies força + 2 dies cardio moderat.",
    "Passos diaris: 8–10k. Mobilitat 10' post-entrenament.",
    "Volum moderat i variació d’exercicis."
  ];
}

function getSomatoFromIMC(imc) {
  if (imc < 18.5) return "Ectomorf";
  if (imc < 25)   return "Mesomorf";
  return "Endomorf";
}

  function wrap(doc, text, x, y, maxW, lineH = 14) {
    const lines = doc.splitTextToSize(String(text ?? ""), maxW);
    lines.forEach(l => { doc.text(l, x, y); y += lineH; });
    return y;
  }

(function attachPDFGenerator(){
  const btn = document.getElementById("dietes-pdf");
  if (!btn) return;

btn.addEventListener("click", () => {
  // 1) coger form y validar
  const f = document.getElementById("dietes-form");
  if (!f) return alert("Omple la calculadora de dietes primer.");

  // 2) leer valores
  const pes = parseFloat(f.pes.value);
  const activitat = f.activitat.value;   // baix | mig | alt
  const objectiu = f.objectiu.value;     // perdre | mantenir | guanyar

  // 3) textos específicos según objectiu
  const conf = planIntro(objectiu);

  // 4) kcal/macros del DOM
  const kcalText = document.getElementById("dietes-kcal")?.textContent || "";
  const macrosUl = document.getElementById("dietes-macros");
  const macros = macrosUl ? Array.from(macrosUl.querySelectorAll("li")).map(li => li.textContent) : [];

  // 5) IMC / somatotip si existe
  let imcTxt = document.getElementById("resultat")?.textContent || "";
  let explicacioIMC = document.getElementById("explicacio-imc")?.innerText || "";
  const m = imcTxt.match(/IMC\s+([\d.]+)/);
  const imcVal = m ? parseFloat(m[1]) : null;
  const somato = imcVal != null ? somatoFromIMC(imcVal) : null;

  // 6) construir menú y exercici
  const menu = buildMenu(objectiu);
  const exercici = buildEx(objectiu);

  // 7) Crear PDF con jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  let x = margin, y = margin;
  const maxW = 515;

  // --- Cabecera ---
  doc.setFont("helvetica","bold"); doc.setFontSize(16);
  doc.text(conf.title, x, y); y += 20;

  doc.setFont("helvetica","normal"); doc.setFontSize(11);
  doc.text(`Pes: ${isNaN(pes) ? "—" : pes+" kg"} · Activitat: ${activitat} · Objectiu: ${objectiu}`, x, y); y += 16;
  if (imcVal != null) {
    doc.text(`IMC: ${imcVal.toFixed(1)} · Somatotip orientatiu: ${somato}`, x, y);
    y += 16;
  }

  y = wrap(doc, conf.intro, x, y, maxW);  
  y += 10;

// Tips
doc.setFont("helvetica","bold");
doc.text("Pautes clau:", x, y);   // escribe en Y actual
y += 20;                          // espacio debajo del título

doc.setFont("helvetica","normal");
for (const t of conf.tips) {
  y = wrap(doc, "• " + t, x, y, maxW);  // sin y+4
  y += 12;                               // separación entre bullets
}

y += 15;  // margen antes de la siguiente sección (kcal/macros)


  // 8) (sigues con kcal/macros, menús, exercici, IMC, disclaimer...)

     // Kcal
  if (kcalText) {
    y = wrap(doc, kcalText, x, y, maxW);
    y += 6;
  }

  // Macros
  if (macros.length) {
    doc.setFont("helvetica","bold");
    doc.text("Macros estimats:", x, y+=12);
    doc.setFont("helvetica","normal");
    macros.forEach(li => { y = wrap(doc, "• " + li, x, y + 14, maxW); });
  }

    // Salto si hace falta
    if (y > 700) { doc.addPage(); x = margin; y = margin; }

    // Menú 7 dies
    doc.setFont("helvetica","bold"); doc.setFontSize(13);
    doc.text("Menú orientatiu (7 dies)", x, y+=22);
    doc.setFont("helvetica","normal"); doc.setFontSize(11);

menu.forEach(dia => {
  if (y > 760) { doc.addPage(); x = margin; y = margin; }

  doc.setFont("helvetica","bold");
  doc.setFontSize(12);
  doc.text(dia.dia, x, y += 18);   // título del día
  doc.setFont("helvetica","normal");
  y += 15;                          // <-- margen bajo el título

  y = wrap(doc, `Esmorzar: ${dia.esmorzar}`, x, y, maxW);
  y = wrap(doc, `Dinar: ${dia.dinar}`,     x, y, maxW);
  y = wrap(doc, `Sopar: ${dia.sopar}`,     x, y, maxW);
  y = wrap(doc, `Snack: ${dia.snack}`,     x, y, maxW);

  y += 10;                          // espacio entre días
});


    // Salto
    if (y > 720) { doc.addPage(); x = margin; y = margin; }

      // Exercici
  doc.setFont("helvetica","bold"); doc.setFontSize(13);
  doc.text("Proposta d’exercici setmanal", x, y+=22);
  doc.setFont("helvetica","normal"); doc.setFontSize(11);
  exercici.forEach(p => { y = wrap(doc, "• " + p, x, y + 14, maxW); });

      // Nota IMC y disclaimer
  y += 18;
  if (explicacioIMC) {
    doc.setFont("helvetica","bold");
    doc.text("Què és l’IMC?", x, y); doc.setFont("helvetica","normal");
    y = wrap(doc, explicacioIMC, x, y + 14, maxW);
    y += 6;
  }
  doc.setFont("helvetica","italic");
  y = wrap(doc, "* Document orientatiu per al TDR. No substitueix l’assessorament professional.", x, y, maxW);

  // 9) Guardar PDF
  const mapName = { perdre: "baixar_pes", mantenir: "manteniment", guanyar: "guanyar_pes" };
doc.save(`pla_${mapName[objectiu] || "personalitzat"}_${Date.now()}.pdf`);
});          // <-- cierra addEventListener
})();        // <-- cierra IIFE attachFullPDF

// ====== Generador de PDF único y estable ======
(function attachPDFGenerator(){
  const btn = document.getElementById("dietes-pdf");
  if (!btn) return;

  // Helpers
  function somatoFromIMC(imc){ return imc < 18.5 ? "Ectomorf" : imc < 25 ? "Mesomorf" : "Endomorf"; }
  function wrap(doc, text, x, y, maxW, lineH = 14) {
    const lines = doc.splitTextToSize(String(text ?? ""), maxW);
    lines.forEach(l => { doc.text(l, x, y); y += lineH; });
    return y;
  }

  function planIntro(objectiu){
    const data = {
      perdre: {
        title: "Pla personalitzat per BAIXAR pes",
        intro: "Aquest pla està enfocat a un dèficit calòric moderat i sostenible, prioritzant aliments frescos, proteïna suficient i hàbits actius.",
        tips: [
          "Prioritza verdures, proteïna magra i hidrats integrals.",
          "Evita begudes ensucrades i grànuls extra fora d’àpats.",
          "Dorm 7–9 h i camina 8–10k passos/dia."
        ]
      },
      mantenir: {
        title: "Pla personalitzat de MANTENIMENT",
        intro: "Objectiu de pes estable amb energia adequada per rendir bé. Prioritza varietat, aliments reals i regularitat d’horaris.",
        tips: [
          "Mantén 3 àpats principals + 1 snack segons gana.",
          "Hidratació: 1.5–2 L/dia. Evita grans oscil·lacions calòriques.",
          "Combina força (3 dies) i cardio moderat (2 dies)."
        ]
      },
      guanyar: {
        title: "Pla personalitzat per GUANYAR pes",
        intro: "Lleuger superàvit calòric, proteïna i hidrats suficients per afavorir el guany muscular amb entrenament de força progressiu.",
        tips: [
          "Afegeix 1–2 racions d’hidrats extra al dia.",
          "Reparteix proteïna en 3–4 preses/dia.",
          "Entrena força 4–5 dies/setmana i progressa càrregues."
        ]
      }
    };
    return data[objectiu] || data.mantenir;
  }

  // Menú 7 dies (usa tu versión ya probada; aquí dejo una stub simple)
  function buildMenu(objectiu){
    const dies = ["Dilluns","Dimarts","Dimecres","Dijous","Divendres","Dissabte","Diumenge"];
    const vari = {
      perdre: [
        ["Iogurt natural + maduixes","Amanida + pollastre","Truita d’espinacs + verdures","Poma / nous"],
        ["Llet o vegetal + torrades","Cigrons + verdures + tonyina","Peix blanc + verdures al vapor","Iogurt natural"],
        ["Iogurt + civada + plàtan","Pasta integral + gall dindi + amanida","Llenties estofades","Pastanaga + hummus"],
        ["Batut llet + fruita","Brou + arròs + ou + amanida","Truita francesa + pa integral (petit)","Fruita temporada"],
        ["Iogurt + granola (poca)","Quinoa + pollastre + amanida","Peix blau + amanida","Iogurt + nous (poques)"],
        ["Torrades integrals + ou","Arròs + llenties + amanida","Hamburguesa magra + verdures","Fruita / fruits secs (poques)"],
        ["Iogurt + fruita","Pasta integral + tonyina + amanida","Pollastre al forn + verdures","Iogurt / formatge tendre"],
      ],
      mantenir: [
        ["Iogurt + civada + fruita","Arròs integral + pollastre + amanida","Truita d’espinacs + amanida","Poma / nous"],
        ["Llet o vegetal + torrades","Cigrons + verdures + tonyina","Peix blau + amanida","Iogurt natural"],
        ["Iogurt + civada + plàtan","Pasta + gall dindi + oli d’oliva","Llenties + amanida","Fruita / hummus"],
        ["Batut + fruita","Brou + arròs + ou + amanida","Truita francesa + pa integral","Fruita temporada"],
        ["Iogurt + granola","Quinoa + pollastre + amanida","Peix blanc + patata + amanida","Iogurt + nous"],
        ["Torrades + ou","Arròs + llenties + amanida","Hamburguesa magra + verdures","Fruita / fruits secs"],
        ["Iogurt + fruita","Pasta integral + tonyina + amanida","Pollastre al forn + verdures","Iogurt / formatge tendre"],
      ],
      guanyar: [
        ["Truita + pa integral + fruita","Pasta integral + carn magra + verdures","Arròs + tonyina/ous + amanida","Iogurt grec + fruita"],
        ["Llet + torrades + mantega de cacauet","Arròs integral + pollastre + amanida","Salmó + arròs + verdures","Iogurt grec"],
        ["Iogurt + civada + plàtan","Pasta + gall dindi + oli d’oliva","Llenties + arròs + amanida","Formatge + torrades"],
        ["Batut + civada","Quinoa + pollastre + amanida","Truita + pa + amanida","Iogurt + fruits secs"],
        ["Iogurt + granola","Arròs + peix blau + amanida","Patata + carn magra + verdures","Pa + hummus"],
        ["Torrades + ous remenats","Arròs + llenties + amanida","Hamburguesa magra + arròs + verdures","Iogurt grec + fruita"],
        ["Iogurt + fruita + civada","Pasta + tonyina + amanida","Pollastre al forn + arròs + verdures","Iogurt grec / fruits secs"],
      ]
    };
    return dies.map((dia,i)=>({ dia,
      esmorzar: vari[objectiu][i][0], dinar: vari[objectiu][i][1],
      sopar: vari[objectiu][i][2], snack: vari[objectiu][i][3],
    }));
  }

  function buildEx(objectiu){
    if(objectiu==="perdre") return [
      "3–4 dies/setm de cardio moderat (30–40’): caminar ràpid/cinta/bici.",
      "2 dies/setm de força total cos (bàsics: squat, push, pull).",
      "Passos diaris: 8–10k. 1–2 sessions HIIT curtes opcional."
    ];
    if(objectiu==="guanyar") return [
      "4–5 dies/setm de força (push/pull/legs o torso-cames).",
      "Progressió de càrregues; 6–12 repeticions; 60–90’’ descans.",
      "Cardio lleu 2 dies (20–25’) per salut/metabòlic."
    ];
    return [
      "3 dies força + 2 dies cardio moderat.",
      "Mobilitat/estiraments 10’ post-sessió.",
      "Passos diaris: 8–10k."
    ];
  }

  btn.addEventListener("click", () => {
    // jsPDF cargado
    if (!window.jspdf) { alert("jsPDF no està carregat."); return; }
    const { jsPDF } = window.jspdf;

    // Datos del form/resultados
    const f = document.getElementById("dietes-form");
    if (!f) { alert("Omple la calculadora de dietes primer."); return; }
    const pes = parseFloat(f.pes.value);
    const activitat = f.activitat.value;       // baix | mig | alt
    const objectiu = f.objectiu.value;         // perdre | mantenir | guanyar
    const conf = planIntro(objectiu);

    const kcalText = document.getElementById("dietes-kcal")?.textContent || "";
    const macrosLi = Array.from(
      document.getElementById("dietes-macros")?.querySelectorAll("li") || []
    ).map(li => li.textContent);

    // IMC de la secció anterior (si existeix)
    let imc = null, somato = null;
    const r = document.getElementById("resultat")?.textContent || ""; // "Resultat: IMC 21.2 → normal"
    const m = r.match(/IMC\s+([\d.]+)/);
    if (m){ imc = parseFloat(m[1]); somato = somatoFromIMC(imc); }
    const explicacioIMC = document.getElementById("explicacio-imc")?.innerText || "";

    // Crear PDF
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40; let x = margin, y = margin; const maxW = 515;

    // Cabecera
    doc.setFont("helvetica","bold"); doc.setFontSize(16);
    doc.text(conf.title, x, y); y += 20;
    doc.setFont("helvetica","normal"); doc.setFontSize(11);
    doc.text(`Pes: ${isNaN(pes) ? "—" : pes+" kg"} · Activitat: ${activitat} · Objectiu: ${objectiu}`, x, y); y += 16;
    if (imc !== null){ doc.text(`IMC: ${imc.toFixed(1)} · Somatotip orientatiu: ${somato}`, x, y); y += 16; }

    // Intro + tips
    y = wrap(doc, conf.intro, x, y, maxW);  y += 10;
    doc.setFont("helvetica","bold"); doc.text("Pautes clau:", x, y+=14);
    doc.setFont("helvetica","normal");
    conf.tips.forEach(t => { y = wrap(doc, "• " + t, x, y+4, maxW); });
    y += 10;

    // Kcal
    if (kcalText) { y = wrap(doc, kcalText, x, y, maxW); y += 6; }

    // Macros
    if (macrosLi.length){
      doc.setFont("helvetica","bold"); doc.text("Macros estimats:", x, y+=14);
      doc.setFont("helvetica","normal");
      macrosLi.forEach(li => { y = wrap(doc, "• " + li, x, y+14, maxW); });
    }

    // Menú 7 dies
    if (y > 700) { doc.addPage(); x = margin; y = margin; }
    doc.setFont("helvetica","bold"); doc.setFontSize(13);
    doc.text("Menú orientatiu (7 dies)", x, y+=22);
    doc.setFont("helvetica","normal"); doc.setFontSize(11);

    buildMenu(objectiu).forEach(d => {
      if (y > 760) { doc.addPage(); x = margin; y = margin; }
      doc.setFont("helvetica","bold"); doc.setFontSize(12);
      doc.text(d.dia, x, y+=18);
      doc.setFont("helvetica","normal");
      y += 15;
      y = wrap(doc, `Esmorzar: ${d.esmorzar}`, x, y, maxW);
      y = wrap(doc, `Dinar: ${d.dinar}`,     x, y, maxW);
      y = wrap(doc, `Sopar: ${d.sopar}`,     x, y, maxW);
      y = wrap(doc, `Snack: ${d.snack}`,     x, y, maxW);
      y += 10;
    });

    // Exercici
    if (y > 720) { doc.addPage(); x = margin; y = margin; }
    doc.setFont("helvetica","bold"); doc.setFontSize(13);
    doc.text("Proposta d’exercici setmanal", x, y+=22);
    doc.setFont("helvetica","normal"); doc.setFontSize(11);
    buildEx(objectiu).forEach(p => { y = wrap(doc, "• " + p, x, y + 14, maxW); });

    // Nota IMC + disclaimer
    y += 18;
    if (explicacioIMC){
      doc.setFont("helvetica","bold"); doc.text("Què és l’IMC?", x, y);
      doc.setFont("helvetica","normal");
      y = wrap(doc, explicacioIMC, x, y + 14, maxW);
      y += 6;
    }
    doc.setFont("helvetica","italic");
    y = wrap(doc, "* Document orientatiu per al TDR. No substitueix l’assessorament professional.", x, y, maxW);

    // Guardar
    const mapName = { perdre: "baixar_pes", mantenir: "manteniment", guanyar: "guanyar_pes" };
    doc.save(`pla_${mapName[objectiu] || "personalitzat"}_${Date.now()}.pdf`);
  });
})();

// Cambiar texto del botón según objectiu
document.querySelector('#dietes-form select[name="objectiu"]')?.addEventListener('change', function(){
  const btn = document.getElementById('dietes-pdf');
  if (!btn) return;
  const map = {
    perdre:   "Descarregar PDF: pla per BAIXAR pes",
    mantenir: "Descarregar PDF: pla de MANTENIMENT",
    guanyar:  "Descarregar PDF: pla per GUANYAR pes"
  };
  btn.textContent = map[this.value] || "Descarregar PDF personalitzat";
});






