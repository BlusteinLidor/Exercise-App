require('dotenv').config();
const express = require('express');
// const fetch = require('node-fetch');
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require('cors');

const app = express();
app.use(cors());

const RAPID_API_KEY = process.env.RAPID_API_KEY;
console.log('RAPID_API_KEY:', RAPID_API_KEY);

// Proxy endpoint for exercise info
app.get('/api/exercise/:name', async (req, res) => {
    const exerciseName = req.params.name;
    const cleanName = exerciseName.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    const apiUrl = `https://exercisedb.p.rapidapi.com/exercises/name/${cleanName}`;
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
                'x-rapidapi-key': RAPID_API_KEY
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch exercise info' });
    }
});

app.get('/api/image', async (req, res) => {
    const { exerciseId, resolution } = req.query;
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
            console.error('ExerciseDB API image error:', response.status, text);
            return res.status(500).json({ error: `ExerciseDB API image error: ${response.status}` });
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.startsWith('image/')) {
            const text = await response.text();
            console.error('Not an image:', contentType, text);
            return res.status(500).json({ error: 'Response is not an image.' });
        }

        const buffer = await response.arrayBuffer();
        res.set('Content-Type', contentType);
        res.send(Buffer.from(buffer));
    } catch (err) {
        console.error('Error fetching image:', err);
        res.status(500).json({ error: 'Failed to fetch image' });
    }
});

app.get('/api/bodyPartList', async (req, res) => {
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
            console.error('ExerciseDB API error:', response.status, text);
            return res.status(500).json({ error: `ExerciseDB API error: ${response.status}` });
        }
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('Error fetching body part list:', err);
        res.status(500).json({ error: 'Failed to fetch body part list' });
    }
});

app.get('/api/bodyPart/:muscle', async (req, res) => {
    const muscle = req.params.muscle;
    const apiUrl = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${muscle}`;
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
                'x-rapidapi-key': RAPID_API_KEY
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch exercises for muscle' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));