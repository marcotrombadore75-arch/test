'use strict';
const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#navigation');
function setMenu(open){navigation.classList.toggle('open',open);menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Chiudi menu':'Apri menu');menuButton.querySelector('span').textContent=open?'−':'＋'}
menuButton.addEventListener('click',()=>setMenu(menuButton.getAttribute('aria-expanded')!=='true'));
navigation.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&navigation.classList.contains('open')){setMenu(false);menuButton.focus()}});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))setMenu(false)});
window.matchMedia('(max-width:760px)').addEventListener('change',()=>setMenu(false));

const views={sale:{image:'assets/screen-sale.webp',alt:'Schermata reale CassaIQ: prodotti e carrello',caption:'Il tuo catalogo, il carrello e il totale. Nella stessa schermata.'},tables:{image:'assets/screen-tables.webp',alt:'Schermata reale CassaIQ: gestione tavoli e sale',caption:'Sale, tavoli e nuovi ordini. Tutto sotto controllo.'},payment:{image:'assets/screen-payment.webp',alt:'Schermata reale CassaIQ: scelta del pagamento',caption:'Scegli il metodo di pagamento e completa la vendita.'}};
const tabs=[...document.querySelectorAll('[role="tab"]')];
const productImage=document.querySelector('#product-image');
function selectView(tab){const view=views[tab.dataset.view];tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1});productImage.src=view.image;productImage.alt=view.alt;document.querySelector('#product-caption').textContent=view.caption;document.querySelector('#product-panel').setAttribute('aria-labelledby',tab.id)}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectView(tab));tab.addEventListener('keydown',e=>{let n=i;if(['ArrowRight','ArrowDown'].includes(e.key))n=(i+1)%tabs.length;else if(['ArrowLeft','ArrowUp'].includes(e.key))n=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();selectView(tabs[n]);tabs[n].focus()})});
const screenDialog=document.querySelector('#screen-dialog');
document.querySelector('[data-open-screen]').addEventListener('click',()=>{screenDialog.querySelector('img').src=productImage.src;screenDialog.querySelector('img').alt=productImage.alt;screenDialog.showModal()});
screenDialog.querySelector('button').addEventListener('click',()=>screenDialog.close());
screenDialog.addEventListener('click',e=>{if(e.target===screenDialog){const r=screenDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)screenDialog.close()}});

// Analytics run only with consent and on the public CassaIQ domain.
// The private redesign and demo background do not alter live visit statistics.
const consentKey='cassaiq.cookie.consent.v2';
const cookiePanel=document.querySelector('#cookie-panel');
const inDemoBackground=new URLSearchParams(location.search).has('demoBackground');
const publicDomain=['cassaiq.it','www.cassaiq.it'].includes(location.hostname);
function readConsent(){try{return localStorage.getItem(consentKey)}catch{return null}}
function startAnalytics(){
  if(!publicDomain||inDemoBackground||window.cassaiqAnalyticsStarted)return;
  window.cassaiqAnalyticsStarted=true;
  window.dataLayer=window.dataLayer||[];
  window.gtag=function(){window.dataLayer.push(arguments)};
  window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  window.gtag('js',new Date());window.gtag('config','G-7CZZF562H5');
  const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id=G-7CZZF562H5';document.head.appendChild(script);
  updateVisitCounter();
}
function setConsent(value){try{localStorage.setItem(consentKey,value)}catch{}cookiePanel.hidden=true;window['ga-disable-G-7CZZF562H5']=value!=='granted';if(value==='granted')startAnalytics();else if(window.gtag)window.gtag('consent','update',{analytics_storage:'denied'})}
document.querySelectorAll('[data-consent]').forEach(b=>b.addEventListener('click',()=>setConsent(b.dataset.consent)));
document.querySelector('.cookie-settings').addEventListener('click',()=>{cookiePanel.hidden=false;cookiePanel.querySelector('button').focus()});
if(!inDemoBackground){const consent=readConsent();if(consent==='granted')startAnalytics();else if(!consent)cookiePanel.hidden=false}
async function updateVisitCounter(){
  const now=new Date();const day=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');const key='cassaiq.site.counter.lastDay.v1';let previous;try{previous=localStorage.getItem(key)}catch{}
  try{const response=await fetch('https://fmwoycukrablixqqatmo.supabase.co/rest/v1/rpc/'+(previous===day?'cassaiq_site_counter_get':'cassaiq_site_counter_hit'),{method:'POST',headers:{apikey:'sb_publishable_cgeNpt6V56Wc95lFZUDYSA_xFcmxTTZ',Authorization:'Bearer sb_publishable_cgeNpt6V56Wc95lFZUDYSA_xFcmxTTZ','Content-Type':'application/json'},body:JSON.stringify({p_page:'cassaiq'}),cache:'no-store'});if(!response.ok)return;const count=Number(await response.json());if(!Number.isFinite(count))return;try{localStorage.setItem(key,day)}catch{}document.querySelector('#siteVisitCount').textContent=new Intl.NumberFormat('it-IT').format(count);document.querySelector('#siteVisitCounter').hidden=false}catch{}
}
