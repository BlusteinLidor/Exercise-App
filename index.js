// Object with exercises categorized by muscle groups
const exercisesByMuscle = {
    legs: ["Squats", "Lunges", "Jumping Jacks", ""],
    back: ["Dumbbell Rows", "Pull-ups", "Deadlifts"],
    chest: ["Push-ups", "Bench Press", "Dumbbell Flyes"],
    arms: ["Bicep Curls", "Tricep Dips", "Hammer Curls"],
    abs: ["Plank", "Sit-ups", "Leg Raises"],
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
