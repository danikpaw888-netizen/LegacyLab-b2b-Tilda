/* Native Tilda form enhancement. Configure hidden ll_form_mode=demo (default)
 * or live only after a recipient and approved documents are connected.
 * Fields: name, company, contact, comment, product, direction, source_page, intent.
 * Load at end of the page in T123. Native Tilda handles live transport/results.
 */
(()=>{'use strict';
const valid=v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)||(/^\+?[0-9\s()\-]+$/.test(v)&&v.replace(/\D/g,'').length>=10&&v.replace(/\D/g,'').length<=15);
function init(){for(const form of document.querySelectorAll('form')){
const contact=form.elements.namedItem('contact'),mode=form.elements.namedItem('ll_form_mode');if(!contact||!mode||form.dataset.llEnhanced)return;form.dataset.llEnhanced='true';
contact.type='text';contact.required=true;contact.setAttribute('aria-required','true');
const q=new URLSearchParams(location.search);for(const key of['product','direction','intent','source_page']){const f=form.elements.namedItem(key);if(!f)continue;const value=q.get('form-setter-'+key);if(value)f.value=value.slice(0,200);if(key==='source_page'&&!f.value)f.value=location.pathname;}
const summary=document.createElement('p');summary.style.cssText='padding:12px 16px;border-left:3px solid #2358D5;background:#F3F5F7;font:14px/1.6 Inter,Arial;color:#17212B';summary.textContent=['product','direction','intent'].map(k=>form.elements.namedItem(k)?.value).filter(Boolean).join(' · ');if(summary.textContent)form.prepend(summary);
const error=document.createElement('span');error.id='ll-contact-error-'+[...document.forms].indexOf(form);error.setAttribute('aria-live','polite');error.style.cssText='display:block;color:#AC2535;font-size:13px;line-height:1.6;margin-top:8px';contact.after(error);contact.setAttribute('aria-describedby',[(contact.getAttribute('aria-describedby')||''),error.id].join(' ').trim());
function check(){const ok=valid(contact.value.trim());contact.setCustomValidity(ok?'':'Введите email или телефон из 10–15 цифр.');contact.setAttribute('aria-invalid',String(!ok));error.textContent=ok?'':'Введите email вида name@company.kz или телефон из 10–15 цифр.';return ok;}
contact.addEventListener('input',()=>{if(contact.getAttribute('aria-invalid')==='true')check()});
const status=document.createElement('p');status.setAttribute('role','status');status.style.cssText='font:14px/1.6 Inter,Arial;color:#17212B;padding-top:16px';form.append(status);
function gate(e){const n=form.elements.namedItem('name');if(n){n.value=n.value.trim();n.setCustomValidity(n.value?'':'Укажите имя.');if(!n.value){e.preventDefault();e.stopImmediatePropagation();n.reportValidity();return false;}}if(!check()){e.preventDefault();e.stopImmediatePropagation();contact.focus();return false;}if(mode.value!=='live'){e.preventDefault();e.stopImmediatePropagation();status.textContent='Проверка завершена. Запрос не отправлен: это тестовая форма, получатель не подключён.';return false;}return true;}
form.addEventListener('submit',gate,true);form.addEventListener('click',e=>{if(e.target.closest('button[type="submit"],input[type="submit"]'))gate(e)},true);
}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
