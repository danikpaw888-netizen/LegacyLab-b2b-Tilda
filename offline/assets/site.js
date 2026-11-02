/* LegacyLab demo — no third-party runtime, no form network requests. */
(()=>{'use strict';
const root=document.querySelector('.ll-site');if(!root)return;
const $=(s,c=root)=>c.querySelector(s),$$=(s,c=root)=>[...c.querySelectorAll(s)];
const menu=$('.menu-toggle'),nav=$('#mobile-nav');
function closeMenu(){if(!menu)return;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Открыть меню');nav.hidden=true;}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));menu.setAttribute('aria-label',open?'Открыть меню':'Закрыть меню');nav.hidden=open;});
nav?.addEventListener('click',e=>{if(e.target.closest('a,button'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
const dialog=$('.inquiry-dialog');let returnFocus=null;
function context(form,{product='',direction='',intent='Подбор оборудования'}={}){
  const values={source_page:location.pathname+location.search,product,direction,intent};
  for(const [k,v]of Object.entries(values))form.elements[k].value=v;
  const ctx=$('.form-context',form),lines=[product&&`Оборудование: ${product}`,direction&&`Объект: ${direction}`,`Запрос: ${intent}`].filter(Boolean);ctx.textContent=lines.join('\n');ctx.hidden=false;
}
$$('.inquiry-form').forEach(f=>{f.elements.source_page.value=location.pathname+location.search;f.elements.intent.value='Подбор оборудования';});
document.addEventListener('click',e=>{const b=e.target.closest('[data-inquiry]');if(!b||!root.contains(b))return;returnFocus=b;closeMenu();const f=$('form',dialog);context(f,{product:b.dataset.product,direction:b.dataset.direction,intent:b.dataset.intent});$('.form-status',f).hidden=true;dialog.showModal();root.classList.add('dialog-open');});
$('.dialog-close',dialog)?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog?.addEventListener('close',()=>{root.classList.remove('dialog-open');returnFocus?.focus();});
dialog?.addEventListener('keydown',e=>{
  if(e.key!=='Tab')return;
  const items=$$('a[href],button:not([disabled]),input:not([type="hidden"]):not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])',dialog).filter(x=>x.getClientRects().length&&!x.hidden);
  const first=items[0],last=items[items.length-1];if(!first)return;
  if(e.shiftKey&&(document.activeElement===first||!items.includes(document.activeElement))){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&(document.activeElement===last||!dialog.contains(document.activeElement))){e.preventDefault();first.focus();}
});
const contactValid=v=>{v=v.trim();return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)||(/^\+?[0-9\s()\-]+$/.test(v)&&v.replace(/\D/g,'').length>=10&&v.replace(/\D/g,'').length<=15);};
function validateField(input){let msg='';const v=input.value.trim();if(input.name==='name'&&!v)msg='Укажите имя.';if(input.name==='contact'&&!contactValid(v))msg=v?'Введите email вида name@company.kz или телефон из 10–15 цифр.':'Укажите телефон или email.';const el=document.getElementById(input.id+'-error');if(el)el.textContent=msg;input.setAttribute('aria-invalid',String(!!msg));return !msg;}
$$('.inquiry-form').forEach(f=>{
  $$('input[required]',f).forEach(i=>{i.addEventListener('blur',()=>{if(i.value||i.getAttribute('aria-invalid')==='true')validateField(i);});i.addEventListener('input',()=>{if(i.getAttribute('aria-invalid')==='true')validateField(i);$('.form-status',f).hidden=true;});});
  f.addEventListener('submit',async e=>{
    e.preventDefault();const invalid=$$('input[required]',f).filter(i=>!validateField(i));if(invalid.length){invalid[0].focus();return;}
    const button=$('.submit',f),status=$('.form-status',f),data=Object.fromEntries(new FormData(f));
    Object.keys(data).forEach(k=>data[k]=data[k].trim());
    button.disabled=true;button.textContent='Проверяем тестовый запрос…';f.setAttribute('aria-busy','true');status.hidden=true;
    await new Promise(r=>setTimeout(r,600));
    button.disabled=false;button.innerHTML='Отправить запрос <span aria-hidden="true">↗</span>';f.removeAttribute('aria-busy');
    status.replaceChildren();const title=document.createElement('strong');title.textContent='Проверка завершена. Запрос не отправлен.';const desc=document.createElement('p');desc.textContent='Это тестовая форма. Данные проверены в браузере; получатель заявок не подключён.';const info=document.createElement('p');info.textContent=[data.product&&`Модель: ${data.product}`,data.direction&&`Объект: ${data.direction}`,`Страница: ${data.source_page}`].filter(Boolean).join(' · ');
    const download=document.createElement('button');download.type='button';download.className='btn secondary';download.textContent='Скачать тестовый запрос';download.addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify({...data,demo:true,sent:false},null,2)],{type:'application/json;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='legacylab-test-request.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});status.append(title,desc,info,download);status.hidden=false;status.focus();
  });
});
$$('.gallery-thumb').forEach(b=>b.addEventListener('click',()=>{const g=b.closest('.gallery'),im=$('.gallery-main img',g);im.src=b.dataset.src;im.alt=b.dataset.alt;$$('.gallery-thumb',g).forEach(t=>t.setAttribute('aria-pressed',String(t===b)));}));
// Catalog reads the same source data from which the static product cards were built.
const grid=$('#catalog-grid');if(!grid)return;
const controls=$('#catalog-filters'),toggle=$('.filter-toggle');
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));controls.classList.toggle('is-open',!open);});
let products=[];const nodes=new Map($$('[data-id]',grid).map(n=>[n.dataset.id,n]));
const catnames={all:'Всё оборудование',radio:'Радиосвязь',video:'Видеонаблюдение',access:'Контроль доступа',network:'Сетевое оборудование',accessories:'Аксессуары'};
let state={category:'all',q:'',sort:'default',filters:{}};
function fromURL(){const q=new URLSearchParams(location.search);const category=catnames[q.get('category')]?q.get('category'):'all';state={category,q:q.get('q')||'',sort:['az','za'].includes(q.get('sort'))?q.get('sort'):'default',filters:{}};for(const[k,v]of q)if(k.startsWith('f_')){const key=k.slice(2);if(!Object.hasOwn(state.filters,key))state.filters[key]=[];state.filters[key].push(v);}}
function norm(v){return v.toLowerCase().replace(/ё/g,'е').replace(/[‐‑–—]/g,'-');}
function tech(){const wrap=$('.technical-filters');wrap.replaceChildren();const list=products.filter(p=>p.category===state.category),names=[...new Set(list.flatMap(p=>Object.keys(p.filters)))];if(state.category==='all'){state.filters={};return;}for(const key of Object.keys(state.filters))if(!names.includes(key))delete state.filters[key];for(const key of names){const vals=[...new Set(list.map(p=>p.filters[key]).filter(Boolean))];if(state.filters[key])state.filters[key]=state.filters[key].filter(v=>vals.includes(v));const field=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=key;field.append(legend);for(const val of vals){const label=document.createElement('label');label.className='technical-option';const input=document.createElement('input');input.type='checkbox';input.value=val;input.checked=state.filters[key]?.includes(val)||false;input.addEventListener('change',()=>{const set=new Set(state.filters[key]||[]);input.checked?set.add(val):set.delete(val);state.filters[key]=[...set];render();});label.append(input,document.createTextNode(val));field.append(label);}wrap.append(field);}}
function saveURL(){const q=new URLSearchParams();if(state.category!=='all')q.set('category',state.category);if(state.q)q.set('q',state.q);if(state.sort!=='default')q.set('sort',state.sort);for(const[k,vals]of Object.entries(state.filters))for(const v of vals)q.append('f_'+k,v);history.replaceState(null,'',location.pathname+(q.size?'?'+q.toString():''));}
function render(push=true){
  const words=norm(state.q.trim()).split(/\s+/).filter(Boolean);let list=products.filter(p=>(state.category==='all'||p.category===state.category)&&words.every(w=>norm([p.model,p.title].join(' ')).includes(w))&&Object.entries(state.filters).every(([k,v])=>!v.length||v.includes(p.filters[k])));
  if(state.sort!=='default')list.sort((a,b)=>a.model.localeCompare(b.model,'ru',{numeric:true})*(state.sort==='az'?1:-1));
  const ids=new Set(list.map(p=>p.id));for(const[id,n]of nodes)n.hidden=!ids.has(id);list.forEach(p=>grid.append(nodes.get(p.id)));
  $('#result-count').textContent=`Найдено: ${list.length}`;$('.empty-state').hidden=!!list.length;grid.hidden=!list.length;$('.search-clear').hidden=!state.q;
  const chips=$('.active-filters');chips.replaceChildren();function chip(label,fn){const b=document.createElement('button');b.type='button';b.className='filter-chip';b.textContent=label+' ×';b.setAttribute('aria-label','Убрать фильтр: '+label);b.addEventListener('click',fn);chips.append(b);}
  if(state.category!=='all')chip(catnames[state.category],()=>{state.category='all';state.filters={};sync();render();});if(state.q)chip('Поиск: '+state.q,()=>{state.q='';sync();render();});for(const[k,v]of Object.entries(state.filters))for(const val of v)chip(k+': '+val,()=>{state.filters[k]=state.filters[k].filter(x=>x!==val);sync();render();});
  if(chips.children.length){const b=document.createElement('button');b.type='button';b.className='reset-filters';b.textContent='Сбросить всё';b.addEventListener('click',reset);chips.append(b);}if(push){try{saveURL();}catch{/* Offline file previews may restrict history updates. */}}
}
function sync(){const r=$(`input[name=category][value="${state.category}"]`);if(r)r.checked=true;$('#catalog-search').value=state.q;$('#sort').value=state.sort;tech();}
function reset(){state={category:'all',q:'',sort:'default',filters:{}};sync();render();}
$$('input[name=category]').forEach(r=>r.addEventListener('change',()=>{state.category=r.value;state.filters={};tech();render();}));
$('#catalog-search').addEventListener('input',e=>{state.q=e.target.value;render();});$('.search-clear').addEventListener('click',()=>{state.q='';sync();render();$('#catalog-search').focus();});$('#sort').addEventListener('change',e=>{state.sort=e.target.value;render();});$$('.reset-filters').forEach(b=>b.addEventListener('click',reset));window.addEventListener('popstate',()=>{fromURL();sync();render(false);});
// In Tilda embeds an inline JSON payload replaces this fetch. No scraping of Tilda internals.
const inline=$('#ll-catalog-data');const ready=inline?Promise.resolve(JSON.parse(inline.textContent)):fetch('/assets/catalog.json').then(r=>{if(!r.ok)throw new Error('catalog');return r.json();});
ready.then(data=>{products=data;fromURL();sync();render(false);}).catch(()=>{const note=document.createElement('p');note.className='demo-note';note.setAttribute('role','alert');note.textContent='Данные фильтров не загрузились. Ниже доступен полный каталог. Обновите страницу или воспользуйтесь формой подбора.';grid.before(note);$$('input,select',controls).forEach(x=>x.disabled=true);$('#catalog-search').disabled=true;$('#sort').disabled=true;});
})();
