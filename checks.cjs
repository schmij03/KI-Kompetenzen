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
 const expose="\nreturn {get state(){return state},pages,chapterView,actions,fruitGuess,fruitDomain,fruitTicks,baseFruit,updateFruit,addFruit,undoFruit,resetFruit,tokenDistribution,tokenOptions,chooseToken,resetTokens,nextToken,tokenText,optionsNow,updateRules,put,val,quizzes,quizHTML,quizFeedback,checkQuiz,chooseTask,refreshGroupNames,journalText,materialsHTML,canvasPaper,render,go,markDone};";
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
// Stale cache keys would serve an old stylesheet or script after an update.
const assetHash=file=>require("node:crypto").createHash("sha256").update(fs.readFileSync(require("node:path").join(__dirname,file))).digest("hex").slice(0,12);
for(const[page,markup]of[["index.html",landing],["lernen.html",html]]){
 const references=[...markup.matchAll(/\.\/([\w.-]+\.(?:css|js))\?v=([0-9a-f]{12})/g)];
 assert(references.length>0,"versioned assets referenced in "+page);
 for(const[,file,key]of references)assert(key===assetHash(file),"cache key for "+file+" in "+page+" matches the file");
}
console.log(assertions+" logic and markup checks passed. Layout was additionally verified in Chromium; see README.");
