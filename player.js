(function () {


  const audio         = document.getElementById('bg-music');
  const btnPlayPause  = document.getElementById('play-pause');
  const progressBar   = document.getElementById('progress-bar');
  const progressLine  = document.getElementById('progress-line');
  const progressThumb = document.getElementById('progress-thumb');
  const tempoAtual    = document.getElementById('current-time');
  const duracaoTotal  = document.getElementById('duration');
  const volumeSlider  = document.getElementById('volume-slider');
  const capaDisco     = document.getElementById('album-cover');
  const btnAnterior   = document.getElementById('btn-prev');
  const btnProximo    = document.getElementById('btn-next');


  if (!audio) {
    console.error('[Player] ❌ Elemento <audio id="bg-music"> não encontrado no HTML.');
    return;
  }


  const srcOriginal = audio.getAttribute('src') || '';
  if (srcOriginal.startsWith('/')) audio.src = srcOriginal.replace(/^\//, '');


  console.log('[Player] 🎵 Música carregada:', audio.src);


  audio.volume = volumeSlider ? parseFloat(volumeSlider.value) : 0.7;


  function formatarTempo(segundos) {
    if (isNaN(segundos) || segundos === Infinity) return '0:00';
    const min = Math.floor(segundos / 60);
    const seg = String(Math.floor(segundos % 60)).padStart(2, '0');
    return `${min}:${seg}`;
  }


  function setText(el, valor) {
    if (el) el.textContent = valor;
  }


  function setWidth(el, pct) {
    if (el) el.style.width = pct + '%';
  }


  function setLeft(el, pct) {
    if (el) el.style.left = pct + '%';
  }




  function alternarPlay() {
    if (audio.paused) {
      audio.play().catch(err => console.error('[Player] ❌ Erro ao iniciar:', err.message));
    } else {
      audio.pause();
    }
  }


  function reiniciarInterface() {
    setText(btnPlayPause, '▶');
    capaDisco?.classList.remove('girando');
    setWidth(progressLine, 0);
    setLeft(progressThumb, 0);
    setText(tempoAtual, '0:00');
  }


  audio.addEventListener('play', () => {
    setText(btnPlayPause, '⏸');
    capaDisco?.classList.add('girando');
    iniciarNotasMusicais();
  });


  audio.addEventListener('pause', () => {
    setText(btnPlayPause, '▶');
    capaDisco?.classList.remove('girando');
    pararNotasMusicais();
  });


  audio.addEventListener('ended', () => {
    reiniciarInterface();
    pararNotasMusicais();
  });


  audio.addEventListener('loadedmetadata', () => {
    setText(duracaoTotal, formatarTempo(audio.duration));
  });


  audio.addEventListener('error', () => {
    console.error('[Player] ❌ Falha ao carregar o áudio. Código:', audio.error?.code, '| src:', audio.src);
  });


  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const porcentagem = (audio.currentTime / audio.duration) * 100;
    setWidth(progressLine, porcentagem);
    setLeft(progressThumb, porcentagem);
    setText(tempoAtual, formatarTempo(audio.currentTime));
  });


  if (btnPlayPause) btnPlayPause.addEventListener('click', alternarPlay);




  let arrastando = false;


  function buscarPosicao(evento) {
    if (!progressBar || !audio.duration) return;
    const rect     = progressBar.getBoundingClientRect();
    const fracao   = Math.max(0, Math.min(1, (evento.clientX - rect.left) / rect.width));
    audio.currentTime = fracao * audio.duration;
  }


  if (progressBar) {
    progressBar.addEventListener('mousedown',  e => { arrastando = true; buscarPosicao(e); });
    progressBar.addEventListener('touchstart', e => { arrastando = true; buscarPosicao(e.touches[0]); }, { passive: true });
  }


  document.addEventListener('mousemove', e => { if (arrastando) buscarPosicao(e); });
  document.addEventListener('mouseup',   () => { arrastando = false; });


  document.addEventListener('touchmove', e => { if (arrastando) buscarPosicao(e.touches[0]); }, { passive: true });
  document.addEventListener('touchend',  () => { arrastando = false; });




  if (btnAnterior) {
    btnAnterior.addEventListener('click', () => {
      audio.currentTime = 0;
      if (!audio.paused) audio.play().catch(() => {});
    });
  }


  if (btnProximo) {
    btnProximo.addEventListener('click', () => {
      audio.pause();
      reiniciarInterface();
    });
  }


  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      const vol    = parseFloat(volumeSlider.value);
      audio.volume = vol;
      audio.muted  = vol === 0;
    });
  }




  const NOTAS       = ['♪', '♫', '♬', '🎵', '🎶'];
  const CORES_NOTAS = ['#d63384', '#ff69b4'];
  let   intervaloNotas = null;


  function criarNota() {
    const nota = document.createElement('span');
    nota.className   = 'music-note';
    nota.textContent = NOTAS[Math.floor(Math.random() * NOTAS.length)];


    const card = document.querySelector('.card_musica');
    const rect = card
      ? card.getBoundingClientRect()
      : { left: window.innerWidth / 2, top: 200, width: 300 };


    nota.style.left  = (rect.left + Math.random() * rect.width) + 'px';
    nota.style.top   = (rect.top + window.scrollY + 20) + 'px';
    nota.style.setProperty('--dx', (Math.random() - 0.5) * 80 + 'px');
    nota.style.color = CORES_NOTAS[Math.floor(Math.random() * CORES_NOTAS.length)];


    document.body.appendChild(nota);
    setTimeout(() => nota.remove(), 3200);
  }


  function iniciarNotasMusicais() {
    if (!intervaloNotas) intervaloNotas = setInterval(criarNota, 1200);
  }


  function pararNotasMusicais() {
    clearInterval(intervaloNotas);
    intervaloNotas = null;
  }


  const SIMBOLOS_CORACAO = ['♥', '♡', '❤', '💕', '💗'];
  const CORES_CORACAO    = ['#d63384', '#ff69b4', '#e8a0b0', '#c4718a'];


  function criarCoracao() {
    const coracao    = document.createElement('span');
    coracao.textContent = SIMBOLOS_CORACAO[Math.floor(Math.random() * SIMBOLOS_CORACAO.length)];


    const tamanho   = Math.random() * 14 + 8;
    const cor       = CORES_CORACAO[Math.floor(Math.random() * CORES_CORACAO.length)];
    const duracao   = 9 + Math.random() * 13;


    coracao.style.cssText = `
      position: fixed;
      bottom: -30px;
      left: ${Math.random() * 100}vw;
      font-size: ${tamanho}px;
      color: ${cor};
      opacity: 0;
      pointer-events: none;
      z-index: 0;
      animation: coracao-subir ${duracao}s linear forwards;
    `;


    document.body.appendChild(coracao);


    coracao.addEventListener('animationend', () => coracao.remove());
  }


  setInterval(criarCoracao, 600);


  const DATA_INICIO = new Date('2025-05-11T00:00:00');


  const IDS_CONTADOR = {
    anos    : 'cnt-anos',
    meses   : 'cnt-meses',
    dias    : 'cnt-dias',
    horas   : 'cnt-horas',
    minutos : 'cnt-minutos',
    segundos: 'cnt-segundos',
  };


  function calcularTempoJuntos() {
    const diff = Date.now() - DATA_INICIO.getTime();


    return {
      anos    : Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)),
      meses   : Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44)),
      dias    : Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44))  / (1000 * 60 * 60 * 24)),
      horas   : Math.floor((diff % (1000 * 60 * 60 * 24))          / (1000 * 60 * 60)),
      minutos : Math.floor((diff % (1000 * 60 * 60))               / (1000 * 60)),
      segundos: Math.floor((diff % (1000 * 60))                    / 1000),
    };
  }


  function atualizarContador() {
    const tempo = calcularTempoJuntos();


    for (const [unidade, id] of Object.entries(IDS_CONTADOR)) {
      const el = document.getElementById(id);
      const novoValor = String(tempo[unidade]);
      if (el && el.textContent !== novoValor) {
        el.textContent = novoValor;
      }
    }
  }


  atualizarContador();
  setInterval(atualizarContador, 1000);


})();
