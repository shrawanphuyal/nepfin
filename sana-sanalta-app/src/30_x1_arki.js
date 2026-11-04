// ================= ARJESSA: Finnish to use today =================
let curArki=sget('arki','aamu');
function openArki(id){const a=ARKI.find(x=>x.id===id)||ARKI[0];curArki=a.id;sset('arki',a.id);stopLines();
  $$('#arTiles [data-ar]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ar===a.id)));
  $('#arView').innerHTML=`<div class="row" style="gap:12px"><span style="font-size:2.4rem">${a.e}</span><div><h3 style="margin:0">${esc(a.fi)}</h3><div><span class="t-en">${esc(a.en)}</span> · <span class="ne t-ne">${esc(a.ne)}</span></div></div></div>
   <div class="note ok" style="margin:12px 0"><span class="lbl">How to use it</span>${esc(a.tip)}</div>
   <div class="row" style="margin-bottom:10px"><button class="btn pri sm" id="arPlay">▶ Play all</button><label class="tog"><input type="checkbox" id="arHide"> Test me: hide the Finnish</label></div>
   <div class="stack" id="arLines" style="gap:8px">${a.lines.map(l=>`<div class="card exline arline" style="padding:10px 12px">${lineHTML(l[0],l[1],l[2],l[3])}</div>`).join('')}</div>
   <p class="mut" style="font-size:.9rem;margin-top:12px">With "Test me" on, read the English or Nepali, say the Finnish aloud, then tap the blurred line to check.</p>`;
  $('#arPlay').onclick=()=>{if(LP.on){stopLines();$('#arPlay').textContent='▶ Play all';return}$('#arPlay').textContent='■ Stop';playLines(a.lines.map(l=>['N',l[0]]),$('#arLines'),()=>{$('#arPlay').textContent='▶ Play all'})};
  $('#arHide').onchange=e=>{$('#arLines').classList.toggle('arhide',e.target.checked);$$('#arLines .arline').forEach(x=>x.classList.remove('rev'))};
  $('#arLines').onclick=e=>{const c=e.target.closest('.arline');if(c&&$('#arLines').classList.contains('arhide')&&!e.target.closest('button'))c.classList.toggle('rev')}}
RENDER.arki=()=>{
  $('#p-arki').innerHTML=`<p class="eyebrow">Arjessa · Use it today</p><h2>Finnish you can use today</h2>
  <p class="lede">Short sentences for real moments: morning, class, the bus, the shop, work, the phone, small talk, evening and problems. Say each one while you are actually doing it. That is how words move from the page into your memory. Green 🗣 lines show how people say it.</p>
  <div class="places" id="arTiles">${ARKI.map(a=>`<button class="ptile" data-ar="${a.id}" aria-pressed="false"><span class="pe">${a.e}</span><span class="pf">${esc(a.fi)}</span><span class="pn">${esc(a.en)}</span></button>`).join('')}</div>
  <div class="out" id="arView"></div>`;
  $('#arTiles').addEventListener('click',e=>{const b=e.target.closest('[data-ar]');if(b){openArki(b.dataset.ar);$('#arView').scrollIntoView({block:'start',behavior:reduceMotion()?'auto':'smooth'})}});
  openArki(curArki);
};
