// Carrega data/content.json e preenche a página. Ao terminar, dispara
// "content:ready" — o script.js espera esse evento antes de ligar as
// interações (accordion, formulário etc.), já que esses elementos só
// existem depois deste script rodar.

(function () {
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function whatsappUrl(number, message) {
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  // Texto simples com suporte a **negrito** (usado no parágrafo "Sobre").
  function renderInlineMarkdownBold(container, text) {
    const parts = text.split(/\*\*(.+?)\*\*/g);
    parts.forEach((part, i) => {
      if (i % 2 === 1) {
        const strong = document.createElement('strong');
        strong.textContent = part;
        container.appendChild(strong);
      } else if (part) {
        container.appendChild(document.createTextNode(part));
      }
    });
  }

  function setText(id, text) {
    const node = document.getElementById(id);
    if (node) node.textContent = text;
  }

  function renderHeader(site) {
    const parts = site.brand_name.trim().split(' ');
    const last = parts.pop();
    const logoHtml = (name) => {
      const wrap = document.createDocumentFragment();
      if (parts.length) wrap.appendChild(document.createTextNode(parts.join(' ') + ' '));
      const strong = document.createElement('strong');
      strong.textContent = last;
      wrap.appendChild(strong);
      return wrap;
    };
    document.getElementById('logoText').appendChild(logoHtml());
    document.getElementById('footerLogoText').appendChild(logoHtml());

    const phoneLink = document.getElementById('phoneHeaderLink');
    phoneLink.href = `tel:${site.phone_primary_tel}`;
    setText('phoneHeaderText', site.phone_primary_display);

    const waUrl = whatsappUrl(site.whatsapp_number, site.whatsapp_default_message);
    document.getElementById('whatsappHeaderLink').href = waUrl;
    document.getElementById('whatsappFloat').href = waUrl;
  }

  function renderHero(hero, site) {
    setText('heroBadge', hero.badge);
    setText('heroTitleLine1', hero.title_line1);
    setText('heroTitleAccent', hero.title_accent);
    setText('heroLead', hero.lead);
    setText('heroVisualCaption', hero.visual_caption);

    const ctaPrimary = document.getElementById('heroCtaPrimary');
    ctaPrimary.href = whatsappUrl(site.whatsapp_number, site.whatsapp_default_message);
    ctaPrimary.textContent = hero.cta_primary_text;
    document.getElementById('heroCtaSecondary').textContent = hero.cta_secondary_text;

    const trust = document.getElementById('heroTrust');
    trust.innerHTML = '';
    hero.trust.forEach(item => {
      const li = document.createElement('li');
      const strong = document.createElement('strong');
      strong.textContent = item.value;
      li.appendChild(strong);
      li.appendChild(document.createTextNode(' ' + item.label));
      trust.appendChild(li);
    });

    swapHeroPhoto('heroVisualBefore', hero.visual_before_image, 'Antes');
    swapHeroPhoto('heroVisualAfter', hero.visual_after_image, 'Depois');
  }

  function swapHeroPhoto(containerId, src, alt) {
    if (!src) return;
    const half = document.getElementById(containerId);
    const illustration = half.querySelector('.sofa-illustration');
    if (illustration) illustration.remove();
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.position = 'absolute';
    img.style.inset = '0';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    half.appendChild(img);
  }

  function renderAbout(about) {
    setText('aboutEyebrow', about.eyebrow);
    setText('aboutTitle', about.title);
    setText('aboutPhotoNote', about.photo_note);
    setText('aboutSignatureName', about.signature_name);
    setText('aboutSignatureRole', about.signature_role);

    const paragraphs = document.getElementById('aboutParagraphs');
    paragraphs.innerHTML = '';
    about.paragraphs.forEach(text => {
      const p = document.createElement('p');
      renderInlineMarkdownBold(p, text);
      paragraphs.appendChild(p);
    });

    if (about.photo) {
      const frame = document.getElementById('aboutPhotoFrame');
      frame.innerHTML = '';
      const img = document.createElement('img');
      img.src = about.photo;
      img.alt = about.signature_name;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.borderRadius = 'inherit';
      frame.appendChild(img);
    }
  }

  function renderServices(services) {
    setText('servicesEyebrow', services.eyebrow);
    setText('servicesTitle', services.title);
    setText('servicesLead', services.lead);
    setText('servicesExtraTitle', services.extra_title);

    const grid = document.getElementById('servicesGrid');
    grid.innerHTML = '';
    services.items.forEach(item => {
      const card = el('div', 'service-card');
      card.appendChild(el('div', 'service-card__icon', item.icon));
      card.appendChild(el('h3', null, item.title));
      grid.appendChild(card);
    });

    const chips = document.getElementById('servicesExtraChips');
    chips.innerHTML = '';
    services.extra_items.forEach(text => {
      chips.appendChild(el('span', 'chip', text));
    });
  }

  function renderProcess(process) {
    setText('processEyebrow', process.eyebrow);
    setText('processTitle', process.title);
    setText('processLead', process.lead);

    const timeline = document.getElementById('processTimeline');
    timeline.innerHTML = '';
    process.steps.forEach((step, i) => {
      const item = el('div', 'timeline__step');
      item.appendChild(el('span', 'timeline__num', String(i + 1)));
      item.appendChild(el('h3', null, step.title));
      item.appendChild(el('p', null, step.text));
      timeline.appendChild(item);
    });
  }

  function renderPricing(pricing, site) {
    setText('pricingEyebrow', pricing.eyebrow);
    setText('pricingTitle', pricing.title);
    setText('pricingText', pricing.text);
    setText('pricingCardTitle', pricing.card_title);
    setText('pricingCardText', pricing.card_text);
    setText('pricingCardNoteStrong', pricing.card_note.split(':')[0] + ':');
    setText('pricingCardNoteRest', pricing.card_note.split(':').slice(1).join(':'));

    const payments = document.getElementById('pricingPayments');
    payments.innerHTML = '';
    pricing.payments.forEach(text => payments.appendChild(el('li', null, text)));

    const cta = document.getElementById('pricingCta');
    cta.href = whatsappUrl(site.whatsapp_number, site.whatsapp_visit_message);
    cta.textContent = pricing.cta_text;
  }

  function renderDifferentials(diff) {
    setText('diffEyebrow', diff.eyebrow);
    setText('diffTitle', diff.title);

    const grid = document.getElementById('diffGrid');
    grid.innerHTML = '';
    diff.items.forEach(item => {
      const card = el('div', 'diff-card');
      card.appendChild(el('div', 'diff-card__icon', item.icon));
      card.appendChild(el('h3', null, item.title));
      card.appendChild(el('p', null, item.text));
      grid.appendChild(card);
    });

    const stats = document.getElementById('diffStats');
    stats.innerHTML = '';
    diff.stats.forEach(stat => {
      const wrap = el('div', 'stat');
      wrap.appendChild(el('strong', null, stat.value));
      wrap.appendChild(el('span', null, stat.label));
      stats.appendChild(wrap);
    });
  }

  function renderGallery(gallery) {
    setText('galleryEyebrow', gallery.eyebrow);
    setText('galleryTitle', gallery.title);
    setText('galleryLead', gallery.lead);

    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';
    gallery.items.forEach(item => {
      const card = el('div', 'gallery-card');
      const split = el('div', 'gallery-card__split');

      const before = el('div', 'gallery-card__side gallery-card__side--before');
      if (item.before_image) {
        const img = el('img'); img.src = item.before_image; img.alt = 'Antes';
        img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'cover';
        before.appendChild(img);
      } else {
        before.textContent = 'Antes';
      }

      const after = el('div', 'gallery-card__side gallery-card__side--after');
      if (item.after_image) {
        const img = el('img'); img.src = item.after_image; img.alt = 'Depois';
        img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'cover';
        after.appendChild(img);
      } else {
        after.textContent = 'Depois';
      }

      split.appendChild(before);
      split.appendChild(after);
      card.appendChild(split);
      card.appendChild(el('p', null, item.caption));
      grid.appendChild(card);
    });
  }

  function youtubeEmbedUrl(url) {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : null;
  }

  function renderVideos(videos) {
    const section = document.getElementById('videos');
    if (!videos.items || !videos.items.length) {
      section.style.display = 'none';
      return;
    }
    section.style.display = '';
    setText('videosEyebrow', videos.eyebrow);
    setText('videosTitle', videos.title);
    setText('videosLead', videos.lead);

    const grid = document.getElementById('videosGrid');
    grid.innerHTML = '';
    videos.items.forEach(item => {
      const card = el('div', 'gallery-card');
      const embed = youtubeEmbedUrl(item.url);
      if (embed) {
        const iframe = document.createElement('iframe');
        iframe.src = embed;
        iframe.style.width = '100%';
        iframe.style.aspectRatio = '16/9';
        iframe.style.border = '0';
        iframe.allowFullscreen = true;
        iframe.loading = 'lazy';
        card.appendChild(iframe);
      } else {
        const a = el('a', null, item.url);
        a.href = item.url; a.target = '_blank'; a.rel = 'noopener';
        card.appendChild(a);
      }
      if (item.caption) card.appendChild(el('p', null, item.caption));
      grid.appendChild(card);
    });
  }

  function renderTestimonials(testimonials) {
    setText('testimonialsEyebrow', testimonials.eyebrow);
    setText('testimonialsTitle', testimonials.title);

    const grid = document.getElementById('testimonialsGrid');
    grid.innerHTML = '';
    testimonials.items.forEach(item => {
      const card = el('div', 'testimonial-card');
      card.appendChild(el('div', 'testimonial-card__stars', '★'.repeat(item.stars)));
      card.appendChild(el('p', null, `"${item.text}"`));
      card.appendChild(el('span', 'testimonial-card__author', item.author));
      grid.appendChild(card);
    });
  }

  function renderArea(area, site) {
    setText('areaEyebrow', area.eyebrow);
    setText('areaTitle', area.title);
    setText('areaText', area.text);
    setText('areaHours', area.hours_text);

    const cities = document.getElementById('areaCities');
    cities.innerHTML = '';
    area.cities.forEach(city => cities.appendChild(el('li', null, city)));

    const mapQuery = (site.address || area.cities.join(', ')).trim();
    if (mapQuery) {
      document.getElementById('areaMapFrame').src =
        `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
    }
  }

  function renderFaq(faq) {
    setText('faqEyebrow', faq.eyebrow);
    setText('faqTitle', faq.title);

    const accordion = document.getElementById('accordion');
    accordion.innerHTML = '';
    faq.items.forEach(item => {
      const wrap = el('div', 'accordion__item');
      const trigger = el('button', 'accordion__trigger');
      trigger.appendChild(document.createTextNode(item.question + ' '));
      trigger.appendChild(el('span', 'accordion__icon', '+'));
      const panel = el('div', 'accordion__panel');
      panel.appendChild(el('p', null, item.answer));
      wrap.appendChild(trigger);
      wrap.appendChild(panel);
      accordion.appendChild(wrap);
    });
  }

  function renderContact(contact, site) {
    setText('contactEyebrow', contact.eyebrow);
    setText('contactTitle', contact.title);
    setText('contactLead', contact.lead);
    setText('contactFormNote', contact.form_note);

    const list = document.getElementById('contactList');
    list.innerHTML = '';

    const items = [
      { icon: '📞', label: 'WhatsApp / Telefone principal', value: site.phone_primary_display, href: `tel:${site.phone_primary_tel}` },
      { icon: '☎️', label: 'Telefone secundário', value: site.phone_secondary_display, href: `tel:${site.phone_secondary_tel}` },
      { icon: '✉️', label: 'E-mail', value: site.email, href: `mailto:${site.email}` },
      { icon: '📍', label: 'Base operacional', value: site.address, href: null },
      { icon: '🕗', label: 'Horário', value: site.hours, href: null }
    ];
    items.forEach(item => {
      const li = document.createElement('li');
      li.appendChild(el('span', 'contact__icon', item.icon));
      const div = document.createElement('div');
      div.appendChild(el('strong', null, item.label));
      if (item.href) {
        const a = el('a', null, item.value); a.href = item.href;
        div.appendChild(a);
      } else {
        div.appendChild(el('span', null, item.value));
      }
      li.appendChild(div);
      list.appendChild(li);
    });

    const social = document.getElementById('contactSocial');
    social.innerHTML = '';
    const ig = el('a', null, site.instagram_label);
    ig.href = site.instagram_url; ig.target = '_blank'; ig.rel = 'noopener';
    const fb = el('a', null, site.facebook_label);
    fb.href = site.facebook_url; fb.target = '_blank'; fb.rel = 'noopener';
    social.appendChild(ig);
    social.appendChild(fb);

    const form = document.getElementById('orcamentoForm');
    form.dataset.whatsapp = site.whatsapp_number;
  }

  function renderFooter(footer, site) {
    setText('footerTagline', footer.tagline);
    setText('footerCopyright', footer.copyright_name);

    const phoneLink = document.getElementById('footerPhoneLink');
    phoneLink.href = `tel:${site.phone_primary_tel}`;
    phoneLink.textContent = site.phone_primary_display;

    const emailLink = document.getElementById('footerEmailLink');
    emailLink.href = `mailto:${site.email}`;
    emailLink.textContent = site.email;

    setText('footerHours', site.hours);
  }

  fetch('data/content.json')
    .then(res => res.json())
    .then(content => {
      document.title = content.site.title;
      const metaDesc = document.getElementById('metaDescription');
      if (metaDesc) metaDesc.setAttribute('content', content.site.description);

      renderHeader(content.site);
      renderHero(content.hero, content.site);
      renderAbout(content.about);
      renderServices(content.services);
      renderProcess(content.process);
      renderPricing(content.pricing, content.site);
      renderDifferentials(content.differentials);
      renderGallery(content.gallery);
      renderVideos(content.videos);
      renderTestimonials(content.testimonials);
      renderArea(content.area, content.site);
      renderFaq(content.faq);
      renderContact(content.contact, content.site);
      renderFooter(content.footer, content.site);

      document.dispatchEvent(new Event('content:ready'));
    })
    .catch(err => {
      console.error('Não foi possível carregar data/content.json', err);
    });
})();
