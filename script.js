let questions = [];
let index = 0;
let score = 0;
let username = "";

// Utility to avoid duplicates
function uniqueChoices(correct, count = 4) {
    let set = new Set([correct]);

    while (set.size < count) {
        let offset = Math.floor(Math.random() * 20) - 10;
        let wrong = correct + offset;
        if (wrong !== correct) set.add(wrong);
    }

    // convert Set → shuffled array
    return Array.from(set).sort(() => Math.random() - 0.5);
}

// Better random
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// ------------------------ Question Generators ------------------------

function genAddSub() {
    let a = rand(5, 99);
    let b = rand(5, 99);
    let op = Math.random() < 0.5 ? "+" : "-";
    let ans = op === "+" ? a + b : a - b;

    let choices = uniqueChoices(ans);

    return {
        question: `${a} ${op} ${b}`,
        choices,
        answer: choices.indexOf(ans)
    };
}

function genMulDiv() {
    let a = rand(2, 12);
    let b = rand(2, 12);

    let op = Math.random() < 0.5 ? "×" : "÷";
    let ans = (op === "×") ? a * b : b; // ensures exact divisions

    let choices = uniqueChoices(ans);

    return {
        question: `${a} ${op} ${b}`,
        choices,
        answer: choices.indexOf(ans)
    };
}

function genTwoStep() {
    let x = rand(5, 50);
    let y = rand(5, 50);
    let z = rand(5, 30);
    let ans = x + y - z;

    let choices = uniqueChoices(ans);

    return {
        question: `${x} + ${y} - ${z}`,
        choices,
        answer: choices.indexOf(ans)
    };
}

function genFraction() {
    let a = rand(1, 9);
    let b = rand(2, 12);
    let ans = Number((a / b).toFixed(2));

    let wrongs = new Set();
    while (wrongs.size < 3) {
        let offset = (Math.random() * 0.6 - 0.3);
        let wrong = Number((ans + offset).toFixed(2));
        if (wrong !== ans) wrongs.add(wrong);
    }

    let choices = [ans, ...wrongs].sort(() => Math.random() - 0.5);

    return {
        question: `${a}/${b} as a decimal`,
        choices,
        answer: choices.indexOf(ans)
    };
}

function genAlgebra() {
    let x = rand(1, 10);
    let b = rand(1, 15);
    let ans = 2 * x + b;

    let choices = uniqueChoices(ans);

    return {
        question: `2x + ${b}, when x = ${x}`,
        choices,
        answer: choices.indexOf(ans)
    };
}

function genMixed() {
    let generators = [genAddSub, genMulDiv, genTwoStep, genFraction, genAlgebra];
    return generators[rand(0, generators.length - 1)]();
}

// ------------------------ Question Set ------------------------

function generateQuestions(level) {
    let out = [];
    for (let i = 0; i < 10; i++) {
        if (level == 1) out.push(genAddSub());
        else if (level == 2) out.push(genMulDiv());
        else if (level == 3) out.push(genMixed());
        else if (level == 4) out.push(genTwoStep());
        else if (level == 5) out.push(genFraction());
        else if (level == 6) out.push(genAlgebra());
    }
    return out;
}

// ------------------------ Quiz Flow ------------------------

function startTest() {
    username = document.getElementById("username").value;
    let level = Number(document.getElementById("level").value);

    if (!username) return alert("Enter your name!");

    questions = generateQuestions(level);
    index = 0;
    score = 0;

    document.getElementById("setup").classList.add("hidden");
    document.getElementById("quiz").classList.remove("hidden");

    showQuestion();
}

function showQuestion() {
    const q = questions[index];
    const quiz = document.getElementById("quiz");

    quiz.innerHTML = `
        <div class="progress">Question ${index + 1} of 10</div>
        <div class="question-text">${q.question}</div>
    `;

    q.choices.forEach((c, i) => {
        const btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.textContent = c;
        btn.onclick = () => checkAnswer(i);
        quiz.appendChild(btn);
    });
}

function checkAnswer(i) {
    if (i === questions[index].answer) score++;
    index++;

    if (index >= 10) return finish();
    showQuestion();
}

function finish() {
    document.getElementById("quiz").innerHTML = `
        <h2>${username}, your score is ${score}/10</h2>
        <button class="start-btn" onclick="location.reload()">Restart</button>
    `;
}
