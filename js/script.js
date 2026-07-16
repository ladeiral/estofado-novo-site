// Todo o conteúdo interativo depende de elementos criados dinamicamente
// pelo content-loader.js (accordion, lista de contato etc.), então só
// inicializamos depois que o evento "content:ready" é disparado.
document.addEventListener('content:ready', () => {

  // Menu mobile
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  const navLinks = Array.from(nav.querySelectorAll('.nav__link'));
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  // Indicador deslizante do menu (segue o hover / item ativo)
  const navIndicator = document.getElementById('navIndicator');

  function moveIndicatorTo(link) {
    if (!link || window.innerWidth <= 980) {
      navIndicator.classList.remove('is-visible');
      return;
    }
    navIndicator.style.width = link.offsetWidth + 'px';
    navIndicator.style.transform = `translateX(${link.offsetLeft}px)`;
    navIndicator.classList.add('is-visible');
  }

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => moveIndicatorTo(link));
  });
  nav.addEventListener('mouseleave', () => {
    const active = nav.querySelector('.nav__link.active');
    moveIndicatorTo(active);
  });

  // Scroll-spy: destaca o link da seção visível
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = '#' + entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === id);
      });
      if (!nav.matches(':hover')) {
        moveIndicatorTo(nav.querySelector('.nav__link.active'));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(section => spyObserver.observe(section));

  window.addEventListener('resize', () => {
    moveIndicatorTo(nav.querySelector('.nav__link.active'));
  });

  // Accordion FAQ
  document.querySelectorAll('.accordion__item').forEach(item => {
    const trigger = item.querySelector('.accordion__trigger');
    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.accordion__item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // Formulário de orçamento -> WhatsApp
  const form = document.getElementById('orcamentoForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const nome = data.get('nome').trim();
    const telefone = data.get('telefone').trim();
    const cidade = data.get('cidade').trim();
    const estofado = data.get('estofado');
    const mensagem = data.get('mensagem').trim();

    const texto =
      `Olá! Gostaria de um orçamento.%0A` +
      `Nome: ${nome}%0A` +
      `Telefone: ${telefone}%0A` +
      `Cidade/bairro: ${cidade}%0A` +
      `Tipo de estofado: ${estofado}` +
      (mensagem ? `%0ADetalhes: ${mensagem}` : '');

    const whatsappNumber = form.dataset.whatsapp;
    window.open(`https://wa.me/${whatsappNumber}?text=${texto}`, '_blank');
    form.reset();
  });

  // Ano no rodapé
  document.getElementById('year').textContent = new Date().getFullYear();

  // Header com sombra ao rolar
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10 ? '0 4px 20px rgba(0,0,0,.06)' : 'none';
  });

});
