console.log('hello');
async function showWeather(){
    //let latitude=15.33;
   // let longitude=74.0833;
    let city='howrah';
    let KEY="b867a3797ca0ddb1868339f3c5b224ba";
    const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY}&units=metric`);
    const data=await response.json();
    console.log('data=>',data);
}