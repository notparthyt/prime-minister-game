const W=18,H=11,S=40,TURNS=60,$=id=>document.getElementById(id);
const DEF=[["Valoria","#4f8cff"],["Ironmark","#e5584f"],["Sunhaven","#e8a838"],["Verdane","#4fb477"],["Nordheim","#a58bf0"],["Zephyria","#2cc5b8"]];
const rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)],cl=(v,a,b)=>Math.max(a,Math.min(b,v));
let G,sel=-1,flash={};
function init(){
 const seeds=[[3,6],[14,2],[14,8],[8,1],[8,9],[2,1]],own=[];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){let b=0,bd=1e9;seeds.forEach((s,i)=>{const d=(s[0]-x)**2+(s[1]-y)**2+rnd(0,6);if(d<bd){bd=d;b=i}});own.push(b)}
 const cap=seeds.map(s=>s[1]*W+s[0]);
 for(let i=0;i<own.length;i++)if(!cap.includes(i)&&Math.random()<.08)own[i]=-1;
 const n=DEF.map((d,i)=>({id:i,name:d[0],col:d[1],gold:i?150:250,mil:i?rnd(38,58):50,eco:i?rnd(40,60):50,aggr:rnd(.3,1),cap:cap[i],dead:false,trade:false}));
 const k=DEF.length,rel=[],war=[],al=[];
 for(let i=0;i<k;i++){rel.push([]);war.push([]);al.push([]);for(let j=0;j<k;j++){rel[i][j]=0;war[i][j]=false;al[i][j]=false}}
 for(let i=0;i<k;i++)for(let j=i+1;j<k;j++)rel[i][j]=rel[j][i]=Math.round(rnd(-35,35));
 G={own,n,rel,war,al,turn:0,ap:3,app:62,tax:1,over:false,log:[]};
 sel=-1;flash={};$("log").innerHTML="";
 say("You are sworn in as Prime Minister of Valoria. Grow your land, win allies, and keep the voters happy.","n");
 render();
}
const cnt=i=>G.own.filter(o=>o===i).length;
function say(t,c=""){const p=document.createElement("p");p.className=c;p.textContent=`Q${G.turn%4+1} ${2030+Math.floor(G.turn/4)}: `+t;const l=$("log");l.prepend(p)}
const nb=c=>{const x=c%W,y=(c/W)|0,r=[];if(x>0)r.push(c-1);if(x<W-1)r.push(c+1);if(y>0)r.push(c-W);if(y<H-1)r.push(c+W);return r};
const adj=(c,a)=>nb(c).some(q=>G.own[q]===a);
const alive=()=>G.n.filter(x=>!x.dead);
function power(a,b){let p=G.n[a].mil;G.n.forEach(k=>{if(!k.dead&&k.id!==a&&k.id!==b&&G.al[a][k.id])p+=k.mil*.25});return p}
function status(i){return G.war[0][i]?"war":G.al[0][i]?"ally":"neutral"}
function battle(a,c){
 const d=G.own[c],A=G.n[a],D=G.n[d],isCap=D.cap===c;
 const ap=power(a,d)*rnd(.8,1.3),dp=power(d,a)*rnd(.8,1.3)*(isCap?1.5:1.1);
 flash[c]=Date.now();
 if(ap>dp){
  A.mil=Math.max(8,A.mil*.93);D.mil=Math.max(6,D.mil*.88);
  if(isCap){G.own=G.own.map(o=>o===d?a:o);D.dead=true;for(let j=0;j<G.n.length;j++){G.war[d][j]=G.war[j][d]=false;G.al[d][j]=G.al[j][d]=false}
   say(`${A.name} captured the capital of ${D.name}. The nation has collapsed!`,a===0?"g":d===0?"w":"n");}
  else{G.own[c]=a;say(`${A.name} took a province from ${D.name}.`,a===0?"g":d===0?"w":"n")}
  return true}
 A.mil=Math.max(8,A.mil*.85);D.mil=Math.max(6,D.mil*.95);
 say(`${A.name}'s attack on ${D.name} was repelled.`,a===0?"w":d===0?"g":"n");return false}
function declareWar(a,b){
 G.war[a][b]=G.war[b][a]=true;G.al[a][b]=G.al[b][a]=false;G.rel[a][b]=G.rel[b][a]=-70;
 say(`${G.n[a].name} declared war on ${G.n[b].name}!`,a===0||b===0?"w":"n");
 G.n.forEach(k=>{if(k.dead||k.id===a||k.id===b||k.id===0)return;
  if(G.al[k.id][b]&&!G.war[k.id][a]){G.war[k.id][a]=G.war[a][k.id]=true;say(`${k.name} joins ${G.n[b].name} against ${G.n[a].name}.`,"n")}
  else if(G.al[k.id][a]&&!G.war[k.id][b]&&Math.random()<.6){G.war[k.id][b]=G.war[b][k.id]=true;say(`${k.name} joins ${G.n[a].name} against ${G.n[b].name}.`,"n")}})}
function peace(a,b){G.war[a][b]=G.war[b][a]=false;G.rel[a][b]=G.rel[b][a]=-10;say(`Peace signed between ${G.n[a].name} and ${G.n[b].name}.`,a===0||b===0?"g":"n")}
function border(a,e){const r=[];G.own.forEach((o,c)=>{if(o===e&&adj(c,a))r.push(c)});return r}
const EV=[
["Oil discovered","Surveyors found oil under the northern plains.",[["Nationalise it (+150 gold, -6 approval)",()=>{G.n[0].gold+=150;G.app-=6}],["Auction to investors (+80 gold, +4 approval)",()=>{G.n[0].gold+=80;G.app+=4}]]],
["Mass protests","Students fill the capital demanding reform.",[["Send police (-8 approval, +4 military)",()=>{G.app-=8;G.n[0].mil+=4}],["Negotiate (-60 gold, +8 approval)",()=>{G.n[0].gold-=60;G.app+=8}]]],
["Scandal","A minister is caught taking bribes.",[["Fire him publicly (+3 approval)",()=>{G.app+=3}],["Cover it up (-10 approval, +60 gold)",()=>{G.app-=10;G.n[0].gold+=60}]]],
["Border incident","Soldiers clash with a neighbour's patrol.",[["Apologise (-6 approval, relations up)",()=>{G.app-=6;G.n.forEach(k=>{if(k.id&&!k.dead){G.rel[0][k.id]+=8;G.rel[k.id][0]+=8}})}],["Show strength (+5 approval, relations down)",()=>{G.app+=5;G.n.forEach(k=>{if(k.id&&!k.dead){G.rel[0][k.id]-=10;G.rel[k.id][0]-=10}})}]]],
["Harvest festival","A bumper crop fills the granaries.",[["Export surplus (+100 gold)",()=>{G.n[0].gold+=100}],["Feed the poor (+10 approval)",()=>{G.app+=10}]]],
["Spy ring uncovered","Foreign agents were stealing military plans.",[["Expel them quietly (+3 approval)",()=>{G.app+=3}],["Invest in counter-intel (-70 gold, +6 military)",()=>{G.n[0].gold-=70;G.n[0].mil+=6}]]],
["Tech breakthrough","Engineers offer a new rifle design.",[["Fund production (-90 gold, +10 military)",()=>{G.n[0].gold-=90;G.n[0].mil+=10}],["License it abroad (+120 gold)",()=>{G.n[0].gold+=120}]]],
["Economic slump","A global downturn hits exports.",[["Stimulus package (-100 gold, +5 approval)",()=>{G.n[0].gold-=100;G.app+=5}],["Austerity (-8 approval, +50 gold)",()=>{G.app-=8;G.n[0].gold+=50}]]]];
function modal(h,body,btns){const m=$("mb");m.innerHTML=`<h2>${h}</h2><p>${body}</p>`;btns.forEach(([t,f])=>{const b=document.createElement("button");b.textContent=t;b.onclick=()=>{$("modal").classList.remove("on");f&&f();render()};m.appendChild(b)});$("modal").classList.add("on")}
function useAP(){if(G.ap<1||G.over)return false;G.ap--;return true}
function endTurn(){
 if(G.over)return;const P=G.n[0];
 const inc=cnt(0)*4*[.7,1,1.4][G.tax]+P.eco*.8+G.n.reduce((s,k)=>s+(k.trade&&!k.dead?8:0),0)-P.mil*.35;
 P.gold+=inc;if(P.gold<0){G.app-=3;P.mil*=.95;say("The treasury is in debt! Soldiers desert and voters grumble.","w")}
 const wars=G.n.filter(k=>!k.dead&&k.id&&G.war[0][k.id]).length;
 G.app+= [2,0,-3][G.tax]-wars*1.5+(G.app>60?-.8:G.app<50?.8:0);
 alive().forEach(k=>{if(!k.id)return;k.gold+=cnt(k.id)*4+k.eco*.6;const sp=k.gold*.08;k.gold-=sp;k.mil=Math.min(160,k.mil+sp*.35);k.eco+=.4});
 alive().forEach(k=>{if(!k.id)return;const foes=G.n.filter(q=>!q.dead&&G.war[k.id][q.id]);
  const tries=k.aggr>.8?2:1;
  foes.forEach(f=>{for(let t=0;t<tries;t++){if(Math.random()<.45+k.aggr*.2){const bc=border(k.id,f.id);if(bc.length&&!k.dead&&!f.dead){const c=pick(bc);const caps=bc.includes(f.cap)&&Math.random()<.3?f.cap:c;battle(k.id,caps)}}}
   if(f.id!==0&&Math.random()<.1)peace(k.id,f.id)});
  if(!foes.length&&Math.random()<.05*k.aggr){const ts=alive().filter(q=>q.id!==k.id&&!G.al[k.id][q.id]&&G.rel[k.id][q.id]<20&&border(k.id,q.id).length);if(ts.length)declareWar(k.id,ts.sort((a,b)=>G.rel[k.id][a.id]-G.rel[k.id][b.id])[0].id)}
  if(G.war[k.id][0]===false&&Math.random()<.04&&G.rel[k.id][0]>30&&!G.al[k.id][0]){say(`${k.name} proposes an alliance if you ask them. Relations are warm.`,"n")}});
 for(let i=0;i<G.n.length;i++)for(let j=i+1;j<G.n.length;j++){let r=G.rel[i][j];r+=G.war[i][j]?-1:G.al[i][j]?1:r>0?-.5:.5;G.rel[i][j]=G.rel[j][i]=cl(r,-100,100)}
 G.turn++;G.ap=3;G.app=cl(G.app,0,100);
 const done=()=>{render();check()};
 if(G.turn%12===0){render();if(G.app<45)return end(false,"You lost the general election. The voters have chosen someone else.");G.app=cl(G.app+5,0,100);return modal("Election won!",`You were re-elected with ${Math.round(G.app)}% approval. Another term begins.`,[["Continue",done]])}
 if(Math.random()<.4){const e=pick(EV);return modal(e[0],e[1],e[2].map(c=>[c[0],()=>{c[1]();G.app=cl(G.app,0,100);check()}]))}
 done()}
function check(){
 if(G.over)return;const pct=cnt(0)/G.own.filter(o=>o>=0).length;
 if(G.n[0].dead||G.own[G.n[0].cap]!==0)return end(false,"Your capital has fallen. Valoria is no more.");
 if(G.app<=0)return end(false,"A military coup removed you from office.");
 if(pct>=.55)return end(true,"Valoria controls most of the known world. Historians call it a golden age.");
 if(G.turn>=TURNS){const top=alive().every(k=>cnt(k.id)<=cnt(0));return end(top,top?`After 15 years you lead the largest nation (${Math.round(pct*100)}% of land). Victory!`:"You survived 15 years, but a rival is larger. History will remember you kindly, not greatly.")}}
function end(win,msg){G.over=true;render();modal(win?"Victory":"Game over",msg,[["Play again",init]])}
function render(){
 const P=G.n[0];$("sGold").textContent=Math.round(P.gold);$("sApp").textContent=Math.round(G.app)+"%";$("sMil").textContent=Math.round(P.mil);$("sEco").textContent=Math.round(P.eco);
 $("sLand").textContent=Math.round(cnt(0)/G.own.filter(o=>o>=0).length*100)+"%";$("sTurn").textContent=`Q${G.turn%4+1} ${2030+Math.floor(G.turn/4)}`;$("ap").textContent=G.ap;
 $("taxb").innerHTML=["Low","Normal","High"].map((t,i)=>`<button ${G.tax===i?'class="pri"':""} onclick="G.tax=${i};render()">${t}</button>`).join("");
 const can=G.ap>0&&!G.over;$("bEco").disabled=!can||P.gold<100;$("bMil").disabled=!can||P.gold<80;$("bWel").disabled=!can||P.gold<90;$("bEnd").disabled=G.over;
 $("leg").innerHTML=G.n.filter(k=>!k.dead).map(k=>`<span><i style="background:${k.col}"></i>${k.name} (${cnt(k.id)})</span>`).join("")+`<span>★ capital</span>`;
 side();draw()}
function side(){
 const s=$("side");if(sel<0||G.own[sel]<0){s.innerHTML=`<h3>Select a province</h3><p class="small">Click any land on the map to see its nation, then trade, ally, threaten or invade.</p>`;return}
 const o=G.own[sel],k=G.n[o];
 if(o===0){s.innerHTML=`<h3>${k.name} (you)</h3><p class="small">Provinces: ${cnt(0)}${G.n[0].cap===sel?" · this is your capital, protect it":""}<br>Income per quarter: about ${Math.round(cnt(0)*4*[.7,1,1.4][G.tax]+k.eco*.8-k.mil*.35)} gold</p>`;return}
 const st=status(o),r=Math.round(G.rel[0][o]),pw=power(0,o)/Math.max(1,power(o,0)),can=G.ap>0&&!G.over;
 const rd=pw>1.4?"Much stronger than them":pw>1.05?"Slightly stronger":pw>.75?"Evenly matched":"They are stronger";
 s.innerHTML=`<h3 style="color:${k.col}">${k.name}</h3><span class="chip">${st==="war"?"At war":st==="ally"?"Ally":"Neutral"}</span>${k.trade?'<span class="chip">Trade deal</span>':""}
 <div class="small" style="margin-top:6px">Relations: ${r}</div><div class="bar"><i style="width:${(r+100)/2}%;background:${r>=0?"var(--ok)":"var(--bad)"}"></i></div>
 <p class="small">Provinces: ${cnt(o)} · ${rd}${G.own[sel]===o&&k.cap===sel?" · <b>capital</b>":""}</p>
 <button data-a="gift" ${can&&G.n[0].gold>=60&&st!=="war"?"":"disabled"}>Send aid (60)</button>
 <button data-a="trade" ${can&&!k.trade&&r>=0&&st!=="war"?"":"disabled"}>Trade deal</button>
 <button data-a="ally" ${can&&st==="neutral"&&r>=35?"":"disabled"}>Propose alliance</button>
 ${st==="war"?`<button data-a="peace" ${can?"":"disabled"}>Offer peace</button><button class="red" data-a="atk" ${can&&G.n[0].gold>=10&&adj(sel,0)?"":"disabled"}>Attack this province (10)</button>`:`<button class="red" data-a="war" ${can&&st!=="ally"?"":"disabled"}>Declare war</button>`}
 <p class="small">Alliances need relations of 35+. Attack from a province that borders yours. Capturing a capital collapses the whole nation.</p>`;
 s.querySelectorAll("button[data-a]").forEach(b=>b.onclick=()=>act(b.dataset.a,o))}
function act(a,o){
 const P=G.n[0],k=G.n[o];if(!useAP())return;
 if(a==="gift"){P.gold-=60;G.rel[0][o]=G.rel[o][0]=cl(G.rel[0][o]+16,-100,100);say(`You sent aid to ${k.name}.`,"g")}
 else if(a==="trade"){k.trade=true;G.rel[0][o]=G.rel[o][0]+=6;say(`Trade deal with ${k.name}: +8 gold every quarter.`,"g")}
 else if(a==="ally"){if(Math.random()<.5+G.rel[0][o]/200){G.al[0][o]=G.al[o][0]=true;say(`${k.name} is now your ally!`,"g")}else say(`${k.name} declined your alliance.`,"w")}
 else if(a==="war"){G.app-=3;declareWar(0,o)}
 else if(a==="peace"){const p=.3+(power(o,0)>power(0,o)?.1:.25)-k.aggr*.2+(G.turn%7)*.01;if(Math.random()<p)peace(0,o);else say(`${k.name} refused peace.`,"w")}
 else if(a==="atk"){P.gold-=10;if(battle(0,sel)){G.app+=1.5}else G.app-=2}
 G.app=cl(G.app,0,100);render();check()}
$("bEco").onclick=()=>{if(useAP()){G.n[0].gold-=100;G.n[0].eco+=8;say("New factories open. Economy +8.","g");render()}};
$("bMil").onclick=()=>{if(useAP()){G.n[0].gold-=80;G.n[0].mil+=10;say("Fresh recruits join the army. Military +10.","g");render()}};
$("bWel").onclick=()=>{if(useAP()){G.n[0].gold-=90;G.app=cl(G.app+10,0,100);say("Welfare payments raise your popularity.","g");render()}};
$("bEnd").onclick=endTurn;
const cv=$("cv"),cx=cv.getContext("2d");
cv.onclick=e=>{const r=cv.getBoundingClientRect(),x=((e.clientX-r.left)/r.width*cv.width/S)|0,y=((e.clientY-r.top)/r.height*cv.height/S)|0;sel=y*W+x;render()};
function draw(){
 cx.clearRect(0,0,cv.width,cv.height);const now=Date.now();
 for(let c=0;c<G.own.length;c++){const x=(c%W)*S,y=((c/W)|0)*S,o=G.own[c];
  if(o<0){cx.fillStyle=(c%2?"#0d3a52":"#0b3249");cx.fillRect(x,y,S,S);continue}
  const k=G.n[o];cx.fillStyle=k.col;cx.globalAlpha=.82;cx.fillRect(x,y,S,S);cx.globalAlpha=1;
  cx.strokeStyle="#0006";cx.lineWidth=1;cx.strokeRect(x+.5,y+.5,S-1,S-1);
  nb(c).forEach(q=>{if(G.own[q]!==o){cx.strokeStyle="#0b1118";cx.lineWidth=3;const qx=(q%W)*S,qy=((q/W)|0)*S;cx.beginPath();if(qx>x){cx.moveTo(x+S,y);cx.lineTo(x+S,y+S)}else if(qx<x){cx.moveTo(x,y);cx.lineTo(x,y+S)}else if(qy>y){cx.moveTo(x,y+S);cx.lineTo(x+S,y+S)}else{cx.moveTo(x,y);cx.lineTo(x+S,y)}cx.stroke()}});
  if(o!==0&&G.war[0][o]){cx.strokeStyle="#ff3b30aa";cx.lineWidth=2;cx.strokeRect(x+3,y+3,S-6,S-6)}
  if(o!==0&&G.al[0][o]){cx.fillStyle="#fff";cx.beginPath();cx.arc(x+S-8,y+8,3.5,0,7);cx.fill()}
  if(k.cap===c){cx.fillStyle="#fff";cx.font="22px serif";cx.textAlign="center";cx.textBaseline="middle";cx.fillText("★",x+S/2,y+S/2+1)}
  if(flash[c]&&now-flash[c]<700){cx.fillStyle=`rgba(255,255,255,${.8*(1-(now-flash[c])/700)})`;cx.fillRect(x,y,S,S)}}
 if(sel>=0){cx.strokeStyle="#fff";cx.lineWidth=3;cx.setLineDash([6,4]);cx.lineDashOffset=-now/60;cx.strokeRect((sel%W)*S+2,((sel/W)|0)*S+2,S-4,S-4);cx.setLineDash([])}
 G.n.forEach(k=>{if(k.dead)return;cx.fillStyle="#fffe";cx.font="bold 12px Trebuchet MS,sans-serif";cx.textAlign="center";cx.textBaseline="top";cx.fillText(k.name,(k.cap%W)*S+S/2,((k.cap/W)|0)*S+S+1)})}
(function loop(){if(G)draw();requestAnimationFrame(loop)})();
init();
modal("Welcome, Prime Minister","You lead Valoria (blue). Each quarter you get 3 actions: build, trade, ally, or invade. End the quarter to collect taxes and watch your rivals move. Win by holding 55% of the land or the largest nation after 15 years. Keep approval above 45% for elections every 3 years.",[["Take office",null]]);
