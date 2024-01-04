const addBtn = document.getElementById("add-city-btn");
const input = document.getElementById("searchbar");
const container = document.getElementById("weather-cards-containers");
const errorMessageContainer = document.getElementById("error-message");
const apiKey = "b78bd618b86451ce6f7ec0bb155135f8";
let citiesList = [];

////////////////////////////////////////////////////////////////
function displayList() {
  container.innerHTML = "";
  for (let item of citiesList) {
    const myCard = document.createElement("div");
    myCard.className = "city-container";
    myCard.innerHTML = `
         <div class="degree">${item.temperature.current}&deg;</div>
         <div class="temperature">
             <span class="high">H:${item.temperature.high}&deg;</span>
             <span class="low">L:${item.temperature.low}&deg;</span>
         </div>
         <div class="card-bottom">
             <span class="city-name">${item.city}, ${item.country}</span>
             <span class="cloud-type">${item.condition}</span>
         </div>
         <img src="./Assets/${item.cloudPic}.svg" alt="${item.condition}-cloud" class="cloud-img">
         `;
    container.appendChild(myCard);
  }
  document.getElementById("searchbar").value = "";
}
////////////////////////////////////////////////////////////////
function getCloudCondition(condition) {
  if (condition == "Dust" || condition == "Sand" || condition == "Haze")
    return "windy";
  else if (
    condition == "Rain" ||
    condition == "Thunderstorm" ||
    condition == "Drizzle"
  )
    return "rainny";
  else if (condition == "Clear") return "sunny";
  else return "cloudy";
}
////////////////////////////////////////////////////////////////
function sortCitiesList() {
  citiesList.sort((a, b) => a.temperature.current - b.temperature.current);
}
///////
////////////////////////////////////////////////////////////////
async function fetchDetails(city) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      // Exception handling
      if (response.ok) {
        const cloudCondition = getCloudCondition(data.weather[0].main);
        citiesList.push({
          city: data.name,
          country: data.sys.country,
          temperature: {
            current: Math.floor(data.main.temp),
            high: Math.floor(data.main.temp_max),
            low: Math.floor(data.main.temp_min),
          },
          condition: data.weather[0].main,
          cloudPic: cloudCondition,
        });
        sortCitiesList();
        displayList();
      } else {
        errorMessageContainer.innerText = `Hint : City not found`;
      }
    } catch (err) {
      console.log("Error:" + err);
    }
  }
  ////////////////////////////////////////////////////////////////
  function checkForDuplicates(cityInput) {
    for (let item of citiesList) {
      if (item.city.toLowerCase() == cityInput.toLowerCase()) {
        return true;
      }
    }
  }
  ////////////////////////////////////////////////////////////////
  function checkForValidInput() {
    const inputElement = document.getElementById("searchbar");
    const inputValue = inputElement.value;
    if (!inputValue) {
      errorMessageContainer.innerText = "Please enter a valid city";
    } else if (checkForDuplicates(inputValue)) {
      errorMessageContainer.innerText = `Hint : ${inputValue
        .charAt(0)
        .toUpperCase()}${inputValue.slice(1)} is already present`;
      inputElement.value = "";
    } else {
      errorMessageContainer.innerText = "";
      fetchDetails(inputValue);
    }
  }
  
  input.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
      checkForValidInput();
    }
  });
  addBtn.addEventListener("click", checkForValidInput);