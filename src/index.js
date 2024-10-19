const express = require('express');
const mongoose = require('mongoose');
const { fetchWeatherData, getDailySummary } = require('./weatherController');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Fetch weather data every 5 minutes
setInterval(fetchWeatherData, 5 * 60 * 1000); // 5 minutes in milliseconds
fetchWeatherData(); // Initial fetch

// Get daily summaries every day at midnight
setInterval(getDailySummary, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
app.use(express.static('public'));

// Endpoint to get daily summaries
app.get('/summaries', async (req, res) => {
    try {
        const summaries = await getDailySummary();
        res.json(summaries);
    } catch (error) {
        console.error('Error retrieving summaries:', error); // More detailed logging
        res.status(500).json({ error: 'Failed to retrieve summaries', details: error.message });
    }
});



mongoose.connect(`mongodb+srv://omenagarjuna:${process.env.PASSWORD}@cluster0.arzsg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.log(err);
}
)