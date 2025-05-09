// Audio setup
const sounds = {
    click: new Audio('audio/start.wav'),
    start: new Audio('audio/start.wav'),
    pause: new Audio('audio/pause.wav'),
    complete: new Audio('audio/alarm.mp3')
};

// Set custom volumes
sounds.click.volume = 0.5;
sounds.start.volume = 0.6;
sounds.pause.volume = 0.5;
sounds.complete.volume = 1.0;

// DOM Elements
const timerElement = document.getElementById('timer');
const progressBar = document.getElementById('progress-bar');
const startButton = document.getElementById('start-btn');
const resetButton = document.getElementById('reset-btn');
const reverseTab = document.getElementById('reverse-tab');
const breakTab = document.getElementById('break-tab');
const toast = document.getElementById('toast');

// Add task elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Timer variables
const MAX_TIME = 3600; // 1 hour in seconds
let currentSeconds = 0;
let initialSeconds = MAX_TIME;
let isRunning = false;
let timerInterval = null;
let currentMode = 'reverse';
let earnedBreakTime = 0;
let hasUnsavedTasks = false;
let hasUnfinishedTasks = false;
let tasks = [];

// Calculate break time based on work duration
function calculateBreakTime(workedSeconds) {
    const minutes = Math.floor(workedSeconds / 60);
    
    if (minutes <= 15) return 5;
    if (minutes <= 30) return 10;
    if (minutes <= 45) return 15;
    return 30;
}

// Update timer display
function updateDisplay() {
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = currentSeconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerElement.textContent = timeString;
    
    // Update progress bar based on mode
    const progress = currentMode === 'break' 
        ? ((initialSeconds - currentSeconds) / initialSeconds) * 100
        : (currentSeconds / MAX_TIME) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Update document title with status
    const modeText = currentMode === 'break' ? 'Break' : 'Reverse';
    const statusText = isRunning ? timeString : 'Paused';
    document.title = `${statusText} - FocusKaya ${modeText}`;
}

// Toggle timer
function toggleTimer() {
    if (!isRunning) {
        if (currentMode === 'break') {
            if (currentSeconds <= 0) {
                showToast("Break time is over!");
                return;
            }
        } else if (currentSeconds >= MAX_TIME) {
            showToast("You've reached the maximum time!");
            return;
        }
        
        sounds.start.play().catch(err => console.log('Audio disabled'));
        showToast(currentMode === 'break' ? "Enjoy your break! 😌" : "Time to focus! 💪");
        
        isRunning = true;
        startButton.textContent = 'STOP';
        
        timerInterval = setInterval(() => {
            if (currentMode === 'break') {
                if (currentSeconds > 0) {
                    currentSeconds--;
                    updateDisplay();
                } else {
                    completeBreak();
                }
            } else {
                if (currentSeconds < MAX_TIME) {
                    currentSeconds++;
                    updateDisplay();
                } else {
                    completeSession();
                }
            }
        }, 1000);
    } else {
        sounds.pause.currentTime = 0;
        sounds.pause.play().catch(err => console.log('Audio disabled'));
        
        clearInterval(timerInterval);
        isRunning = false;
        startButton.textContent = 'START';
        
        if (currentMode === 'reverse' && confirm('Do you want to end this session and take your break?')) {
            completeSession(false); // Pass false to indicate manual completion
        }
    }
}

// Complete session
function completeSession(playSound = true) {
    clearInterval(timerInterval);
    isRunning = false;
    
    // Only play completion sound if the timer reached max time or playSound is true
    if (currentSeconds >= MAX_TIME || playSound) {
        sounds.complete.currentTime = 0;
        sounds.complete.play().catch(err => console.log('Audio disabled'));
    }
    
    // Calculate earned break
    earnedBreakTime = calculateBreakTime(currentSeconds);
    
    const workMinutes = Math.floor(currentSeconds / 60);
    showToast(`Great work! You worked for ${workMinutes} minutes and earned a ${earnedBreakTime}-minute break! 🎉`);
    
    startButton.textContent = 'START';
    switchMode('break');
}

// Complete break
function completeBreak() {
    clearInterval(timerInterval);
    isRunning = false;
    
    // Play completion sound when break is done
    sounds.complete.currentTime = 0;
    sounds.complete.play().catch(err => console.log('Audio disabled'));
    
    showToast("Break time is over! Ready to work again? 💪");
    startButton.textContent = 'START';
    switchMode('reverse');
}

// Reset timer
function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    currentSeconds = 0;
    initialSeconds = MAX_TIME;
    updateDisplay();
    startButton.textContent = 'START';
}

// Switch between reverse and break modes with validation
function switchMode(mode) {
    if (isRunning) {
        const confirmed = confirm('Timer is still running. Are you sure you want to switch modes? This will reset your current progress.');
        if (!confirmed) return;
    }

    if (taskList.children.length > 0) {
        const confirmed = confirm('Switching modes will delete all your tasks. Do you want to continue?');
        if (!confirmed) return;
    }

    // Clear all tasks if user confirms
    taskList.innerHTML = '';
    hasUnfinishedTasks = false;
    hasUnsavedTasks = false;

    currentMode = mode;
    reverseTab.classList.toggle('active', mode === 'reverse');
    breakTab.classList.toggle('active', mode === 'break');
    
    // Reset timer state
    clearInterval(timerInterval);
    isRunning = false;
    startButton.textContent = 'START';
    
    if (mode === 'break') {
        currentSeconds = earnedBreakTime * 60;
        initialSeconds = currentSeconds;
    } else {
        currentSeconds = 0;
        initialSeconds = MAX_TIME;
    }
    
    updateDisplay();
}

// Show toast notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Create task element
function createTaskElement(text, completed = false) {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    if (completed) taskItem.classList.add('task-completed');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = completed;
    checkbox.addEventListener('change', () => {
        taskItem.classList.toggle('task-completed', checkbox.checked);
        updateUnfinishedTasks();
    });

    const textElement = document.createElement('span');
    textElement.className = 'task-text';
    textElement.textContent = text;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-delete';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this task?')) {
            taskList.removeChild(taskItem);
            updateUnfinishedTasks();
        }
    });

    taskItem.appendChild(checkbox);
    taskItem.appendChild(textElement);
    taskItem.appendChild(deleteBtn);

    taskList.appendChild(taskItem);
}

// Add task function
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        if (!confirm('Add this task to your list?')) {
            return;
        }

        // Check for unfinished tasks
        const unfinishedTasks = Array.from(taskList.children).filter(task => 
            !task.querySelector('.task-checkbox').checked
        );

        if (unfinishedTasks.length > 0) {
            if (!confirm('You have unfinished tasks. Add another one anyway?')) {
                return;
            }
        }

        createTaskElement(taskText);

        // Clear input
        taskInput.value = '';
        hasUnsavedTasks = false;
    }
}

// Add function to update unfinished tasks status
function updateUnfinishedTasks() {
    const unfinishedTasks = Array.from(taskList.children).filter(task => 
        !task.querySelector('.task-checkbox').checked
    );
    hasUnfinishedTasks = unfinishedTasks.length > 0;
}

// Event listeners
startButton.addEventListener('click', toggleTimer);
resetButton.addEventListener('click', resetTimer);
reverseTab.addEventListener('click', () => switchMode('reverse'));
breakTab.addEventListener('click', () => switchMode('break'));

// Add task event listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
taskInput.addEventListener('input', () => {
    hasUnsavedTasks = taskInput.value.trim().length > 0;
});

// Add click sounds to buttons
document.querySelectorAll('.time-btn, .secondary-btn, .tab').forEach(button => {
    button.addEventListener('click', () => {
        const clone = sounds.click.cloneNode();
        clone.volume = sounds.click.volume;
        clone.play().catch(err => console.log('Audio disabled'));
    });
});

// Add link handler for mode switching
document.querySelector('.switch-btn').addEventListener('click', (e) => {
    const hasTasks = taskList.children.length > 0;
    if (hasTasks) {
        const confirmed = confirm('Switching modes will delete all your tasks. Do you want to continue?');
        if (!confirmed) {
            e.preventDefault();
        }
    }
});

// Handle page leave/refresh
window.addEventListener('beforeunload', (e) => {
    if (isRunning || hasUnsavedTasks || hasUnfinishedTasks) {
        e.preventDefault();
        let message = '';
        if (isRunning) message = 'Timer is still running.';
        if (hasUnsavedTasks) message = 'You have unsaved tasks.';
        if (hasUnfinishedTasks) message = 'You have unfinished tasks.';
        e.returnValue = `${message} Are you sure you want to leave?`;
        return e.returnValue;
    }
});

// Initialize display
updateDisplay();
