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

  resultat += ` (IMC: ${imc.toFixed(1)}, activitat: ${activitat})`;
  document.getElementById("resultat").textContent = resultat;
});
