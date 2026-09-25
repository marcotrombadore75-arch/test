'use strict';
(() => {
  const dialog=document.getElementById('inquiry-dialog');
  const title=document.getElementById('inquiry-title');
  const label=document.getElementById('inquiry-step-label');
  const options=document.getElementById('inquiry-options');
  const ready=document.getElementById('inquiry-ready');
  const back=document.getElementById('inquiry-back');
  const questions=[
    {title:'Che tipo di attività gestisci?',options:['Bar o caffetteria','Ristorante o street food','Negozio, panificio o altra attività']},
    {title:'Cosa vorresti migliorare?',options:['Vendite e scontrini','Tavoli e comande','Asporto e ordini programmati']},
    {title:'Quando vorresti iniziare?',options:['Il prima possibile','Entro un mese','Sto valutando le opzioni']}
  ];
  const answers=['','',''];
  let step=0,opener=null,previousOverflow='';
  function render(focus=true){
    const complete=step===questions.length;
    label.textContent='RICHIEDI INFORMAZIONI · '+(complete?'PRONTO':String(step+1).padStart(2,'0')+' / 03');
    dialog.querySelectorAll('.inquiry-progress span').forEach((bar,i)=>bar.classList.toggle('filled',i<=step));
    title.textContent=complete?'Parliamo della tua attività.':questions[step].title;
    options.hidden=complete;ready.hidden=!complete;back.hidden=step===0;
    options.replaceChildren();
    if(complete){
      ['business','goal','timing'].forEach((key,i)=>{document.getElementById('answer-'+key).textContent=answers[i]});
      const message='Ciao, vorrei informazioni su CassaIQ.\n\nAttività: '+answers[0]+'.\nMi interessa: '+answers[1]+'.\nVorrei iniziare: '+answers[2]+'.\n\nPotete darmi maggiori informazioni sulla soluzione e sulla prova di 30 giorni? Grazie.';
      document.getElementById('inquiry-whatsapp').href='https://wa.me/393793613179?text='+encodeURIComponent(message);
      document.getElementById('inquiry-email').href='mailto:hello@menoova.it?subject='+encodeURIComponent('Informazioni CassaIQ — '+answers[0])+'&body='+encodeURIComponent(message);
    }else{
      questions[step].options.forEach(text=>{
        const button=document.createElement('button');button.type='button';button.className='inquiry-choice';
        button.setAttribute('aria-pressed',String(answers[step]===text));
        const caption=document.createElement('span');caption.textContent=text;
        const arrow=document.createElement('span');arrow.textContent='→';arrow.setAttribute('aria-hidden','true');
        button.append(caption,arrow);
        button.addEventListener('click',()=>{answers[step]=text;step++;render()});options.append(button);
      });
    }
    dialog.scrollTop=0;
    if(focus)title.focus({preventScroll:true});
  }
  document.querySelectorAll('[data-contact-open]').forEach(trigger=>trigger.addEventListener('click',event=>{
    event.preventDefault();if(dialog.open)return;opener=trigger;previousOverflow=document.body.style.overflow;
    render(false);dialog.showModal();document.body.style.overflow='hidden';title.focus({preventScroll:true});
  }));
  back.addEventListener('click',()=>{if(step>0){step--;render()}});
  dialog.querySelector('.inquiry-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;opener?.focus({preventScroll:true})});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close()});
  render(false);
})();
