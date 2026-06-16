/* Zero Dance Studio — Vanilla JS */
(function(){
  'use strict';

  // Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Sticky navbar
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    document.getElementById('toTop').classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Mobile menu
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

  // Scroll to top
  document.getElementById('toTop').addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

  // Reveal on scroll
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); revealIO.unobserve(e.target); } });
  }, {threshold:0.12});
  document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

  // Counters
  const counters = document.querySelectorAll('.counter');
  const animateCounter = (el) => {
    const target = +el.dataset.target;
    const divide = +el.dataset.divide || 1;
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const val = Math.floor(target * (1 - Math.pow(1 - p, 3)));
      el.textContent = divide > 1 ? (val/divide).toFixed(1) : val.toLocaleString();
      if(p < 1) requestAnimationFrame(tick);
      else el.textContent = (divide > 1 ? (target/divide).toFixed(1) : target.toLocaleString()) + (el.dataset.suffix||'');
    };
    requestAnimationFrame(tick);
  };
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ animateCounter(e.target); counterIO.unobserve(e.target); } });
  }, {threshold:0.5});
  counters.forEach(c => counterIO.observe(c));

  // Gallery filter
  const filters = document.querySelectorAll('.filter');
  const items = document.querySelectorAll('.m-item');
  filters.forEach(f => f.addEventListener('click', () => {
    filters.forEach(x => x.classList.remove('active'));
    f.classList.add('active');
    const v = f.dataset.filter;
    items.forEach(it => {
      const show = v === 'all' || it.classList.contains(v);
      it.style.display = show ? '' : 'none';
    });
  }));

  // Lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImage');
  let gallery = [], idx = 0;
  const openLB = (i) => {
    gallery = Array.from(document.querySelectorAll('.m-item')).filter(el => el.style.display !== 'none').map(el => el.querySelector('img').src);
    idx = i;
    lbImg.src = gallery[idx];
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLB = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
  const navLB = (d) => { idx = (idx + d + gallery.length) % gallery.length; lbImg.src = gallery[idx]; };
  items.forEach((it, i) => it.addEventListener('click', () => {
    const visible = Array.from(document.querySelectorAll('.m-item')).filter(el => el.style.display !== 'none');
    openLB(visible.indexOf(it));
  }));
  document.getElementById('lbClose').addEventListener('click', closeLB);
  document.getElementById('lbPrev').addEventListener('click', () => navLB(-1));
  document.getElementById('lbNext').addEventListener('click', () => navLB(1));
  lb.addEventListener('click', e => { if(e.target === lb) closeLB(); });
  document.addEventListener('keydown', e => {
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') closeLB();
    if(e.key === 'ArrowLeft') navLB(-1);
    if(e.key === 'ArrowRight') navLB(1);
  });

  // Reviews slider
  const slides = document.getElementById('slides');
  const total = slides.children.length;
  const dotsWrap = document.getElementById('dots');
  let current = 0, autoTimer;
  for(let i=0;i<total;i++){
    const d = document.createElement('span');
    d.addEventListener('click', () => go(i));
    dotsWrap.appendChild(d);
  }
  const dots = dotsWrap.children;
  const go = (i) => {
    current = (i + total) % total;
    slides.style.transform = `translateX(-${current*100}%)`;
    Array.from(dots).forEach((d,k) => d.classList.toggle('active', k===current));
    resetAuto();
  };
  const resetAuto = () => { clearInterval(autoTimer); autoTimer = setInterval(() => go(current+1), 5500); };
  document.getElementById('prevSlide').addEventListener('click', () => go(current-1));
  document.getElementById('nextSlide').addEventListener('click', () => go(current+1));
  go(0);

  // Form validation
  const form = document.getElementById('trialForm');
  const msg = document.getElementById('formMsg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = fd.get('name').toString().trim();
    const phone = fd.get('phone').toString().trim();
    const age = fd.get('age').toString().trim();
    const style = fd.get('style').toString().trim();
    let ok = true;
    form.querySelectorAll('input,select').forEach(el => el.classList.remove('error'));
    if(name.length < 2){ form.name.classList.add('error'); ok = false; }
    if(!/^[+\d\s\-()]{8,}$/.test(phone)){ form.phone.classList.add('error'); ok = false; }
    if(!age || +age < 3){ form.age.classList.add('error'); ok = false; }
    if(!style){ form.style.classList.add('error'); ok = false; }
    if(!ok){ msg.style.color = '#e25c5c'; msg.textContent = 'Please complete all required fields correctly.'; return; }
    msg.style.color = '#D4AF37';
    msg.textContent = '✓ Thanks ' + name + '! We will WhatsApp you shortly to confirm your free trial slot.';
    const wa = `Hi Zero Dance Studio! I'd like to book a free trial.%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AAge: ${encodeURIComponent(age)}%0AStyle: ${encodeURIComponent(style)}`;
    setTimeout(() => window.open('https://wa.me/918446188518?text=' + wa, '_blank'), 800);
    form.reset();
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if(id.length > 1){
      const t = document.querySelector(id);
      if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); }
    }
  }));
})();
