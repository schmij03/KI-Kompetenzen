"use strict";
const form=document.getElementById('filters');
const cards=[...document.querySelectorAll('.idea')];
const search=document.getElementById('search');
const subject=document.getElementById('subject');
const mode=document.getElementById('mode');
const domain=document.getElementById('domain');
const searchable=new Map(cards.map(card=>[card,card.textContent.toLocaleLowerCase('de-CH')]));
function filterIdeas(){
 const terms=search.value.trim().toLocaleLowerCase('de-CH').split(/\s+/).filter(Boolean);
 let count=0;
 for(const card of cards){
  const match=terms.every(term=>searchable.get(card).includes(term))&&(!subject.value||card.dataset.subjects.split('|').includes(subject.value))&&(!mode.value||card.dataset.mode===mode.value)&&(!domain.value||card.dataset.domains.split(' ').includes(domain.value));
  card.hidden=!match;if(match)count++;
 }
 document.getElementById('result-count').textContent=count+' von '+cards.length+' Unterrichtsideen';
 document.getElementById('empty').hidden=count!==0;
}
form.hidden=false;
form.addEventListener('input',filterIdeas);
form.addEventListener('change',filterIdeas);
form.addEventListener('submit',event=>event.preventDefault());
form.addEventListener('reset',()=>{search.value='';subject.value='';mode.value='';domain.value='';filterIdeas()});
let savedDetails=null;
function openPrintDetails(){
 if(savedDetails)return;
 savedDetails=cards.flatMap(card=>[...card.querySelectorAll('details')].map(detail=>[detail,detail.open]));
 savedDetails.forEach(([detail])=>{detail.open=true});
}
function restorePrint(){
 if(savedDetails)savedDetails.forEach(([detail,open])=>{detail.open=open});
 savedDetails=null;document.body.classList.remove('print-one');
 cards.forEach(card=>card.classList.remove('print-target'));
}
document.querySelectorAll('[data-print]').forEach(button=>{
 button.hidden=false;
 button.addEventListener('click',()=>{
  const card=document.getElementById(button.dataset.print);
  card.classList.add('print-target');document.body.classList.add('print-one');openPrintDetails();
  try{window.print()}catch(error){restorePrint();throw error}
 });
});
window.addEventListener('beforeprint',openPrintDetails);
window.addEventListener('afterprint',restorePrint);
filterIdeas();
