let questions = [];
let index = 0;
let score = 0;
let username = "";
let speed = false;
let timeLeft = 3;
let timer = null;

function rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function shuffle(a){ return a.sort(()=>Math.random()-0.5); }

// -------------------------
//   CLIC LEVELS 17 → 22
// -------------------------

function clic17() {
    let a = rand(30,90);
    let b = rand(11,29);
    let c = rand(5,20);
    let ans = a + b - c;
    let choices = shuffle([ans, ans+5, ans-5, ans+10]);
    return { question:`${a} + ${b} - ${c}`, choices, answer:choices.indexOf(ans) };
}

function clic18() {
    let a = rand(4,20);
    let multipliers = [20,25,50];
    let m = multipliers[rand(0,2)];
    let ans = a * m;
    let choices = shuffle([ans, ans+10, ans-10, ans+m]);
    return { question:`${a} × ${m}`, choices, answer:choices.indexOf(ans) };
}

function clic19() {
    let a = rand(40,120);
    let ans = a / 2;
    let choices = shuffle([ans, ans+5, ans-5, ans*2]);
    return { question:`Half of ${a}`, choices, answer:choices.indexOf(ans) };
}

function clic20() {
    let a = (rand(10,99) / 10).toFixed(1);
    let b = (rand(10,99) / 10).toFixed(1);
    let ans = Number((parseFloat(a)+parseFloat(b)).toFixed(1));
    let choices = shuffle([ans, ans+0.5, ans-0.5, ans+1]);
    return { question:`${a} + ${b}`, choices, answer:choices.indexOf(ans) };
}

function clic21() {
    let a = rand(20,90);
    let b = rand(10,40);
    let ans = a + b;
    let choices = shuffle([ans, ans+5, ans-5, ans+10]);
    return { question:`Use partitioning: ${a} + ${b}`, choices, answer:choices.indexOf(ans) };
}

function clic22() {
    let a = rand(12,39);
    let b = rand(3,9);
    let ans = a * b;
    let choices = shuffle([ans, ans+10, ans-10, ans+b]);
    return { question:`${a} × ${b}`, choices, answer:choices.indexOf(ans) };
}


// -------------------------
//     SAFE 14 → 20
// -------------------------

function safe14() {
    const q = ["Right angle turn?", "How many degrees in a straight line?"];
    const a = [[90,180,45,60],[180,90,120,160]];
    const right = [0,0];
    let i = rand(0,1);
    return { question:q[i], choices:a[i], answer:right[i] };
}

function safe15() {
    let l = rand(4,12);
    let w = rand(3,10);
    let ans = l*l; // area of square OR rectangle?
    if(Math.random()<0.5) ans = l*w;
    let choices = shuffle([ans, ans+4, ans-4, ans+8]);
    return { question:`Area of shape with sides ${l}×${w}`, choices, answer:choices.indexOf(ans) };
}

function safe16() {
    let a = rand(200,500);
    let b = rand(200,500);
    let ans = Math.max(a,b);
    let choices = shuffle([ans, a, b, ans-50]);
    return { question:`Which is greater: ${a} or ${b}?`, choices, answer:choices.indexOf(ans) };
}

function safe17() {
    let total = rand(20,60);
    let part = rand(1,3);
    let ans = Math.floor(total * (part/4));
    let choices = shuffle([ans, ans+2, ans-2, total]);
    return { question:`What is ${part}/4 of ${total}?`, choices, answer:choices.indexOf(ans) };
}

function safe18() {
    let a = rand(10,40);
    let b = rand(20,60);
    let ans = a + b;
    let choices = shuffle([ans, ans-5, ans+5, ans+10]);
    return { question:`Bar model: ${a} + ${b}`, choices, answer:choices.indexOf(ans) };
}

function safe19() {
    let a = rand(10,40);
    let ans = a + rand(5,10);
    let choices = shuffle([ans, ans-5, ans+5, a]);
    return { question:`Graph rises from ${a} to?`, choices, answer:choices.indexOf(ans) };
}

function safe20() {
    let a = rand(2,10);
    let ratio = rand(2,5);
    let ans = a * ratio;
    let choices = shuffle([ans, ans+2, ans-2, ratio]);
    return { question:`${a}:${ratio} — find the matching value`, choices, answer:choices.indexOf(ans) };
}


// -------------------------
//     MIXED MODE (Big Maths style)
// -------------------------
let allFuncs = [clic17,clic18,clic19,clic20,clic21,clic22,safe14,safe15,safe16,safe17,safe18,safe19,safe20];

function mix() {
    return allFuncs[rand(0, allFuncs.length-1)]();
}


// -------------------------
//     QUESTION SELECTOR
// -------------------------
const levelMap = {
    clic17, clic18, clic19, clic20, clic21, clic22,
    safe14, safe15, safe16, safe17, safe18, safe19, safe20,
    mix
};

function generate(level) {
    let fn = levelMap[level];
    let out = [];
    for (let i = 0; i < 10; i++) out.push(fn());
    return out;
}


// -------------------------
//     QUIZ + SPEED MODE
// -------------------------
function startTest() {
    username = document.getElementById("username").value;
    let level = document.getElementById("level").value;
    speed = document.getElementById("speedMode").checked;

    if (!username) return alert("Enter your name!");

    questions = generate(level);
    index = 0;
    score = 0;

    document.getElementById("setup").classList.add("hidden");
    document.getElementById("quiz").classList.remove("hidden");

    showQ();
}

function showQ() {
    const q = questions[index];
    const quiz = document.getElementById("quiz");

    quiz.innerHTML = `
        <div class="progress">Question ${index+1}/10</div>
        <div class="question-text">${q.question}</div>
    `;

    if (speed) {
        timeLeft = 3;
        let t = document.createElement("div");
        t.id = "timer";
        t.style.fontSize = "28px";
        t.style.marginBottom = "10px";
        t.textContent = "⏳ " + timeLeft;
        quiz.prepend(t);

        timer = setInterval(() => {
            timeLeft--;
            t.textContent = "⏳ " + timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                index++;
                if (index>=10) finish();
                else showQ();
            }
        }, 1000);
    }

    q.choices.forEach((c, i) => {
        let btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.textContent = c;
        btn.onclick = () => check(i, btn);
        quiz.appendChild(btn);
    });
}

function check(i, btn) {
    clearInterval(timer);

    if (i === questions[index].answer) {
        btn.classList.add("correct");
        score += speed ? Math.max(1, timeLeft) : 1;
    } else {
        btn.classList.add("wrong");
    }

    setTimeout(() => {
        index++;
        if (index>=10) finish();
        else showQ();
    }, 350);
}

function finish() {
    confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 }
    });

    saveLocalScore(username, score);

    document.getElementById("quiz").innerHTML = `
        <h2>${username}, you scored ${score} 🎉</h2>
        <button class="start-btn" onclick="location.reload()">Play Again</button>
        <button class="leader-btn" onclick="openLeaderboard()">Leaderboard</button>
    `;
}


// -------------------------
//   LOCAL SCOREBOARD
// -------------------------
function saveLocalScore(name, score) {
    let data = JSON.parse(localStorage.getItem("copemScores") || "[]");
    data.push({ name, score, date: Date.now() });
    localStorage.setItem("copemScores", JSON.stringify(data));
}

function openLeaderboard() {
    window.location.href = "leaderboard.html";
}
