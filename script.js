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



















