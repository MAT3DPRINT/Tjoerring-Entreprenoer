(() => {
  const NS = "mat3dprint.github.io";
  const ACTION = "view";
  const KEY = "tjoerring-entreprenoer-home";
  const API = `https://counterapi.com/api/${NS}/${ACTION}/${KEY}`;

  const style = document.createElement("style");
  style.textContent = `
    .visitor-counter-section{background:#080808;color:#fff;padding:72px 0;border-top:1px solid #242424;border-bottom:1px solid #242424;overflow:hidden}
    .visitor-counter-wrap{width:min(1180px,calc(100% - 40px));margin:auto}
    .visitor-counter-kicker{color:#f6c400;font-size:12px;font-weight:950;letter-spacing:.16em;text-transform:uppercase;margin:0 0 10px}
    .visitor-counter-head{display:flex;justify-content:space-between;gap:24px;align-items:end;margin-bottom:28px}
    .visitor-counter-head h2{margin:0;font-size:clamp(34px,5vw,58px);line-height:.95;letter-spacing:-.04em}
    .visitor-counter-head p{margin:8px 0 0;color:#999;max-width:600px;transition:opacity .25s ease}
    .visitor-counter-head p.is-changing{opacity:0}
    .visitor-counter-machine{position:relative;background:linear-gradient(145deg,#191919,#0d0d0d);border:1px solid #363636;border-radius:24px;padding:24px;box-shadow:0 24px 70px #0009,inset 0 0 0 1px #111;overflow:hidden}
    .visitor-counter-machine:before,.visitor-counter-machine:after{content:"";position:absolute;width:120px;height:18px;background:repeating-linear-gradient(135deg,#f6c400 0 18px,#111 18px 36px);opacity:.95}
    .visitor-counter-machine:before{left:-18px;top:16px;transform:rotate(-5deg)}
    .visitor-counter-machine:after{right:-18px;bottom:16px;transform:rotate(-5deg)}
    .visitor-counter-plate{position:relative;z-index:2;background:linear-gradient(#ffd82b,#e9b900);color:#111;border:3px solid #1c1c1c;border-radius:14px;padding:16px 20px;text-align:center;box-shadow:inset 0 0 0 2px #fff4,0 8px 20px #0008}
    .visitor-counter-plate strong{display:block;font-size:clamp(22px,4vw,38px);line-height:1;font-weight:1000;letter-spacing:.03em}
    .visitor-counter-plate span{display:block;margin-top:5px;font-size:12px;font-weight:900;letter-spacing:.13em;text-transform:uppercase}
    .visitor-counter-bolts{position:absolute;inset:9px;pointer-events:none}
    .visitor-counter-bolts:before,.visitor-counter-bolts:after{content:"●";position:absolute;top:0;color:#555;text-shadow:0 1px #fff8;font-size:18px}
    .visitor-counter-bolts:before{left:0}.visitor-counter-bolts:after{right:0}
    .odometer{position:relative;z-index:2;margin:20px auto 18px;display:flex;justify-content:center;gap:5px;background:#050505;border:4px solid #222;border-radius:14px;padding:14px 12px;box-shadow:inset 0 10px 30px #000,0 10px 24px #0008;min-height:104px}
    .odometer-digit{width:clamp(42px,8vw,78px);height:clamp(64px,11vw,92px);display:grid;place-items:center;border-radius:8px;background:linear-gradient(90deg,#080808,#292929 45%,#090909);border:1px solid #333;color:#f7f7f7;font:900 clamp(42px,7vw,66px)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;text-shadow:0 3px 0 #000;box-shadow:inset 0 2px 1px #555,inset 0 -12px 18px #000;transform-origin:center;animation:counterClack .4s ease both}
    @keyframes counterClack{0%{transform:rotateX(-65deg);opacity:.2}100%{transform:rotateX(0);opacity:1}}
    .visitor-stats-grid{position:relative;z-index:2;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
    .visitor-stat{background:#0f0f0f;border:1px solid #333;border-radius:14px;padding:17px;text-align:center;min-height:108px;display:flex;flex-direction:column;justify-content:center}
    .visitor-stat b{display:block;color:#f6c400;font-size:28px;line-height:1.1}
    .visitor-stat span{display:block;margin-top:6px;color:#a0a0a0;font-size:11px;font-weight:850;letter-spacing:.08em;text-transform:uppercase}
    .visitor-counter-foot{position:relative;z-index:2;margin-top:16px;color:#777;font-size:12px}
    .counter-error{color:#ffcf33!important}

    /* Flyt den hvide "professionel tilstand"-boks ned i footeren */
    footer .footer-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,300px);gap:20px 28px;align-items:start}
    footer .footer-warning{grid-column:1/-1;max-width:none}
    .footer-message-slot{min-height:150px;display:flex;justify-content:flex-end;align-items:flex-start;overflow:hidden}
    .footer-message-slot .serious-message,
    .footer-message-slot .serious-message.show{
      position:static!important;left:auto!important;top:auto!important;z-index:auto!important;
      width:100%;max-width:300px;margin:0;
      transform:translateX(120%)!important;opacity:0!important;
      background:#fff;color:#111;border-radius:12px;padding:18px 20px;text-align:center;
      box-shadow:0 10px 30px rgba(0,0,0,.35);
      transition:transform .55s cubic-bezier(.2,.85,.2,1),opacity .35s ease!important;
      pointer-events:none;
    }
    .footer-message-slot .serious-message.footer-visible,
    .footer-message-slot .serious-message.footer-visible.show{transform:translateX(0)!important;opacity:1!important}
    .footer-message-slot .serious-message strong{display:block;margin-bottom:4px;color:#111}
    .footer-message-slot .serious-message span{display:block;color:#555}
    @media(max-width:760px){
      .visitor-counter-section{padding:54px 0}.visitor-counter-wrap{width:calc(100% - 24px)}.visitor-counter-head{display:block}.visitor-counter-machine{padding:16px}.odometer{gap:3px;padding:10px 8px;min-height:82px}.odometer-digit{width:42px;height:62px;font-size:40px}.visitor-stats-grid{grid-template-columns:1fr 1fr}.visitor-counter-foot{align-items:flex-start;flex-direction:column}
      footer .footer-grid{grid-template-columns:minmax(0,1fr) minmax(190px,260px);gap:18px}
    }
    @media(max-width:430px){footer .footer-grid{grid-template-columns:1fr}.footer-message-slot{min-height:120px;justify-content:flex-start}.footer-message-slot .serious-message{max-width:100%}.footer-warning{grid-column:auto!important}}
    @media(max-width:390px){.odometer-digit{width:36px;height:57px;font-size:34px}.visitor-counter-machine{padding:12px}.visitor-stat{padding:12px}.visitor-stat b{font-size:23px}}
  `;
  document.head.appendChild(style);

  const footer = document.querySelector("footer");
  if (footer) {
    const section = document.createElement("section");
    section.className = "visitor-counter-section";
    section.id = "besog";
    section.innerHTML = `
      <div class="visitor-counter-wrap">
        <div class="visitor-counter-head"><div><p class="visitor-counter-kicker">📊 Helt ægte statistik*</p><h2>Hvor mange har kigget forbi?</h2><p id="visitorIntroText">Vi tæller rigtige sidevisninger. Gravemaskinen tæller ikke som besøgende. Endnu.</p></div></div>
        <div class="visitor-counter-machine">
          <div class="visitor-counter-plate"><div class="visitor-counter-bolts"></div><strong>BESØGSMÅLER</strong><span>Siden vi begyndte at grave på internettet</span></div>
          <div class="odometer" id="visitorOdometer" aria-label="Antal sidevisninger"><span class="odometer-digit">–</span><span class="odometer-digit">–</span><span class="odometer-digit">–</span><span class="odometer-digit">–</span><span class="odometer-digit">–</span><span class="odometer-digit">–</span></div>
          <div class="visitor-stats-grid">
            <div class="visitor-stat"><b id="visitorTotal">–</b><span>Sidevisninger</span></div>
            <div class="visitor-stat"><b id="visitorUnique">–</b><span>Unikke besøgende</span></div>
            <div class="visitor-stat"><b id="visitorToday">–</b><span>Seneste 24 timer</span></div>
            <div class="visitor-stat"><b id="visitorDevice">–</b><span>Besøg på denne enhed</span></div>
          </div>
          <div class="visitor-counter-foot"><span>* Tallene er rigtige. Kommentarerne er stadig stærkt tvivlsomme.</span></div>
        </div>
      </div>`;
    footer.insertAdjacentElement("beforebegin", section);

    const introText = document.getElementById("visitorIntroText");
    const introMessages = [
      "Vi tæller rigtige sidevisninger. Gravemaskinen tæller ikke som besøgende. Endnu.",
      "Rigtige besøg. Rigtige visninger. Stadig stærkt tvivlsom entreprenør-humor."
    ];
    let introIndex = 0;
    setInterval(() => {
      introIndex = (introIndex + 1) % introMessages.length;
      introText.classList.add("is-changing");
      setTimeout(() => {
        introText.textContent = introMessages[introIndex];
        introText.classList.remove("is-changing");
      }, 250);
    }, 30000);

    const fmt = n => new Intl.NumberFormat("da-DK").format(Number(n) || 0);
    const getValue = async url => { const r = await fetch(url,{cache:"no-store"}); if(!r.ok) throw new Error(`HTTP ${r.status}`); const d = await r.json(); return Number(d.value ?? d.count ?? 0); };
    const renderOdometer = value => { const el=document.getElementById("visitorOdometer"); const chars=String(Math.max(0,Math.floor(value))).padStart(6,"0").split(""); el.innerHTML=chars.map((c,i)=>`<span class="odometer-digit" style="animation-delay:${i*45}ms">${c}</span>`).join(""); };
    let deviceVisits=Number(localStorage.getItem("tjoerring-device-visits")||0)+1; localStorage.setItem("tjoerring-device-visits",String(deviceVisits)); document.getElementById("visitorDevice").textContent=fmt(deviceVisits);
    Promise.all([getValue(API),getValue(`${API}?readOnly=true&unique=true`),getValue(`${API}?readOnly=true&timeline=24h`)]).then(([total,unique,today])=>{document.getElementById("visitorTotal").textContent=fmt(total);document.getElementById("visitorUnique").textContent=fmt(unique);document.getElementById("visitorToday").textContent=fmt(today);renderOdometer(total);}).catch(()=>{document.getElementById("visitorTotal").textContent="OFFLINE";document.getElementById("visitorTotal").classList.add("counter-error");document.getElementById("visitorUnique").textContent="–";document.getElementById("visitorToday").textContent="–";document.getElementById("visitorOdometer").innerHTML='<span class="odometer-digit">O</span><span class="odometer-digit">F</span><span class="odometer-digit">F</span>';});
  }

  /* Den hvide boks ligger nu i footerens højre felt og kommer først ind ved bunden. */
  const seriousMessage = document.getElementById("seriousMessage");
  const footerGrid = document.querySelector("footer .footer-grid");
  if (seriousMessage && footerGrid) {
    const slot = document.createElement("div");
    slot.className = "footer-message-slot";
    const warning = footerGrid.querySelector(".footer-warning");
    footerGrid.insertBefore(slot, warning || null);
    slot.appendChild(seriousMessage);

    const updateFooterMessage = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24;
      seriousMessage.classList.toggle("footer-visible", atBottom);
      seriousMessage.setAttribute("aria-hidden", atBottom ? "false" : "true");
    };
    window.addEventListener("scroll", updateFooterMessage, {passive:true});
    window.addEventListener("resize", updateFooterMessage);
    requestAnimationFrame(updateFooterMessage);
  }
})();
