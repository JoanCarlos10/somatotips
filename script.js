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

function lineWrap(doc, text, width) {
  const lines = doc.splitTextToSize(text, width);
  lines.forEach((l) => doc.text(l, doc.x, doc.y += 6));
}

(function attachPDFGenerator(){
  const btn = document.getElementById("dietes-pdf");
  if (!btn) return;

  btn.addEventListener("click", () => {
    // Leer datos del formulario de dietas
    const f = document.getElementById("dietes-form");
    if (!f) return alert("Omple la calculadora de dietes primer.");
    const pes = parseFloat(f.pes.value);
    const activitat = f.activitat.value;         // baix|mig|alt
    const objectiu = f.objectiu.value;           // perdre|mantenir|guanyar
    const kcalText = document.getElementById("dietes-kcal")?.textContent || "";
    const macrosUl = document.getElementById("dietes-macros");
    const macros = macrosUl ? Array.from(macrosUl.querySelectorAll("li")).map(li => li.textContent) : [];

    // Intentar coger IMC/somatotip si ya lo calculó
    let imcTxt = document.getElementById("resultat")?.textContent || ""; // "Resultat: IMC 21.2 → normal"
    let explicacioIMC = document.getElementById("explicacio-imc")?.innerText || "";

    // Parseo sencillo de IMC
    let imcVal = null, somato = null;
    const m = imcTxt.match(/IMC\s+([\d.]+)/);
    if (m) {
      imcVal = parseFloat(m[1]);
      somato = getSomatoFromIMC(imcVal);
    }

    // Construir menú y plan de ejercicios
    const menu = buildMenuSemana(objectiu, kcalText);
    const exercici = buildEjercicio(objectiu);

    // ---------- Crear PDF con jsPDF ----------
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    let x = margin, y = margin;
    const maxW = 515; // ancho útil A4 en pt (595-2*40 aprox)

    doc.setFont("helvetica","bold"); doc.setFontSize(16);
    doc.text("Pla personalitzat – Dietes i exercici (orientatiu)", x, y); y += 18;

    doc.setFont("helvetica","normal"); doc.setFontSize(11);
    doc.text(`Pes: ${isNaN(pes) ? "—" : pes + " kg"} · Activitat: ${activitat} · Objectiu: ${objectiu}`, x, y); y += 16;

    if (imcVal !== null) {
      doc.text(`IMC: ${imcVal.toFixed(1)} · Somatotip orientatiu: ${somato}`, x, y);
      y += 16;
    }

    // Kcal
    if (kcalText) {
      lineWrap(doc, kcalText, maxW);
      y += 6;
    }

    // Macros
    if (macros.length) {
      doc.setFont("helvetica","bold");
      doc.text("Macros estimats:", x, y+=12);
      doc.setFont("helvetica","normal");
      macros.forEach(li => { y+=14; lineWrap(doc, "• " + li, maxW); });
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
      doc.text(dia.dia, x, y+=16);
      doc.setFont("helvetica","normal");
      lineWrap(doc, `Esmorzar: ${dia.esmorzar}`, maxW);
      lineWrap(doc, `Dinar: ${dia.dinar}`, maxW);
      lineWrap(doc, `Sopar: ${dia.sopar}`, maxW);
      lineWrap(doc, `Snack: ${dia.snack}`, maxW);
      y += 6;
    });

    // Salto
    if (y > 720) { doc.addPage(); x = margin; y = margin; }

    // Exercici
    doc.setFont("helvetica","bold"); doc.setFontSize(13);
    doc.text("Proposta d’exercici setmanal", x, y+=22);
    doc.setFont("helvetica","normal"); doc.setFontSize(11);
    exercici.forEach(p => { y+=14; lineWrap(doc, "• " + p, maxW); });

    // Nota IMC y disclaimer
    y += 18;
    if (explicacioIMC) {
      doc.setFont("helvetica","bold");
      doc.text("Què és l’IMC?", x, y); doc.setFont("helvetica","normal");
      y += 14; lineWrap(doc, explicacioIMC, maxW);
      y += 6;
    }
    doc.setFont("helvetica","italic");
    lineWrap(doc, "* Document orientatiu per al TDR. No substitueix l’assessorament professional.", maxW);

    // Guardar
    const fname = `pla_dietes_${objectiu}_${Date.now()}.pdf`;
    doc.save(fname);
  });
})();

// Test mínimo para el botón PDF
const pdfBtn = document.getElementById("dietes-pdf");
if (pdfBtn) {
  pdfBtn.addEventListener("click", () => {
    console.log("click en dietes-pdf");
    if (!window.jspdf) {
      alert("jsPDF no està carregat. Revisa el <script> del CDN al final de l'HTML.");
      return;
    }
    // Crear un PDF muy simple
    const { jsPDF } = window.jspdf;        // <- acceso UMD
    try {
      const doc = new jsPDF();
      doc.text("Prova de PDF (hola!)", 20, 20);
      doc.save("prova.pdf");
    } catch (err) {
      console.error(err);
      alert("Error creant el PDF. Mira la consola (F12).");
    }
  });
}



















