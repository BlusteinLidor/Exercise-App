// Cache for body part list
let bodyPartListCache = {};

// Cache for exercises by muscle group
let exercisesByMuscleCache = {};

// Object with exercises categorized by muscle groups
const exercisesByMuscleDict = {
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

const setsByMuscleDict = {
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
        console.log('Fetching from cache:', exerciseName);
        return exerciseCache[exerciseName];
    }

    // Clean up exercise name for API
    const cleanExerciseName = exerciseName.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    const apiUrl = '/.netlify/functions/exercise?name=' + encodeURIComponent(cleanExerciseName);
    
    console.log('Original exercise name:', exerciseName);
    console.log('Cleaned exercise name:', cleanExerciseName);
    console.log('API URL:', apiUrl);

    const response = await fetch(apiUrl);

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (response.status === 429) {
        console.error('Rate limit exceeded');
        return null;
    }

    if (response.status === 403) {
        console.error('Forbidden: Check your API key and permissions');
        return null;
    }

    if (!response.ok) {
        console.error('HTTP error:', response.status, response.statusText);
        return null;
    }

    const data = await response.json();
    console.log('API response data:', data);
    console.log('Data length:', data.length);
    
    if (data && data.length > 0) {
        const exerciseInfo = data[0];
        console.log('Found exercise info:', exerciseInfo);
        exerciseCache[exerciseName] = exerciseInfo;
        return exerciseInfo;
    } else {
        console.log('No exercises found for:', cleanExerciseName);
        exerciseCache[exerciseName] = null; // Cache the fact that we didn't find anything
        return null;
    }
}

// Function to initialize tooltips
async function initializeTooltips() {
    // fix this function to work with async fetchExerciseInfo

    const exercises = document.querySelectorAll('.exercise');

    for (const exercise of exercises) {
        const exerciseText = exercise.textContent.split(': ');
        const exerciseNameAndSets = exerciseText.length > 1 ? exerciseText[1] : null;
        const exerciseName = exerciseNameAndSets.split(' x ')[0]; // Remove set count if present
        console.log('exerciseName', exerciseName);
        const explanation = exercise.getAttribute('data-explanation');
        let tooltip = exercise.querySelector('.tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.classList.add('tooltip');
            exercise.appendChild(tooltip);
        }

        if (explanation) {
            tooltip.textContent = explanation;
        } else if (exerciseName) {
            const exerciseInfo = await fetchExerciseInfo(exerciseName);
            console.log('exerciseInfo', exerciseInfo);
            if (exerciseInfo) {
                const exerciseId = exerciseInfo.id;
                console.log('exerciseId', exerciseId);
                const imageUrl = `/.netlify/functions/image?resolution=180&exerciseId=${exerciseId}`;
                console.log('Image URL:', imageUrl);

                const response = await fetch(imageUrl);

                try {
                    if (response.ok) {
                        const blob = await response.blob();
                        const imageObjectUrl = URL.createObjectURL(blob);
                        const imgElement = document.createElement('img');
                        imgElement.src = imageObjectUrl;
                        imgElement.alt = exerciseName;
                        imgElement.style.maxWidth = '100%';
                        imgElement.style.height = 'auto';
                        tooltip.appendChild(imgElement);
                    }
                } catch (error) {
                    console.error('Error fetching exercise image:', error);
                }
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
async function generateRandomExercises() {
    console.log('Generating random exercises...');
    const exerciseDisplay = document.getElementById("exerciseDisplay");
    const setDisplay = document.getElementById("setDisplay");

    // Clear previous exercises
    exerciseDisplay.innerHTML = '';

    try {
        // Fetch body part list if not cached
        if (Object.keys(bodyPartListCache).length === 0) {
            console.log('Fetching body part list...');
            const bodyPartResponse = await fetch('/.netlify/functions/bodyPartList');
            bodyPartListCache = await bodyPartResponse.json();
            console.log('Fetched body part list:', bodyPartListCache);
        }

        // Fetch exercises for each muscle group if not cached
        if (Object.keys(exercisesByMuscleCache).length === 0) {
            console.log('Fetching exercises by muscle group...');
            const fetchPromises = bodyPartListCache.map(async (muscle) => {
                try {
                    const response = await fetch('/.netlify/functions/bodyPart?muscle=' + encodeURIComponent(muscle));
                    const data = await response.json();
                    const bodyWeightExercises = data.filter(exercise => exercise.equipment === 'body weight');
                    if (bodyWeightExercises.length > 0) {
                        exercisesByMuscleCache[muscle] = bodyWeightExercises;
                        console.log(`Fetched ${bodyWeightExercises.length} exercises for ${muscle}`);
                    }
                } catch (error) {
                    console.error(`Error fetching exercises for ${muscle}:`, error);
                }
            });

            // Wait for all fetch operations to complete
            await Promise.all(fetchPromises);
            console.log('All exercises fetched:', exercisesByMuscleCache);
        }

        // Now generate the display with cached exercises
        for (const muscle in exercisesByMuscleCache) {
            if (exercisesByMuscleCache[muscle] && exercisesByMuscleCache[muscle].length > 0) {
                const randomIndex = Math.floor(Math.random() * exercisesByMuscleCache[muscle].length);
                const randomExercise = exercisesByMuscleCache[muscle][randomIndex];
                
                // Create new div element
                const muscleElement = document.createElement("div");
                muscleElement.classList.add("exercise");
                muscleElement.id = muscle;
                
                // Use the exercise name from the API object
                const exerciseName = randomExercise.name || 'Unknown Exercise';
                muscleElement.textContent = `${muscle.charAt(0).toUpperCase() + muscle.slice(1)}: ${exerciseName}`;
                
                // Add set count
                const setCount = setsByMuscleDict[muscle] ? setsByMuscleDict[muscle][0] : "20";
                muscleElement.textContent += ` x ${setCount}`;
                
                exerciseDisplay.appendChild(muscleElement);
            }
        }

        // Initialize tooltips after all elements are created
        await initializeTooltips();

    } catch (error) {
        console.error('Error in generateRandomExercises:', error);
        // Fallback to your original exercise list if API fails
        for (const muscle in exercisesByMuscleDict) {
            const randomIndex = Math.floor(Math.random() * exercisesByMuscleDict[muscle].length);
            const randomExercise = exercisesByMuscleDict[muscle][randomIndex];
            const muscleElement = document.createElement("div");
            muscleElement.classList.add("exercise");
            muscleElement.id = muscle;
            if (muscle === "legs2" || muscle === "abs2") {
                muscleElement.textContent = `${muscle.charAt(0).toUpperCase() + muscle.slice(1, -1)}: ${randomExercise}`;
            } else {
                muscleElement.textContent = `${muscle.charAt(0).toUpperCase() + muscle.slice(1)}: ${randomExercise}`;
            }
            const setCount = setsByMuscleDict[muscle] ? setsByMuscleDict[muscle][0] : "20";
            muscleElement.textContent += ` x ${setCount}`;
            exerciseDisplay.appendChild(muscleElement);
        }
    }
}

// Event listener for button click
const generateExerciseBtn = document.getElementById("generateExerciseBtn");
generateExerciseBtn.addEventListener("click", generateRandomExercises, initializeTooltips);

// Initialize tooltips on page load
// document.addEventListener('DOMContentLoaded', initializeTooltips);
