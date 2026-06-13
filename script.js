/**
 * Purple Quiz Application - JavaScript
 * Handles all client-side interactivity
 */

// Quiz state
const quizState = {
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    selectedOption: null,
    answered: false,
    totalQuestions: 0
};

// DOM Elements
const screens = {
    start: document.getElementById('startScreen'),
    quiz: document.getElementById('quizScreen'),
    results: document.getElementById('resultsScreen')
};

const elements = {
    startBtn: document.getElementById('startBtn'),
    nextBtn: document.getElementById('nextBtn'),
    restartBtn: document.getElementById('restartBtn'),
    questionText: document.getElementById('questionText'),
    optionsContainer: document.getElementById('optionsContainer'),
    currentQuestion: document.getElementById('currentQuestion'),
    totalQuestions: document.getElementById('totalQuestions'),
    progressBar: document.getElementById('progressBar'),
    feedbackSection: document.getElementById('feedbackSection'),
    feedbackMessage: document.getElementById('feedbackMessage'),
    headerScore: document.querySelector('.score-value'),
    finalScore: document.getElementById('finalScore'),
    percentageText: document.getElementById('percentageText'),
    performanceMessage: document.getElementById('performanceMessage'),
    resultsIcon: document.getElementById('resultsIcon'),
    scoreRing: document.getElementById('scoreRing')
};

// Initialize the quiz
async function initQuiz() {
    try {
        const response = await fetch('/api/questions');
        const data = await response.json();
        
        quizState.questions = data.questions;
        quizState.totalQuestions = data.total;
        quizState.currentQuestionIndex = 0;
        quizState.score = 0;
        
        elements.totalQuestions.textContent = quizState.totalQuestions;
        
        setupEventListeners();
        showScreen('start');
    } catch (error) {
        console.error('Error initializing quiz:', error);
        alert('Failed to load questions. Please refresh the page.');
    }
}

// Setup event listeners
function setupEventListeners() {
    elements.startBtn.addEventListener('click', startQuiz);
    elements.nextBtn.addEventListener('click', nextQuestion);
    elements.restartBtn.addEventListener('click', restartQuiz);
    
    // Option button clicks
    elements.optionsContainer.addEventListener('click', handleOptionClick);
}

// Show a specific screen
function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.add('hidden');
    });
    screens[screenName].classList.remove('hidden');
}

// Start the quiz
function startQuiz() {
    quizState.currentQuestionIndex = 0;
    quizState.score = 0;
    elements.headerScore.textContent = '0';
    loadQuestion();
    showScreen('quiz');
}

// Load a question
function loadQuestion() {
    const question = quizState.questions[quizState.currentQuestionIndex];
    
    // Reset state
    quizState.selectedOption = null;
    quizState.answered = false;
    elements.nextBtn.disabled = true;
    elements.feedbackSection.classList.add('hidden');
    
    // Update UI
    elements.questionText.textContent = question.question;
    elements.currentQuestion.textContent = quizState.currentQuestionIndex + 1;
    
    // Update progress bar
    const progress = ((quizState.currentQuestionIndex + 1) / quizState.totalQuestions) * 100;
    elements.progressBar.style.width = `${progress}%`;
    
    // Render options
    const optionLetters = ['A', 'B', 'C', 'D'];
    const optionBtns = elements.optionsContainer.querySelectorAll('.option-btn');
    
    optionBtns.forEach((btn, index) => {
        const optionText = btn.querySelector('.option-text');
        const optionLetter = btn.querySelector('.option-letter');
        
        optionLetter.textContent = optionLetters[index];
        optionText.textContent = question.options[index];
        
        // Reset button state
        btn.classList.remove('selected', 'correct', 'incorrect');
        btn.disabled = false;
    });
    
    // Update button text for last question
    if (quizState.currentQuestionIndex === quizState.totalQuestions - 1) {
        elements.nextBtn.innerHTML = 'See Results <span class="btn-icon">🏆</span>';
    } else {
        elements.nextBtn.innerHTML = 'Next Question <span class="btn-icon">→</span>';
    }
}

// Handle option click
async function handleOptionClick(event) {
    const btn = event.target.closest('.option-btn');
    if (!btn || quizState.answered) return;
    
    const selectedIndex = parseInt(btn.dataset.index);
    quizState.selectedOption = selectedIndex;
    
    // Visual selection
    const optionBtns = elements.optionsContainer.querySelectorAll('.option-btn');
    optionBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    
    // Submit answer
    await submitAnswer(selectedIndex);
}

// Submit answer to backend
async function submitAnswer(selectedOption) {
    const question = quizState.questions[quizState.currentQuestionIndex];
    
    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question_id: question.id,
                selected_option: selectedOption
            })
        });
        
        const data = await response.json();
        
        quizState.answered = true;
        quizState.score = data.score;
        
        // Update header score
        elements.headerScore.textContent = quizState.score;
        
        // Show feedback
        showFeedback(data.is_correct, data.correct_option);
        
        // Disable all options
        const optionBtns = elements.optionsContainer.querySelectorAll('.option-btn');
        optionBtns.forEach((btn, index) => {
            btn.disabled = true;
            if (index === data.correct_option) {
                btn.classList.add('correct');
            } else if (index === selectedOption && !data.is_correct) {
                btn.classList.add('incorrect');
            }
        });
        
        // Enable next button
        elements.nextBtn.disabled = false;
        
    } catch (error) {
        console.error('Error submitting answer:', error);
        alert('Failed to submit answer. Please try again.');
    }
}

// Show feedback message
function showFeedback(isCorrect, correctOption) {
    elements.feedbackSection.classList.remove('hidden');
    
    if (isCorrect) {
        elements.feedbackMessage.className = 'feedback-message correct';
        elements.feedbackMessage.innerHTML = '<span class="feedback-icon">✓</span><span class="feedback-text">Correct!</span>';
    } else {
        elements.feedbackMessage.className = 'feedback-message incorrect';
        elements.feedbackMessage.innerHTML = '<span class="feedback-icon">✗</span><span class="feedback-text">Incorrect!</span>';
    }
}

// Go to next question
function nextQuestion() {
    quizState.currentQuestionIndex++;
    
    if (quizState.currentQuestionIndex < quizState.totalQuestions) {
        loadQuestion();
    } else {
        showResults();
    }
}

// Show results screen
function showResults() {
    const percentage = (quizState.score / quizState.totalQuestions) * 100;
    
    // Update result elements
    elements.finalScore.textContent = quizState.score;
    elements.percentageText.textContent = `${percentage}%`;
    
    // Set performance message and icon
    let message, icon;
    if (percentage === 100) {
        message = 'Perfect Score! 🎉';
        icon = '🏆';
    } else if (percentage >= 80) {
        message = 'Excellent Work! 🌟';
        icon = '⭐';
    } else if (percentage >= 60) {
        message = 'Good Job! 👍';
        icon = '👏';
    } else if (percentage >= 40) {
        message = 'Keep Practicing! 💪';
        icon = '📚';
    } else {
        message = 'Don\'t Give Up! 🎯';
        icon = '💜';
    }
    
    elements.performanceMessage.textContent = message;
    elements.resultsIcon.textContent = icon;
    
    // Animate score ring
    animateScoreRing(percentage);
    
    showScreen('results');
}

// Animate the score ring
function animateScoreRing(percentage) {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percentage / 100) * circumference;
    
    // Reset to start position
    elements.scoreRing.style.strokeDashoffset = circumference;
    
    // Animate after a small delay
    setTimeout(() => {
        elements.scoreRing.style.strokeDashoffset = offset;
    }, 100);
}

// Restart the quiz
async function restartQuiz() {
    try {
        await fetch('/api/reset', { method: 'POST' });
        await initQuiz();
    } catch (error) {
        console.error('Error restarting quiz:', error);
        // Start fresh anyway
        quizState.currentQuestionIndex = 0;
        quizState.score = 0;
        quizState.questions = [];
        showScreen('start');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initQuiz);
