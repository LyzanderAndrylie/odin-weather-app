import './main.css';

const API_KEY = '64639162cde7412b81275428241201';
const BASE_URL = 'https://api.weatherapi.com/v1';

type Weather = {
  current: {
    condition: {
      code: number;
      icon: string;
      text: string;
    };
    last_updated: string;
    temp_c: number;
    temp_f: number;
  };
  location: {
    country: string;
    name: string;
  };
};

async function getWeatherFromLocation(query: string) {
  const currentWeatherURL = `${BASE_URL}/current.json?key=${API_KEY}&q=${query.toLowerCase()}`;
  const response = await fetch(currentWeatherURL);
  const responseJSON = await response.json();

  if (!response.ok) throw new Error(responseJSON.error.message);

  return responseJSON;
}

function resetInformationInWidget() {
  const weatherInfoDiv = document.getElementById('weather-info');
  weatherInfoDiv.innerHTML = '';
  weatherInfoDiv.setAttribute(
    'class',
    'flex-1 border-2 border-black rounded-xl mb-4 p-2',
  );
}

function fillWeatherWidget(weather: Weather) {
  const weatherInfoDiv = document.getElementById('weather-info');

  const conditionTextDiv = document.createElement('div');
  conditionTextDiv.textContent = weather.current.condition.text;
  conditionTextDiv.setAttribute('class', 'text-2xl text-center mb-2');

  const locationDiv = document.createElement('div');
  locationDiv.textContent = `${weather.location.country}, ${weather.location.name}`;
  locationDiv.setAttribute('class', 'text-xl text-center mb-2');

  const conditionIcon = document.createElement('img');
  conditionIcon.src = `https:${weather.current.condition.icon}`;
  conditionIcon.setAttribute('class', 'block mx-auto my-2');

  const tempDiv = document.createElement('div');
  tempDiv.setAttribute('class', 'flex gap-2');

  const tempCDiv = document.createElement('div');
  tempCDiv.textContent = `${weather.current.temp_c}°C`;
  tempCDiv.setAttribute('class', 'flex-1 text-2xl text-center');

  const tempFDiv = document.createElement('div');
  tempFDiv.textContent = `${weather.current.temp_f}°F`;
  tempFDiv.setAttribute('class', 'flex-1 text-2xl text-center');

  // Append to tempDiv
  tempDiv.appendChild(tempCDiv);
  tempDiv.appendChild(tempFDiv);

  // Append to weatherInfoDiv
  weatherInfoDiv.appendChild(conditionTextDiv);
  weatherInfoDiv.appendChild(locationDiv);
  weatherInfoDiv.appendChild(conditionIcon);
  weatherInfoDiv.appendChild(tempDiv);
}

function showErrorInWeatherWidget(error: Error) {
  const weatherInfoDiv = document.getElementById('weather-info');
  weatherInfoDiv.innerHTML = error.message;
  weatherInfoDiv.setAttribute(
    'class',
    'mb-4 flex flex-1 items-center justify-center rounded-xl border-2 border-black p-2 text-xl',
  );
}
/**
 * Loading spinner is taken from:
 * <https://tw-elements.com/docs/standard/components/spinners/>
 */
function showLoadingInWeatherWidget() {
  const weatherInfoDiv = document.getElementById('weather-info');
  weatherInfoDiv.setAttribute(
    'class',
    'mb-4 flex flex-1 items-center justify-center rounded-xl border-2 border-black p-2 text-xl',
  );
  weatherInfoDiv.innerHTML = `
    <div
    class="text-primary inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
    role="status"
    >
      <span
        class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
        >Loading...</span
      >
    </div>
  `;
}

function addEventListener() {
  const locationSearchForm = document.getElementById('location-search-form');
  locationSearchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoadingInWeatherWidget();

    const locationSearchInput = document.getElementById(
      'location-search',
    ) as HTMLInputElement;
    const locationSearch = locationSearchInput.value;

    try {
      const weatherData = (await getWeatherFromLocation(
        locationSearch,
      )) as Weather;
      resetInformationInWidget();
      fillWeatherWidget(weatherData);
    } catch (error) {
      resetInformationInWidget();
      showErrorInWeatherWidget(error);
    }
  });
}

async function setInitialWeatherInfo() {
  const weatherData = (await getWeatherFromLocation('auto:ip')) as Weather;
  resetInformationInWidget();
  fillWeatherWidget(weatherData);
}

showLoadingInWeatherWidget();
setInitialWeatherInfo();
addEventListener();
