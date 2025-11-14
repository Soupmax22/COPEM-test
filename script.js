let selected = [];
let index = 0;
let score = 0;
let username = "";

// ----------- START TEST -----------
function startTest() {
    username = document.getElementById("username").value;
    let level = Number(document.getElementById("level").value);

    if (!username) return alert("Please enter your name!");

    selected = generateQuestions(level);
    index = 0;
    score = 0;

    document.getElementById("setup").classList.add("hidden");
    document.getElementById("quiz").classList.remove("hidden");

    showQuestion();
}

// ----------- MAIN GENERATOR -----------
function generateQuestions(level) {
    let list = [];
    for (let i = 0; i < 10; i++) {
        list.push(
            level === 1 ? genAddSub() :
            level === 2 ? genMulDiv() :
            level === 3 ? genMixed() :
            level === 4 ? genTwoStep() :
            level === 5 ? genFraction() :
            level === 6 ? genAlgebra() :
            genAddSub()
        );
    }
    return list;
}

// ----------- QUESTION TYPES -----------

function genAddSub() {
    let a = rand(1, 50);
    let b = rand(1, 50);
    let op = Math.random() < 0.5 ? "+" : "-";
    let ans = op === "+" ? a + b : a - b;

    let choices = shuffle([
        ans,
        ans + rand(-3, 3),
        ans + rand(-5, 5),
        ans + rand(2, 4)
    ]);

    return {
        question: `What is ${a} ${op} ${b}?`,
        choices: choices,
        answer: choices.indexOf(ans)
    };
}

function genMulDiv() {
    let a = rand(2, 12);
    let b = rand(2, 12);
    let op = Math.random() < 0.5 ? "×" : "÷";
    let ans = op === "×" ? a * b : Math.floor((a * b) / a);

    if (op === "÷") {
        ans = b;
    }

    let choices = shuffle([
        ans,
        ans + rand(-5, 5),
        ans + rand(-3, 3),
        ans + rand(1, 10)
    ]);

    return {
        question: `What is ${a} ${op} ${b}?`,
        choices: choices,
        answer: choices.indexOf(ans)
    };
}

function genMixed() {
    let type = rand(1, 4);
    return [
        genAddSub,
        genMulDiv,
        genTwoStep,
        genFraction
    ][type - 1]();
}

function genTwoStep() {
    let x = rand(1, 20);
    let y = rand(1, 20);
    let z = rand(1, 20);

    let ans = x + y - z;
    let choices = shuffle([ans, ans + 1, ans - 1, ans + 3]);

    return {
        question: `What is ${x} + ${y} - ${z}?`,
        choices,
        answer: choices.indexOf(ans)
    };
}

function genFraction() {
    let a = rand(1, 9);
    let b = rand(2, 10);
    let ans = (a / b).toFixed(2);

    let choices = shuffle([
        ans,
        (ans * 1 + rand(-0.2, 0.2)).toFixed(2),
        (ans * 1 + rand(-0.3, 0.3)).toFixed(2),
        (ans * 1 + rand(-0.1, 0.4)).toFixed(2)
    ]);

    return {
        question: `What is ${a}/${b} as a decimal?`,
        choices,
        answer: choices.indexOf(ans)
    };
}

function genAlgebra() {
    let x = rand(1, 10);
    let b = rand(1, 10);
    let ans = x * 2 + b;

    let choices = shuffle([ans, ans + 2, ans - 2, ans + 4]);

    return {
        question: `If 2x + ${b} = ?, when x = ${x}`,
        choices,
        answer: choices.indexOf(ans)
    };
}

// ----------- QUIZ UI -----------

function showQuestion() {
    const q = selected[index];
    const quiz = document.getElementById("quiz");

    quiz.innerHTML = `
        <div class="progress">Question ${index + 1} of ${selected.length}</div>
        <div class="question-text">${q.question}</div>
    `;

    q.choices.forEach((c, i) => {
        let btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.textContent = c;
        btn.onclick = () => checkAnswer(i);
        quiz.appendChild(btn);
    });
}

function checkAnswer(i) {
    if (i === selected[index].answer) score++;
    index++;
    if (index >= selected.length) finish();
    else showQuestion();
}

function finish() {
    const quiz = document.getElementById("quiz");

    quiz.innerHTML = `
        <h2>${username}, your score is ${score}/10</h2>
        <button class="start-btn" onclick="location.reload()">Restart</button>
    `;
}

// ----------- UTILITIES -----------
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}
