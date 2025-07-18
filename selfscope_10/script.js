async function getWeather() {
  const city = document.getElementById('city-input').value;
  const forecastList = document.getElementById('forecast-list');
  forecastList.innerHTML = '<p>Loading...</p>';

  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`);
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) throw new Error('City not found');

    const { latitude, longitude, name } = geoData.results[0];

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`);
    const weatherData = await weatherRes.json();
    const daily = weatherData.daily;

    let html = `<h2>${name}</h2>`;
    for (let i = 0; i < daily.time.length; i++) {
      html += `
        <div class="forecast-item">
          <div><strong>${daily.time[i]}</strong></div>
          <div>${daily.temperature_2m_min[i]}°C - ${daily.temperature_2m_max[i]}°C</div>
          <div>💧 ${daily.precipitation_sum[i]} mm</div>
        </div>
      `;
    }

    forecastList.innerHTML = html;
  } catch (err) {
    forecastList.innerHTML = '<p>Could not fetch forecast. Try another city.</p>';
  }
}