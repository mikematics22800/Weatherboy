# Weatherboy

## Description
A fully responsive React app that fetches and displays weather conditions and forecasts for your current location and cities worldwide, along with an interactive global map that displays satellite derived weather data.

[![](./public/screenshot.png)](https://mikemedina22800.github.io/Weatherboy)

## Installation and Usage
Before you begin, you'll need API keys from [OpenWeather](https://openweathermap.org/) and [Google Maps Platform](https://developers.google.com/maps).

```bash
# Navigate to your desired directory
cd path/to/your/desired/directory

# Clone the repository
git clone https://github.com/mikemedina22800/Weatherboy

# Enter the project directory
cd Weatherboy

# Install dependencies
npm i

# Create a .env file and add your API keys (replace YOUR_KEY with your actual API keys)
echo VITE_OPEN_WEATHER_API_KEY="$key" > .env
echo VITE_GOOGLE_MAPS_API_KEY="$key" >> .env

# Start the development server
npm run dev
```

After starting the development server, open [http://localhost:5174/weatherboy](http://localhost:5174/weatherboy) in your browser to view the application.

## License
[![alt text](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)