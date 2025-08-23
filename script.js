document.getElementById("form-somatotip").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const altura = parseInt(this.altura.value);
  const pes = parseInt(this.pes.value);
  const activitat = this.activitat.value;

  const imc = pes / ((altura / 100) ** 2);
  let resultat = "";

  if (imc < 18.5) {
    resultat = "Somatotip orientatiu: Ectomorf";
  } else if (imc < 25) {
    resultat = "Somatotip orientatiu: Mesomorf";
  } else {
    resultat = "Somatotip orientatiu: Endomorf";
  }

  document.getElementById("resultat").textContent =
    `${resultat} (IMC: ${imc.toFixed(1)}, activitat: ${activitat})`;

  document.getElementById("explicacio-imc").textContent =
    "L'IMC (Índex de Massa Corporal) és una mesura orientativa que relaciona el pes amb l'alçada. No té en compte la composició corporal (greix vs múscul).";
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



