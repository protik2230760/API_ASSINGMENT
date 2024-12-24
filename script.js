const countryGrid = document.getElementById("countryGrid");
const searchBox = document.getElementById("searchBox");

searchBox.addEventListener("input", () => {
  const countryName = searchBox.value.trim();

  if (!countryName) {
    countryGrid.innerHTML = "";
    return;
  }

  const countryAPI = `https://restcountries.com/v3.1/name/${countryName}`;
  fetch(countryAPI)
    .then(response => response.json())
    .then(data => {
      if (!data || data.status === 404) {
        countryGrid.innerHTML = `<p>No country data found.</p>`;
        return;
      }
      displayCountries(data);
    })
    .catch(error => {
      console.error("Error fetching country data:", error);
      countryGrid.innerHTML = `<p>Error fetching data. Please try again.</p>`;
    });
});

function displayCountries(countries) {
  countryGrid.innerHTML = "";

  countries.forEach(country => {
    const card = document.createElement("div");
    card.classList.add("country-card");

    const currency = country.currencies
      ? Object.values(country.currencies)[0]
      : { name: "N/A", symbol: "N/A" };

    card.innerHTML = `
      <img src="${country.flags.png}" alt="${country.name.common}">
      <h5>${country.name.common} <span class="badge bg-primary">Info</span></h5>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
      <p><strong>Currency:</strong> ${currency.name} (${currency.symbol})</p>
      <button class="btn btn-primary" onclick="getWeather('${country.latlng[0]}', '${country.latlng[1]}', '${country.name.common}')">More Details</button>
    `;

    countryGrid.appendChild(card);
  });
}

function getWeather(lat, lon, countryName) {
  const weatherAPI = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  fetch(weatherAPI)
    .then(response => response.json())
    .then(data => {
      const weather = data.current_weather;
      const modalWeatherDetails = document.getElementById("modalWeatherDetails");

      if (!weather) {
        modalWeatherDetails.innerHTML = `<p>No weather data available.</p>`;
      } else {
        modalWeatherDetails.innerHTML = `
          <h5>${countryName}</h5>
          <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
          <p><strong>Wind Speed:</strong> ${weather.windspeed} km/h</p>
          <p><strong>Condition Code:</strong> ${weather.weathercode || "N/A"}</p>
        `;
      }

      const weatherModal = new bootstrap.Modal(document.getElementById("weatherModal"));
      weatherModal.show();
    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
      alert("Error fetching weather data.");
    });
}
