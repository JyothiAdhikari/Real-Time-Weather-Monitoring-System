# Weather Monitoring System

## Description

The **Weather Monitoring System** is a real-time application that monitors weather conditions in major metro cities across India. It fetches data from the OpenWeatherMap API, processes it, and provides daily summaries of weather information.

### What I Have Done

- Developed a Node.js application that retrieves weather data every 5 minutes.
- Implemented daily weather summaries, including average, maximum, and minimum temperatures.
- Created an alert system to notify users based on defined weather conditions.
- Stored weather data and summaries in a MongoDB database.

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB**
- **OpenWeatherMap API**
- **dotenv**

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/weather-monitoring-system.git
   cd weather-monitoring-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:

   ```plaintext
   OPENWEATHER_API_KEY=your_api_key
   DB=your_database_name
   PORT=3000
   ```

4. Start the application:

   ```bash
   node src/index.js
   ```
