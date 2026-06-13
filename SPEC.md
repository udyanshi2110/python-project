# Quiz Application Specification

## 1. Project Overview
- **Project Name**: Purple Quiz Application
- **Type**: Interactive Web Application
- **Core Functionality**: A quiz application where users can answer multiple-choice questions, get immediate feedback, and see their final score
- **Target Users**: Students, learners, or anyone wanting to test their knowledge

## 2. Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Python with Flask framework
- **Server**: Flask development server

## 3. UI/UX Specification

### Layout Structure
- **Header**: App title with quiz icon
- **Main Content Area**: 
  - Start screen with "Start Quiz" button
  - Quiz container with question, options, and navigation
  - Results screen with score and restart option
- **Footer**: Copyright info

### Visual Design
- **Color Palette**:
  - Primary: #6B21A8 (Deep Purple)
  - Secondary: #9333EA (Medium Purple)
  - Accent: #A855F7 (Light Purple)
  - Background: #1E1B4B (Dark Navy/Purple)
  - Card Background: #2E1065 (Purple-tinted dark)
  - Text Primary: #FFFFFF (White)
  - Text Secondary: #E9D5FF (Light Purple)
  - Success: #22C55E (Green)
  - Error: #EF4444 (Red)
  
- **Typography**:
  - Headings: 'Poppins', sans-serif
  - Body: 'Open Sans', sans-serif
  - Font sizes: H1: 2.5rem, H2: 1.75rem, Body: 1rem
  
- **Spacing System**:
  - Container padding: 2rem
  - Card padding: 1.5rem
  - Element margins: 1rem
  - Border radius: 12px (cards), 8px (buttons)
  
- **Visual Effects**:
  - Box shadows with purple glow: 0 4px 20px rgba(147, 51, 234, 0.3)
  - Smooth transitions: 0.3s ease
  - Hover effects on buttons and options
  - Gradient backgrounds
  - Animated progress bar

### Components
1. **Start Screen**
   - App logo/title
   - "Start Quiz" button with hover effect
   
2. **Quiz Container**
   - Question counter (e.g., "Question 1 of 5")
   - Progress bar
   - Question text
   - 4 multiple choice options (buttons)
   - "Next" button
   - Score display

3. **Option Buttons**
   - Default: Dark purple background
   - Hover: Lighter purple with glow
   - Selected: Highlighted border
   - Correct: Green background
   - Incorrect: Red background with shake animation

4. **Results Screen**
   - Final score display (e.g., "4/5")
   - Percentage score
   - Performance message
   - "Restart Quiz" button

## 4. Functionality Specification

### Core Features
1. **Quiz Flow**
   - Start screen → Quiz questions → Results screen
   - 5 sample questions about general knowledge
   - Each question has 4 options with only 1 correct answer
   
2. **Question Navigation**
   - One question at a time
   - Cannot proceed without selecting an answer
   - Immediate feedback after selecting answer (correct/incorrect)
   - Auto-advance to next question after 1.5 seconds
   
3. **Scoring System**
   - +1 point for each correct answer
   - No negative marking for wrong answers
   - Final score displayed at end
   
4. **Data Handling**
   - Questions stored in Flask backend (Python list)
   - Answers submitted to backend for validation
   - Score tracked in session

### API Endpoints
- `GET /api/questions` - Returns list of quiz questions
- `POST /api/submit` - Submit answer, returns correctness
- `GET /api/score` - Get current score
- `POST /api/reset` - Reset quiz for new attempt

### User Interactions
- Click "Start Quiz" to begin
- Click option to select answer
- Visual feedback immediately shown
- Auto-advance to next question
- Click "Restart" to try again

### Edge Cases
- No answer selected → "Next" button disabled
- Network error → Show error message
- Refresh page → Quiz restarts

## 5. File Structure
```
quiz application/
├── app.py              # Flask backend
├── templates/
│   └── index.html      # Main HTML file
├── static/
│   ├── style.css       # Stylesheet
│   └── script.js       # JavaScript logic
└── SPEC.md             # This specification
```

## 6. Acceptance Criteria
- [ ] Purple color theme is consistently applied
- [ ] Quiz starts with start screen
- [ ] Questions display one at a time with 4 options
- [ ] Selecting an answer shows immediate feedback (green/red)
- [ ] Correct/incorrect visual distinction works
- [ ] Progress bar updates with each question
- [ ] Score is calculated correctly
- [ ] Results screen shows final score
- [ ] "Restart" button resets the quiz
- [ ] Responsive design works on mobile and desktop
- [ ] All animations are smooth
- [ ] No console errors
