# Weather Dashboard (Bash CLI)

A simple command-line weather dashboard written in **Bash** that fetches real-time weather data using a weather API.
The script allows users to check current weather, view short forecasts, and convert temperature units directly from the terminal.

---

## Features

* Get **current weather conditions** for any city
* View **forecast for the next 5 time slots**
* Switch between **Celsius and Fahrenheit**
* **Temperature conversion tool** (C ↔ F)
* Simple **interactive terminal menu**
* Uses **API requests with curl**
* Parses JSON responses using **jq**

---

## Requirements

Make sure the following tools are installed:

* **bash**
* **curl**
* **jq**

Install jq if needed:

Ubuntu

```
sudo apt install jq
```

MacOS (Homebrew)

```
brew install jq
```

---

## Setup

1. Clone the repository

```
git clone https://github.com/yourusername/weather-dashboard.git
cd weather-dashboard
```

2. Open the script and add your API details

```
API_KEY="your_api_key"
BASE_URL="https://api.openweathermap.org/data/2.5"
```

You can get a free API key from
https://openweathermap.org/api

3. Make the script executable

```
chmod +x weather.sh
```

---

## Running the Program

Run the script from the terminal:

```
./weather.sh
```

You will be prompted to:

* Enter a **city name**
* Choose **temperature units**

---

## Menu Options

```
1) Set/Change city
2) Set/Change units (C/F)
3) Show current weather
4) Show forecast (next 5 time slots)
5) Convert temperature (C <-> F)
6) Quit
```

---

## Example Output

```
========== Weather Dashboard ==========
Current city : London
Units        : metric (°C)

1) Set/Change city
2) Set/Change units (C/F)
3) Show current weather
4) Show forecast (next 5 time slots)
5) Convert temperature (C <-> F)
6) Quit
=======================================
```

Example weather result:

```
Current weather in London:
Condition   : broken clouds
Temperature : 18°C (64.40°F)
Humidity    : 72%
```

---

## Project Structure

```
weather-dashboard/
│
├── weather.sh
└── README.md
```

---

## How It Works

The script sends requests to the weather API using **curl** and processes the JSON response using **jq**.

Main API endpoints used:

* `/weather` → current weather
* `/forecast` → short-term forecast

Temperature conversions are handled using **awk calculations**.


This project is open source and free to use.
