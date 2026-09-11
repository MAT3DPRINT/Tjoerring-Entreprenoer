(() => {
  if (document.querySelector('.philosophy-section')) return;

  const style = document.createElement('style');
  style.textContent = `
    .philosophy-section{
      position:relative;
      overflow:hidden;
      min-height:620px;
      display:grid;
      place-items:center;
      isolation:isolate;
      background:
        radial-gradient(circle at 76% 42%,rgba(246,196,0,.09),transparent 24%),
        radial-gradient(circle at 18% 88%,rgba(255,255,255,.055),transparent 23%),
        linear-gradient(115deg,#050505 0%,#111 48%,#080808 100%);
      border-top:1px solid #242424;
      border-bottom:1px solid #242424;
    }
    .philosophy-section::before,
    .philosophy-section::after{
      content:"";
      position:absolute;
      top:0;
      bottom:0;
      width:34px;
      z-index:4;
      opacity:.9;
      background:repeating-linear-gradient(135deg,var(--yellow) 0 18px,#111 18px 36px);
    }
    .philosophy-section::before{left:0}
    .philosophy-section::after{right:0}
    .philosophy-dirt{
      position:absolute;
      left:-4%;
      right:-4%;
      bottom:-78px;
      height:240px;
      z-index:1;
      opacity:.9;
      filter:contrast(1.15);
      background:
        radial-gradient(ellipse at 8% 55%,#30271d 0 8%,transparent 9%),
        radial-gradient(ellipse at 21% 40%,#1d1813 0 11%,transparent 12%),
        radial-gradient(ellipse at 35% 62%,#3b3022 0 10%,transparent 11%),
        radial-gradient(ellipse at 52% 40%,#211b15 0 13%,transparent 14%),
        radial-gradient(ellipse at 68% 55%,#443626 0 12%,transparent 13%),
        radial-gradient(ellipse at 82% 35%,#211a13 0 13%,transparent 14%),
        radial-gradient(ellipse at 95% 58%,#382b1f 0 10%,transparent 11%),
        linear-gradient(#211a14,#090909);
      transform:rotate(-1deg);
    }
    .philosophy-watermark{
      position:absolute;
      left:-80px;
      top:50%;
      width:min(430px,38vw);
      transform:translateY(-50%) rotate(-7deg);
      opacity:.13;
      filter:grayscale(1) brightness(2.2) contrast(1.25);
      z-index:0;
      pointer-events:none;
    }
    .philosophy-smoke{
      position:absolute;
      inset:0;
      z-index:0;
      opacity:.45;
      background:
        radial-gradient(circle at 25% 30%,rgba(255,255,255,.05),transparent 18%),
        radial-gradient(circle at 70% 28%,rgba(255,255,255,.035),transparent 22%),
        radial-gradient(circle at 52% 68%,rgba(255,255,255,.04),transparent 24%);
      filter:blur(14px);
    }
    .philosophy-inner{
      position:relative;
      z-index:3;
      width:min(1120px,calc(100% - 92px));
      margin:auto;
      padding:92px 28px 132px;
      text-align:center;
    }
    .philosophy-kicker{
      display:flex;
      align-items:center;
      justify-content:center;
      gap:22px;
      margin:0 auto 28px;
      color:var(--yellow);
      font-size:clamp(13px,1.35vw,18px);
      font-weight:950;
      letter-spacing:.42em;
      text-transform:uppercase;
    }
    .philosophy-kicker::before,
    .philosophy-kicker::after{
      content:"";
      width:110px;
      max-width:12vw;
      height:3px;
      background:var(--yellow);
    }
    .philosophy-title{
      margin:0;
      text-transform:uppercase;
      font-size:clamp(58px,8.2vw,126px);
      line-height:.84;
      letter-spacing:-.055em;
      font-weight:1000;
      text-shadow:0 12px 34px rgba(0,0,0,.8);
    }
    .philosophy-title .white{
      display:block;
      color:#f1f1f1;
      text-shadow:0 2px 0 #777,0 12px 34px rgba(0,0,0,.8);
    }
    .philosophy-title .yellow-line{
      display:block;
      color:var(--yellow);
      margin-top:8px;
    }
    .philosophy-subtitle{
      margin:30px 0 0;
      color:#e6e6e6;
      font-size:clamp(19px,2vw,31px);
      font-weight:500;
    }
    .philosophy-mini-excavator{
      display:inline-block;
      margin-left:12px;
      color:var(--yellow);
      filter:grayscale(1) sepia(1) saturate(8) hue-rotate(350deg);
    }
    @media (max-width:760px){
      .philosophy-section{min-height:520px}
      .philosophy-section::before,.philosophy-section::after{width:18px}
      .philosophy-inner{width:calc(100% - 42px);padding:72px 10px 112px}
      .philosophy-kicker{letter-spacing:.25em;gap:10px}
      .philosophy-kicker::before,.philosophy-kicker::after{width:42px;max-width:none}
      .philosophy-title{font-size:clamp(48px,16vw,78px)}
      .philosophy-watermark{width:340px;left:-155px;opacity:.08}
      .philosophy-subtitle{font-size:18px}
    }
  `;
  document.head.appendChild(style);

  const section = document.createElement('section');
  section.className = 'philosophy-section';
  section.setAttribute('aria-labelledby', 'philosophyTitle');
  section.innerHTML = `
    <div class="philosophy-smoke" aria-hidden="true"></div>
    <img class="philosophy-watermark" src="assets/logo-new.svg" alt="" aria-hidden="true">
    <div class="philosophy-dirt" aria-hidden="true"></div>
    <div class="philosophy-inner">
      <div class="philosophy-kicker" data-philosophy-kicker>VORES FILOSOFI</div>
      <h2 class="philosophy-title" id="philosophyTitle">
        <span class="white" data-philosophy-line1>DET KOSTER</span>
        <span class="yellow-line" data-philosophy-line2>AT HAVE DET SJOVT.</span>
      </h2>
      <p class="philosophy-subtitle"><span data-philosophy-subtitle>Men det har aldrig stoppet os før.</span><span class="philosophy-mini-excavator" aria-hidden="true">🚜</span></p>
    </div>
  `;

  const cta = document.querySelector('.cta-section');
  if (cta) cta.insertAdjacentElement('beforebegin', section);
  else document.querySelector('main')?.appendChild(section);

  const copy = {
    da:{k:'VORES FILOSOFI',l1:'DET KOSTER',l2:'AT HAVE DET SJOVT.',s:'Men det har aldrig stoppet os før.'},
    en:{k:'OUR PHILOSOPHY',l1:'FUN',l2:'COMES AT A PRICE.',s:'But that has never stopped us before.'},
    de:{k:'UNSERE PHILOSOPHIE',l1:'SPASS',l2:'HAT SEINEN PREIS.',s:'Aber das hat uns noch nie aufgehalten.'},
    pl:{k:'NASZA FILOZOFIA',l1:'DOBRA ZABAWA',l2:'KOSZTUJE.',s:'Ale to jeszcze nigdy nas nie powstrzymało.'}
  };
  const applyLanguage = () => {
    const lang = (document.documentElement.lang || 'da').slice(0,2);
    const t = copy[lang] || copy.da;
    section.querySelector('[data-philosophy-kicker]').textContent = t.k;
    section.querySelector('[data-philosophy-line1]').textContent = t.l1;
    section.querySelector('[data-philosophy-line2]').textContent = t.l2;
    section.querySelector('[data-philosophy-subtitle]').textContent = t.s;
  };
  applyLanguage();
  new MutationObserver(applyLanguage).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();