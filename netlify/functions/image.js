const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async function(event, context) {
    const RAPID_API_KEY = process.env.RAPID_API_KEY;
    const { exerciseId, resolution } = event.queryStringParameters || {};
    if (!exerciseId || !resolution) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing exerciseId or resolution parameter' })
        };
    }
    const apiUrl = `https://exercisedb.p.rapidapi.com/image?resolution=${resolution}&exerciseId=${exerciseId}`;
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
                body: JSON.stringify({ error: `ExerciseDB API image error: ${response.status}` })
            };
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.startsWith('image/')) {
            const text = await response.text();
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Response is not an image.' })
            };
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        return {
            statusCode: 200,
            headers: {
                'Content-Type': contentType
            },
            body: buffer.toString('base64'),
            isBase64Encoded: true
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch image' })
        };
    }
};