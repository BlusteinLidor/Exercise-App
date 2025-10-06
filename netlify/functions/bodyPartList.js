const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async function(event, context) {
    const RAPID_API_KEY = process.env.RAPID_API_KEY;
    const apiUrl = 'https://exercisedb.p.rapidapi.com/exercises/bodyPartList';
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
                'x-rapidapi-key': RAPID_API_KEY
            }
        });
        if (!response.ok) {
            const text = await response.text();
            return {
                statusCode: 500,
                body: JSON.stringify({ error: `ExerciseDB API error: ${response.status}` })
            };
        }
        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (err) {
        console.error('Error fetching body part list:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch body part list' })
        };
    }
};