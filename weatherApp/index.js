
const userTab=document.querySelector('[data-userWeather]');
const searchTab=document.querySelector('[data-searchWeather]');
const userContainer=document.querySelector('.weather-container');
const grantAccessContainer=document.querySelector('.grant-location-container');
const searchForm=document.querySelector('[data-searchForm]');
const loadingScreen=document.querySelector('.loading-container');
const userInfoContainer=document.querySelector('.user-info-container');
const errorContainer=document.querySelector(".error-container");
const errorMsg=document.querySelector("[data-ErrorMsg]")

// intially variable:-
let currentTab=userTab;
const API_KEY="168771779c71f3d64106d8a88376808a";
currentTab.classList.add('current-tab');

// ek kaam pending hai
getFromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove('current-tab');
        currentTab=clickedTab;
        currentTab.classList.add('current-tab');

        if(!searchForm.classList.contains('active')){
            // kya search wala conatiner is invisible,make it visible
            userInfoContainer.classList.remove('active');
            grantAccessContainer.classList.remove('active');
            searchForm.classList.add('active');
        }else{
            // main pahele search wale pe ta ab your weather ko visible karana hai
            searchForm.classList.remove('active');
            userInfoContainer.classList.remove('active');
            // seasion ke under coordinates store ho local storage me
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener('click',()=>{
    switchTab(userTab);
});
searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
});


// chaeck if coordinates are already present in session storage
function getFromSessionStorage(){
    const localCoordinates=sessionStorage.getItem('user-coordinates');
    if(!localCoordinates){
        // if it is not present show grant-access container
        errorContainer.classList.remove('active');
        grantAccessContainer.classList.add('active');
    }else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    // make grant container invisible
    grantAccessContainer.classList.remove('active');
    errorContainer.classList.remove('active');
    // make loading screen visible
    loadingScreen.classList.add('active');

    // api call
    try{
        const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await res.json();
        console.log(data);
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        if(!data?.sys){
            throw data;
        }
        renderWeatherInfo(data);
    }catch(e){
        userInfoContainer.classList.remove('active');
        loadingScreen.classList.remove('active');
        errorContainer.classList.add('active');
        errorMsg.textContent=`${e?.message}`;
        setTimeout(()=>{
            grantAccessContainer.classList.add('active');
            errorContainer.classList.remove('active');
            errorMsg.textContent=``;
        },4000);
    }
}

function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch the data
    const cityName=document.querySelector('[data-cityName]');
    const countryIcon=document.querySelector('[data-countryIcon]');
    const desc=document.querySelector('[data-weatherDesc]');
    const weatherIcon=document.querySelector('[data-weatherIcon]');
    const temp=document.querySelector('[data-temp]');
    const windspeed=document.querySelector('[wind-speed]');
    const humidity=document.querySelector('[data-humidity]');
    const cloudiness=document.querySelector('[data-cloudiness]');

    // fetch values from weather info object and put in ui element
    // $,curly,optional chainning symbol parameter->json proprty present if then will return but if absent than provide an undefined value (?)
    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp} °C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all} %`;
}

function geolocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        // h/w->allert show for no geolocation support available
        alert("No navigation support present")
        errorContainer.classList.add('active'); 
    }
}

function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccess=document.querySelector('[data-grantAccess]');
grantAccess.addEventListener('click',geolocation);

const searchInput=document.querySelector('[data-searchInput]');

searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    searchInput.value='';
    if(cityName===""){
        return;
    }else{
        fetchSearchWeatherInfo(cityName);
    }
});



async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add('active');
    userInfoContainer.classList.remove('active');
    grantAccessContainer.classList.remove('active');
    errorContainer.classList.remove('active');
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        console.log(data);
        loadingScreen.classList.remove('active');
        if(!data?.sys){
            // throw new Error(data); give error
            throw data;
        }else{
            userInfoContainer.classList.add('active');
            renderWeatherInfo(data);
        }
        
    }catch(e){
        // h/w
        loadingScreen.classList.remove('active');
        errorContainer.classList.add('active');
        errorMsg.textContent=`${e?.message}`;
    }
}