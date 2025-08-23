document.getElementById('form-somatotip')?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const pes = +e.target.pes.value || 0;
    const altura = (+e.target.altura.value || 0)/100;
    const imc = altura>0 ? (pes/(altura*altura)).toFixed(1) : '—';
    let tipus = 'Mesomorf (demo)';
    if(imc !== '—'){
      const n = parseFloat(imc);
      if(n < 19) tipus = 'Ectomorf (demo)';
      else if(n > 26) tipus = 'Endomorf (demo)';
    }
    document.getElementById('resultat').textContent = `IMC: ${imc} · Somatotip orientatiu: ${tipus}`;
  });
  