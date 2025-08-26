document.getElementById("form-somatotip").addEventListener("submit", function(e) {
  e.preventDefault();

  const altura = parseFloat(this.altura.value);  // cm
  const pes = parseFloat(this.pes.value);        // kg
  const edat = parseInt(this.edat.value, 10);    // anys
  const activitat = this.activitat.value;        // info contextual

  const imc = pes / ((altura / 100) ** 2);

  // Categoria IMC (adults)
  let cat;
  if (imc < 18.5)      cat = "baix";
  else if (imc < 25)   cat = "normal";
  else                 cat = "alt";

  // Resultado visible: IMC + categoría
  document.getElementById("resultat").textContent =
    `IMC: ${imc.toFixed(1)} — ${cat} (activitat: ${activitat}).`;

  // Explicación clara del IMC
  document.getElementById("explicacio-imc").textContent =
    "L'IMC (Índex de Massa Corporal) és una mesura orientativa que relaciona el pes amb l'alçada (pes/altura²). " +
    "Serveix per estimar si el pes és per sota (baix), dins (normal) o per sobre (alt) del rang saludable en adults.";

  // Nota según la edad
  const nota = document.getElementById("nota");
  if (edat < 18) {
    nota.textContent = "Atenció: per a menors de 18 anys, l'IMC s'interpreta amb taules específiques per edat i gènere. Pren aquest resultat com a orientatiu.";
  } else {
    nota.textContent = "Recorda: l'IMC no diferencia entre múscul i greix i pot no reflectir la composició corporal.";
  }

  document.getElementById("panel-resultat").style.display = "block";
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






