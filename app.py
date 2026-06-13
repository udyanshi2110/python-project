"""
Purple Quiz Application - Flask Backend
"""
from flask import Flask, render_template, jsonify, request, session
import json

app = Flask(__name__)
app.secret_key = 'purple_quiz_secret_key_2024'

# Quiz questions data
QUESTIONS = [
    {
        "id": 1,
        "question": "What is the capital of France?",
        "options": ["London", "Berlin", "Paris", "Madrid"],
        "correct": 2
    },
    {
        "id": 2,
        "question": "Which planet is known as the Red Planet?",
        "options": ["Venus", "Mars", "Jupiter", "Saturn"],
        "correct": 1
    },
    {
        "id": 3,
        "question": "What is the largest mammal in the world?",
        "options": ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
        "correct": 1
    },
    {
        "id": 4,
        "question": "Who painted the Mona Lisa?",
        "options": ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        "correct": 2
    },
    {
        "id": 5,
        "question": "What is the chemical symbol for gold?",
        "options": ["Go", "Gd", "Au", "Ag"],
        "correct": 2
    }
]

@app.route('/')
def index():
    """Render the main quiz page"""
    return render_template('index.html')

@app.route('/api/questions', methods=['GET'])
def get_questions():
    """Return all quiz questions"""
    # Reset score when getting new questions
    session['score'] = 0
    session['current_question'] = 0
    session['answers'] = []
    return jsonify({
        'questions': QUESTIONS,
        'total': len(QUESTIONS)
    })

@app.route('/api/submit', methods=['POST'])
def submit_answer():
    """Submit an answer and get feedback"""
    data = request.json
    question_id = data.get('question_id')
    selected_option = data.get('selected_option')
    
    # Find the question
    question = next((q for q in QUESTIONS if q['id'] == question_id), None)
    
    if not question:
        return jsonify({'error': 'Question not found'}), 404
    
    is_correct = selected_option == question['correct']
    
    if is_correct:
        session['score'] = session.get('score', 0) + 1
    
    # Track answered questions
    if 'answers' not in session:
        session['answers'] = []
    session['answers'].append({
        'question_id': question_id,
        'selected': selected_option,
        'correct': question['correct'],
        'is_correct': is_correct
    })
    
    session['current_question'] = session.get('current_question', 0) + 1
    
    return jsonify({
        'is_correct': is_correct,
        'correct_option': question['correct'],
        'score': session.get('score', 0),
        'total_questions': len(QUESTIONS)
    })

@app.route('/api/score', methods=['GET'])
def get_score():
    """Get current score"""
    return jsonify({
        'score': session.get('score', 0),
        'total': len(QUESTIONS),
        'current_question': session.get('current_question', 0)
    })

@app.route('/api/reset', methods=['POST'])
def reset_quiz():
    """Reset the quiz for a new attempt"""
    session['score'] = 0
    session['current_question'] = 0
    session['answers'] = []
    return jsonify({'status': 'reset'})

import os

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
