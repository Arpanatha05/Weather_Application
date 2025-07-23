 
    function saveToHistory(data) {
      let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
      if (!history.some(item => item.city === data.city)) {
        history.push(data);
        localStorage.setItem('weatherHistory', JSON.stringify(history));
        renderHistory();
      }
    }

    function deleteFromHistory(city) {
      let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
      history = history.filter(item => item.city !== city);
      localStorage.setItem('weatherHistory', JSON.stringify(history));
      renderHistory();
    }

    function renderHistory() {
      const container = document.getElementById('history');
      const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
      container.innerHTML = '<h3>Search History</h3>';

      history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';

        const header = document.createElement('div');
        header.className = 'history-item-header';
        header.innerHTML = `
          <strong>${item.city}</strong>
          <button class="delete-btn" onclick="deleteFromHistory('${item.city}')">Delete</button>
        `;

        const weather = document.createElement('div');
        weather.className = 'history-weather';
        weather.innerHTML = `🌡️ ${item.temp}°C | 🌬️ ${item.wind} km/h | 💧 ${item.humidity}%`;

        div.appendChild(header);
        div.appendChild(weather);
        container.appendChild(div);
      });
    }

    async function getWeather() {
      const city = document.getElementById("cityInput").value.trim();
      if (!city) {
        alert("Please enter a city name.");
        return;
      }

      //const url = `http://api.weatherapi.com/v1/current.json?key=16100ec6549d48e287314917252307&q=${encodeURIComponent(city)}&aqi=yes`;
     const url = `https://api.weatherapi.com/v1/current.json?key=...`

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("City not found");
        const data = await res.json();

        document.getElementById("weatherCard").style.display = "block";
        document.getElementById("location").innerText = `${data.location.name}, ${data.location.country}`;
        document.getElementById("icon").src = "https:" + data.current.condition.icon;
        document.getElementById("temp").innerText = data.current.temp_c;
        document.getElementById("condition").innerText = data.current.condition.text;
        document.getElementById("humidity").innerText = data.current.humidity;
        document.getElementById("wind").innerText = data.current.wind_kph;
        document.getElementById("aqi").innerText = data.current.air_quality["pm2_5"].toFixed(2) + " PM2.5";

        const historyData = {
          city: data.location.name,
          temp: data.current.temp_c,
          wind: data.current.wind_kph,
          humidity: data.current.humidity
        };

        saveToHistory(historyData);
      }catch (error) {
  console.error("Weather fetch failed:", error);
  alert("Error fetching weather data. Please check the city name.");
}

    }

    window.onload = renderHistory;
  