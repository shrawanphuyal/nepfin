// ================= PHONE APP (PWA) =================
(function(){
  if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol))window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
  try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{})}catch(e){}
  let deferred=null;const btn=document.createElement('button');btn.className='btn pri installbtn';btn.hidden=true;btn.textContent='📲 Install app';document.body.appendChild(btn);
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;btn.hidden=false});
  btn.addEventListener('click',async()=>{if(!deferred)return;deferred.prompt();try{await deferred.userChoice}catch(e){}deferred=null;btn.hidden=true});
  window.addEventListener('appinstalled',()=>{btn.hidden=true});
})();
// backup and restore of progress (everything this app keeps in the browser)
function progressDump(){const data={};try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('ss2:'))data[k]=localStorage.getItem(k)}}catch(e){}return data}
function backupCard(){const n=Object.keys(progressDump()).length;
  return `<h3 id="backup">Back up your progress</h3><div class="card"><p style="margin:0 0 8px">Your progress (${n} saved items: flashcards, ticked days, writing, exam scores) lives only on this device. Save a backup file now and then, especially before you change phone or clear the browser.</p>
  <p class="ne t-ne" style="margin:0 0 10px">तपाईंको प्रगति यही फोनमा मात्र सुरक्षित हुन्छ। बेलाबेलामा ब्याकअप फाइल बनाउनुहोस्।</p>
  <div class="row"><button class="btn pri sm" id="bkSave">💾 Save backup file</button><label class="btn ghost sm" for="bkFile" style="cursor:pointer">📂 Restore from file</label><input type="file" id="bkFile" accept="application/json,.json" hidden></div><div id="bkMsg" class="mut" style="margin-top:8px;font-size:.9rem"></div></div>`}
function wireBackup(){const save=$('#bkSave');if(!save)return;
  save.onclick=()=>{const blob=new Blob([JSON.stringify({app:'sana-sanalta',v:1,date:new Date().toISOString(),data:progressDump()},null,1)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='sana-sanalta-progress-'+todayKey()+'.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);$('#bkMsg').textContent='Backup saved to your downloads.'};
  $('#bkFile').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{let j;try{j=JSON.parse(r.result)}catch(err){$('#bkMsg').textContent='That file is not a Sana Sanalta backup.';return}
    if(!j||j.app!=='sana-sanalta'||!j.data){$('#bkMsg').textContent='That file is not a Sana Sanalta backup.';return}
    const n=Object.keys(j.data).length;$('#bkMsg').innerHTML=`Restore ${n} items from ${esc((j.date||'').slice(0,10))}? This replaces the progress on this device. <button class="btn ok sm" id="bkYes">Restore</button> <button class="btn ghost sm" id="bkNo">Cancel</button>`;
    $('#bkYes').onclick=()=>{try{Object.keys(progressDump()).forEach(k=>localStorage.removeItem(k));for(const [k,v] of Object.entries(j.data))if(k.startsWith('ss2:'))localStorage.setItem(k,v);location.reload()}catch(err){$('#bkMsg').textContent='Could not restore: storage is blocked in this browser.'}};
    $('#bkNo').onclick=()=>{$('#bkMsg').textContent='';e.target.value=''}};r.readAsText(f)}}
{const _tips=RENDER.tips;RENDER.tips=()=>{_tips();$('#p-tips').insertAdjacentHTML('beforeend',backupCard());wireBackup()}}
