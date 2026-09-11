(() => {
  if (document.querySelector('.philosophy-section')) return;

  const style = document.createElement('style');
  style.textContent = `
    .philosophy-section{
      position:relative;
      overflow:hidden;
      min-height:660px;
      display:grid;
      place-items:center;
      isolation:isolate;
      color:#fff;
      background:#080808;
      border-top:1px solid #242424;
      border-bottom:1px solid #242424;
    }
    .philosophy-section::before{
      content:"";
      position:absolute;
      inset:0;
      z-index:-3;
      background-image:url("https://images.unsplash.com/photo-1780054984791-ef3f58ca753e?auto=format&fit=crop&fm=jpg&q=82&w=2400");
      background-size:cover;
      background-position:center 52%;
      transform:scale(1.035);
      filter:saturate(.72) contrast(1.14) brightness(.66);
    }
    .philosophy-section::after{
      content:"";
      position:absolute;
      inset:0;
      z-index:-2;
      background:
        linear-gradient(90deg,rgba(0,0,0,.34),rgba(0,0,0,.16) 24%,rgba(0,0,0,.24) 74%,rgba(0,0,0,.46)),
        linear-gradient(180deg,rgba(0,0,0,.42) 0%,rgba(0,0,0,.18) 34%,rgba(0,0,0,.44) 100%),
        radial-gradient(circle at 50% 42%,rgba(0,0,0,.08),rgba(0,0,0,.5) 76%);
    }
    .philosophy-hazard{
      position:absolute;
      top:0;
      bottom:0;
      width:40px;
      z-index:4;
      opacity:.96;
      background:repeating-linear-gradient(135deg,var(--yellow) 0 18px,#111 18px 36px);
      box-shadow:0 0 0 1px rgba(0,0,0,.4),0 0 24px rgba(0,0,0,.55);
    }
    .philosophy-hazard.left{left:0}
    .philosophy-hazard.right{right:0}
    .philosophy-vignette{
      position:absolute;
      inset:0;
      z-index:0;
      pointer-events:none;
      box-shadow:inset 0 0 90px 30px rgba(0,0,0,.78);
    }
    .philosophy-inner{
      position:relative;
      z-index:2;
      width:min(1180px,calc(100% - 120px));
      margin:auto;
      padding:92px 26px 118px;
      text-align:center;
    }
    .philosophy-kicker{
      display:flex;
      align-items:center;
      justify-content:center;
      gap:28px;
      margin:0 auto 32px;
      color:var(--yellow);
      font-size:clamp(13px,1.2vw,18px);
      font-weight:950;
      letter-spacing:.43em;
      text-transform:uppercase;
      text-shadow:0 4px 18px #000;
    }
    .philosophy-kicker::before,
    .philosophy-kicker::after{
      content:"";
      width:128px;
      max-width:13vw;
      height:3px;
      background:var(--yellow);
      box-shadow:0 2px 12px rgba(0,0,0,.75);
    }
    .philosophy-title{
      margin:0;
      text-transform:uppercase;
      font-size:clamp(62px,8.8vw,136px);
      line-height:.82;
      letter-spacing:-.06em;
      font-weight:1000;
      text-shadow:0 8px 26px rgba(0,0,0,.88),0 2px 1px rgba(0,0,0,.65);
    }
    .philosophy-title .white{
      display:block;
      color:#f5f5f2;
      -webkit-text-stroke:1px rgba(0,0,0,.28);
      text-shadow:0 3px 0 #777,0 9px 28px rgba(0,0,0,.9);
    }
    .philosophy-title .yellow-line{
      display:block;
      color:var(--yellow);
      margin-top:10px;
      text-shadow:0 5px 0 rgba(94,72,0,.6),0 10px 28px rgba(0,0,0,.92);
    }
    .philosophy-subtitle{
      margin:34px 0 0;
      color:#f0f0f0;
      font-size:clamp(19px,2vw,30px);
      font-weight:520;
      text-shadow:0 3px 14px rgba(0,0,0,.95);
    }
    .philosophy-mini-excavator{
      display:inline-block;
      margin-left:13px;
      transform:translateY(2px);
      filter:drop-shadow(0 3px 5px rgba(0,0,0,.9));
    }
    .philosophy-ground-fade{
      position:absolute;
      left:0;
      right:0;
      bottom:0;
      height:170px;
      z-index:1;
      pointer-events:none;
      background:linear-gradient(180deg,transparent,rgba(0,0,0,.12) 35%,rgba(0,0,0,.68) 100%);
    }
    @media (max-width:760px){
      .philosophy-section{min-height:540px}
      .philosophy-section::before{background-position:38% 50%;filter:saturate(.7) contrast(1.12) brightness(.6)}
      .philosophy-hazard{width:18px}
      .philosophy-inner{width:calc(100% - 42px);padding:72px 10px 104px}
      .philosophy-kicker{letter-spacing:.24em;gap:10px;margin-bottom:24px}
      .philosophy-kicker::before,.philosophy-kicker::after{width:42px;max-width:none}
      .philosophy-title{font-size:clamp(48px,16vw,80px)}
      .philosophy-subtitle{font-size:18px;margin-top:26px}
    }
  `;
  document.head.appendChild(style);

  const section = document.createElement('section');
  section.className = 'philosophy-section';
  section.setAttribute('aria-labelledby', 'philosophyTitle');
  section.innerHTML = `
    <div class="philosophy-hazard left" aria-hidden="true"></div>
    <div class="philosophy-hazard right" aria-hidden="true"></div>
    <div class="philosophy-vignette" aria-hidden="true"></div>
    <div class="philosophy-ground-fade" aria-hidden="true"></div>
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