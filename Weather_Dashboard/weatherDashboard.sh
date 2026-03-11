#!/usr/bin/env bash

API_KEY="API_key"
BASE_URL="URL"

CITY=""
UNITS="metric"
UNIT_LABEL="°C"


choose_city() {
    echo -n "Enter city name: "
    read CITY
}


choose_units() {
    echo "Choose units:"
    echo "1) Celsius"
    echo "2) Fahrenheit"
    echo -n "Enter choice (1 or 2): "
    read choice

    if [ "$choice" = "1" ]; then
        UNITS="metric"
        UNIT_LABEL="°C"
    else
        UNITS="imperial"
        UNIT_LABEL="°F"
    fi
}

show_current_weather() {
    if [ -z "$CITY" ]; then
        echo "No city set yet."
        choose_city
    fi

    echo
    echo "Fetching current weather for $CITY..."
    echo

    CURRENT=$(curl -s "$BASE_URL/weather?q=$CITY&appid=$API_KEY&units=$UNITS")

    COD=$(echo "$CURRENT" | jq -r '.cod')
    if [ "$COD" != "200" ]; then
        MSG=$(echo "$CURRENT" | jq -r '.message')
        echo "Error from API: $MSG"
        return
    fi

    TEMP=$(echo "$CURRENT" | jq '.main.temp')
    DESC=$(echo "$CURRENT" | jq -r '.weather[0].description')
    HUMIDITY=$(echo "$CURRENT" | jq '.main.humidity')

    # Optional: also show opposite unit
    if [ "$UNITS" = "metric" ]; then
        TEMP_OTHER=$(awk -v c="$TEMP" 'BEGIN { printf "%.2f", (c * 9 / 5) + 32 }')
        OTHER_LABEL="°F"
    else
        TEMP_OTHER=$(awk -v f="$TEMP" 'BEGIN { printf "%.2f", (f - 32) * 5 / 9 }')
        OTHER_LABEL="°C"
    fi

    echo "Current weather in $CITY:"
    echo "Condition   : $DESC"
    echo "Temperature : $TEMP$UNIT_LABEL ($TEMP_OTHER$OTHER_LABEL)"
    echo "Humidity    : $HUMIDITY%"
    echo
}


show_forecast() {
    if [ -z "$CITY" ]; then
        echo "No city set yet."
        choose_city
    fi

    echo
    echo "Fetching forecast (next 5 time slots) for $CITY..."
    echo

    FORECAST=$(curl -s "$BASE_URL/forecast?q=$CITY&appid=$API_KEY&units=$UNITS")


    COD=$(echo "$FORECAST" | jq -r '.cod')
    if [ "$COD" != "200" ]; then
        MSG=$(echo "$FORECAST" | jq -r '.message')
        echo "Error from API: $MSG"
        return
    fi

    echo "$FORECAST" | jq -r '
      .list[0:5][] |
      "\(.dt_txt): \(.main.temp)° '"$UNIT_LABEL"', \(.weather[0].description)"
    '
    echo
}

convert_temperature() {
    echo -n "Enter temperature value: "
    read VALUE

    echo -n "From unit (C/F): "
    read FROM

    echo -n "To unit (C/F): "
    read TO

    FROM_UP=$(echo "$FROM" | tr '[:lower:]' '[:upper:]')
    TO_UP=$(echo "$TO" | tr '[:lower:]' '[:upper:]')

    if [ "$FROM_UP" = "C" ] && [ "$TO_UP" = "F" ]; then
        RESULT=$(awk -v c="$VALUE" 'BEGIN { printf "%.2f", (c * 9 / 5) + 32 }')
        echo "Result: $RESULT°F"
    elif [ "$FROM_UP" = "F" ] && [ "$TO_UP" = "C" ]; then
        RESULT=$(awk -v f="$VALUE" 'BEGIN { printf "%.2f", (f - 32) * 5 / 9 }')
        echo "Result: $RESULT°C"
    else
        echo "Unsupported conversion: $FROM -> $TO"
    fi

    echo
}

show_menu() {
    echo "========== Weather Dashboard =========="
    echo "Current city : ${CITY:-not set}"
    echo "Units        : $UNITS ($UNIT_LABEL)"
    echo
    echo "1) Set/Change city"
    echo "2) Set/Change units (C/F)"
    echo "3) Show current weather"
    echo "4) Show forecast (next 5 time slots)"
    echo "5) Convert temperature (C <-> F)"
    echo "6) Quit"
    echo "======================================="
    echo -n "Enter your choice: "
}


if [ -z "$CITY" ]; then
    choose_city
    choose_units
fi

while true; do
    show_menu
    read choice
    case "$choice" in
        1) choose_city ;;
        2) choose_units ;;
        3) show_current_weather ;;
        4) show_forecast ;;
        5) convert_temperature ;;
        6) echo "Goodbye!"; exit 0 ;;
        *) echo "Invalid choice. Try again."; echo ;;
    esac
done
