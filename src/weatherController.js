const Weather = require('./weatherModel');
require('dotenv').config();
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

// Utility function to convert Kelvin to Celsius
const kelvinToCelsius = (kelvin) => kelvin - 273.15;

// Fetch weather data for all specified cities
const fetchWeatherData = async () => {
    if (!OPENWEATHER_API_KEY) {
        console.error('API key is missing. Please set OPENWEATHER_API_KEY in your .env file.');
        return;
    }

    try {
        const promises = cities.map(async (city) => {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch data for ${city}: ${response.statusText}`);
            }

            const data = await response.json();
            return {
                city: data.name,
                main: data.weather[0].main,
                temp: kelvinToCelsius(data.main.temp),
                feels_like: kelvinToCelsius(data.main.feels_like),
                dt: new Date(data.dt * 1000) // Convert Unix timestamp to Date
            };
        });

        // Wait for all promises to resolve
        const weatherDataArray = await Promise.all(promises);

        // Save each weather data entry to the database
        for (const weatherData of weatherDataArray) {
            await saveWeatherData(weatherData);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
    }
};

// Save weather data to the database
const saveWeatherData = async (weatherData) => {
    try {
        const newWeather = new Weather(weatherData);
        await newWeather.save();
        console.log(`Weather data saved for ${weatherData.city}`);
    } catch (error) {
        console.error('Error saving weather data:', error.message);
    }
};

// Get daily summary aggregates
const getDailySummary = async () => {
    try {
        const dailyConditions = await Weather.aggregate([
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        main: "$main"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.date",
                    dominantCondition: { $first: "$_id.main" }, // Just get the first for simplicity
                    count: { $sum: "$count" }
                }
            },
            {
                $project: {
                    date: "$_id",
                    dominantCondition: 1,
                    count: 1
                }
            },
            { $sort: { date: 1 } }
        ]);

        const summaries = await Weather.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    averageTemp: { $avg: "$temp" },
                    maxTemp: { $max: "$temp" },
                    minTemp: { $min: "$temp" },
                    dominantCondition: { $first: "$main" } // Modify as needed
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return summaries;
    } catch (error) {
        console.error('Error getting daily summaries:', error);
        throw error; // Re-throw the error to be caught in your route handler
    }
};



module.exports = { fetchWeatherData, getDailySummary };
