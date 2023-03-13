const userTab=document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container")
const grantAcces=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loading=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const dataSearchInput=document.querySelector("[data-searchInput]");

let oldTab=userTab;
const API_KEY="b867a3797ca0ddb1868339f3c5b224ba";
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab){
    if(newTab!=oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){

            userInfoContainer.classList.remove("active");
            grantAcces.classList.remove("active");
            searchForm.classList.add("active");
        }
        
        else{
                searchForm.classList.remove("active");
                userInfoContainer.classList.remove("active");
                getfromSessionStorage();
        }

    }

}

userTab.addEventListener("click",()=>{
    //pass clicked tab as parameter
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});

//check if cordinates are already present in session storage
function getfromSessionStorage(){
    const loacalCoordinates=sessionStorage.getItem("user-coordinate");
    if(!loacalCoordinates){
        //if we don't get coordinates
        grantAcces.classList.add("active");
    }else{
        const coordinates=JSON.parse(loacalCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    //make grant container invisible
    grantAcces.classList.remove("active");
    //Make loader Visible
    loading.classList.add("active");
    //Api Call
    try{
        const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await res.json();
        loading.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }catch(err){


    }

}
function renderWeatherInfo(weatherInfo){
//firstly we have to fetch the element

const cityName=document.querySelector("[data-cityName]");
const countryIcon=document.querySelector("[data-countryIcon]");
const desc=document.querySelector("[data-weatherDesc]");
const weatherIcon=document.querySelector("[data-weatherIcon]");
const temp=document.querySelector("[data-temp]");
const windSpeed=document.querySelector("[data-windSpeed]");
const humidity=document.querySelector("[data-humudity]");
const cloudiness=document.querySelector("[data-cloudiness]");

//fetch values from weather info object
cityName.innerText= weatherInfo?.name;
countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`
desc.innerText=weatherInfo?.weather?.[0]?.description;
weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0].icon}.png`;
temp.innerText=`${weatherInfo?.main?.temp} °C`;
windSpeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
humidity.innerText=`${weatherInfo?.main?.humidity}%`;
cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}
function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        //Show an alert for no geolocation avilable.
    }


}
function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,

        
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAcessButton=document.querySelector("[data-grantAcces]");
grantAcessButton.addEventListener("click",getlocation);

const searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityname=searchInput.value;
    if(cityname==="")return;
    else
        fetchSearchWeatherInfo(cityname);

});
async function fetchSearchWeatherInfo(city){
    
    loading.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAcces.classList.remove("active");

    try{
       
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loading.classList.remove("active");
        userInfoContainer.classList.add("active");
        
        renderWeatherInfo(data);

    }
    catch(err){

    }
}