/* Dependency-free logic and markup checks. Not a browser/layout test. */
"use strict";
const fs=require("node:fs");
const source=fs.readFileSync(require("node:path").join(__dirname,"app.js"),"utf8");
const html=fs.readFileSync(require("node:path").join(__dirname,"index.html"),"utf8");
let assertions=0;
function assert(ok,label){if(!ok)throw new Error(label);assertions++}
function harness(saved=null){
 const nodes=new Map(),events={};let stored=saved;
 const node=id=>{
  if(!nodes.has(id))nodes.set(id,{id,_value:"",get value(){return this._value},set value(v){this._value=String(v)},innerHTML:"",textContent:"",hidden:false,disabled:false,options:[{},{},{},{},{}],
   focus(){},scrollIntoView(){},showModal(){},close(){}});
  return nodes.get(id);
 };
 const document={getElementById:node,addEventListener(name,fn){(events[name]??=[]).push(fn)},
  querySelectorAll(){return [...nodes.values()].filter(n=>/^sort\d+$/.test(n.id))}};
 const localStorage={getItem(){return stored},setItem(k,v){stored=v}};
 const window={scrollTo(){},addEventListener(){},print(){}};
 const expose="\nreturn {state,pages,chapterView,actions,fruitGuess,baseFruit,updateFruit,addFruit,undoFruit,resetFruit,tokenDistribution,tokenOptions,chooseToken,resetTokens,nextToken,tokenText,optionsNow,updateRules,put,val,quizzes,quizHTML,quizFeedback,checkQuiz,chooseTask,refreshGroupNames,journalText,materialsHTML,canvasPaper,guideHTML,schedule,render,go,markDone};";
 const api=new Function("document","localStorage","window",source+expose)(document,localStorage,window);
 return{api,node,events,saved:()=>stored};
}
const {api,node,events,saved}=harness();
assert(api.fruitGuess(api.baseFruit,160).label==="Apfel","initial fruit prediction");
assert(api.fruitGuess([...api.baseFruit,{w:160,t:"Birne"}],160).label==="Birne","additional pear");
assert(api.fruitGuess(api.baseFruit,140).label==="uneindeutig","equal distance");
assert(api.fruitGuess([...api.baseFruit,{w:160,t:"Birne"},{w:160,t:"Apfel"}],160).label==="uneindeutig","conflicting labels");
assert(api.fruitGuess([],160).label==="keine Trainingsdaten","empty model");
node("fruitWeight").value="160";node("threshold").value="140";api.updateFruit();
assert(node("fruitChart").innerHTML.includes('role="img"'),"accessible fruit chart");
node("newWeight").value="160";node("newType").value="Birne";api.addFruit();
assert(node("fruitResult").innerHTML.includes("Birne"),"add example");
api.undoFruit();assert(node("fruitResult").innerHTML.includes("Apfel"),"undo example");
api.undoFruit();assert(node("fruitMsg").textContent.includes("Ausgangsbeispiele"),"protect initial examples");
node("fruitWeight").value="";api.updateFruit();assert(node("fruitResult").textContent.includes("Bitte"),"empty weight validation");
node("fruitWeight").value="500";api.updateFruit();assert(node("fruitChart").innerHTML==="","clear stale chart");
node("fruitWeight").value="200";node("threshold").value="170";api.updateFruit();
api.go(0);api.go(1);assert(node("fruitWeight").value==="200"&&node("threshold").value==="170","retain experiment controls on chapter change");
for(let i=0;i<4;i++){
 const complete=[];
 function walk(tokens){
  const opts=api.tokenDistribution(i,tokens);
  if(!opts.length){complete.push(tokens);assert(tokens.at(-1)===".","every path ends with full stop");return}
  assert(opts.reduce((sum,x)=>sum+x[1],0)===100,"distribution totals 100");
  assert(opts.every(x=>x[1]>0),"probabilities positive");
  for(const[t]of opts)walk([...tokens,t]);
 }
 walk([]);assert(complete.length>0,"context generates complete examples");
 if(i===1)assert(complete.every(t=>t[2]===(t[0]==="Kind"?"das":"der")),"relative pronoun follows context");
 if(i===3)assert(complete.every(t=>t[0]===","),"door sentence starts with comma");
}
assert(api.chooseToken(api.tokenOptions[0],"max")==="Bern","maximum selection");
assert(api.chooseToken(api.tokenOptions[0],"random",()=>.8)==="Zürich","weighted selection");
assert(api.chooseToken(api.tokenOptions[0],"random",()=>.99)==="Genf","tail selection");
node("context").value="0";node("sampling").value="max";api.resetTokens();api.nextToken();api.nextToken();
assert(api.tokenText()==="Die Hauptstadt der Schweiz ist Bern.","complete generation");
assert(!api.optionsNow().length,"stop generation");
node("chatInput").value="Ich bin in der Schule";api.updateRules();assert(node("chatOutput").textContent.includes("Schule"),"rule priority");
node("chatInput").value="Ich bin müde.";api.updateRules();assert(node("chatOutput").textContent==="Warum bist du müde?","rule substitution");
let time=0;
for(const row of api.schedule){const[a,b]=row[0].split("–").map(Number);assert(a===time&&b>a,"continuous schedule");time=b}
assert(time===120,"120 minutes");
api.put("modelOpen",true);
for(let chapter=0;chapter<8;chapter++){
 api.state.chapter=chapter;const markup=api.chapterView();
 assert(markup.includes("<h1>")&&markup.includes('class="learning-goal"'),"chapter has goal");
 const ids=[...markup.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert(ids.length===new Set(ids).size,"unique IDs in chapter "+chapter);
 for(const m of markup.matchAll(/data-action="([^"]+)"/g))assert(typeof api.actions[m[1]]==="function","valid action "+m[1]);
 for(const m of markup.matchAll(/href="#([^"]+)"/g))assert(ids.includes(m[1]),"outline links to section");
}
for(const m of html.matchAll(/data-action="([^"]+)"/g))assert(typeof api.actions[m[1]]==="function","valid global action");
for(let i=0;i<api.quizzes.length;i++){
 api.checkQuiz(i);assert(node("quizFeedback"+i).textContent.includes("zuerst"),"quiz requires choice");
 api.put("quiz"+i,String(api.quizzes[i].correct));api.checkQuiz(i);
 assert(node("quizFeedback"+i).textContent.startsWith("Das passt."),"correct answer feedback");
 api.put("quiz"+i,String((api.quizzes[i].correct+1)%3));
 assert(node("quizFeedback"+i).hidden&&!api.val("quizChecked"+i),"changing answer clears stale feedback");
 api.checkQuiz(i);assert(node("quizFeedback"+i).textContent.startsWith("Prüfe"),"incorrect answer explains");
}
api.put("verbesserteaufgabe","Meine vorhandene Überarbeitung");api.chooseTask(2);
assert(api.val("taskwahl").startsWith("Geschichte"),"select task");
assert(api.val("verbesserteaufgabe")==="Meine vorhandene Überarbeitung","preserve own work");
node("sort0");api.put("group1","Unsere Daten");api.put("sort0","1");
assert(node("sort0").options[1].textContent==="Unsere Daten","live group labels");
assert(node("groupSummary").innerHTML.includes("Unsere Daten"),"live group summary");
api.put("fach",'<img src=x onerror="alert(1)">');
assert(!api.pages[7]().includes("<img src=x"),"escape form values");
assert(api.canvasPaper(true).includes("&lt;img"),"escape print values");
api.put("group1","<script>alert(1)</script>");
assert(!node("groupSummary").innerHTML.includes("<script>"),"escape group names");
assert(api.journalText().includes("Selbsttest:"),"quiz in journal");
assert((api.materialsHTML().match(/<strong>Karte \d+<\/strong>/g)||[]).length===12,"12 printable cards");
assert(api.guideHTML().includes("120 Minuten"),"print guide");
assert(api.materialsHTML().includes("Exit-Ticket"),"print exit ticket");
const restored=harness(saved()).api;
assert(restored.val("verbesserteaufgabe")==="Meine vorhandene Überarbeitung","restore existing notes");
const invalid=harness('{"answers":{"safe":"ok","bad":{},"constructor":"unsafe"},"done":[0,0,99],"chapter":999}').api;
assert(invalid.val("safe")==="ok"&&invalid.val("bad")==="","validate stored data");
assert(invalid.state.done.length===1&&invalid.state.chapter===7,"sanitize progress");
assert(!Object.hasOwn(invalid.state.answers,"constructor"),"reject prototype keys");
const corrupt=harness("{broken").api;assert(corrupt.state.chapter===0,"recover corrupt storage");
console.log(assertions+" logic and markup checks passed. Browser and print layout remain untested.");
