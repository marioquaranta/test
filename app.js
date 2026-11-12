'use strict';
/* Prototipo locale di una sola rilevazione. Nessun collegamento a un database. */
const SURVEY=window.BT_SURVEY;
const QUESTIONS=SURVEY.questions;
const QUESTION_MAP=Object.fromEntries(QUESTIONS.map(q=>[q.id,q]));
const app=document.getElementById('app');
const query=new URLSearchParams(location.search);
const invitation=(query.get('token')||query.get('id')||'BT-PROVA-LOCALE').replace(/[^A-Za-z0-9_-]/g,'').slice(0,90)||'BT-PROVA-LOCALE';
let screen='intro';
let currentKey=QUESTIONS[0].id;
let answers={};
let alertMessage='';
const optionOrders={};
const rowOrders={};

function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function shuffle(items){let arr=[...items];for(let i=arr.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}
for(const q of QUESTIONS){
  const o=q.opts||[];
  const fixed=o.filter(x=>x.other||x.exclusive||x.label==='Non ricordo'||x.label==='Non so');
  optionOrders[q.id]=q.random?[...shuffle(o.filter(x=>!fixed.includes(x))),...fixed]:o;
  if(q.type==='matrix'){
    if(q.id==='B1-B5'){
      rowOrders[q.id]=shuffle(q.rows.filter(r=>r.id!=='B2'));
    }else{
      rowOrders[q.id]=q.random?shuffle(q.rows):q.rows;
    }
  }
}
function getAnswer(q){return answers[q.id]||null;}
function active(q){
 const value=(id)=>answers[id]?.v;
 if(q.id==='P3')return ['O03','O04'].includes(value('P2')) && ['O02','O03'].includes(value('P1'));
 if(q.id==='B8')return /^F\d+$/.test(value('B7N')||'');
 if(['B9V','B12S'].includes(q.id))return /^F\d+$/.test(value('B9')||'');
 if(q.id==='D1R')return ['O03','O04'].includes(value('P2'));
 if(q.id==='G4')return ['O01','O02'].includes(value('G3'));
 return true;
}
function activeQuestions(){return QUESTIONS.filter(active);}
function matrixRows(q){
 const rows=rowOrders[q.id]||[];
 if(q.id==='B1-B5'){
  const withB2=[];
  for(const r of rows){
   withB2.push(r);
   if(r.id==='B1'&&['2','3','4'].includes(answers[q.id]?.rows?.B1))withB2.push(q.rows.find(x=>x.id==='B2'));
  }
  return withB2;
 }
 return rows;
}
// Una schermata per ogni item delle batterie, senza alterare i codici delle variabili.
function steps(){
  return activeQuestions().flatMap(q=>q.type==='matrix'
    ? matrixRows(q).map(row=>({key:`${q.id}::${row.id}`,q,row}))
    : [{key:q.id,q,row:null}]);
}
function getStep(){return steps().find(s=>s.key===currentKey)||null;}
function pageTop(){
  const list=steps();const i=Math.max(0,list.findIndex(s=>s.key===currentKey));
  const percent=Math.round(((i+1)/list.length)*100);
  return `<div class="single-flow"><div class="eyebrow">QUESTIONARIO SOCI · DICEMBRE 2026</div><div class="progress-bg" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}" aria-label="Avanzamento"><div class="progress-fill" style="width:${percent}%"></div></div>`;
}
function titleAndHint(q){
 return `<h2 id="question-title">${escapeHtml(q.text)}</h2>${(q.hint||[]).map(h=>`<p class="hint">${escapeHtml(h)}</p>`).join('')}`;
}
function renderIntro(){
 document.body.dataset.surveyScreen="intro";
 app.innerHTML=`<div class="single-flow"><div class="question-card intro-card"><h1>La tua esperienza<br>con Better Together</h1><div class="intro-text">${SURVEY.intro.map(x=>`<p>${escapeHtml(x)}</p>`).join('')}</div></div><div class="actions"><span></span><button type="button" class="btn primary" data-action="start">Inizia il questionario →</button></div></div>`;
}
function renderScale(q){
 const ans=getAnswer(q)?.v;
 const main=q.opts.filter(o=>/^[1-5]$/.test(o.code));
 const extras=q.opts.filter(o=>!/^[1-5]$/.test(o.code));
 const a=`<div class="scale-labeled" aria-label="Scala di risposta">${main.map(o=>`<button type="button" class="scale-label ${ans===o.code?'active':''}" data-action="choose" data-code="${o.code}" aria-pressed="${ans===o.code}"><strong>${o.code}</strong><span>${escapeHtml(o.label)}</span></button>`).join('')}</div>`;
 // Numero e descrizione sono nello stesso pulsante a ogni larghezza.
 return a+(extras.length?`<div class="specials">${extras.map(o=>`<label class="special-choice ${ans===o.code?'selected':''}"><input type="radio" name="single-${q.id}" data-action="radio" value="${o.code}" ${ans===o.code?'checked':''}>${escapeHtml(o.label)}</label>`).join('')}</div>`:'');
}
function renderSingle(q){
 const ans=getAnswer(q)||{};
 const options=optionOrders[q.id];
 const choice=(o)=>{
  const checked=ans.v===o.code;
  return `<div class="choice-wrap"><label class="choice ${checked?'selected':''}"><input type="radio" name="single-${q.id}" data-action="radio" value="${escapeHtml(o.code)}" ${checked?'checked':''}><span>${escapeHtml(o.label)}</span></label>${o.other&&checked?`<div class="write-in"><label for="other-input">${o.label.includes('facoltativamente')?'Se desideri, specifica':'Specifica'}</label><input id="other-input" data-action="other-text" type="text" maxlength="300" value="${escapeHtml(ans.t||'')}" autocomplete="off"></div>`:''}</div>`;
 };
 return `<div class="choice-list">${options.map(choice).join('')}</div>`;
}
function renderMulti(q){
 const ans=getAnswer(q)||{v:[],otherTexts:{}};
 const codes=Array.isArray(ans.v)?ans.v:[];
 const maxText=q.max?`Seleziona al massimo ${q.max} risposte.`:'Seleziona tutte le risposte pertinenti.';
 const options=optionOrders[q.id];
 return `<p class="muted small" style="margin-bottom:16px">${maxText}</p><div class="choice-list">${options.map(o=>{
   const checked=codes.includes(o.code);
   return `<div class="choice-wrap"><label class="choice ${checked?'selected':''}"><input type="checkbox" data-action="check" value="${escapeHtml(o.code)}" ${checked?'checked':''}><span>${escapeHtml(o.label)}</span></label>${o.other&&checked?`<div class="write-in"><label for="other-input">Specifica</label><input id="other-input" data-action="other-text" data-code="${o.code}" maxlength="300" value="${escapeHtml(ans.otherTexts?.[o.code]||'')}" autocomplete="off"></div>`:''}</div>`;
 }).join('')}</div>`;
}
function renderMatrixItem(q,row){
  const ans=answers[q.id]?.rows?.[row.id]||'';
  const normal=q.opts.filter(o=>/^[1-5]$/.test(o.code));
  const extras=q.opts.filter(o=>!normal.includes(o));
  const instructionByBattery={
    'A5-A6':'Per ogni figura indicata, seleziona una sola risposta.',
    'B1-B5':'Per ogni situazione descritta, seleziona una sola risposta.',
    'B9V':'Per ogni aspetto indicato, seleziona una sola risposta.',
    'B13':'Per ogni caratteristica indicata, seleziona una sola risposta.'
  };
  const instruction=instructionByBattery[q.id]||'Seleziona una sola risposta.';
  const prefix=`<h3 class="battery-item-label">${escapeHtml(row.label)}</h3><p class="muted small battery-instruction">${escapeHtml(instruction)}</p>`;
  const choices=`<div class="scale-labeled" role="group" aria-label="${escapeHtml(row.label)}">${normal.map(o=>`<button type="button" class="scale-label ${ans===o.code?'active':''}" data-action="matrix-choice" data-rowid="${row.id}" data-code="${o.code}" aria-pressed="${ans===o.code}"><strong>${o.code}</strong><span>${escapeHtml(o.label)}</span></button>`).join('')}</div>`;
  const special=extras.length?`<div class="specials">${extras.map(o=>`<label class="special-choice ${ans===o.code?'selected':''}"><input type="radio" name="matrix-${q.id}-${row.id}" data-action="matrix-radio" data-rowid="${row.id}" value="${escapeHtml(o.code)}" ${ans===o.code?'checked':''}>${escapeHtml(o.label)}</label>`).join('')}</div>`:'';
  return prefix+choices+special;
}
function renderPostal(q){
 const ans=getAnswer(q)||{};
 const options=q.opts;
 return `<div class="choice-list">${options.map(o=>{
    const checked=ans.v===o.code;
    return `<div class="choice-wrap"><label class="choice ${checked?'selected':''}"><input type="radio" data-action="radio" name="postal-${q.id}" value="${o.code}" ${checked?'checked':''}><span>${escapeHtml(o.label)}</span></label>${o.code==='O01'&&checked?`<div class="write-in"><label for="postal-input">CAP (5 cifre)</label><input type="text" inputmode="numeric" pattern="[0-9]{5}" autocomplete="postal-code" maxlength="5" id="postal-input" data-action="postal-input" value="${escapeHtml(ans.t||'')}" placeholder="00000"></div>`:''}</div>`;
 }).join('')}</div>`;
}
function renderComment(q){
 const ans=getAnswer(q)||{};
 return `<div class="choice-list"><div class="choice-wrap"><label class="choice ${ans.v==='O01'?'selected':''}"><input type="radio" name="comment" data-action="radio" value="O01" ${ans.v==='O01'?'checked':''}><span>Vorrei aggiungere:</span></label>${ans.v==='O01'?`<div class="write-in"><label for="comment-input">Il tuo commento</label><textarea id="comment-input" data-action="comment-text" class="open-answer">${escapeHtml(ans.t||'')}</textarea></div>`:''}</div><label class="choice ${ans.v==='O02'?'selected':''}"><input type="radio" name="comment" data-action="radio" value="O02" ${ans.v==='O02'?'checked':''}><span>Non ho altro da aggiungere</span></label></div>`;
}
function renderQuestion(preserveScroll=false){
 document.body.dataset.surveyScreen="question";
  const step=getStep();
  if(!step){screen='intro';renderIntro();return;}
  const {q,row}=step;
  const y=window.scrollY;
  const content=q.type==='matrix'?renderMatrixItem(q,row):q.type==='scale'?renderScale(q):q.type==='multi'?renderMulti(q):q.type==='postal'?renderPostal(q):q.type==='comment'?renderComment(q):renderSingle(q);
  app.innerHTML=pageTop()+`<div class="question-card" aria-labelledby="question-title">${titleAndHint(q)}${content}${alertMessage?`<div class="alert" role="alert">${escapeHtml(alertMessage)}</div>`:''}</div><div class="actions"><button type="button" class="btn" data-action="back">← Indietro</button><button type="button" class="btn primary" data-action="next">${steps().at(-1)?.key===currentKey?'Termina':'Avanti'} →</button></div></div>`;
  if(preserveScroll)window.scrollTo(0,y);else window.scrollTo(0,0);
}
function validate(step){
  const {q,row}=step;
  const ans=getAnswer(q);
  if(!ans)return 'Seleziona una risposta per proseguire.';
  if(q.type==='matrix'){
    if(!ans.rows?.[row.id])return 'Seleziona una risposta per proseguire.';
  }else if(q.type==='multi'){
    if(!Array.isArray(ans.v)||!ans.v.length)return 'Seleziona almeno una risposta per proseguire.';
    if(q.max && ans.v.length>q.max)return `Puoi selezionare al massimo ${q.max} risposte.`;
    for(const opt of q.opts){
      if(opt.other&&ans.v.includes(opt.code)&&!(ans.otherTexts?.[opt.code]||'').trim())return 'Specifica la risposta selezionata alla voce «Altro».';
    }
  }else{
    if(!ans.v)return 'Seleziona una risposta per proseguire.';
    const opt=q.opts.find(o=>o.code===ans.v);
    if(opt?.other && !opt.label.includes('facoltativamente') && !(ans.t||'').trim())return 'Completa la risposta selezionata.';
    if(q.type==='postal' && ans.v==='O01' && !/^\d{5}$/.test(ans.t||''))return 'Inserisci un CAP di cinque cifre.';
    if(q.type==='comment' && ans.v==='O01' && !(ans.t||'').trim())return 'Scrivi il commento oppure scegli «Non ho altro da aggiungere».';
  }
  return '';
}
function updateChoice(code){
 const q=getStep().q;
 answers[q.id]={...(answers[q.id]||{}),v:code};
 if(q.type==='postal'&&code!=='O01')delete answers[q.id].t;
 if(q.type==='comment'&&code!=='O01')delete answers[q.id].t;
 alertMessage='';renderQuestion(true);
}
function updateMulti(code,checked){
 const q=getStep().q;
 const current=answers[q.id]||{v:[],otherTexts:{}};
 const option=q.opts.find(x=>x.code===code);
 let values=Array.isArray(current.v)?[...current.v]:[];
 if(checked){
  if(option?.exclusive)values=[code];
  else{
   values=values.filter(c=>!q.opts.find(o=>o.code===c)?.exclusive);
   if(!values.includes(code))values.push(code);
  }
 }else values=values.filter(c=>c!==code);
 if(q.max&&values.length>q.max){
  alertMessage=`Puoi selezionare al massimo ${q.max} risposte.`;
  renderQuestion(true);return;
 }
 answers[q.id]={v:values,otherTexts:current.otherTexts||{}};
 alertMessage='';renderQuestion(true);
}
function updateMatrix(rowid,code){
 const q=getStep().q;
 answers[q.id]={rows:{...(answers[q.id]?.rows||{}),[rowid]:code}};
 if(q.id==='B1-B5'&&rowid==='B1'&&!['2','3','4'].includes(code))delete answers[q.id].rows.B2;
 alertMessage='';renderQuestion(true);
}
function next(){
  const step=getStep();const error=validate(step);
  if(error){alertMessage=error;renderQuestion(true);return;}
  alertMessage='';
  const list=steps();const i=list.findIndex(s=>s.key===currentKey);
  if(i<list.length-1){currentKey=list[i+1].key;renderQuestion();}else{screen='done';renderDone();}
}
function back(){
  const list=steps();const i=list.findIndex(s=>s.key===currentKey);
  if(i>0){currentKey=list[i-1].key;alertMessage='';renderQuestion();}
  else{screen='intro';renderIntro();window.scrollTo(0,0);}
}
function columnNames(){
 const cols=['id_rispondente'];
 for(const q of QUESTIONS){
   if(q.type==='matrix')cols.push(...q.rows.map(r=>r.id));
   else if(q.type==='comment')cols.push('E3','E3_testo');
   else if(q.type==='postal')cols.push(q.id,q.id+'_cap');
   else if(q.type==='multi')cols.push(q.id,q.id+'_altro');
   else if(q.opts?.some(o=>o.other))cols.push(q.id,q.id+'_altro');
   else cols.push(q.id);
 }
 return cols;
}
function valueRows(){
 const result={id_rispondente:invitation};
 for(const q of QUESTIONS){
   const shown=active(q),a=shown?answers[q.id]:null;
   if(q.type==='matrix'){
    for(const r of q.rows){
     const eligible=shown&&(q.id!=='B1-B5'||r.id!=='B2'||['2','3','4'].includes(a?.rows?.B1));
     result[r.id]=eligible?(a?.rows?.[r.id]||''):'FILTERED';
    }
   }else if(q.type==='comment'){
    result[q.id]=shown?(a?.v||''):'FILTERED';result.E3_testo=shown?(a?.t||''):'';
   }else if(q.type==='postal'){
    result[q.id]=shown?(a?.v||''):'FILTERED';result[q.id+'_cap']=shown?(a?.t||''):'';
   }else if(q.type==='multi'){
    result[q.id]=shown?(Array.isArray(a?.v)?q.opts.filter(o=>a.v.includes(o.code)).map(o=>o.code).join(';'):''):'FILTERED';
    result[q.id+'_altro']=shown?Object.values(a?.otherTexts||{}).join('; '):'';
   }else if(q.opts?.some(o=>o.other)){
    result[q.id]=shown?(a?.v||''):'FILTERED';result[q.id+'_altro']=shown?(a?.t||''):'';
   }else result[q.id]=shown?(a?.v||''):'FILTERED';
 }
 return result;
}
function toCSV(){
 const names=columnNames();const data=valueRows();
 const quote=(s)=>'"'+String(s??'').replace(/"/g,'""')+'"';
 return '\ufeff'+names.map(quote).join(',')+'\r\n'+names.map(k=>quote(data[k])).join(',')+'\r\n';
}
function saveCSV(){
 const csv=toCSV();const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);
 const el=document.createElement('a');el.href=url;el.download=`better_together_${invitation}.csv`;document.body.appendChild(el);el.click();el.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function renderDone(){
 document.body.dataset.surveyScreen="done";
 app.innerHTML=`<div class="single-flow"><div class="question-card intro-card"><div class="finish-icon">✓</div><h1>Grazie!</h1><p class="lead">${escapeHtml(SURVEY.outro)}</p><p class="muted small">Questa è una prova locale: le risposte non sono inviate online. Puoi esportarle in un file CSV.</p><div class="actions"><button class="btn primary" type="button" data-action="csv">Scarica le risposte CSV ↓</button></div></div></div>`;
 window.scrollTo(0,0);
}
app.addEventListener('click',e=>{
 const target=e.target.closest('[data-action]');if(!target)return;
 const action=target.dataset.action;
 if(action==='start'){screen='question';currentKey=steps()[0].key;renderQuestion();}
 else if(action==='choose')updateChoice(target.dataset.code);
 else if(action==='matrix-choice')updateMatrix(target.dataset.rowid,target.dataset.code);
 else if(action==='next')next();
 else if(action==='back')back();
 else if(action==='csv')saveCSV();
});
app.addEventListener('change',e=>{
 const target=e.target;
 if(target.dataset.action==='radio')updateChoice(target.value);
  if(target.dataset.action==='matrix-radio')updateMatrix(target.dataset.rowid,target.value);
 if(target.dataset.action==='check')updateMulti(target.value,target.checked);
});
app.addEventListener('input',e=>{
 const target=e.target,q=getStep().q;
 if(target.dataset.action==='other-text'){
  if(q.type==='multi'){
   answers[q.id]??={v:[],otherTexts:{}};
   answers[q.id].otherTexts??={};answers[q.id].otherTexts[target.dataset.code]=target.value;
  }else {answers[q.id]??={};answers[q.id].t=target.value;}
 }else if(['postal-input','comment-text'].includes(target.dataset.action)){
  answers[q.id]??={};answers[q.id].t=target.value;
 }
});
// Read-only interface for automated smoke testing; not displayed to respondents.
window.BT_TEST={get activeIds(){return activeQuestions().map(q=>q.id);},get activeKeys(){return steps().map(s=>s.key);},get currentId(){return getStep()?.q.id||null;},get currentRowId(){return getStep()?.row?.id||null;},get currentKey(){return currentKey;},get answers(){return JSON.parse(JSON.stringify(answers));},get csv(){return toCSV();},get pages(){return QUESTIONS;}};
renderIntro();
