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

// Cache for exercise information
const exerciseCache = {};

// Function to fetch exercise information from the API
async function fetchExerciseInfo(exerciseName) {
    if (exerciseCache[exerciseName]) {
        return exerciseCache[exerciseName];
    }

    const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises/name/${exerciseName}`, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
            'X-RapidAPI-Key': '46b569f70dmsh550ea0d5620febbp18d8f0jsnc17ae3b37859'
        }
    });

    if (response.status === 429) {
        console.error('Rate limit exceeded');
        return null;
    }

    if (response.status === 403) {
        console.error('Forbidden: Check your API key and permissions');
        return null;
    }

    const data = await response.json();
    const exerciseInfo = data[0]; // Assuming the API returns an array of exercises
    exerciseCache[exerciseName] = exerciseInfo;
    return exerciseInfo;
}

// Function to initialize tooltips
async function initializeTooltips() {
    const exercises = document.querySelectorAll('.exercise');

    for (const exercise of exercises) {
        const exerciseText = exercise.textContent.split(': ');
        const exerciseName = exerciseText.length > 1 ? exerciseText[1] : null;
        const explanation = exercise.getAttribute('data-explanation');
        let tooltip = exercise.querySelector('.tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.classList.add('tooltip');
            exercise.appendChild(tooltip);
        }

        if (explanation) {
            tooltip.textContent = explanation;
            console.log('explanation', explanation);
        } else if (exerciseName) {
            const exerciseInfo = await fetchExerciseInfo(exerciseName);
            if (exerciseInfo) {
                tooltip.textContent = exerciseInfo.description || 'No description available';
                exercise.setAttribute('data-explanation', exerciseInfo.description || 'No description available');
            } else {
                tooltip.textContent = 'No description available';
            }
        } else {
            tooltip.textContent = 'No description available';
        }

        exercise.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
        });

        exercise.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    }
}

// Function to generate random exercises
function generateRandomExercises() {
    const exerciseDisplay = document.getElementById("exerciseDisplay");
    const setDisplay = document.getElementById("setDisplay");

    for (const muscle in exercisesByMuscle) {
        if (exercisesByMuscle.hasOwnProperty(muscle)) {
            const randomIndex = Math.floor(Math.random() * exercisesByMuscle[muscle].length);
            const randomExercise = exercisesByMuscle[muscle][randomIndex];
            const muscleElement = document.getElementById(muscle);
            if (muscle === "legs2" || muscle === "abs2") {
                muscleElement.textContent = `${muscle.charAt(0).toUpperCase() + muscle.slice(1, -1)}: ${randomExercise}`;
            } else {
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

    // Re-initialize tooltips after updating the mainDisplay
    initializeTooltips();
}

// Event listener for button click
const generateExerciseBtn = document.getElementById("generateExerciseBtn");
generateExerciseBtn.addEventListener("click", generateRandomExercises, initializeTooltips);

// Initialize tooltips on page load
// document.addEventListener('DOMContentLoaded', initializeTooltips);
