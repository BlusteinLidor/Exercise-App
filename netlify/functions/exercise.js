const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async function(event, context) {
    const RAPID_API_KEY = process.env.RAPID_API_KEY;
    // Use query param: /api/exercise?name=push-ups
    const name = event.queryStringParameters && event.queryStringParameters.name;
    if (!name) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing name parameter' })
        };
    }
    const cleanName = name.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    const apiUrl = `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(cleanName)}`;
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
            body: JSON.stringify({ error: 'Failed to fetch exercise info' })
        };
    }
};