// -------------------------
// VARIABLES
// -------------------------
let questions = [];
let index = 0;
let score = 0;
let username = "";
let speed = false;
let timeLeft = 3;
let timer = null;

let xp = parseInt(localStorage.getItem("copemXP")||0);
let level = Math.floor(xp/50)+1;

// -------------------------
// UTILS
// -------------------------
function rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function shuffle(a){ return a.sort(()=>Math.random()-0.5); }
function vibrate(ms){ if(navigator.vibrate) navigator.vibrate(ms); }

// -------------------------
// BIG MATHS STYLE QUESTION GENERATORS
// -------------------------
// CLIC17-22
function clic17(){let a=rand(30,90),b=rand(11,29),c=rand(5,20),ans=a+b-c,ch=shuffle([ans,ans+5,ans-5,ans+10]);return {question:`${a}+${b}-${c}`,choices:ch,answer:ch.indexOf(ans)}}
function clic18(){let a=rand(4,20),m=[20,25,50][rand(0,2)],ans=a*m,ch=shuffle([ans,ans+10,ans-10,ans+m]);return {question:`${a}×${m}`,choices:ch,answer:ch.indexOf(ans)}}
function clic19(){let a=rand(40,120),ans=a/2,ch=shuffle([ans,ans+5,ans-5,ans*2]);return {question:`Half of ${a}`,choices:ch,answer:ch.indexOf(ans)}}
function clic20(){let a=(rand(10,99)/10).toFixed(1),b=(rand(10,99)/10).toFixed(1),ans=Number((parseFloat(a)+parseFloat(b)).toFixed(1)),ch=shuffle([ans,ans+0.5,ans-0.5,ans+1]);return {question:`${a}+${b}`,choices:ch,answer:ch.indexOf(ans)}}
function clic21(){let a=rand(20,90),b=rand(10,40),ans=a+b,ch=shuffle([ans,ans+5,ans-5,ans+10]);return {question:`Use partitioning: ${a}+${b}`,choices:ch,answer:ch.indexOf(ans)}}
function clic22(){let a=rand(12,39),b=rand(3,9),ans=a*b,ch=shuffle([ans,ans+10,ans-10,ans+b]);return {question:`${a}×${b}`,choices:ch,answer:ch.indexOf(ans)}}

// SAFE14-20
function safe14(){let q=["Right angle turn?","How many degrees in a straight line?"],a=[[90,180,45,60],[180,90,120,160]],r=[0,0],i=rand(0,1);return {question:q[i],choices:a[i],answer:r[i]}}
function safe15(){let l=rand(4,12),w=rand(3,10),ans=Math.random()<0.5?l*w:l*l,ch=shuffle([ans,ans+4,ans-4,ans+8]);return {question:`Area of ${l}×${w}`,choices:ch,answer:ch.indexOf(ans)}}
function safe16(){let a=rand(200,500),b=rand(200,500),ans=Math.max(a,b),ch=shuffle([ans,a,b,ans-50]);return {question:`Which is greater: ${a} or ${b}?`,choices:ch,answer:ch.indexOf(ans)}}
function safe17(){let total=rand(20,60),part=rand(1,3),ans=Math.floor(total*(part/4)),ch=shuffle([ans,ans+2,ans-2,total]);return {question:`What is ${part}/4 of ${total}?`,choices:ch,answer:ch.indexOf(ans)}}
function safe18(){let a=rand(10,40),b=rand(20,60),ans=a+b,ch=shuffle([ans,ans-5,ans+5,ans+10]);return {question:`Bar model: ${a}+${b}`,choices:ch,answer:ch.indexOf(ans)}}
function safe19(){let a=rand(10,40),ans=a+rand(5,10),ch=shuffle([ans,ans-5,ans+5,a]);return {question:`Graph rises from ${a} to?`,choices:ch,answer:ch.indexOf(ans)}}
function safe20(){let a=rand(2,10),ratio=rand(2,5),ans=a*ratio,ch=shuffle([ans,ans+2,ans-2,ratio]);return {question:`${a}:${ratio} — matching value?`,choices:ch,answer:ch.indexOf(ans)}}

// MIX mode
let allFuncs=[clic17,clic18,clic19,clic20,clic21,clic22,safe14,safe15,safe16,safe17,safe18,safe19,safe20];
function mix(){return allFuncs[rand(0,allFuncs.length-1)]()}

// Level mapping
const levelMap={clic17,clic18,clic19,clic20,clic21,clic22,safe14,safe15,safe16,safe17,safe18,safe19,safe20,mix}

// -------------------------
// QUIZ LOGIC
// -------------------------
function generate(level){let fn=levelMap[level],out=[];for(let i=0;i<10;i++)out.push(fn());return out;}

function startTest(){
    username=document.getElementById("username").value;
    let level=document.getElementById("level").value;
    speed=document.getElementById("speedMode").checked;
    if(!username)return alert("Enter your name!");

    questions=generate(level);
    index=0;
    score=0;
    document.getElementById("setup").classList.add("hidden");
    document.getElementById("quiz").classList.remove("hidden");
    updateXPDisplay();
    showQ();
}

function showQ(){
    const q=questions[index];
    const quiz=document.getElementById("quiz");
    quiz.innerHTML=`<div class="progress">Question ${index+1}/10</div><div class="question-text">${q.question}</div>`;

    if(speed){
        timeLeft=3;
        let t=document.createElement("div");
        t.id="timer";
        t.style.fontSize="28px"; t.style.marginBottom="10px"; t.textContent="⏳ "+timeLeft;
        quiz.prepend(t);

        timer=setInterval(()=>{
            timeLeft--; t.textContent="⏳ "+timeLeft;
            if(timeLeft<=0){clearInterval(timer);index++;if(index>=10)finish();else showQ();}
        },1000);
    }

    q.choices.forEach((c,i)=>{
        let btn=document.createElement("button");
        btn.className="answer-btn"; btn.textContent=c; btn.onclick=()=>check(i,btn);
        quiz.appendChild(btn);
    });
}

function check(i,btn){
    clearInterval(timer);
    if(i===questions[index].answer){btn.classList.add("correct");score+=speed?Math.max(1,timeLeft):1;}
    else{btn.classList.add("wrong");vibrate(200);}
    setTimeout(()=>{index++;if(index>=10)finish();else showQ();},350);
}

// -------------------------
// FINISH, CONFETTI, XP
// -------------------------
function finish(){
    confetti({particleCount:200,spread:90,origin:{y:0.6}});
    xp+=score*10; localStorage.setItem("copemXP",xp); level=Math.floor(xp/50)+1; updateXPDisplay();
    saveLocalScore(username,score);
    document.getElementById("quiz").innerHTML=`
        <h2>${username}, Score: ${score} 🎉</h2>
        <button class="start-btn" onclick="location.reload()">Play Again</button>
        <button class="leader-btn" onclick="openLeaderboard()">Leaderboard</button>
        <button class="leader-btn" onclick="printCertificate()">Print Certificate</button>
        <canvas id="scoreChart" width="400" height="200"></canvas>
    `;
    showGraph();
}

// -------------------------
// LOCAL SCOREBOARD
// -------------------------
function saveLocalScore(name,score){
    let data=JSON.parse(localStorage.getItem("copemScores")||"[]");
    data.push({name,score,date:Date.now()});
    localStorage.setItem("copemScores",JSON.stringify(data));
}

// -------------------------
// LEADERBOARD (LOCAL / P2P placeholder)
// -------------------------
function openLeaderboard(){window.location.href="leaderboard.html";}

// -------------------------
// GRAPH OF HISTORY
// -------------------------
function showGraph(){
    let data=JSON.parse(localStorage.getItem("copemScores")||"[]").slice(-10);
    const ctx=document.getElementById("scoreChart");
    new Chart(ctx,{type:'line',data:{
        labels:data.map((d,i)=>i+1),
        datasets:[{label:'Last 10 Scores',data:data.map(d=>d.score),borderColor:'blue',fill:false}]
    },options:{responsive:true,maintainAspectRatio:false}});
}

// -------------------------
// XP DISPLAY
// -------------------------
function updateXPDisplay(){
    document.getElementById("xp-display").textContent=`XP: ${xp} | Level: ${level}`;
}

// -------------------------
// DAILY CHALLENGE
// -------------------------
function dailyChallenge(){
    let today=new Date().toDateString();
    if(localStorage.getItem("dailyChallengeDate")===today){alert("Already completed today's challenge!");return;}
    localStorage.setItem("dailyChallengeDate",today);
    document.getElementById("level").value="mix";
    startTest();
}

// -------------------------
// PRINTABLE CERTIFICATE
// -------------------------
function printCertificate(){
    let certWin=window.open("","Certificate","width=600,height=400");
    certWin.document.write(`<h1>COPEM Certificate</h1><p>Name: ${username}</p><p>Score: ${score}</p><p>XP: ${xp}</p><p>Level: ${level}</p><p>Date: ${new Date().toDateString()}</p>`);
    certWin.print();
}
