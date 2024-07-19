# Weatherboy

## Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Node Packages](#node-packages)
- [License](#license)

## Description
A web client that displays current weather conditions and forecasts for the user's current location and cities across the world. The user can query cities using a search bar with autocomplete functionality. Additionally, the app includes an interactive map which displays satellite derived weather data across the globe.

[![](./public/screenshot.png)](https://mikematics22800.github.io/Weatherboy)

## Installation
Before you begin, you'll need API keys from [OpenWeather](https://openweathermap.org/) and [Google Maps Platform](https://developers.google.com/maps).

```bash
# Navigate to your desired directory
cd path/to/your/desired/directory
# Clone the repository
git clone https://github.com/mikematics22800/Weatherboy
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

## Node Packages
React | React Router | Vite | Tailwind CSS | Material UI | Chart.js | Leaflet

## License
[![alt text](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)