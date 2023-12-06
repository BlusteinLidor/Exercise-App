// @TODO add an option to click an exercise and see an explanation of it
// @TODO add an option to choose the amount of exercises per muscle


// Object with exercises categorized by muscle groups
const exercisesByMuscle = {
    legs: ["Squats", "Lunges", "Jumping Jacks", "Bulgarian Split Squats", "Wall Sits",
"Calf Raises", "High Knees", "Burpees"],
    back: ["Bodyweight Rows (TRX)", "Superman Exercise", "Scapular Wall Slides"],
    chest: ["Push-ups", "Isometric Chest Squeeze"],
    arms: ["Spiderman Crawls", "Tricep Dips"],
    abs: ["Plank", "Sit-ups", "Leg Raises", "Russian Twists", "Bicycle Crunches",
"Mountain Climbers", "Reverse Crunches", "Plank with Hip Dips"],
    shoulders: ["Shoulder Press", "Lateral Raises", "Front Raises"]
};

// Function to generate a random exercise for each muscle group
function generateRandomExercises() {
    const exerciseDisplay = document.getElementById("exerciseDisplay");

    for (const muscle in exercisesByMuscle) {
        if (exercisesByMuscle.hasOwnProperty(muscle)) {
            const randomIndex = Math.floor(Math.random() * exercisesByMuscle[muscle].length);
            const randomExercise = exercisesByMuscle[muscle][randomIndex];
            const muscleElement = document.getElementById(muscle);
            muscleElement.textContent = `${muscle.charAt(0).toUpperCase() + muscle.slice(1)}: ${randomExercise}`;
        }
    }
}

// Event listener for button click
const generateExerciseBtn = document.getElementById("generateExerciseBtn");
generateExerciseBtn.addEventListener("click", generateRandomExercises);
