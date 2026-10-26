/* Dependency-free logic and markup checks. Not a browser/layout test. */
"use strict";
const fs=require("node:fs");
const source=fs.readFileSync(require("node:path").join(__dirname,"app.js"),"utf8");
const html=fs.readFileSync(require("node:path").join(__dirname,"lernen.html"),"utf8");
const landing=fs.readFileSync(require("node:path").join(__dirname,"index.html"),"utf8");
let assertions=0;
function assert(ok,label){if(!ok)throw new Error(label);assertions++}
function harness(saved=null,search="",options={}){
 const nodes=new Map(),events={},windowEvents={};let stored=saved,writes=0;
 const node=id=>{
  if(!nodes.has(id))nodes.set(id,{id,_value:"",get value(){return this._value},set value(v){this._value=String(v)},innerHTML:"",textContent:"",hidden:false,disabled:false,options:[{},{},{},{},{}],
   focus(){},scrollIntoView(){},showModal(){},close(){}});
  return nodes.get(id);
 };
 const document={getElementById:node,addEventListener(name,fn){(events[name]??=[]).push(fn)},
  querySelectorAll(){return [...nodes.values()].filter(n=>/^sort\d+$/.test(n.id))}};
 const localStorage={getItem(){if(options.storageFails)throw Error("Storage blocked");return stored},setItem(k,v){if(options.storageFails)throw Error("Storage blocked");writes++;stored=v}};
 const historyEntries=["https://example.test/lernen.html"+search];let position=0;
 const window={location:new URL(historyEntries[0]),scrollTo(){},addEventListener(name,fn){(windowEvents[name]??=[]).push(fn)},print(){}};
 window.history={
  pushState(data,title,url){if(options.historyFails)throw Error("History blocked");historyEntries.splice(++position);historyEntries[position]=url;window.location=new URL(url)},
  replaceState(data,title,url){if(options.historyFails)throw Error("History blocked");historyEntries[position]=url;window.location=new URL(url)}
 };
 const expose="\nreturn {get state(){return state},pages,chapterView,actions,fruitGuess,fruitDomain,fruitTicks,baseFruit,updateFruit,addFruit,undoFruit,resetFruit,tokenDistribution,tokenOptions,chooseToken,resetTokens,nextToken,tokenText,optionsNow,updateRules,put,val,quizzes,quizHTML,quizFeedback,checkQuiz,chooseTask,refreshGroupNames,journalText,materialsHTML,canvasPaper,render,go,markDone,matrix,matrixCycle,matrixLevels,matrixHTML,sortMode,areaSummaryHTML};";
 const api=new Function("document","localStorage","window","confirm",source+expose)(document,localStorage,window,()=>options.confirmClear!==false);
 return{api,node,events,windowEvents,window,saved:()=>stored,writes:()=>writes,
 back(){if(position>0){window.location=new URL(historyEntries[--position]);(windowEvents.popstate||[]).forEach(fn=>fn())}},
 forward(){if(position<historyEntries.length-1){window.location=new URL(historyEntries[++position]);(windowEvents.popstate||[]).forEach(fn=>fn())}}
 };
}
const {api,node,events,saved}=harness();
for(let i=0;i<8;i++)assert(landing.includes('href="./lernen.html?kapitel='+i+'"'),"homepage links to chapter "+i);
assert(landing.includes('href="./lernen.html"'),"homepage offers saved chapter entry");
assert(html.includes('href="./"'),"learning environment links home");
for(let i=0;i<8;i++)assert(harness(null,"?kapitel="+i).api.state.chapter===i,"landing chapter destination "+i);
const savedChapter=JSON.stringify({answers:{startbeleg:"Mein Beispiel"},done:[0],chapter:4});
assert(harness(savedChapter).api.state.chapter===4,"plain entry resumes chapter");
const linked=harness(savedChapter,"?kapitel=2").api;
assert(linked.state.chapter===2&&linked.val("startbeleg")==="Mein Beispiel"&&linked.state.done.includes(0),"chapter link preserves saved work");
assert(harness(savedChapter,"?kapitel=99").api.state.chapter===4,"invalid chapter retains saved chapter");
assert(api.fruitGuess(api.baseFruit,160).label==="Apfel","initial fruit prediction");
assert(api.fruitGuess([...api.baseFruit,{w:160,t:"Birne"}],160).label==="Birne","additional pear");
assert(api.fruitGuess(api.baseFruit,140).label==="uneindeutig","equal distance");
assert(api.fruitGuess([...api.baseFruit,{w:160,t:"Birne"},{w:160,t:"Apfel"}],160).label==="uneindeutig","conflicting labels");
assert(api.fruitGuess([],160).label==="keine Trainingsdaten","empty model");
node("fruitWeight").value="160";node("threshold").value="140";api.updateFruit();
assert(node("fruitChart").innerHTML.includes('role="img"'),"accessible fruit chart");
assert(node("fruitChart").innerHTML.includes("Gewicht in Gramm"),"fruit chart labels its axis");
const padded=api.fruitDomain([110,180]);
assert(padded.lo<110&&padded.hi>180,"chart domain pads the data range");
const flat=api.fruitDomain([160]);
assert(flat.hi>flat.lo,"identical weights still span a drawable range");
assert(api.fruitTicks(padded.lo,padded.hi).every(t=>t>=padded.lo&&t<=padded.hi),"ticks stay inside the domain");
assert(api.fruitTicks(105,190).length>1&&api.fruitTicks(105,190).length<=7,"tick count stays readable");
assert(api.fruitTicks(100,2000).length<=7,"wide ranges do not flood the axis");
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
api.put("modelOpen",true);
for(let chapter=0;chapter<8;chapter++){
 api.state.chapter=chapter;const markup=api.chapterView();
 assert(!/\bMinuten\b|\d+\s*Min\b/.test(markup),"no workshop timing in chapter "+chapter);
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
const opening=harness(null,"?kapitel=0").api;
assert(!opening.pages[0]().includes("Unsere Einordnung"),"opening exercise hides its resolution first");
assert((opening.pages[0]().match(/data-key="alltag\d"/g)||[]).length===6,"six everyday cases to classify");
opening.put("alltag0","regel");
opening.actions.revealAlltag();
assert(opening.pages[0]().includes("Unsere Einordnung"),"resolution appears after the reveal");
assert(opening.val("alltag0")==="regel","reveal keeps the chosen answers");
assert(opening.journalText().includes("KI oder nicht KI: "),"opening exercise reaches the journal");
assert(api.materialsHTML().includes("KI oder nicht KI"),"opening exercise is printable");
const badOpening=harness(JSON.stringify({answers:{alltag0:"unsinn",alltag1:"offen",alltagOpen:"ja"},chapter:0,done:[]})).api;
assert(badOpening.val("alltag0")===""&&badOpening.val("alltagOpen")==="","invalid opening answers removed");
assert(badOpening.val("alltag1")==="offen","valid opening answers kept");
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
assert(api.materialsHTML().includes("Exit-Ticket"),"print exit ticket");
assert(!/\bMinuten\b|\d+\s*Min\b/.test(api.materialsHTML()),"no timing in print materials");
const restored=harness(saved()).api;
assert(restored.val("verbesserteaufgabe")==="Meine vorhandene Überarbeitung","restore existing notes");
const invalid=harness('{"answers":{"safe":"ok","bad":{},"constructor":"unsafe"},"done":[0,0,99],"chapter":999}').api;
assert(invalid.val("safe")==="ok"&&invalid.val("bad")==="","validate stored data");
assert(invalid.state.done.length===1&&invalid.state.chapter===7,"sanitize progress");
assert(!Object.hasOwn(invalid.state.answers,"constructor"),"reject prototype keys");
const corrupt=harness("{broken").api;assert(corrupt.state.chapter===0,"recover corrupt storage");
const navigation=harness(null,"?kapitel=1");
navigation.api.put("startbeleg","Bleibt erhalten");
navigation.api.go(3);
assert(navigation.window.location.search==="?kapitel=3","navigation updates URL");
assert(harness(navigation.saved(),navigation.window.location.search).api.state.chapter===3,"reload keeps visible chapter");
navigation.back();assert(navigation.api.state.chapter===1,"browser back restores chapter");
navigation.forward();assert(navigation.api.state.chapter===3,"browser forward restores chapter");
assert(navigation.api.val("startbeleg")==="Bleibt erhalten","history retains notes");
const writeCount=navigation.writes();
navigation.api.put("startbeleg","Bleibt erhalten");navigation.api.render();
assert(navigation.writes()===writeCount,"unchanged values do not rewrite storage");
const blocked=harness(null,"",{storageFails:true});
blocked.api.put("startbeleg","Im Speicher verfügbar");
assert(blocked.node("saveStatus").hidden===false,"storage failure visible outside resource menu");
assert(blocked.api.journalText().includes("Im Speicher verfügbar"),"blocked storage still permits journal export");
assert(harness(null,"",{historyFails:true}).api.state.chapter===0,"file browser history failure does not break app");
const simulation=harness(null,"?kapitel=2");
simulation.node("chatInput").value="Ich bin neugierig";simulation.api.updateRules();
simulation.node("context").value="1";simulation.api.resetTokens();
simulation.node("sampling").value="max";simulation.api.nextToken();
simulation.api.go(4);simulation.api.go(2);
assert(simulation.node("sampling").value==="max","sampling choice survives chapter change");
assert(simulation.node("chatInput").value==="Ich bin neugierig","rule input survives chapter change");
assert(simulation.node("tokenText").textContent==="Es war einmal ein Kind","generated text survives chapter change");
assert(simulation.node("tokenStep").textContent.includes("Schritt 1"),"step indicator matches restored tokens");
assert(api.fruitGuess([{w:150.1,t:"Apfel"},{w:150.3,t:"Birne"}],150.2).label==="uneindeutig","decimal equidistance");
const invalidControls=harness(JSON.stringify({answers:{quiz0:true,quiz1:"99",domain0:"false",pre0:"9",sort0:"8",niveau:"X",tm_test:"Mein Test"},chapter:0,done:[]})).api;
assert(invalidControls.val("quiz0")===""&&invalidControls.val("quiz1")==="","invalid quiz values removed");
assert(invalidControls.val("domain0")===""&&invalidControls.val("niveau")==="","invalid canvas controls removed");
assert(invalidControls.val("pre0")===""&&invalidControls.val("sort0")==="","invalid rating and sorting removed");
assert(invalidControls.val("tm_test")==="Mein Test","control validation keeps notes");
assert(!invalidControls.journalText().includes("undefined"),"journal has no undefined answers");
simulation.api.actions.clear();
assert(simulation.api.state.chapter===0&&simulation.window.location.search==="?kapitel=0","clear resets chapter and URL");
assert(!Object.keys(simulation.api.state.answers).length,"clear removes notes");
const cancelled=harness(savedChapter,"",{confirmClear:false});
cancelled.api.actions.clear();
assert(cancelled.api.val("startbeleg")==="Mein Beispiel","cancel clear preserves notes");
navigation.api.actions.canvas();
assert(navigation.node("paper").innerHTML.includes("KI-Kompetenz-Canvas"),"canvas print content prepared");
navigation.windowEvents.beforeprint.forEach(fn=>fn());
assert(!navigation.node("paper").innerHTML.includes("Experimentprotokoll"),"print event keeps chosen canvas");
navigation.windowEvents.afterprint.forEach(fn=>fn());
assert(navigation.node("paper").innerHTML==="","print content cleaned");
api.put("group1","Quellen prüfen");api.put("sort0","1");api.put("tm_test","Stift auf dunklem Papier");
assert(api.journalText().includes("Quellen prüfen"),"journal includes group names");
assert(api.journalText().includes("Teachable Machine:")&&api.journalText().includes("Stift auf dunklem Papier"),"optional task exported");
assert(api.materialsHTML().includes("Zusatzaufgabe · Teachable Machine"),"optional task printable");
// Chapter 6 offers open sorting (default, keeps existing data) and direct assignment to the four domains.
const sorting=harness(JSON.stringify({answers:{group1:"Unsere Daten",sort0:"1",sortbegruendung:"Alt"},chapter:5,done:[]}),"?kapitel=5");
assert(sorting.api.sortMode()==="offen","open sorting stays the default for existing data");
let sortPage=sorting.api.pages[5]();
assert(sortPage.includes('data-key="group1"')&&!sortPage.includes('data-key="area0"'),"open mode shows own groups");
assert(!sortPage.includes("Das Kompetenzmodell im Detail"),"open mode keeps the matrix back until the comparison");
assert(sortPage.includes('aria-pressed="true"')&&sortPage.includes('data-action="setSortMode"'),"mode switch announces the active mode");
sorting.api.actions.setSortMode({dataset:{mode:"bereiche"}});
assert(sorting.api.sortMode()==="bereiche"&&sorting.saved().includes('"sortMode":"bereiche"'),"chosen mode is stored");
sortPage=sorting.api.pages[5]();
assert((sortPage.match(/data-key="area\d+"/g)||[]).length===12&&(sortPage.match(/data-key="stufe\d+"/g)||[]).length===12,"each card gets a domain and a level");
assert(sortPage.includes("Das Kompetenzmodell im Detail")&&!sortPage.includes('data-key="group1"'),"domain mode shows the matrix instead of own groups");
sorting.api.actions.setSortMode({dataset:{mode:"unsinn"}});
assert(sorting.api.sortMode()==="bereiche","unknown modes are ignored");
assert(sorting.api.val("group1")==="Unsere Daten"&&sorting.api.val("sort0")==="1"&&sorting.api.val("sortbegruendung")==="Alt","switching modes keeps open sorting");
sorting.api.actions.revealAreas();
assert(sorting.node("areaStatus").textContent.includes("alle zwölf")&&!sorting.api.val("areaOpen"),"comparison needs every card assigned");
const focus=[2,0,3,1,2,0,3,1,0,3,1,2];for(let i=0;i<12;i++)sorting.api.put("area"+i,String(focus[i]+1));
sorting.api.put("stufe0","II");
sorting.api.actions.revealAreas();
assert(sorting.api.val("areaOpen")===true,"complete assignment opens the comparison");
assert(sorting.api.areaSummaryHTML().includes("Bei 12 von 12 Karten"),"comparison counts matches with the possible focus");
assert(sorting.api.areaSummaryHTML().includes("Stufe II")&&sorting.api.areaSummaryHTML().includes("Stufe offen"),"comparison shows estimated and open levels");
sorting.api.put("area0","4");
assert(sorting.node("areaSummary").innerHTML.includes("Bei 11 von 12 Karten")&&sorting.node("areaSummary").innerHTML.includes("(abweichend)"),"comparison updates live");
assert(sorting.api.areaSummaryHTML().includes("keine Musterlösung"),"levels get no model answer");
sortPage=sorting.api.chapterView();
const sortIds=[...sortPage.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert(sortIds.length===new Set(sortIds).size,"unique IDs in domain mode");
for(const m of sortPage.matchAll(/data-action="([^"]+)"/g))assert(typeof sorting.api.actions[m[1]]==="function","valid action in domain mode "+m[1]);
assert((sortPage.match(/class="card matrix"/g)||[]).length===1,"matrix appears once in domain mode");
assert(!/\bMinuten\b|\d+\s*Min\b/.test(sortPage),"no workshop timing in domain mode");
assert(sorting.api.journalText().includes("Bereich für Karte 1: ")&&sorting.api.journalText().includes("\nMitgestalten"),"journal names the chosen domain");
assert(sorting.api.journalText().includes("Niveaustufe für Karte 1: ")&&sorting.api.journalText().includes("\nII"),"journal names the estimated level");
const reloadedSorting=harness(sorting.saved(),"?kapitel=5").api;
assert(reloadedSorting.sortMode()==="bereiche"&&reloadedSorting.val("area0")==="4"&&reloadedSorting.val("stufe0")==="II"&&reloadedSorting.val("group1")==="Unsere Daten","both modes survive a reload");
const badSorting=harness(JSON.stringify({answers:{sortMode:"alles",area0:"5",area1:"2",stufe0:"IV",stufe1:"III",areaOpen:"ja",sort0:"2"},chapter:5,done:[]})).api;
assert(badSorting.val("sortMode")===""&&badSorting.val("area0")===""&&badSorting.val("stufe0")===""&&badSorting.val("areaOpen")==="","invalid domain-mode values removed");
assert(badSorting.val("area1")==="2"&&badSorting.val("stufe1")==="III"&&badSorting.val("sort0")==="2","valid domain-mode values kept");
// The shortened matrix: four domains with three levels each, a closed cycle and an attributed source.
assert(api.matrix.map(d=>d.domain).join()==="Verstehen,Anwenden,Reflektieren,Mitgestalten","matrix follows the four domains");
assert(api.matrix.every(d=>d.focus&&d.levels.length===3&&d.levels.every(l=>l.length>=3&&l.every(t=>typeof t==="string"&&t.length>10))),"every domain describes levels I to III");
assert(api.matrixLevels.map(l=>l.join(" ")).join()==="I Basis,II Vertiefung,III Expertise","levels are named");
assert(api.matrixCycle.every((t,i)=>t[1]===api.matrixCycle[(i+1)%4][0]&&t[2].includes(" / ")),"transitions close the circle");
const matrixMarkup=api.matrixHTML();
for(const part of ["AI Leadership","Lernen über, mit, durch, trotz und ohne KI","keine Klassenstufen","keine Zuordnung zu I bis III","AILit","10.5281/zenodo.15047793","CC BY 4.0","Gekürzt","Susanne Alles, Joscha Falck, Manuel Flick und Regina Schulz"])assert(matrixMarkup.includes(part),"matrix names "+part);
assert((matrixMarkup.match(/<details class="matrix-domain/g)||[]).length===4,"one expandable section per domain");
assert(matrixMarkup.includes('role="img"')&&matrixMarkup.includes("<title"),"cycle diagram is labelled");
api.put("modelOpen",true);api.state.chapter=5;
assert(api.pages[5]().includes("Das Kompetenzmodell im Detail"),"open mode shows the matrix after the comparison");
const printed=api.materialsHTML();
assert(printed.includes("Den vier Bereichen zuordnen:")&&printed.includes("Niveaustufe I, II oder III"),"card sheets explain the second mode");
assert(printed.includes("Kompetenzmatrix (gekürzt)")&&printed.includes("10.5281/zenodo.15047793")&&printed.includes("Expertise"),"matrix is printable with its source");
assert((printed.match(/<strong>Karte \d+<\/strong>/g)||[]).length===12,"still 12 printable cards");
assert(!/\bMinuten\b|\d+\s*Min\b/.test(printed),"no timing in extended print materials");
// Chapter 5 weighs chances and limits; the old field keys keep stored notes.
const school=harness(JSON.stringify({answers:{kann:"Alt gespeichert",nicht:"N",mensch:"M"},chapter:4,done:[]}),"?kapitel=4");
let schoolPage=school.api.pages[4]();
assert(school.api.val("kann")==="Alt gespeichert"&&schoolPage.includes("Alt gespeichert"),"existing chapter 5 notes stay visible");
for(const part of ["Im Schulalltag hilft KI bei …","Nicht verlassen kann ich mich auf …","Deshalb bleibt bei mir …","Chancen und Grenzen im Bildungsalltag","Material differenzieren","Feedback vorbereiten","Lernende unterstützen","Ideen und Perspektiven","Darum macht der Mensch",'data-key="chancegrenze"'])assert(schoolPage.includes(part),"chapter 5 shows "+part);
assert(!schoolPage.includes("KI kann gut"),"old sentence starters replaced");
school.api.put("chancegrenze","Differenzieren, aber fachlich prüfen");
assert(school.api.journalText().includes("Im Schulalltag hilft KI bei\nAlt gespeichert")&&school.api.journalText().includes("Eine Chance für meinen Unterricht und ihre Grenze\nDifferenzieren"),"chapter 5 reaches the journal");
assert(api.materialsHTML().includes("Chancen und Grenzen im Bildungsalltag")&&api.materialsHTML().includes("Schülerdaten gehören nicht in Prompts")&&api.materialsHTML().includes("Deshalb bleibt bei mir"),"chances overview is printable");
school.api.state.chapter=4;assert(school.api.chapterView().includes("Chance für deinen Unterricht"),"chapter 5 goal names chances");
// Activity review: eight activities, a resolution without score, Mitgestalten named as missing.
const review=harness(JSON.stringify({answers:{sortMode:"bereiche"},chapter:5,done:[]}),"?kapitel=5");
let reviewPage=review.api.pages[5]();
assert((reviewPage.match(/data-key="geuebt\d"/g)||[]).length===8,"eight activities to assign");
assert(!reviewPage.includes("Mögliche Zuordnung")&&reviewPage.includes('data-action="revealPractised"'),"resolution stays hidden first");
review.api.put("geuebt0","2");review.api.actions.revealPractised();
reviewPage=review.api.pages[5]();
assert((reviewPage.match(/Mögliche Zuordnung: /g)||[]).length===8,"resolution for every activity");
assert(reviewPage.includes("Mögliche Zuordnung: Verstehen")&&reviewPage.includes("Mögliche Zuordnung: Anwenden")&&reviewPage.includes("Mögliche Zuordnung: Reflektieren")&&!reviewPage.includes("Mögliche Zuordnung: Mitgestalten"),"resolution uses three domains");
assert(reviewPage.includes("Mitgestalten kam kaum vor")&&reviewPage.includes("Kapitel 7 und 8")&&reviewPage.includes("Mehrere Zuordnungen sind begründbar"),"resolution names the missing domain");
assert(!/\d+ von 8|Punkte/.test(reviewPage),"activity review has no score");
assert(review.api.val("geuebt0")==="2"&&review.api.journalText().includes("Heute geübt: Systeme als feste Regeln oder aus Daten gelernt einordnen\nAnwenden"),"activity choice kept and exported");
const openReview=harness(JSON.stringify({answers:{},chapter:5,done:[]}),"?kapitel=5").api;
assert(!openReview.pages[5]().includes('data-key="geuebt0"'),"open sorting keeps the model and the review back");
openReview.put("modelOpen",true);assert(openReview.pages[5]().includes('data-key="geuebt0"'),"open sorting shows the review after the comparison");
const badReview=harness(JSON.stringify({answers:{geuebt0:"7",geuebt1:"3",geuebtOpen:"ja"},chapter:5,done:[]})).api;
assert(badReview.val("geuebt0")===""&&badReview.val("geuebtOpen")===""&&badReview.val("geuebt1")==="3","invalid review values removed, valid kept");
// The projection view reuses app.js, so it has to keep the elements app.js writes into.
const demo=fs.readFileSync(require("node:path").join(__dirname,"demo.html"),"utf8");
for(const id of ["nav","main","progress","progressText","paper"])assert(demo.includes('id="'+id+'"'),"projection view keeps #"+id+" for app.js");
assert(demo.includes('src="./app.js'),"projection view loads app.js");
// Local links must point at files that exist.
for(const page of ["index.html","lernen.html","unterrichtsideen.html","it2school.html","ablauf.html","demo.html"]){
 const markup=fs.readFileSync(require("node:path").join(__dirname,page),"utf8");
 for(const m of markup.matchAll(/(?:href|src)="\.\/([^"#?]+)/g))
  assert(m[1]===""||fs.existsSync(require("node:path").join(__dirname,m[1])),"local link ./"+m[1]+" in "+page+" exists");
}
// Stale cache keys would serve an old stylesheet or script after an update.
const assetHash=file=>require("node:crypto").createHash("sha256").update(fs.readFileSync(require("node:path").join(__dirname,file))).digest("hex").slice(0,12);
const read=file=>fs.readFileSync(require("node:path").join(__dirname,file),"utf8");
for(const[page,markup]of["unterrichtsideen.html","it2school.html","ablauf.html","demo.html"].map(f=>[f,read(f)]).concat([["index.html",landing],["lernen.html",html]])){
 const references=[...markup.matchAll(/\.\/([\w.-]+\.(?:css|js))\?v=([^"'\s>]+)/g)];
 assert(references.length>0,"versioned assets referenced in "+page);
 for(const[,file,key]of references)assert(key===assetHash(file),"cache key for "+file+" in "+page+" matches the file");
}
// The facilitation plan must add up to 120 minutes without gaps, and each phase card must match the overview.
const plan=read("ablauf.html");
const planRows=[...plan.matchAll(/<tr(?: class="break")?><td>(\d\d\d?)–(\d\d\d?)<\/td>/g)].map(m=>[+m[1],+m[2]]);
assert(planRows.length===9,"overview lists nine time blocks: eight phases and a break");
assert(planRows[0][0]===0&&planRows[planRows.length-1][1]===120,"overview runs from minute 0 to 120");
for(let i=1;i<planRows.length;i++)assert(planRows[i][0]===planRows[i-1][1],"time block "+(i+1)+" starts where the previous one ends");
const planCards=[...plan.matchAll(/class="phase-time">(\d\d\d?)–(\d\d\d?) Minuten/g)].map(m=>[+m[1],+m[2]]);
assert(JSON.stringify(planCards)===JSON.stringify(planRows),"phase cards use the same times as the overview");
assert([...plan.matchAll(/class="phase-time">[^<]*Folie/g)].length===9,"every phase names its slides");
assert([...plan.matchAll(/<article class="card phase[^"]*" id="phase-/g)].length===9,"nine phase cards");
// Slides in the overview and on the cards must agree, follow each other and stop before the appendix.
const slideRange=text=>{const n=(text.match(/\d+/g)||[]).map(Number);return[n[0],n.at(-1)]};
const overviewSlides=[...plan.matchAll(/<tr(?: class="break")?><td>[^<]*<\/td>(?:<td>[^<]*<\/td>){2}<td>([^<]*)<\/td>/g)].map(m=>slideRange(m[1]));
const cardSlides=[...plan.matchAll(/class="phase-time">[^<]*?(Folien? [^<]*)<\/p>/g)].map(m=>slideRange(m[1]));
assert(overviewSlides.length===9&&JSON.stringify(overviewSlides)===JSON.stringify(cardSlides),"phase cards name the same slides as the overview");
assert(overviewSlides[0][0]===1&&overviewSlides.at(-1)[1]===49,"slides 1 to 49 belong to the 120 minutes");
for(let i=1;i<overviewSlides.length;i++)assert(overviewSlides[i][0]===overviewSlides[i-1][1]+1,"slides of block "+(i+1)+" follow the previous block");
assert(plan.includes("Folien 50 bis 52 (INPUT, PICTS, Stufenmodell)")&&!/Folien (28 bis 30|46 bis 48)/.test(plan),"appendix names slides 50 to 52");
for(const phase of plan.match(/<article class="card phase" id="phase-\d"[\s\S]*?<\/article>/g))
 for(const part of ["Sozialform","Vorne","Teilnehmende","Stolperstelle",'class="phase-goal"','class="say"'])assert(phase.includes(part),"phase card names "+part);
for(const part of ["Gruppe trifft Gruppe","Partnerprüfungsfrage","7×7-Raster","Kurzversuch"])assert(plan.includes(part),"plan describes "+part);
console.log(assertions+" logic and markup checks passed. Layout was additionally verified in Chromium; see README.");
