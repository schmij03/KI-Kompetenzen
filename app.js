"use strict";
const $=id=>document.getElementById(id);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const KEY="ki-workshop-v1";
let state={answers:{},done:[],chapter:0},persistent=true,lastSaved="";
try{
 const stored=localStorage.getItem(KEY);
 const loaded=JSON.parse(stored||"null");
 if(loaded&&loaded.answers&&typeof loaded.answers==="object"&&!Array.isArray(loaded.answers)&&Array.isArray(loaded.done)){
  state.answers=Object.fromEntries(Object.entries(loaded.answers).filter(([k,v])=>!["__proto__","constructor","prototype"].includes(k)&&(typeof v==="string"||typeof v==="boolean")));
  state.done=[...new Set(loaded.done.filter(n=>Number.isInteger(n)&&n>=0&&n<8))];
  state.chapter=Number.isInteger(loaded.chapter)?Math.max(0,Math.min(7,loaded.chapter)):0;
 }
 lastSaved=stored||"";
}catch(e){persistent=false}
function save(){
 const serialized=JSON.stringify(state);
 try{if(serialized!==lastSaved){localStorage.setItem(KEY,serialized);lastSaved=serialized}persistent=true}catch(e){persistent=false}
 const storageMessage=persistent
 ?"Eingaben werden in diesem Browser gespeichert, nicht an einen Workshop-Server gesendet. Exportiere dein Lernjournal vor dem Gerätewechsel."
 :"Dauerhaftes Speichern ist nicht verfügbar. Bitte exportiere dein Lernjournal vor dem Schliessen.";
 if($("storage")&&$("storage").textContent!==storageMessage)$("storage").textContent=storageMessage;
 if($("saveStatus")){
  $("saveStatus").hidden=persistent;
  $("saveStatus").textContent=persistent?"":storageMessage;
 }
}
function chapterFromURL(){
 const value=new URLSearchParams(window.location?.search||"").get("kapitel");
 return value!==null&&/^[0-7]$/.test(value)?Number(value):null;
}
function syncChapterURL(mode="replace",keepHash=false){
 if(!window.history||!window.location?.href)return;
 const url=new URL(window.location.href);
 url.searchParams.set("kapitel",String(state.chapter));
 if(!keepHash)url.hash="";
 try{if(url.href!==window.location.href)window.history[mode==="push"?"pushState":"replaceState"]({chapter:state.chapter},"",url.href)}catch(e){/* Local file browsers may prohibit history updates. */}
}
// A plain entry resumes the saved chapter; direct links select their destination.
const requestedChapter=chapterFromURL();
if(requestedChapter!==null)state.chapter=requestedChapter;
const val=k=>Object.hasOwn(state.answers,k)?state.answers[k]:"";
function put(k,v){
 if(["__proto__","constructor","prototype"].includes(k)||val(k)===v)return;
 state.answers[k]=v;refreshGroupNames(k);save();
}
function field(k,label,placeholder=""){return '<label for="'+k+'">'+label+'</label><textarea id="'+k+'" data-key="'+k+'" placeholder="'+esc(placeholder)+'">'+esc(val(k))+'</textarea>'}
function input(k,label){return '<label for="'+k+'">'+label+'</label><input id="'+k+'" data-key="'+k+'" type="text" value="'+esc(val(k))+'">'}
function check(k,label){return '<label class="check"><input type="checkbox" data-key="'+k+'" '+(val(k)===true?"checked":"")+'>'+label+'</label>'}
function select(k,label,options){return '<label for="'+k+'">'+label+'</label><select id="'+k+'" data-key="'+k+'"><option value="">Bitte wählen</option>'+options.map(([v,t])=>'<option value="'+v+'" '+(String(val(k))===String(v)?"selected":"")+'>'+esc(t)+'</option>').join("")+'</select>'}
document.addEventListener("input",e=>{if(e.target.dataset.key)put(e.target.dataset.key,e.target.type==="checkbox"?e.target.checked:e.target.value)});
document.addEventListener("change",e=>{
 if(e.target.dataset.key)put(e.target.dataset.key,e.target.type==="checkbox"?e.target.checked:e.target.value);
 if(e.target.id==="context")resetTokens();
 if(e.target.id==="sampling")samplingMode=e.target.value;
 if(e.target.id==="chapterSelect")go(Number(e.target.value));
 if(e.target.id==="chapterDone")markDone(e.target.checked);
});
document.addEventListener("click",e=>{
 const b=e.target.closest("[data-action]");if(!b)return;
 const action=Object.hasOwn(actions,b.dataset.action)?actions[b.dataset.action]:null;if(action&&!b.disabled)action(b);
});
const chapters=[
 ["Standort & Alltag"],["Lernen aus Daten"],["Sprachmodelle verstehen"],
 ["Prompting ausprobieren"],["Erkenntnisse & Grenzen"],["Kompetenzen entdecken"],
 ["Aufgaben verbessern"],["Unterricht gestalten"]
];
const domains=["Verstehen","Anwenden","Reflektieren","Mitgestalten"];
const compass=[
 "Ich kann grundsätzlich erklären, wie ein KI-System bzw. Sprachmodell funktioniert.",
 "Ich kann für eine Aufgabe sinnvoll entscheiden, ob und wie ich KI einsetze.",
 "Ich kann KI-Ergebnisse hinsichtlich Richtigkeit, Verzerrung, Datenschutz und Auswirkungen beurteilen.",
 "Ich kann Lernsettings entwickeln, in denen Schülerinnen und Schüler KI-kompetent handeln."
];
function ratings(prefix){return '<p class="small">1 = noch unsicher · 2 = eher unsicher · 3 = eher sicher · 4 = sehr sicher. Diese Werte entsprechen nicht den Modellniveaus I–III.</p>'+compass.map((t,i)=>'<div class="rating"><div><strong>'+domains[i]+'</strong><br>'+t+'</div><div><label class="small" for="'+prefix+i+'">Wert</label><select id="'+prefix+i+'" data-key="'+prefix+i+'" aria-label="'+esc(domains[i]+": "+t)+'"><option value="">–</option>'+[1,2,3,4].map(n=>'<option '+(String(val(prefix+i))===String(n)?"selected":"")+'>'+n+'</option>').join("")+'</select></div></div>').join("")}
function renderNav(){
 if($("chapterSelect"))$("chapterSelect").innerHTML=chapters.map((c,i)=>'<option value="'+i+'">'+(i+1)+". "+c[0]+'</option>').join("");
 $("nav").innerHTML=chapters.map((c,i)=>'<button data-action="go" data-index="'+i+'" '+(state.chapter===i?'aria-current="step"':"")+'><span class="num">'+(state.done.includes(i)?"✓":String(i+1).padStart(2,"0"))+'</span><span>'+c[0]+'</span></button>').join("");
 if($("chapterSelect"))$("chapterSelect").value=String(state.chapter);
 $("progress").value=state.done.length;$("progressText").textContent=state.done.length+" von 8 Kapiteln bearbeitet";
}
function render(){
 renderNav();
 document.title=chapters[state.chapter][0]+" · KI verstehen";
 $("main").innerHTML=chapterView()+
 '<footer><label class="check"><input id="chapterDone" type="checkbox" '+(state.done.includes(state.chapter)?"checked":"")+'>Dieses Kapitel habe ich bearbeitet.</label><div class="actions"><button class="secondary" data-action="go" data-index="'+(state.chapter-1)+'" '+(state.chapter===0?"disabled":"")+'>Zurück</button><button data-action="go" data-index="'+(state.chapter+1)+'" '+(state.chapter===7?"disabled":"")+'>Nächstes Kapitel</button></div></footer>';
 decorateChapter();refreshGroupNames("group1");save();if(state.chapter===1)updateFruit();if(state.chapter===2){updateRules();updateTokens()}
}
function go(i){
 if(!Number.isInteger(i)||i<0||i>7)return;
 if(state.chapter!==i){state.chapter=i;syncChapterURL("push");render()}else syncChapterURL("replace");
 $("main").focus({preventScroll:true});window.scrollTo({top:0,behavior:"auto"});
}
window.addEventListener("popstate",()=>{
 const chapter=chapterFromURL();
 if(chapter===null||chapter===state.chapter)return;
 state.chapter=chapter;render();$("main").focus({preventScroll:true});
});
function markDone(on){state.done=state.done.filter(x=>x!==state.chapter);if(on)state.done.push(state.chapter);save();renderNav()}
const baseFruit=[{w:150,t:"Apfel"},{w:180,t:"Apfel"},{w:110,t:"Birne"},{w:130,t:"Birne"}];
let fruit=baseFruit.map(r=>({...r})),fruitWeight=160,ruleThreshold=140;
function fruitGuess(rows,w){
 if(!rows.length)return {distance:null,near:[],label:"keine Trainingsdaten"};
 const distance=Math.min(...rows.map(r=>Math.abs(r.w-w)));
 const near=rows.filter(r=>Math.abs(Math.abs(r.w-w)-distance)<1e-9),labels=[...new Set(near.map(r=>r.t))];
 return{distance:Math.round(distance*1e9)/1e9,near,label:labels.length===1?labels[0]:"uneindeutig"};
}
function numberIn(id,min,max){const s=$(id).value.trim();if(!s)return null;const n=Number(s);return Number.isFinite(n)&&n>=min&&n<=max?n:null}
function updateFruit(){
 const w=numberIn("fruitWeight",50,400),threshold=numberIn("threshold",50,400);
 $("fruitTable").innerHTML=fruit.map(r=>'<tr><td>'+r.w+' g</td><td>'+r.t+'</td></tr>').join("");
 if(w===null){$("fruitResult").textContent="Bitte 50 bis 400 g eingeben.";$("ruleResult").textContent="";$("outside").textContent="";$("fruitChart").innerHTML="";return}
 fruitWeight=w;if(threshold!==null)ruleThreshold=threshold;
 const g=fruitGuess(fruit,w);drawFruit(w,g);
 $("fruitResult").innerHTML="<strong>Datenmodell: "+g.label+"</strong><br>Nächste Beispiele: "+g.near.map(r=>r.t+", "+r.w+" g").join(" · ")+". Abstand: "+g.distance+" g.";
 $("ruleResult").textContent=threshold===null?"Bitte eine Regelgrenze zwischen 50 und 400 g eingeben.":"Feste Regel: "+(w>=threshold?"Apfel":"Birne")+" – ab "+threshold+" g gilt «Apfel».";
 $("outside").textContent=w<Math.min(...fruit.map(r=>r.w))||w>Math.max(...fruit.map(r=>r.w))
 ?"Ausserhalb des beobachteten Gewichtsbereichs liefert das Modell trotzdem eine Zuordnung. Das macht sie nicht verlässlich."
 :"Die Zuordnung berücksichtigt nur das Gewicht. Sie ist keine gemessene Wahrscheinlichkeit.";
}
function addFruit(){
 const w=numberIn("newWeight",50,400);if(w===null){$("fruitMsg").textContent="Bitte 50 bis 400 g eingeben.";return}
 if(fruit.length>=30){$("fruitMsg").textContent="Für dieses Experiment genügen 30 Beispiele. Entferne das letzte Beispiel oder setze zurück.";return}
 fruit.push({w,t:$("newType").value});updateFruit();$("fruitMsg").textContent="Beispiel hinzugefügt. Vergleicht beide Vorhersagen.";
}
function resetFruit(){fruit=baseFruit.map(r=>({...r}));fruitWeight=160;ruleThreshold=140;$("fruitWeight").value=160;$("threshold").value=140;$("fruitMsg").textContent="Ausgangsdaten wiederhergestellt.";updateFruit()}
function updateRules(){
 const s=$("chatInput").value;chatMessage=s;let response="Erzähl mir mehr darüber.";
 if(/schule/i.test(s))response="Wie fühlst du dich in der Schule?";
 else{const m=s.match(/ich bin\s+(.+)/i);if(m)response="Warum bist du "+m[1].replace(/[.!?]+$/,"")+"?"}
 $("chatOutput").textContent=response;
}
document.addEventListener("input",e=>{
 if(["fruitWeight","threshold"].includes(e.target.id))updateFruit();
 if(e.target.id==="chatInput")updateRules();
});
const tokenStarts=["Die Hauptstadt der Schweiz ist","Es war einmal ein","Zum Frühstück esse ich gerne","Als ich heute Morgen die Tür öffnete"];
// Hand-authored distributions for each complete example context, not a trained LLM.
const tokenOptions=[
 [["Bern",70],["Zürich",20],["Genf",10]],
 [["Kind",45],["Drache",35],["König",20]],
 [["Brot",45],["Müsli",35],["Suppe",20]],[[",",100]]
];
let tokenIndex=0,generated=[],samplingMode="random",chatMessage="Ich bin müde.";
function tokenDistribution(index,tokens){
 if(tokens.at(-1)==="."||tokens.length>=10)return[];
 const n=tokens.length;
 if(!n)return tokenOptions[index]||[];
 if(index===0)return [[".",100]];
 if(index===1){
  if(n===1)return [[",",100]];
  if(n===2)return [[tokens[0]==="Kind"?"das":"der",100]];
  if(n===3)return [["gerne",65],["oft",35]];
  if(n===4)return [["Geschichten",100]];
  if(n===5)return [["erzählte",70],["hörte",30]];
  return [[".",100]];
 }
 if(index===2){
  if(n===1)return [[".",60],["mit",40]];
  if(n===2)return tokens[0]==="Brot"?[["Käse",55],["Marmelade",45]]:
    tokens[0]==="Müsli"?[["Milch",55],["Joghurt",45]]:[["Gemüse",70],["Nudeln",30]];
  return [[".",100]];
 }
 if(n===1)return [["sah",60],["hörte",40]];
 if(n===2)return [["ich",100]];
 if(n===3)return tokens[1]==="sah"?[["einen",65],["niemanden",35]]:[["ein",75],["nichts",25]];
 if(n===4)return tokens[3]==="einen"?[["Vogel",100]]:tokens[3]==="ein"?[["Geräusch",100]]:[[".",100]];
 return [[".",100]];
}
function optionsNow(){return tokenDistribution(tokenIndex,generated)}
function tokenText(){return tokenStarts[tokenIndex]+generated.reduce((s,t)=>s+(/^[.,!?]$/.test(t)?"":" ")+t,"")}
function resetTokens(){tokenIndex=Number($("context").value);generated=[];updateTokens();$("tokenStep").textContent="Vor dem ersten Baustein: Vergleiche die möglichen Fortsetzungen."}
function updateTokens(){
 $("tokenText").textContent=tokenText();const opts=optionsNow();
 $("probabilities").innerHTML=opts.length?opts.map(([t,p])=>'<div class="meter"><span>'+esc(t)+'</span><div class="bar"><span style="width:'+p+'%"></span></div><span>'+p+' %</span></div>').join(""):"<p>Beispiel beendet. Starte erneut und vergleiche.</p>";
 $("nextToken").disabled=!opts.length;
 $("tokenStep").textContent=generated.length
 ?"Schritt "+generated.length+": "+(opts.length?"Vergleiche die Fortsetzungen im neuen Kontext.":"Beispiel beendet. Du kannst neu beginnen.")
 :"Vergleiche die möglichen Fortsetzungen.";
}
function chooseToken(opts,mode,random=Math.random){
 if(mode==="max")return opts.reduce((a,b)=>b[1]>a[1]?b:a)[0];
 let r=random()*100;for(const[t,p]of opts){r-=p;if(r<0)return t}return opts.at(-1)[0];
}
function nextToken(){const opts=optionsNow();if(opts.length){samplingMode=$("sampling").value;generated.push(chooseToken(opts,samplingMode));updateTokens()}}
const prompts=[
 ["A1 · wenig Kontext","Erkläre Photosynthese."],
 ["A2 · genauer Auftrag","Erkläre Photosynthese einem 10-jährigen Kind anhand eines Beispiels aus einer Küche. Verwende maximal 100 Wörter."],
 ["B · Fachwissen prüfen","Erkläre [ein Thema, in dem wir Fachwissen besitzen] in fünf überprüfbaren Aussagen. Unterscheide gesicherte Aussagen und Unsicherheiten."],
 ["C1 · Lehrperson","Sollten Smartphones im Unterricht erlaubt sein? Argumentiere aus Sicht einer Lehrperson."],
 ["C2 · Schüler","Argumentiere zur gleichen Frage aus Sicht eines 14-jährigen Schülers."],
 ["C3 · fehlende Perspektiven","Welche Perspektiven fehlen in den bisherigen Argumenten? Welche Annahmen über die Beteiligten stecken darin?"]
];
async function copyPrompt(i){
 if(!prompts[i])return;const output=$("copyFeedback"+i);
 try{await navigator.clipboard.writeText(prompts[i][1]);if(output)output.textContent="Kopiert – jetzt in Fobizz oder Gemini einfügen."}
 catch(e){if(output)output.textContent="Bitte den Prompt markieren und manuell kopieren."}
}
function promptCard(i){return '<h3>'+prompts[i][0]+'</h3><p class="prompt-text">'+prompts[i][1]+'</p><button class="secondary" data-action="copy" data-index="'+i+'">Prompt kopieren</button><p id="copyFeedback'+i+'" class="small status" role="status"></p>'}
const cards=[
 "Ich überprüfe eine KI-Aussage mit geeigneten Quellen.",
 "Ich kann erklären, welche Rolle Daten beim Training von KI spielen.",
 "Ich entwickle Regeln für einen sinnvollen KI-Einsatz in unserer Klasse.",
 "Ich kann meine Eingabe verändern, um einen geeigneteren Output zu erhalten.",
 "Ich erkenne stereotype oder einseitige Darstellungen in KI-Outputs.",
 "Ich erkenne KI-Systeme in meinem Alltag und begründe meine Einordnung.",
 "Ich entwickle gemeinsam mit anderen Lösungen für Probleme, die durch KI entstehen.",
 "Ich kann sinnvoll entscheiden, welche Teile einer Aufgabe ich selbst und welche eine KI erledigt.",
 "Ich kann erklären, warum ein KI-System falsche Antworten erzeugen kann.",
 "Ich entwickle bestehende KI-Nutzungsszenarien weiter und begründe meine Entscheidungen.",
 "Ich kann unterschiedliche KI-Werkzeuge passend zu einer Aufgabe auswählen.",
 "Ich kann Chancen, Risiken und Folgen eines KI-Einsatzes abwägen."
];
const cardMap=[2,0,3,1,2,0,3,1,0,3,1,2];
const domainTexts=[
 "Funktionsweisen, Daten, Begriffe und Eingabeprinzipien erklären.",
 "Werkzeuge und Arbeitsteilung passend auswählen; Eingaben gezielt verbessern.",
 "Ergebnisse, Annahmen, Risiken und Auswirkungen prüfen und beurteilen.",
 "Regeln, Lösungen und Nutzungsszenarien gemeinsam entwickeln und weiterentwickeln."
];
function revealModel(){if(cards.some((_,i)=>!val("sort"+i))){$("sortStatus").textContent="Ordnet zuerst alle zwölf Karten zu.";return}put("modelOpen",true);render();$("model").focus();$("model").scrollIntoView({block:"start"})}
const tasks=[
 {subject:"Deutsch",bad:"Lass Gemini/Fobizz eine Kurzgeschichte schreiben.",better:"Lege selbst zwei Kriterien für eine spannende Kurzgeschichte fest. Verfasse einen eigenen Anfang. Lass Fobizz oder Gemini zwei Fortsetzungen vorschlagen. Vergleiche sie anhand deiner Kriterien. Untersuche eine mögliche stereotype Darstellung. Schreibe eine eigene Endfassung und erkläre zwei Entscheidungen.",evidence:"Eigener Anfang, Kriterienvergleich und begründete Endfassung."},
 {subject:"Fremdsprache",bad:"Lass deinen Text von KI korrigieren.",better:"Markiere zuerst selbst drei unsichere Stellen. Bitte Fobizz oder Gemini um Korrekturvorschläge mit Begründungen. Prüfe zwei Begründungen mit Unterrichtsmaterial oder Wörterbuch. Entscheide, welche Änderungen du übernimmst. Schreibe anschliessend drei neue Beispielsätze ohne KI.",evidence:"Dokumentierte Prüfung, begründete Auswahl und selbst verfasste Beispielsätze."},
 {subject:"Geschichte",bad:"Frage die KI nach den Ursachen des Ersten Weltkriegs.",better:"Notiere vorab deine Vermutungen. Lass Fobizz oder Gemini Ursachen erklären. Prüfe drei Aussagen mit dem Schulbuch und einer geeigneten weiteren Quelle. Unterscheide langfristige Bedingungen, Anlass und Deutungen. Formuliere eine eigene Erklärung mit Quellenbelegen.",evidence:"Prüftabelle mit Fundstellen und eine eigenständige, differenzierte Erklärung."},
 {subject:"Naturwissenschaften",bad:"Lass dir Photosynthese erklären.",better:"Zeichne zuerst dein eigenes Modell der Photosynthese. Lass Fobizz oder Gemini eine Küchenanalogie erstellen. Markiere zwei hilfreiche Entsprechungen und eine Grenze der Analogie. Prüfe sie am Unterrichtsmaterial. Verbessere deine Zeichnung und erkläre die Veränderung ohne KI.",evidence:"Vorher-nachher-Zeichnung und eine fachlich begründete Grenze der Analogie."},
 {subject:"Berufswahl",bad:"Lass dir ein Bewerbungsschreiben erstellen.",better:"Nutze ein fiktives Profil und lege vier notwendige Informationen fest. Lass Fobizz oder Gemini eine Fassung erstellen. Markiere drei geeignete Stellen und zwei, die du ändern oder entfernen würdest. Prüfe insbesondere erfundene Fähigkeiten. Begründe deine Entscheidungen und verfasse eine eigene Endfassung.",evidence:"Kriterienliste, markierter Vergleich und begründete Endfassung."},
 {subject:"Mathematik",bad:"Lass die KI die Aufgabe lösen.",better:"Entwickle zuerst einen eigenen Lösungsansatz. Lass Fobizz oder Gemini einen zweiten Weg vorschlagen. Prüfe jeden Schritt und teste das Ergebnis durch Einsetzen oder ein Gegenbeispiel. Erkläre einen entscheidenden Schritt selbst. Löse danach eine ähnliche Aufgabe ohne KI.",evidence:"Geprüfte Schritte, eigenständige Erklärung und gelöste Transferaufgabe."}
];
const raster=[["denken","Was sollen die Lernenden selbst denken oder tun?"],["einsatz","Wofür wird KI eingesetzt?"],["pruefen","Was muss am KI-Output geprüft oder hinterfragt werden?"],["entscheiden","Welche Entscheidung bleibt beim Menschen?"],["kompetenz","Welche KI-Kompetenz wird aufgebaut?"],["beleg","Woran erkennen wir, dass gelernt wurde?"]];
const canvasFields=[["ziel","Meine Lernenden sollen können …"],["vorher","So mache ich den Ausgangsstand sichtbar …"],["selbst","Das tun die Lernenden selbst …"],["ki","Dafür setzen sie Fobizz / Gemini / KI ein …"],["nachher","Das prüfen / erklären / vergleichen / entscheiden sie …"],["verantwortung","Die Verantwortung des Menschen liegt bei …"],["sichtbar","So wird die Kompetenz sichtbar …"],["kriterium","Daran erkenne ich die Qualität des Lernbelegs …"]];
const sourcesHTML='<p><a href="./unterrichtsideen.html#materialien">Ergänzende Unterrichtsmaterialien</a>: Code.org / CodeAI, Soekia, Quick, Draw!, AI Unplugged und IT2School. Die Unterrichtsideen verbinden externe Angebote mit eigenen Lernaufträgen und Lernbelegen.</p><p>Kompetenzmodell: Susanne Alles, Joscha Falck, Manuel Flick und Regina Schulz, «KI-Kompetenzen für Lehrende und Lernende», vorgestellt durch den DLH Zürich. Karten und Kurzbeschreibungen sind eigene didaktische Bearbeitungen, keine vollständige Wiedergabe der Originalmatrix.</p><p><a href="https://dlh.zh.ch/home/wb-kompass/kompetenzmodelle/ki-kompetenzen-fuer-lehrende-und-lernende">Modell und Originalgrafiken beim DLH Zürich</a></p><p><a href="https://kompassdigitalerwandel.ch/dk04/">Kompass digitaler Wandel: Informatik</a> – Grundlage für den Einstieg über Informationsverarbeitung.</p><p><a href="https://ailiteracyframework.org/">OECD / Europäische Union: AILit Framework</a>. Die deutsche Fassung 2026 wird auf Grundlage der bereitgestellten Zusammenfassung berücksichtigt. Der Abgleich mit der Original-PDF steht noch aus.</p><p><a href="https://schmij03.github.io/ki-explained/">KI Explained</a> – didaktische Inspiration nach der bereitgestellten Beschreibung. Die Seite konnte bei der inhaltlichen Ausarbeitung nicht direkt geprüft werden. Übungen, Oberfläche und Texte wurden eigenständig entwickelt.</p>';

const teachableSteps='<ol><li><strong>Bildprojekt anlegen:</strong> Öffne Teachable Machine und wähle ein Bildprojekt mit Standard-Bildmodell. Lege die Klassen «Stift» und «Radiergummi» an.</li><li><strong>Beispiele sammeln:</strong> Nimm pro Klasse ungefähr gleich viele Bilder per Webcam auf oder lade eigene Bilder hoch. Nutze unterschiedliche Ansichten. Halte einige weitere Bilder als Testfälle zurück.</li><li><strong>Modell trainieren:</strong> Starte das Training. Prüfe in der Vorschau mit den zurückgehaltenen Bildern, welche Klasse das Modell zuordnet.</li><li><strong>Grenzen untersuchen:</strong> Verändere Hintergrund, Licht oder Abstand einzeln. Teste auch einen unbekannten Gegenstand. Notiere erwartete und angezeigte Klasse.</li><li><strong>Daten verbessern:</strong> Ergänze gezielt vielfältigere Trainingsbilder und trainiere erneut. Vergleiche mit denselben Testfällen. Die Testbilder bleiben ausserhalb des Trainings.</li></ol>';
const teachableQuestions=[
 ["tm_test","Mein Test: Gegenstand / veränderte Bedingung / erwartete Klasse / Ausgabe …"],
 ["tm_daten","Welche Trainingsbilder habe ich ergänzt und was hat sich verändert?"],
 ["tm_transfer","Was zeigt das Experiment über Datenqualität? Wie könnte ich das im Unterricht aufgreifen?"]
];
function teachableHTML(){
 return '<section class="card"><span class="tag">Freiwillige Zusatzaufgabe</span><h2>Ein eigenes Bildmodell mit Teachable Machine</h2><p>Erkennt das Modell den Gegenstand – oder nur seinen Hintergrund? Trainiere eine Unterscheidung zwischen Stift und Radiergummi und untersuche sie mit neuen Bildern.</p><details><summary>Zusatzaufgabe öffnen</summary><p class="small">Du brauchst einen Computer mit geeignetem Browser, Internet sowie eine Webcam oder eigene Bilddateien. Verwende Gegenstände ohne Personen oder persönliche Angaben im Bild.</p><div class="actions"><a class="button" href="https://teachablemachine.withgoogle.com/" target="_blank" rel="noopener">Teachable Machine öffnen ↗</a></div>'+teachableSteps+'<div class="note"><strong>Genau hinschauen:</strong> Die Prozentanzeige ist keine gemessene Trefferquote auf neuen Bildern. Auch ein unbekannter Gegenstand kann einer bekannten Klasse mit hohem Wert zugeordnet werden.</div><details><summary>Vertiefung: Gegenstand oder Hintergrund?</summary><p>Fotografiere Stifte nur auf weissem Papier und Radiergummis nur auf dunklem Untergrund. Trainiere damit ein Modell und tausche beim Test die Hintergründe. Welche Vermutung erklärt deine Beobachtung? Nutze für beide Klassen beide Hintergründe, trainiere erneut und vergleiche. Ein einzelner Versuch beweist noch nicht, welches Merkmal das Modell verwendet.</p></details>'+teachableQuestions.map(([k,l])=>field(k,l)).join("")+'<p class="small">Deine Reflexionen werden im Lernjournal mitgespeichert. Das externe Teachable-Machine-Projekt wird hier nicht gespeichert. <a href="https://blog.google/innovation-and-ai/products/teachable-machine/" target="_blank" rel="noopener">Einführung von Google</a></p></details></section>';
}

const pages=[
()=>'<h1>Wo stehst du gerade?</h1><p class="lead">Untersuche KI, erkläre deine Beobachtungen und entwickle daraus eine Lernaktivität für deinen Unterricht.</p><div class="card"><h2>Dein Kompetenzkompass</h2>'+ratings("pre")+field("startbeleg","Ein Beispiel, das meine Einschätzung begründet …")+'<p class="small">Die vier Begriffe dienen hier nur als Orientierung. Das zugehörige Modell findest du im Kapitel «Kompetenzen entdecken».</p></div><div class="card"><h2>KI im Alltag: Was weisst du wirklich?</h2><p>Besprecht zu zweit: Welche Daten werden verarbeitet? Was geschieht damit? Was kommt heraus? Reicht die Beschreibung für ein sicheres Urteil?</p><ul><li>Ein Rechner addiert zwei Zahlen nach festgelegten Rechenregeln.</li><li>Ein Streamingdienst empfiehlt Videos anhand früherer Nutzung.</li><li>Eine Foto-App ordnet Bilder nach erkannten Gegenständen.</li><li>Ein Chatfenster antwortet auf Fragen.</li></ul>'+field("alltag","Meine Einordnung mit Begründung …")+'<details><summary>Einordnung vergleichen</summary><p>Die feste Addition benötigt kein maschinelles Lernen. Empfehlungen und Bilderkennung können gelernte Modelle verwenden. Eine Empfehlung kann auch durch einfache Regeln entstehen. Ein Chatfenster allein verrät nicht, ob Regeln oder ein Sprachmodell dahinterstehen.</p><p><strong>Daten → Verarbeitung → Output</strong> beschreibt auch Systeme ohne KI. Entscheidend ist, wie die Verarbeitung erfolgt.</p></details></div>',
()=>'<h1>Wie lernt eine Maschine?</h1><p class="lead">Verändere ein Trainingsbeispiel. Beobachte, was sich ändert – und was gleich bleibt.</p><div class="note">Wir verwenden einen <strong>Nächster-Nachbar-Klassifikator</strong>: Neues Obst erhält das Etikett des Beispiels mit dem ähnlichsten Gewicht. Gleich nahe Beispiele mit verschiedenen Etiketten ergeben eine uneindeutige Zuordnung.</div><div class="grid"><div class="card"><h2>1 · Beispieldaten</h2><table><thead><tr><th>Gewicht</th><th>Etikett</th></tr></thead><tbody id="fruitTable"></tbody></table><label for="newWeight">Neues Trainingsbeispiel: Gewicht in g</label><input id="newWeight" type="number" min="50" max="400" step="any" value="160"><label for="newType">Etikett</label><select id="newType"><option>Birne</option><option>Apfel</option></select><div class="actions"><button data-action="addFruit">Beispiel hinzufügen</button><button class="secondary" data-action="undoFruit">Letztes Beispiel entfernen</button><button class="secondary" data-action="resetFruit">Zurücksetzen</button></div><p id="fruitMsg" class="small status" role="status"></p></div><div class="card"><h2>2 · Neuen Fall zuordnen</h2><label for="fruitWeight">Gewicht des unbekannten Obsts in g</label><input id="fruitWeight" type="number" min="50" max="400" step="any" value="160"><div id="fruitResult" class="output" aria-live="polite"></div><p id="outside" class="small"></p><label for="threshold">Von Menschen festgelegte Regel: Apfel ab … g</label><input id="threshold" type="number" min="50" max="400" step="any" value="140"><div id="ruleResult" class="output" aria-live="polite"></div></div></div><div class="card"><h2>Die Abstände sehen</h2><div id="fruitChart"></div><p class="small">Quadrate: Apfel · Kreise: Birne · senkrechte Linie: Testfall. Ein dunkler Rand markiert die nächsten Beispiele. Bei gleichen Gewichten können sich Zeichen überlagern; die Tabelle enthält alle Beispiele.</p></div><div class="card"><h2>Experimentauftrag</h2><ol><li>Notiere die Zuordnung für 160 g mit den Ausgangsdaten.</li><li>Ergänze eine Birne mit 160 g. Vergleiche Datenmodell und feste Regel.</li><li>Ergänze zusätzlich einen Apfel mit 160 g. Was passiert?</li><li>Teste 140 g und einen Fall weit ausserhalb der bisherigen Daten.</li></ol>'+field("fruchtbeobachtung","Was hat sich verändert – und warum?")+field("merkmale","Warum reicht Gewicht nicht? Welche weiteren Merkmale wären sinnvoll?")+field("datenqualitaet","Sind mehr Daten automatisch bessere Daten? Begründe mit deinem Experiment.")+'<details><summary>Eigene Erklärung vergleichen</summary><p>Ein neues Beispiel kann den nächsten Nachbarn verändern. Die feste Regel bleibt gleich, solange wir ihren Schwellenwert nicht ändern. Widersprüchliche Etiketten lösen sich durch mehr Daten nicht automatisch auf.</p><p>Form, Farbe und Oberflächenmerkmale könnten helfen. Ob sie verbessern, müsste mit getrennt gehaltenen neuen Testfällen untersucht werden.</p><p><strong>Grenze:</strong> Dieses Modell speichert Beispiele und vergleicht Abstände. Es trainiert keine neuronalen Gewichte. Andere Verfahren passen beim Training Parameter an. Das Experiment zeigt den Einfluss von Beispieldaten, nicht die gesamte Funktionsweise eines Sprachmodells.</p></details>'+field("obsterklaerung","Erkläre einer Kollegin in zwei Sätzen, was dieses Modell «gelernt» hat.")+'<p class="small">Die Experimentdaten bleiben während dieser Sitzung erhalten. Sichere deine Erkenntnisse im Lernjournal.</p></div>'+teachableHTML(),
()=>'<h1>Von Regeln zu Sprachmodellen</h1><div class="card"><h2>1 · Ein Gespräch ohne Verständnis?</h2><p>Eine Person liest die Eingabe, die andere folgt ausschliesslich diesen Regeln. Die erste passende Regel gewinnt:</p><ol><li>«Schule» enthalten → «Wie fühlst du dich in der Schule?»</li><li>«Ich bin …» enthalten → «Warum bist du …?»</li><li>Sonst → «Erzähl mir mehr darüber.»</li></ol><label for="chatInput">Deine Nachricht</label><input id="chatInput" type="text" value="Ich bin müde."><div id="chatOutput" class="output" aria-live="polite"></div>'+field("regelreflexion","Welche Antwort wirkt passend, obwohl das System nur Regeln abarbeitet?")+'</div><div class="card"><h2>2 · Wir setzen einen Satz fort</h2><p>Schreibt unabhängig voneinander ein passendes Wort zu zwei Satzanfängen auf und vergleicht eure Ideen.</p><label for="context">Kontext</label><select id="context">'+tokenStarts.map((t,i)=>'<option value="'+i+'" '+(i===tokenIndex?"selected":"")+'>'+t+' …</option>').join("")+'</select><label for="sampling">Auswahlverfahren</label><select id="sampling"><option value="random">Zufällig gemäss Beispielverteilung</option><option value="max">Immer die wahrscheinlichste Fortsetzung</option></select><div id="tokenText" class="output" aria-live="polite"></div><div id="probabilities" aria-label="Erfundene Beispielwahrscheinlichkeiten"></div><p id="tokenStep" class="small" role="status">Vergleiche die möglichen Fortsetzungen.</p><div class="actions"><button id="nextToken" data-action="nextToken">Nächsten Baustein erzeugen</button><button class="secondary" data-action="resetTokens">Neu beginnen</button></div><p class="small"><strong>Didaktische Simulation, kein Sprachmodell:</strong> Wahrscheinlichkeiten und Übergänge sind von Hand festgelegt, nicht trainiert oder gemessen. Wörter und Satzzeichen dienen als vereinfachte Token. Echte Token können auch Wortteile sein. Das Spielzeugmodell berücksichtigt den Satzanfang und bereits erzeugte Bausteine durch feste Regeln. Ein echtes Sprachmodell berechnet Verteilungen mit gelernten Parametern. Sprachlich korrekte Sätze können trotzdem sachlich falsch sein.</p>'+field("tokenreflexion","Warum unterscheiden sich Fortsetzungen? Warum kann auch eine falsche Fortsetzung erscheinen?")+'</div><div class="grid"><div class="card"><h2>Training</h2><p><strong>Trainingsdaten → Lernverfahren → Modellparameter</strong></p><p>Sehr viele mathematische Parameter werden so angepasst, dass das Sprachmodell sprachliche und andere statistische Zusammenhänge nutzen kann.</p></div><div class="card"><h2>Nutzung</h2><p><strong>Modell + Prompt/Kontext → Tokenverteilung → Auswahl → neuer Kontext</strong></p><p>Das gewählte Token wird ergänzt. Danach berechnet das Modell die nächste Verteilung. Daraus entsteht schrittweise der Output.</p></div></div><div class="note"><strong>Plausibel bedeutet nicht automatisch wahr.</strong> Ein Sprachmodell ist keine reine Antwortdatenbank. Manche Anwendungen ergänzen es durch Suche oder Dokumente. Auch dann müssen Aussagen und Quellen geprüft werden. Eine neue Eingabe verändert den Kontext; sie bedeutet nicht automatisch erneutes Training.</div>'+field("llmerklaerung","Erkläre in zwei Sätzen: Was passiert beim Training, was beim Antworten?")+'<details><summary>Selbsttest: Stimmen diese Aussagen?</summary><p><strong>«Jeder Prompt trainiert das Modell sofort neu.»</strong> Nein. Kontext und Training unterscheiden.</p><p><strong>«70 % beim nächsten Token bedeutet 70 % Wahrscheinlichkeit, dass die Aussage wahr ist.»</strong> Nein. Fortsetzungswahrscheinlichkeit ist keine Wahrheitswahrscheinlichkeit.</p><p><strong>«Ein Token ist immer ein Wort.»</strong> Nein. Auch Wortteile und Satzzeichen können Token sein.</p></details>',
()=>'<h1>Input beeinflusst Output</h1><p class="lead">Arbeitet mit Fobizz oder Gemini. Ein Gerät pro Zweier- oder Dreiergruppe genügt.</p><div class="actions"><a class="button" href="https://fobizz.com/" target="_blank" rel="noopener">Fobizz öffnen</a><a class="button secondary" href="https://gemini.google.com/" target="_blank" rel="noopener">Gemini öffnen</a></div><p>Verwendet euren eingerichteten Zugang und fiktive Beispiele. Gebt keine personenbezogenen Schülerdaten ein.</p><div class="note">Drei Perspektiven auf Prompting: Kontext gestalten, Aussagen prüfen und Perspektiven vergleichen. Wählt einen Auftrag oder erkundet alle drei.</div><div class="card"><h2>A · Kontext verändert Output</h2><p>Führt A1 und A2 für einen faireren Vergleich in getrennten neuen Chats mit demselben ausgewählten Modell aus.</p>'+promptCard(0)+promptCard(1)+field("promptA","Vergleicht Zielgruppe, Sprache, Länge und Analogie. Welche Eingabe hat was verändert?")+'<p class="small">Auch bei gleichem Prompt können Ausgaben variieren. Ein einzelner Vergleich beweist daher keine allgemeine Wirkung.</p></div><div class="card"><h2>B · Plausibel und überprüfbar?</h2>'+promptCard(2)+'<p>Ersetzt die eckige Klammer durch ein Thema, in dem ihr Fachwissen habt. Markiert drei Aussagen mit Farbe und Textlabel:</p><p><strong>Grün:</strong> durch Beleg bestätigt · <strong>Gelb:</strong> ungeprüft oder unsicher · <strong>Rot:</strong> widerlegt oder problematisch.</p>'+field("promptB","Aussage | Urteil | Quelle/Fundstelle | Begründung")+'<p>Eine Quellenangabe der KI ist zunächst ebenfalls zu prüfen. Öffnet mindestens eine Originalquelle selbst. Findet ihr keinen Fehler, ist das ein gültiges Ergebnis.</p><details><summary>Offline-Reserve: bewusst erfundener Beispieloutput</summary><p>«Pflanzen nehmen bei der Photosynthese Sauerstoff auf und geben Kohlenstoffdioxid ab. Das Licht liefert Energie. Die benötigten Mineralstoffe ersetzen das Wasser.»</p><p>Dieser Text wurde für die Fehlerprüfung konstruiert und stammt nicht aus Fobizz oder Gemini. Prüft die drei Aussagen anhand eines Lehrmittels.</p><details><summary>Auswertung</summary><p>Die Aussage zur Lichtenergie ist korrekt; die anderen beiden sind falsch. Unterscheidet Photosynthese und Zellatmung.</p></details></details></div><div class="card"><h2>C · Perspektiven verändern Argumente</h2>'+[3,4,5].map(promptCard).join("")+field("promptC","Welche Annahmen oder Stereotype erkennst du? Welche reale Person müsstest du zusätzlich befragen?")+'<p class="small">Eine simulierte Schülerperspektive ersetzt keine Befragung von Schülerinnen und Schülern.</p></div><p id="copyStatus" class="status" role="status"></p><div class="card"><h2>Prompting als bewusste Steuerung</h2><p><strong>Aufgabe + Kontext + Zielgruppe + Kriterien + Ausgabeformat.</strong></p><p>Ergänze nur, was hilfreich ist. Prüfe anschliessend, ob die Ausgabe die Kriterien erfüllt. Ein präziser Prompt garantiert keine richtige Antwort.</p>'+field("promptregel","Eine Promptänderung, deren Nutzen ich begründen kann …")+'</div>',
()=>'<h1>Was folgt aus den Experimenten?</h1><p class="lead">Formuliert eure eigenen Gedanken und vergleicht sie zu zweit. Ergänzt jeweils ein konkretes Beispiel.</p><div class="card">'+field("kann","KI kann gut …")+field("nicht","KI kann nicht zuverlässig …")+field("mensch","Deshalb muss der Mensch …")+'</div><div class="card"><h2>Vier Fragen vor dem Übernehmen</h2><ol><li>Welche Aussage ist durch welche Quelle gestützt?</li><li>Welche Perspektiven, Annahmen oder Gruppen fehlen?</li><li>Welche Informationen habe ich eingegeben – und waren sie nötig?</li><li>Welche Folgen könnte meine Verwendung des Outputs haben?</li></ol>'+field("pruefentscheidung","Eine Aussage oder Empfehlung, die ich nicht ungeprüft übernehmen würde – weil …")+'<details><summary>Mögliche Erkenntnissicherung</summary><p>KI kann Muster nutzen, Texte entwerfen und Varianten erzeugen. Sie liefert keine automatische Garantie für Wahrheit, Fairness oder Angemessenheit. Menschen müssen Ziele und Kriterien setzen, Ergebnisse prüfen und über ihre Verwendung entscheiden.</p></details></div>',
()=>'<h1>Welche Kompetenzen haben wir gebraucht?</h1><p class="lead">Sortiert die zwölf Karten in vier selbst benannte Gruppen. Mehrere Zuordnungen können begründbar sein. Wählt zunächst je Karte einen Schwerpunkt.</p><div class="grid">'+[1,2,3,4].map(n=>'<div class="card">'+input("group"+n,"Unser Name für Gruppe "+n)+'</div>').join("")+'</div><div class="grid" style="margin-top:1rem">'+cards.map((c,i)=>'<div class="card"><span class="tag">Karte '+(i+1)+'</span><p>'+c+'</p>'+select("sort"+i,"Zuordnung für Karte "+(i+1),[[1,"Gruppe 1"],[2,"Gruppe 2"],[3,"Gruppe 3"],[4,"Gruppe 4"]])+'</div>').join("")+'</div>'+field("sortbegruendung","Bei welcher Karte wart ihr uneinig? Begründet eure Entscheidung.")+'<div class="actions"><button data-action="revealModel">Sortierung mit dem Modell vergleichen</button></div><p id="sortStatus" role="status"></p>'+(val("modelOpen")?modelHTML():"")+'<details><summary>Quellen und Bearbeitungshinweise</summary>'+sourcesHTML+'</details>',
()=>'<h1>Aus KI-Nutzung wird eine Lernaufgabe</h1><p class="lead">Wählt eine Aufgabe. Verbessert sie so, dass mindestens zwei KI-Kompetenzbereiche durch Handlungen und Lernbelege sichtbar werden.</p><div class="note">Die Ausgangsaufträge sind nicht grundsätzlich wertlos. Sie machen den Kompetenzaufbau und seine Überprüfung noch nicht ausreichend sichtbar.</div><div class="grid">'+tasks.map((t,i)=>'<div class="card"><h2>'+t.subject+'</h2><p>«'+t.bad+'»</p><button class="secondary" data-action="chooseTask" data-index="'+i+'">Diese Aufgabe bearbeiten</button><details><summary>Nach dem eigenen Entwurf: Beispiel vergleichen</summary><p>'+t.better+'</p><p><strong>Lernbeleg:</strong> '+t.evidence+'</p><p><strong>Schwerpunkte:</strong> Anwenden und Reflektieren.</p></details></div>').join("")+'</div><div class="card" id="raster" tabindex="-1"><h2>Euer Verbesserungsraster</h2>'+input("taskwahl","Unsere gewählte Aufgabe")+raster.map(([k,l])=>field("raster_"+k,l)).join("")+field("verbesserteaufgabe","Unser neuer Arbeitsauftrag an die Lernenden …")+field("partnercheck","Partnerprüfung: Könnte jemand erfolgreich sein, ohne den KI-Output verstanden zu haben? Was ändern wir?")+'</div><div class="note"><strong>Kompetenzen nicht nur etikettieren:</strong> Ein eigener fertiger Text belegt noch kein «Mitgestalten». Dafür könnte die Klasse gemeinsame KI-Nutzungsregeln entwickeln, erproben und überarbeiten. «Verstehen» benötigt einen eigenen Beleg zur Funktionsweise von KI; fachliches Verständnis allein genügt dafür nicht.</div>',
()=>'<h1>Deine nächste Lernaktivität</h1><div class="note">Du suchst einen Ausgangspunkt? <a href="./unterrichtsideen.html">Entdecke neun Unterrichtsideen mit Ablauf, Differenzierung und Lernbelegen.</a> Wähle eine Idee und passe sie hier deiner Klasse an.</div><p class="lead">Plane eine kleine, realistisch durchführbare Aktivität. Entscheidend ist, was deine Lernenden selbst können werden.</p><div class="card"><h2>KI-Kompetenz-Canvas</h2><details><summary>Ein Beispiel für Ziel, Lernbeleg und Qualitätskriterium</summary><p><strong>Ziel:</strong> Lernende können eine KI-Aussage anhand geeigneter Quellen beurteilen.</p><p><strong>Lernbeleg:</strong> Eine Prüftabelle mit Aussage, Fundstelle und begründetem Urteil.</p><p><strong>Qualitätskriterium:</strong> Die Fundstelle stützt oder widerlegt genau die geprüfte Aussage; das Urteil unterscheidet bestätigt, widerlegt und ungeklärt.</p><p><strong>Vorher:</strong> Eine Aussage spontan einschätzen. <strong>Nachher:</strong> Eine neue Aussage selbst prüfen und den Unterschied erklären.</p></details>'+input("fach","Fach / Thema / Klasse")+canvasFields.slice(0,2).map(([k,l])=>field("canvas_"+k,l)).join("")+'<h3>Kompetenzbereiche</h3>'+domains.map((d,i)=>check("domain"+i,d)).join("")+select("niveau","Zielniveau im Modell von Alles / Falck / Flick / Schulz",[["I","I"],["II","II"],["III","III"]])+field("niveaubezug","Welche konkrete Beschreibung aus der Originalmatrix passt – und warum?")+canvasFields.slice(2).map(([k,l])=>field("canvas_"+k,l)).join("")+field("ohnezugang","Alternative bei fehlendem KI-Zugang …")+'<div class="canvas-review"><h3>Prüfe deinen Entwurf</h3><ul><li>Ist beschrieben, was die Lernenden selbst tun?</li><li>Gibt es eine konkrete Prüfung des KI-Outputs?</li><li>Ist eine menschliche Entscheidung sichtbar?</li><li>Passt der Lernbeleg zum gewählten Kompetenzbereich?</li></ul><p class="small">Diese Fragen unterstützen deine Beurteilung. Ausgefüllte Felder allein belegen keine Kompetenz.</p></div><div class="actions"><button data-action="canvas">Meinen Canvas drucken</button></div><details><summary>Coachingfragen</summary><ul><li>Was lernen die Schülerinnen und Schüler ausser der Bedienung?</li><li>Was muss der Mensch selbst können?</li><li>Wo findet Reflexion statt?</li><li>Wie vergleichst du Ausgangsstand und Ergebnis?</li><li>Könnte jemand erfolgreich sein, ohne den Output verstanden zu haben?</li></ul></details></div><div class="card"><h2>Gallery Walk</h2><p>Lest eine andere Idee und gebt eine konkrete Rückmeldung. Nutzt das Feedback, um eure eigene Aktivität weiterzuentwickeln.</p>'+field("feedback_stark","💡 Stark: Hier wird KI-Kompetenz sichtbar, weil …")+field("feedback_weiter","🔧 Weiterdenken: Noch stärker würde die Aufgabe, wenn …")+field("revision","Das ändere ich an meiner Aktivität aufgrund des Feedbacks …")+'</div><div class="card"><h2>Kompetenzkompass & Exit</h2>'+ratings("post")+'<p class="small">Deine Ausgangswerte: '+domains.map((d,i)=>d+": "+esc(val("pre"+i)||"–")).join(" · ")+'</p>'+field("endbeleg","Mein konkreter Beleg für eine veränderte oder bestätigte Einschätzung …")+field("exit1","KI funktioniert anders als ich vorher dachte, weil …")+field("exit2","Für meine Lernenden ist besonders wichtig …")+field("exit3","In meinem Unterricht werde ich …")+input("transferdatum","Meine konkrete Unterrichtserprobung …")+'<p class="small">Mehr Sicherheit ist kein automatischer Lernnachweis. Auch eine kritischere Selbsteinschätzung kann auf neues Verständnis hinweisen.</p><div class="actions"><button data-action="export">Lernjournal exportieren</button><button class="secondary" data-action="clear">Meine Eingaben löschen</button></div></div><details><summary>Quellen und Bearbeitungshinweise</summary>'+sourcesHTML+'</details>'
];
function modelHTML(){
 return '<div id="model" class="card" tabindex="-1"><h2>Eure Gruppen</h2><div id="groupSummary">'+[1,2,3,4].map(n=>'<h3>'+esc(val("group"+n)||"Gruppe "+n)+'</h3><ul>'+cards.map((c,i)=>String(val("sort"+i))===String(n)?'<li>'+c+'</li>':"").join("")+'</ul>').join("")+'</div></div><div class="grid">'+domains.map((d,i)=>'<div class="card domain '+["","a","r","m"][i]+'"><h2>'+d+'</h2><p>'+domainTexts[i]+'</p><p class="small">Möglicher Schwerpunkt: Karten '+cardMap.map((x,j)=>x===i?j+1:null).filter(Boolean).join(", ")+'.</p></div>').join("")+'</div><div class="note"><strong>KI benutzen ≠ KI-kompetent sein.</strong> Was kann die lernende Person danach selbst erklären, beurteilen, entscheiden oder gestalten?</div><div class="card"><h2>Bereiche und Niveaus unterscheiden</h2><p>Das Modell von Alles, Falck, Flick und Schulz verbindet vier Kompetenzbereiche mit den Niveaustufen I–III. Die Bereiche greifen ineinander; sie sind keine feste Unterrichtsreihenfolge.</p><p>Wählt ein Niveau anhand der konkreten Kompetenzbeschreibung in der Originalmatrix. Ein anspruchsvoller Prompt allein belegt kein hohes Niveau.</p><p>Beispiel «Verstehen»: Begriffe benennen und beschreiben; Funktionsweisen erläutern und vergleichen; Modellarchitektur oder Trainingsprozesse bewerten. Diese Kurzfassung ersetzt nicht die Originalmatrix.</p><h3>AILit als ergänzender Blick</h3><p>Die bereitgestellte Zusammenfassung des OECD/EU-Rahmens ergänzt den Blick auf Wissen, Fähigkeiten und Haltungen sowie bewussten Umgang, kreative Anwendung, gezielten Einsatz und aktive Mitgestaltung. Diese Bereiche sind keine direkte Umbenennung der vier Bereiche oben.</p><p>Die dort beschriebenen Progressionsstufen werden hier nicht automatisch mit I–III gleichgesetzt oder an Klassenstufen gebunden.</p>'+field("kompetenzbeleg","Welche unserer Handlungen zeigt welchen Kompetenzbereich? Nenne einen beobachtbaren Beleg.")+'</div>';
}

const journalNames={
 startbeleg:"Beleg zur Ausgangseinschätzung",alltag:"KI im Alltag",fruchtbeobachtung:"Obstexperiment",
 merkmale:"Zusätzliche Merkmale",datenqualitaet:"Datenqualität",obsterklaerung:"Erklärung des Obstmodells",
 regelreflexion:"Regelchatbot",tokenreflexion:"Tokenexperiment",llmerklaerung:"Training und Nutzung",
 promptA:"Prompting A",promptB:"Prüftabelle B",promptC:"Perspektiven C",promptregel:"Prompting-Erkenntnis",
 kann:"KI kann gut",nicht:"KI kann nicht zuverlässig",mensch:"Deshalb muss der Mensch",
 pruefentscheidung:"Meine Prüfentscheidung",sortbegruendung:"Begründung der Sortierung",
 kompetenzbeleg:"Kompetenzbeleg",taskwahl:"Gewählte Aufgabe",verbesserteaufgabe:"Verbesserte Aufgabe",
 partnercheck:"Partnerprüfung",fach:"Fach / Thema / Klasse",niveau:"Niveau",niveaubezug:"Bezug zur Originalmatrix",
 ohnezugang:"Alternative ohne Zugang",feedback_stark:"Feedback: Stark",feedback_weiter:"Feedback: Weiterdenken",
 revision:"Meine Änderung",endbeleg:"Beleg zum Abschluss",exit1:"Exit: Funktionsweise",exit2:"Exit: Meine Lernenden",
 exit3:"Exit: Mein Unterricht",transferdatum:"Unterrichtserprobung"
};
domains.forEach((d,i)=>{journalNames["pre"+i]="Vorher: "+d;journalNames["post"+i]="Nachher: "+d;journalNames["domain"+i]="Canvas-Kompetenzbereich: "+d});
raster.forEach(([k,l])=>journalNames["raster_"+k]=l);
canvasFields.forEach(([k,l])=>journalNames["canvas_"+k]=l);
teachableQuestions.forEach(([k,l])=>journalNames[k]="Teachable Machine: "+l);
[1,2,3,4].forEach(n=>journalNames["group"+n]="Name der Gruppe "+n);
cards.forEach((c,i)=>journalNames["sort"+i]="Karte "+(i+1)+": "+c);
function journalText(){
 const parts=["KI verstehen und kompetent im Unterricht einsetzen","Persönliches Lernjournal","Bearbeitete Kapitel: "+state.done.map(i=>chapters[i][0]).join(", ")];
 Object.entries(journalNames).forEach(([k,label])=>{
  const v=val(k);
  const text=/^sort\d+$/.test(k)&&/^[1-4]$/.test(String(v))?val("group"+v)||"Gruppe "+v:v===true?"gewählt":v;
  if(v!==""&&v!==false)parts.push(label+"\n"+text);
 });
 quizzes.forEach((q,i)=>{const a=val("quiz"+i);if(/^[0-2]$/.test(String(a)))parts.push("Selbsttest: "+q.title+"\nMeine Auswahl: "+q.options[Number(a)]+"\n"+(val("quizChecked"+i)?quizFeedback(i):"Noch nicht geprüft."))});
 return parts.join("\n\n");
}
function exportNotes(){
 const blob=new Blob(["\uFEFF"+journalText()],{type:"text/plain;charset=utf-8"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="ki-lernjournal.txt";document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),2000);
}
function clearNotes(){
 if(!confirm("Alle Eingaben und Fortschrittsmarkierungen in diesem Browser löschen? Exportiere dein Lernjournal vorher, falls du es behalten möchtest."))return;
 state={answers:{},done:[],chapter:0};fruit=baseFruit.map(r=>({...r}));fruitWeight=160;ruleThreshold=140;generated=[];tokenIndex=0;samplingMode="random";chatMessage="Ich bin müde.";syncChapterURL("replace");render();$("main").focus({preventScroll:true});window.scrollTo({top:0,behavior:"auto"});
}
function lines(label,value="",large=false){return'<div class="printfield"><strong>'+label+'</strong><div class="lines '+(large?"large":"")+'">'+esc(value)+'</div></div>'}
function sheet(title,body){return'<section class="sheet"><p class="small">KI verstehen · Unterricht gestalten</p><h1>'+title+'</h1>'+body+'</section>'}
function doPrint(html){$("paper").innerHTML=html;try{window.print()}catch(e){$("paper").innerHTML="";throw e}}
function canvasPaper(filled=false){
 const v=k=>filled?val(k):"";
 return sheet("KI-Kompetenz-Canvas · 1/2",
 lines("Fach / Thema / Klasse",v("fach"))+
 canvasFields.slice(0,2).map(([k,l])=>lines(l,v("canvas_"+k),true)).join("")+
 '<p><strong>Kompetenzbereiche:</strong><br>'+domains.map((d,i)=>(filled&&val("domain"+i)===true?"☑":"☐")+" "+d).join(" · ")+'</p><p><strong>Niveau:</strong> '+(esc(v("niveau"))||"☐ I  ☐ II  ☐ III")+'</p>'+
 lines("Bezug zur konkreten Beschreibung in der Originalmatrix",v("niveaubezug"),true))+
 sheet("KI-Kompetenz-Canvas · 2/2",
 canvasFields.slice(2).map(([k,l])=>lines(l,v("canvas_"+k))).join("")+
 lines("Alternative ohne KI-Zugang",v("ohnezugang")));
}
function materialsHTML(){
 let out=sheet("Kompetenzkompass",'<p>Vorher und nachher ausfüllen. 1 = noch unsicher, 4 = sehr sicher.</p><table><thead><tr><th>Bereich und Aussage</th><th>Vorher</th><th>Nachher</th></tr></thead><tbody>'+compass.map((c,i)=>'<tr><td><strong>'+domains[i]+'</strong><br>'+c+'</td><td>1 2 3 4</td><td>1 2 3 4</td></tr>').join("")+'</tbody></table>'+lines("Ein konkreter Beleg für meine Einschätzung …","",true)+'<p>Die Werte sind eine Selbsteinschätzung, keine Zuordnung zu I–III.</p>');
 out+=sheet("Experimentprotokoll",'<h2>Obstmodell</h2><p>Ausgangsdaten: Apfel 150 / 180 g; Birne 110 / 130 g. Ordne nach dem nächsten Gewicht zu. Bei gleich nahen, unterschiedlichen Etiketten: uneindeutig.</p><table><tr><th>Versuch</th><th>Vorhersage und Erklärung</th></tr>'+["Neuer Fall: 160 g","Zusätzlich Birne 160 g","Zusätzlich auch Apfel 160 g","Neuer Fall ausserhalb der bisherigen Gewichte"].map(t=>'<tr style="height:14mm"><td>'+t+'</td><td></td></tr>').join("")+'</table>'+lines("Welche Merkmale fehlen? Warum sind mehr Daten nicht automatisch besser?")+'<h2>Sprachmodell</h2>'+lines("Was passiert beim Training?")+lines("Was passiert bei der Nutzung?")+lines("Warum bedeutet plausibel nicht automatisch wahr?"));
 out+=sheet("Zusatzaufgabe · Teachable Machine",'<p>Trainiere ein Bildmodell für Stift und Radiergummi. Verwende Gegenstände ohne Personen oder persönliche Angaben im Bild.</p><p>Tool: <a href="https://teachablemachine.withgoogle.com/">teachablemachine.withgoogle.com</a></p>'+teachableSteps+'<p>Die Prozentanzeige ist keine gemessene Trefferquote. Teste auch einen unbekannten Gegenstand.</p>'+lines("Testfall / erwartete Klasse / Ausgabe")+lines("Meine Datenänderung und ihre Wirkung")+lines("Meine Erkenntnis für den Unterricht"));
 out+=sheet("Prompting mit Fobizz oder Gemini",'<p>Wählt einen der drei Aufträge oder erkundet alle. Vergleicht eure Beobachtungen.</p>'+prompts.map(p=>'<h3>'+p[0]+'</h3><p>'+p[1]+'</p>').join("")+'<p><strong>A:</strong> Zielgruppe, Sprache, Länge und Analogie vergleichen.</p><p><strong>B:</strong> Drei Aussagen markieren: bestätigt / ungeprüft / widerlegt oder problematisch. Mindestens eine Originalquelle prüfen.</p><p><strong>C:</strong> Annahmen, Stereotype und fehlende reale Stimmen untersuchen.</p><p>Fiktive Beispiele verwenden. Keine personenbezogenen Schülerdaten eingeben.</p>');
 out+=sheet("Prüfen und erklären",'<table><thead><tr><th>Aussage</th><th>Urteil</th><th>Quelle / Fundstelle / Begründung</th></tr></thead><tbody>'+[1,2,3].map(()=>'<tr style="height:30mm"><td></td><td></td><td></td></tr>').join("")+'</tbody></table>'+lines("KI kann gut …")+lines("KI kann nicht zuverlässig …")+lines("Deshalb muss der Mensch …"));
 for(let p=0;p<2;p++)out+=sheet("Kompetenzkarten · "+(p+1),'<p>Ausschneiden. In vier Gruppen sortieren und eigene Gruppennamen finden.</p><div class="printcards">'+cards.slice(p*6,p*6+6).map((c,j)=>'<div class="cut"><strong>Karte '+(p*6+j+1)+'</strong><p>'+c+'</p></div>').join("")+'</div>');
 out+=sheet("Aufgaben zum Weiterentwickeln",'<p>Wählt eine Aufgabe. Macht mindestens zwei Kompetenzbereiche durch konkrete Handlungen und Lernbelege sichtbar.</p><div class="printcards">'+tasks.map(t=>'<div class="cut"><h2>'+t.subject+'</h2><p>'+t.bad+'</p></div>').join("")+'</div>');
 out+=sheet("Verbesserungsraster",lines("Unsere Ausgangsaufgabe …")+raster.map(([,l])=>lines(l)).join("")+lines("Unser neuer Arbeitsauftrag …","",true));
 out+=canvasPaper(false);
 out+=sheet("Gallery-Walk-Feedback",'<p>Gebt eine konkrete Rückmeldung und entwickelt eure Idee mit dem Feedback weiter.</p><div class="printcards">'+[1,2].map(()=>'<div class="cut"><h2>💡 Stark</h2>'+lines("Hier wird KI-Kompetenz sichtbar, weil …","",true)+'</div><div class="cut"><h2>🔧 Weiterdenken</h2>'+lines("Noch stärker würde die Aufgabe, wenn …","",true)+'</div>').join("")+'</div>'+lines("Das ändere ich an meiner eigenen Idee …","",true));
 out+=sheet("Exit-Ticket",lines("KI funktioniert anders als ich vorher dachte, weil …","",true)+lines("Für meine Lernenden ist besonders wichtig …","",true)+lines("In meinem Unterricht werde ich …","",true)+lines("Mein Kompetenzbeleg …")+lines("Meine konkrete Unterrichtserprobung …"));
 out+=sheet("Selbsttests",quizzes.map(q=>'<h2>'+q.title+'</h2><p>'+q.question+'</p>'+q.options.map(t=>'<p>☐ '+t+'</p>').join("")).join(""));
 out+=sheet("Quellen und Bearbeitung",sourcesHTML);return out;
}
const actions={
 go:b=>go(Number(b.dataset.index)),materials:()=>doPrint(materialsHTML()),
 canvas:()=>doPrint(canvasPaper(true)),export:exportNotes,clear:clearNotes,
 addFruit,resetFruit,undoFruit,nextToken,resetTokens,copy:b=>copyPrompt(Number(b.dataset.index)),revealModel,chooseTask:b=>chooseTask(Number(b.dataset.index)),quiz:b=>checkQuiz(Number(b.dataset.index))
};

/* Learning aids and interaction improvements. */
const chapterGoals=[
 ["Deine Ausgangslage","Ordne ein Alltagsbeispiel mit einer Begründung ein."],
 ["Dein Lernbeleg","Erkläre, warum eine zusätzliche Birne die Zuordnung verändert."],
 ["Dein Lernbeleg","Unterscheide Training, Kontext und schrittweise Texterzeugung."],
 ["Dein Lernbeleg","Begründe eine Promptänderung und eine Entscheidung zum Output."],
 ["Deine Erkenntnis","Leite aus einer Grenze der KI eine menschliche Aufgabe ab."],
 ["Dein Lernbeleg","Ordne eine beobachtbare Handlung einem Kompetenzbereich zu."],
 ["Dein Ergebnis","Formuliere einen Auftrag, der mindestens zwei Bereiche sichtbar macht."],
 ["Dein Transfer","Plane eine Aktivität mit Lernbeleg, Qualitätskriterium und Überarbeitung."]
];
const quizzes=[
 {chapter:1,title:"Daten verändern – Regeln verändern?",question:"Eine neue Birne mit 160 g wird ergänzt. Warum ändert sich die feste Gewichtsregel nicht?",
 options:["Weil feste Regeln neue Beispiele automatisch ignorieren müssen.","Weil ihr Schwellenwert von uns festgelegt wurde und nicht aus diesen Beispielen berechnet wird.","Weil Birnen immer leichter sind als Äpfel."],correct:1,
 feedback:"Im Experiment wird nur die Beispielsammlung des Nächster-Nachbar-Modells ergänzt. Die separat festgelegte Regel bleibt gleich, bis wir ihren Schwellenwert ändern."},
 {chapter:2,title:"Fortsetzung ist nicht Wahrheit",question:"Ein Token erhält in der Simulation 70 %. Was sagt diese Zahl aus?",
 options:["Die Aussage ist mit 70 % Wahrscheinlichkeit wahr.","70 % der Menschen würden diesen Satz sagen.","Bei zufälliger Auswahl gemäss dieser Beispielverteilung wird dieses nächste Token in etwa 70 % vieler Wiederholungen gewählt."],correct:2,
 feedback:"Die Zahl beschreibt die Auswahl des nächsten Bausteins unter den Bedingungen dieser Verteilung. Sie bewertet weder die Wahrheit eines Satzes noch menschliche Meinungen. Unsere Zahlen sind erfunden."},
 {chapter:6,title:"Was zeigt Kompetenz?",question:"Welcher Lernbeleg zeigt am deutlichsten, dass eine Person KI-Aussagen kritisch prüfen kann?",
 options:["Ein sprachlich überzeugender KI-Text.","Eine Prüftabelle mit überprüfter Originalquelle, passender Fundstelle und begründetem Urteil.","Die Anzahl der verwendeten Prompts."],correct:1,
 feedback:"Der Lernbeleg macht die eigene Prüfung sichtbar. Die Fundstelle muss genau die Aussage stützen oder widerlegen. Auch ein begründetes «noch ungeklärt» ist ein mögliches Urteil."}
];
function quizHTML(i){
 const q=quizzes[i],answer=String(val("quiz"+i));
 return '<section class="card quiz"><span class="tag">Kurzer Selbsttest</span><h2>'+q.title+'</h2><p class="small">Überprüfe dein Verständnis und erhalte eine Erklärung zu deiner Antwort.</p><fieldset><legend>'+q.question+'</legend>'+
 q.options.map((t,j)=>'<label class="check"><input type="radio" name="quiz'+i+'" data-key="quiz'+i+'" value="'+j+'" '+(answer===String(j)?"checked":"")+'>'+t+'</label>').join("")+
 '</fieldset><button data-action="quiz" data-index="'+i+'">Antwort prüfen</button><p id="quizFeedback'+i+'" class="note" role="status" '+(val("quizChecked"+i)?"":"hidden")+'>'+
 (val("quizChecked"+i)?quizFeedback(i):"")+'</p></section>';
}
function quizFeedback(i){
 const a=val("quiz"+i),q=quizzes[i];
 if(!/^[0-2]$/.test(String(a)))return "Wähle zuerst eine Antwort.";
 return (Number(a)===q.correct?"Das passt. ":"Prüfe deine Überlegung nochmals. ")+q.feedback;
}
function checkQuiz(i){
 if(!quizzes[i])return;put("quizChecked"+i,true);
 const output=$("quizFeedback"+i);output.textContent=quizFeedback(i);output.hidden=false;
}
function chapterView(){
 let html=pages[state.chapter]();
 const ideaLinks={0:["alltag","KI im Alltag mit IT2School"],1:["oceans","Daten untersuchen mit AI for Oceans, Zeichnungen und Papiermodellen"],2:["soekia","Suchmaschine und Sprachmodell mit Soekia vergleichen"],3:["pruefen","Eine KI-Erklärung im Unterricht prüfen"]};
 if(ideaLinks[state.chapter]){const [anchor,label]=ideaLinks[state.chapter];html+='<div class="note"><strong>Für deinen Unterricht:</strong> <a href="./unterrichtsideen.html#'+anchor+'">'+label+'</a>. Weitere Aktivitäten findest du auf der Seite Unterrichtsideen.</div>'}
 const goal=chapterGoals[state.chapter];
 const intro='<div class="learning-goal"><span>'+goal[0]+'</span><strong>'+goal[1]+'</strong></div>';
 html=html.replace(/<h1>(.*?)<\/h1>/,(_,title)=>'<section class="chapter-hero"><div class="eyebrow">KI entdecken · Kapitel '+String(state.chapter+1).padStart(2,"0")+' / 08</div><h1>'+title+'</h1>'+intro+'</section>');
 quizzes.forEach((q,i)=>{if(q.chapter===state.chapter)html+=quizHTML(i)});
 let n=0;const headings=[];
 html=html.replace(/<h2>(.*?)<\/h2>/g,(_,title)=>{
  const id="section-"+state.chapter+"-"+(++n);headings.push([id,title]);
  return '<h2 id="'+id+'">'+title+'</h2>';
 });
 if(headings.length>2){
  const toc='<details class="chapter-outline"><summary>In diesem Kapitel · '+headings.length+' Abschnitte</summary><ol>'+headings.map(([id,title])=>'<li><a href="#'+id+'">'+title+'</a></li>').join("")+'</ol></details>';
  html=html.replace("</section>","</section>"+toc);
 }
 return html;
}
function decorateChapter(){
 if(state.chapter===1){$("fruitWeight").value=fruitWeight;$("threshold").value=ruleThreshold}
 if(state.chapter===2){$("context").value=String(tokenIndex);$("sampling").value=samplingMode;$("chatInput").value=chatMessage}
 if($("chapterSelect"))$("chapterSelect").value=String(state.chapter);
}
function refreshGroupNames(key){
 if(/^quiz\d$/.test(key)){
  const i=key.slice(4);state.answers["quizChecked"+i]=false;
  const feedback=$("quizFeedback"+i);if(feedback){feedback.hidden=true;feedback.textContent=""}
 }
 if(!/^(group|sort)\d+$/.test(key))return;
 document.querySelectorAll('select[data-key^="sort"]').forEach(select=>{
  [1,2,3,4].forEach(n=>{if(select.options[n])select.options[n].textContent=String(val("group"+n)||"Gruppe "+n)});
 });
 const summary=$("groupSummary");if(!summary)return;
 summary.innerHTML=[1,2,3,4].map(n=>'<h3>'+esc(val("group"+n)||"Gruppe "+n)+'</h3><ul>'+
 cards.map((c,i)=>String(val("sort"+i))===String(n)?'<li>'+c+'</li>':"").join("")+'</ul>').join("");
}
function drawFruit(w,g){
 const x=n=>60+(n-50)/350*430;
 const ticks=[50,100,150,200,250,300,350,400];
 $("fruitChart").innerHTML='<svg viewBox="0 0 550 190" role="img" aria-labelledby="fruitChartTitle"><title id="fruitChartTitle">Gewichte der Trainingsbeispiele und Testfall bei '+w+' Gramm. Nächste Entfernung: '+g.distance+' Gramm.</title>'+
 '<text x="8" y="52">Apfel</text><text x="8" y="107">Birne</text>'+
 '<line x1="60" y1="135" x2="490" y2="135" stroke="#718392"/>'+
 ticks.map(t=>'<line x1="'+x(t)+'" y1="135" x2="'+x(t)+'" y2="141" stroke="#718392"/><text x="'+x(t)+'" y="160" text-anchor="middle">'+t+'</text>').join("")+
 '<text x="275" y="183" text-anchor="middle">Gewicht in Gramm</text>'+
 '<line x1="'+x(w)+'" y1="16" x2="'+x(w)+'" y2="130" stroke="#172d41" stroke-width="2" stroke-dasharray="4 4"/>'+
 fruit.map(r=>{const px=x(r.w),py=r.t==="Apfel"?47:102;const common=' fill="'+(r.t==="Apfel"?"#197448":"#075f9c")+'" stroke="'+(g.near.includes(r)?"#111":"white")+'" stroke-width="'+(g.near.includes(r)?3:1)+'"';
 return r.t==="Apfel"?'<rect x="'+(px-6)+'" y="'+(py-6)+'" width="12" height="12"'+common+'><title>Apfel: '+r.w+' g</title></rect>':
 '<circle cx="'+px+'" cy="'+py+'" r="6"'+common+'><title>Birne: '+r.w+' g</title></circle>'}).join("")+'</svg>';
}
function undoFruit(){
 if(fruit.length<=baseFruit.length){$("fruitMsg").textContent="Es sind nur die vier Ausgangsbeispiele vorhanden.";return}
 fruit.pop();updateFruit();$("fruitMsg").textContent="Das zuletzt hinzugefügte Beispiel wurde entfernt.";
}
function chooseTask(i){
 if(!tasks[i])return;put("taskwahl",tasks[i].subject+": "+tasks[i].bad);
 $("taskwahl").value=val("taskwahl");$("raster").scrollIntoView({block:"start"});$("taskwahl").focus();
}

// Validate control values from older or edited browser storage without removing notes.
Object.entries(state.answers).forEach(([key,value])=>{
 let valid=true;
 if(/^(domain[0-3]|modelOpen|quizChecked[0-2])$/.test(key))valid=typeof value==="boolean";
 else if(/^(pre|post)[0-3]$/.test(key)||/^sort(?:[0-9]|1[01])$/.test(key))valid=value===""||/^[1-4]$/.test(value);
 else if(/^quiz[0-2]$/.test(key))valid=value===""||typeof value==="string"&&/^[0-2]$/.test(value);
 else if(key==="niveau")valid=["","I","II","III"].includes(value);
 if(!valid)delete state.answers[key];
});
syncChapterURL("replace",true);
window.addEventListener("beforeprint",()=>{if(!$("paper").innerHTML)$("paper").innerHTML=materialsHTML()});
window.addEventListener("afterprint",()=>{$("paper").innerHTML=""});
render();

