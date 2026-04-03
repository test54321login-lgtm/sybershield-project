// Quiz module for CyberShield project

var questions = [
    {
        question: "What does 'phishing' refer to?",
        options: [
            "A technique to catch fish",
            "A method of attempting to acquire sensitive information",
            "A type of computer virus",
            "A secure communication protocol"
        ],
        answer: 1
    },
    {
        question: "Which of these is NOT a type of malware?",
        options: [
            "Virus",
            "Trojan",
            "Firewall",
            "Ransomware"
        ],
        answer: 2
    },
    {
        question: "What does 'two-factor authentication' mean?",
        options: [
            "Using two different passwords",
            "Adding an extra layer of security beyond password",
            "Having two accounts",
            "Using two different devices"
        ],
        answer: 1
    },
    {
        question: "What is the primary purpose of a firewall?",
        options: [
            "To prevent physical fires",
            "To block unauthorized access to a network",
            "To encrypt data",
            "To speed up internet connection"
        ],
        answer: 1
    },
    {
        question: "Which is the strongest password?",
        options: [
            "password123",
            "johnson",
            "P@ssw0rd!",
            "MyP@ssw0rd2023!"
        ],
        answer: 3
    },
    {
        question: "What is 'social engineering'?",
        options: [
            "Programming social media apps",
            "Manipulating people to divulge confidential information",
            "Creating social networks",
            "Fixing social problems with technology"
        ],
        answer: 1
    },
    {
        question: "What does 'HTTPS' indicate?",
        options: [
            "HyperText Transfer Protocol Secure",
            "High-speed Text Transfer Protocol",
            "HyperText Transfer Protocol Standard",
            "HyperText Transfer Protocol Simple"
        ],
        answer: 0
    },
    {
        question: "What is a 'botnet'?",
        options: [
            "A network of robots",
            "A network of compromised computers controlled remotely",
            "A type of search engine",
            "A secure messaging app"
        ],
        answer: 1
    },
    {
        question: "What is the purpose of a VPN?",
        options: [
            "To increase internet speed",
            "To create a secure, encrypted connection over the internet",
            "To block ads",
            "To improve gaming performance"
        ],
        answer: 1
    },
    {
        question: "What is 'ransomware'?",
        options: [
            "Software that encrypts files and demands payment for decryption",
            "A type of antivirus software",
            "A secure file storage service",
            "A backup solution"
        ],
        answer: 0
    }
];

var currentQuestionIndex = 0;
var score = 0;
var timer;
var timeLeft = 30;

function initQuiz() {
    document.getElementById('startQuizBtn').addEventListener('click', startQuiz);
    document.getElementById('nextQuestionBtn').addEventListener('click', nextQuestion);
    document.getElementById('retakeQuizBtn').addEventListener('click', retakeQuiz);
    document.getElementById('viewHistoryBtn').addEventListener('click', viewHistory);
    document.getElementById('backToQuizBtn').addEventListener('click', backToQuiz);
    
    if (window.location.pathname.indexOf('quiz.html') !== -1) {
        loadHistory();
    }
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    
    document.getElementById('quizIntro').style.display = 'none';
    document.getElementById('quizArea').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('historySection').style.display = 'none';
    
    displayQuestion();
    startTimer();
}

function displayQuestion() {
    var question = questions[currentQuestionIndex];
    document.getElementById('questionText').textContent = question.question;
    
    var optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    for (var i = 0; i < question.options.length; i++) {
        var optionElement = document.createElement('div');
        optionElement.className = 'option-item';
        optionElement.textContent = question.options[i];
        optionElement.dataset.index = i;
        optionElement.addEventListener('click', (function(index) {
            return function() {
                selectOption(index);
            };
        })(i));
        optionsContainer.appendChild(optionElement);
    }
    
    updateProgress();
}

function selectOption(selectedIndex) {
    var options = document.querySelectorAll('#optionsContainer .option-item');
    var correctIndex = questions[currentQuestionIndex].answer;
    
    for (var i = 0; i < options.length; i++) {
        options[i].style.pointerEvents = 'none';
    }
    
    if (selectedIndex === correctIndex) {
        options[selectedIndex].classList.add('correct');
        score++;
    } else {
        options[selectedIndex].classList.add('incorrect');
        options[correctIndex].classList.add('correct');
    }
    
    setTimeout(function() {
        document.getElementById('nextQuestionBtn').style.display = 'block';
    }, 1000);
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        document.getElementById('nextQuestionBtn').style.display = 'none';
        clearInterval(timer);
        timeLeft = 30;
        document.getElementById('timer').textContent = timeLeft + 's';
        
        displayQuestion();
        startTimer();
    } else {
        finishQuiz();
    }
}

function startTimer() {
    timeLeft = 30;
    document.getElementById('timer').textContent = timeLeft + 's';
    
    timer = setInterval(function() {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft + 's';
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            selectOption(0);
        }
    }, 1000);
}

function finishQuiz() {
    clearInterval(timer);
    
    document.getElementById('quizArea').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    
    document.getElementById('finalScore').textContent = score;
    
    var resultMessage = document.getElementById('resultMessage');
    if (score >= 7) {
        resultMessage.textContent = 'Excellent! You have great cybersecurity knowledge.';
        resultMessage.style.color = '#2ecc71';
    } else if (score >= 5) {
        resultMessage.textContent = 'Good job! You have decent cybersecurity knowledge, but there\'s room for improvement.';
        resultMessage.style.color = '#f39c12';
    } else {
        resultMessage.textContent = 'You need to learn more about cybersecurity. Review the materials and try again.';
        resultMessage.style.color = '#e74c3c';
    }
    
    submitScore(score);
}

function submitScore(score) {
    apiFetch('/api/quiz/submit', {
        method: 'POST',
        body: JSON.stringify({ score: score })
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (!response.ok) {
            console.error('Failed to save score:', data.error);
        } else {
            console.log('Score saved successfully');
        }
    })
    .catch(function(error) {
        console.error('Error submitting score:', error);
    });
}

function updateProgress() {
    var progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById('progressBar').style.width = progressPercent + '%';
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
}

function retakeQuiz() {
    startQuiz();
}

function viewHistory() {
    apiFetch('/api/quiz/history')
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (!response.ok) {
            throw new Error(data.error || 'Failed to load history');
        }
        
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('historySection').style.display = 'block';
        
        renderHistory(data.scores);
    })
    .catch(function(error) {
        showError('Failed to load quiz history: ' + error.message);
        console.error('Error loading history:', error);
    });
}

function renderHistory(scores) {
    var historyList = document.getElementById('historyList');
    
    if (!scores || scores.length === 0) {
        historyList.innerHTML = '<p>No quiz history available.</p>';
        return;
    }
    
    scores.sort(function(a, b) {
        return new Date(b.takenAt) - new Date(a.takenAt);
    });
    
    var historyHtml = '<ul class="history-list">';
    for (var i = 0; i < scores.length; i++) {
        var scoreObj = scores[i];
        var date = new Date(scoreObj.takenAt).toLocaleDateString();
        var time = new Date(scoreObj.takenAt).toLocaleTimeString();
        historyHtml += '<li class="history-item"><strong>' + scoreObj.score + '/10</strong> on ' + date + ' at ' + time + '</li>';
    }
    historyHtml += '</ul>';
    
    historyList.innerHTML = historyHtml;
}

function backToQuiz() {
    document.getElementById('historySection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
}

function loadHistory() {
    apiFetch('/api/quiz/history')
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (!response.ok) {
            throw new Error(data.error || 'Failed to load history');
        }
        
        console.log('Quiz history loaded:', data.scores);
    })
    .catch(function(error) {
        console.error('Error loading history:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initQuiz();
});