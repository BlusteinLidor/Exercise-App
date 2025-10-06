const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async function(event, context) {
    const RAPID_API_KEY = process.env.RAPID_API_KEY;
    // Netlify Functions get params from event.queryStringParameters or event.path
    // We'll use a query param: /api/bodyPart?muscle=legs
    const muscle = event.queryStringParameters && event.queryStringParameters.muscle;
    if (!muscle) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing muscle parameter' })
        };
    }
    const apiUrl = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${encodeURIComponent(muscle)}`;
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
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch exercises for muscle' })
        };
    }
};