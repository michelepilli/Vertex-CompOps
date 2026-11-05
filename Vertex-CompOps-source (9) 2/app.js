(() => {
  const nav = document.querySelector('.nav');
  const download = document.querySelector('.dl');
  const progress = document.querySelector('.progress');
  let lastSection = '#foreword';
  download.addEventListener('click', event => event.preventDefault());
  nav.addEventListener('click', event => {
    if (nav.dataset.mode === 'back') { event.preventDefault(); document.querySelector(lastSection)?.scrollIntoView({behavior:'smooth'}); }
    else { const current = [...document.querySelectorAll('main > section')].find(s => { const r=s.getBoundingClientRect(); return r.top <= innerHeight * .35 && r.bottom > innerHeight * .35; }); if(current && current.id !== 'contents') lastSection='#'+current.id; }
  });
  function updateUI() {
    const y = scrollY, max = document.documentElement.scrollHeight-innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y/max : 0})`;
    const probe = innerHeight*.2;
    let current = [...document.querySelectorAll('main > section')].find(s=>{const r=s.getBoundingClientRect(); return r.top<=probe && r.bottom>probe;});
    current ||= document.querySelector('#cover');
    nav.dataset.hidden = current.id === 'cover';
    nav.dataset.mode = current.id === 'contents' ? 'back' : 'index';
    nav.setAttribute('aria-label',current.id === 'contents' ? 'Return to previous section' : 'Go to contents');
    nav.querySelector('span').textContent = current.id === 'contents' ? 'Back' : 'Index';
    nav.dataset.theme=current.dataset.theme;
    const bprobe=innerHeight-45;
    const buttonSection=[...document.querySelectorAll('main > section')].find(s=>{const r=s.getBoundingClientRect();return r.top<=bprobe && r.bottom>bprobe;});
    download.dataset.theme=buttonSection?.dataset.theme || current.dataset.theme;
  }
  addEventListener('scroll',updateUI,{passive:true}); addEventListener('resize',updateUI); updateUI();
  const exhibitScrolls = [...document.querySelectorAll('.part2-scroll')];
  exhibitScrolls.forEach(el => { const hint=document.createElement('p'); hint.className='part2-hint'; hint.textContent='Scroll horizontally to see the full exhibit →'; el.before(hint); });
  function updateExhibitHints(){ exhibitScrolls.forEach(el => { el.previousElementSibling.hidden = el.scrollWidth <= el.clientWidth + 1; }); }
  addEventListener('resize',updateExhibitHints); addEventListener('load',updateExhibitHints); updateExhibitHints();
  const wideTables = [...document.querySelectorAll('.wide-table')];
  wideTables.forEach(el => {const hint=document.createElement('p');hint.className='wide-table-hint';hint.textContent='Scroll horizontally to see the full table →';el.before(hint);});
  function updateWideHints(){wideTables.forEach(el=>{el.previousElementSibling.hidden = el.scrollWidth <= el.clientWidth + 1;});}
  addEventListener('resize',updateWideHints);addEventListener('load',updateWideHints);document.querySelectorAll('.data-values').forEach(el=>el.addEventListener('toggle',updateWideHints));updateWideHints();
  document.querySelectorAll('[data-chart]').forEach(chart => {
    const context=chart.querySelector('.chart-context');
    chart.querySelectorAll('[data-tip]').forEach(mark => {
      const show=()=>{ context.textContent=mark.dataset.tip; };
      mark.addEventListener('mouseenter',show);mark.addEventListener('focus',show);mark.addEventListener('click',show);
    });
  });
  const figureScrolls=[...document.querySelectorAll('.figure-scroll')];
  function updateFigureHints(){figureScrolls.forEach(el=>{el.previousElementSibling.hidden=el.scrollWidth<=el.clientWidth+4;});}
  addEventListener('resize',updateFigureHints);addEventListener('load',updateFigureHints);updateFigureHints();
  const charts=[...document.querySelectorAll('[data-chart]')];
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target)}}),{threshold:.08});charts.forEach(c=>observer.observe(c));
  } else charts.forEach(c=>c.classList.add('in-view'));
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis) {
    const lenis = new Lenis({duration:1.05, smoothWheel:true});
    lenis.on('scroll',ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0);
  }
  gsap.from('.cover-art svg path',{x:-110,opacity:0,stagger:.16,duration:1.4,ease:'power3.out'});
  gsap.from('.cover-title .ln > span',{yPercent:110,stagger:.12,duration:1.05,delay:.15,ease:'power3.out'});
  ScrollTrigger.matchMedia({
    '(min-width: 820px)': function() {
      const cover=gsap.timeline({scrollTrigger:{trigger:'#cover',start:'top top',end:'+=65%',pin:true,scrub:1}});
      cover.to('.cover-art svg g',{scale:3,svgOrigin:'2097 3394',duration:1,ease:'none'},0).to('.cover-title,.cover-brand',{y:-55,opacity:0,duration:.4,ease:'none'},.6).to('.cover-sub,.cover-meta',{y:-35,opacity:0,duration:.25,ease:'none'},.75);
      gsap.to('.toc .bgshape',{yPercent:9,scrollTrigger:{trigger:'.toc',start:'top bottom',end:'bottom top',scrub:1},ease:'none'});
      gsap.to('.fw .bgshape',{yPercent:7,scrollTrigger:{trigger:'.fw',start:'top bottom',end:'bottom top',scrub:1},ease:'none'});
    }
  });
  gsap.utils.toArray('.toc-col').forEach(col=>gsap.from(col.querySelectorAll('.toc-group'),{y:20,opacity:0,duration:.7,stagger:.09,ease:'power2.out',scrollTrigger:{trigger:col,start:'top 88%',once:true}}));
  gsap.utils.toArray('.rv').forEach(el=>gsap.from(el,{y:18,opacity:0,duration:.65,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
  document.querySelectorAll('.scrub-words').forEach(el => {
    const text=el.textContent; el.setAttribute('aria-label',text); el.textContent='';
    text.split(/(\s+)/).forEach(word=>{if(/\s+/.test(word)){el.append(document.createTextNode(word));}else{const span=document.createElement('span'); span.className='w'; span.setAttribute('aria-hidden','true'); span.textContent=word; el.append(span);}});
    gsap.fromTo(el.querySelectorAll('.w'),{opacity:.3},{opacity:1,stagger:.025,ease:'none',scrollTrigger:{trigger:el,start:'top 86%',end:'bottom 43%',scrub:1}});
  });
  gsap.from('.sig',{clipPath:'inset(0 100% 0 0)',duration:1,ease:'power2.inOut',scrollTrigger:{trigger:'.sig',start:'top 90%',once:true}});
  gsap.utils.toArray('.lens').forEach(lens=>{
    const ring=lens.querySelector('circle');
    gsap.fromTo(ring,{strokeDasharray:'1 1',strokeDashoffset:1},{strokeDashoffset:0,duration:1.5,ease:'power2.out',scrollTrigger:{trigger:lens,start:'top 85%',once:true}});
    gsap.from(lens.querySelector('.glow'),{scale:.55,opacity:0,duration:1,scrollTrigger:{trigger:lens,start:'top 85%',once:true}});
  });
  const lenses=[...document.querySelectorAll('.lens')];
  gsap.utils.toArray('.fd').forEach(row=>{
    gsap.from(row,{opacity:.3,y:8,duration:.55,scrollTrigger:{trigger:row,start:'top 90%',once:true}});
    ScrollTrigger.create({trigger:row,start:'top 65%',end:'bottom 35%',onToggle:self=>{if(!self.isActive) return; lenses.forEach(l=>{const active=row.dataset.lens==='both'||l.dataset.kind===row.dataset.lens;l.classList.toggle('is-active',active);l.classList.toggle('is-dim',!active)});}});
  });
  gsap.from('.illo .beam',{clipPath:'inset(0 100% 0 0)',ease:'none',scrollTrigger:{trigger:'.illo',start:'top 85%',end:'bottom 55%',scrub:1}});
  gsap.from('.illo .ma, .illo .mb',{x:-30,rotation:-12,opacity:0,stagger:.15,duration:1,scrollTrigger:{trigger:'.illo',start:'top 85%',once:true}});
  gsap.from('.side',{y:36,opacity:0,duration:.8,scrollTrigger:{trigger:'.side',start:'top 90%',once:true}});
  gsap.utils.toArray('.srv').forEach(el=>gsap.from(el,{y:12,opacity:0,duration:.6,scrollTrigger:{trigger:el,start:'top 96%',once:true}}));
  gsap.utils.toArray('.reveal-card').forEach(el=>gsap.from(el,{y:25,opacity:0,duration:.75,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
  window.addEventListener('load',()=>ScrollTrigger.refresh());
})();
