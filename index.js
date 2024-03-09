// @TODO add an option to click an exercise and see an explanation of it
// @TODO add an option to choose the amount of exercises per muscle


// Object with exercises categorized by muscle groups
const exercisesByMuscle = {
    legs: ["Squats", "Lunges", "Jumping Jacks", "Bulgarian Split Squats", "Wall Sits",
"Calf Raises", "High Knees", "Burpees", "Kness to Chest", "Bird Dogs", "Fire Hydrant", "Y Squats",
"Bob and Weave"],
    back: ["Bodyweight Rows (TRX)", "Superman Exercise", "Back Extensions"],
    chest: ["Push-ups", "Plank to Push-up"],
    arms: ["Spiderman Crawls", "Tricep Dips"],
    abs: ["Plank", "Sit-ups", "Leg Raises", "Russian Twists", "Bicycle Crunches",
"Mountain Climbers", "Reverse Crunches", "Plank with Hip Dips", "Penguins",
"Scissor Kicks", "Side Plank"],
    shoulders: ["Shoulder Press", "Lateral Raises", "Front Raises", "Shoulder Taps", 
],
    legs2: ["Squats", "Lunges", "Jumping Jacks", "Bulgarian Split Squats", "Wall Sits",
"Calf Raises", "High Knees", "Burpees", "Kness to Chest", "Bird Dogs", "Fire Hydrant", "Y Squats",
"Bob and Weave"],
    abs2: ["Plank", "Sit-ups", "Leg Raises", "Russian Twists", "Bicycle Crunches",
"Mountain Climbers", "Reverse Crunches", "Plank with Hip Dips", "Penguins",
"Scissor Kicks", "Side Plank"]
};

const setsByMuscle = {
    legs: ["40"],
    back: ["20"],
    chest: ["20"],
    arms: ["20"],
    abs: ["50"],
    shoulders: ["20"],
    legs2: ["40"],
    abs2: ["50"]
};

// Function to generate a random exercise for each muscle group
function generateRandomExercises() {
    const exerciseDisplay = document.getElementById("exerciseDisplay");
    const setDisplay = document.getElementById("setDisplay");

    for (const muscle in exercisesByMuscle) {
        if (exercisesByMuscle.hasOwnProperty(muscle)) {
            const randomIndex = Math.floor(Math.random() * exercisesByMuscle[muscle].length);
            const randomExercise = exercisesByMuscle[muscle][randomIndex];
            const muscleElement = document.getElementById(muscle);
            if(muscle === "legs2" || muscle === "abs2") {
                muscleElement.textContent = `${muscle.charAt(0).toUpperCase() + muscle.slice(1,-1)}: ${randomExercise}`;
            }
            else{
                muscleElement.textContent = `${muscle.charAt(0).toUpperCase() + muscle.slice(1)}: ${randomExercise}`;
            }
        }
    }

    for (const set in setsByMuscle) {
        if (setsByMuscle.hasOwnProperty(set)) {
            const randomIndex = Math.floor(Math.random() * setsByMuscle[set].length);
            const randomSet = setsByMuscle[set][randomIndex];
            const setElement = document.getElementById(set);
            setElement.textContent += ` ${randomSet}`;
        }
    }
}

// Event listener for button click
const generateExerciseBtn = document.getElementById("generateExerciseBtn");
generateExerciseBtn.addEventListener("click", generateRandomExercises);
