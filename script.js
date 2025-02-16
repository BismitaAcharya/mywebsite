let questions = [];
let scores = [];
let currentQuestionIndex = 0;
let userScore = 0;
let userName = '';
let userClass = '';
let userAnswers = [];
let adminPasscode = '';

// Set Admin Passcode
function setupPasscode(event) {
    event.preventDefault();
    adminPasscode = document.getElementById('adminPasscode').value;
    document.getElementById('setupForm').style.display = 'none';
    document.getElementById('questionForm').style.display = 'block';
    alert('Admin passcode set successfully!');
}

// Admin: Add question
function addQuestion(event) {
    event.preventDefault();
    const questionText = document.getElementById('question').value;
    const option1 = document.getElementById('option1').value;
    const option2 = document.getElementById('option2').value;
    const option3 = document.getElementById('option3').value;
    const correctOption = parseInt(document.getElementById('correctOption').value);

    const question = { questionText, options: [option1, option2, option3], correctOption };
    questions.push(question);
    displayQuestions();

    event.target.reset();
}

function displayQuestions() {
    const questionList = document.getElementById('questionList');
    questionList.innerHTML = '';

    questions.forEach((q, index) => {
        questionList.innerHTML += `
            <div class="questionItem">
                <p><strong>Q${index + 1}:</strong> ${q.questionText}</p>
                <ul>
                    ${q.options.map((opt, i) => `<li>${i + 1}. ${opt}</li>`).join('')}
                </ul>
                <button onclick="deleteQuestion(${index})">Delete</button>
            </div>
        `;
    });
}

function deleteQuestion(index) {
    questions.splice(index, 1);
    displayQuestions();
}

function switchToUserPanel() {
    if (questions.length === 0) {
        alert('Please add at least one question before switching to the User Panel.');
        return;
    }
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('userPanel').style.display = 'block';
}

function startQuiz() {
    const nameInput = document.getElementById('username');
    const classInput = document.getElementById('userClass');
    if (!nameInput.value || !classInput.value) {
        alert('Please enter your name and class.');
        return;
    }
    userName = nameInput.value;
    userClass = classInput.value;
    document.getElementById('userForm').style.display = 'none';
    document.getElementById('quizSection').style.display = 'block';
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        submitQuiz();
        return;
    }
    const question = questions[currentQuestionIndex];
    const quizContent = document.getElementById('quizContent');
    quizContent.innerHTML = `
        <p><strong>Q${currentQuestionIndex + 1}:</strong> ${question.questionText}</p>
        ${question.options
            .map(
                (opt, i) => `
            <label>
                <input type="radio" name="option" value="${i + 1}">
                ${opt}
            </label><br>
        `
            )
            .join('')}
    `;
}

function submitQuiz() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (!selectedOption) {
        alert('Please select an option.');
        return;
    }

    const question = questions[currentQuestionIndex];
    const answer = parseInt(selectedOption.value);
    userAnswers.push({
        question: question.questionText,
        userAnswer: answer,
        correctAnswer: question.correctOption,
    });

    if (answer === question.correctOption) {
        userScore++;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    const scoreSection = document.getElementById('scoreSection');
    scoreSection.style.display = 'block';
    document.getElementById('quizSection').style.display = 'none';

    document.getElementById('displayName').innerText = userName;
    document.getElementById('displayClass').innerText = userClass;
    document.getElementById('score').innerText = `Your score: ${userScore} / ${questions.length}`;

    const answerSummary = document.getElementById('answerSummary');
    answerSummary.innerHTML = userAnswers
        .map(
            (ans, i) =>
                `<p>Q${i + 1}: ${ans.question}<br>Your Answer: ${ans.userAnswer}, Correct Answer: ${ans.correctAnswer}</p>`
        )
        .join('');

    scores.push({
        name: userName,
        class: userClass,
        score: userScore,
    });
}

function restartQuiz() {
    currentQuestionIndex = 0;
    userScore = 0;
    userAnswers = [];

    document.getElementById('scoreSection').style.display = 'none';
    document.getElementById('userForm').style.display = 'block';
}

function downloadScores() {
    const csvContent = 'data:text/csv;charset=utf-8,' + scores.map(s => `${s.name},${s.class},${s.score}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'scores.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function promptAdminAccess() {
    const passcode = prompt('Enter Admin Passcode:');
    if (passcode === adminPasscode) {
        document.getElementById('userPanel').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
    } else {
        alert('Incorrect Passcode!');
    }
}
