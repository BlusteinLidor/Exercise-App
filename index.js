// List of workout exercises
const exercises = [
    "Push-ups",
    "Squats",
    "Jumping Jacks",
    "Plank",
    "Lunges",
    "Burpees",
    "Mountain Climbers",
    "High Knees",
    "Sit-ups",
    "Dumbbell Rows"
];

// Function to generate a random exercise
function generateRandomExercise() {
    const randomIndex = Math.floor(Math.random() * exercises.length);
    return exercises[randomIndex];
}

// Function to update the exercise display
function updateExerciseDisplay() {
    const exerciseDisplay = document.getElementById("exerciseDisplay");
    const exercise = generateRandomExercise();
    exerciseDisplay.textContent = `Today's Exercise: ${exercise}`;
}

// Event listener for button click
const generateExerciseBtn = document.getElementById("generateExerciseBtn");
generateExerciseBtn.addEventListener("click", updateExerciseDisplay);
