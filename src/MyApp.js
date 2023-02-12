import React, { useEffect, useState } from 'react';
import { WiCloud } from "react-icons/wi";
import './MyApp.css';
import LineChart from "./components/LineChart";
// import winston from 'winston';



function MyApp() {
  const [countryState, setCountry] = useState(undefined);
  const [cityState, setCity] = useState(undefined);
  const [fCountry, setfCountry] = useState(null);
  const [fCity, setfCity] = useState(null);
  const [wheather, seWeather] = useState(null);
  const [temperture, setTemperture] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [points, setpoints] = useState(null);

  // const logger = winston.createLogger({
  //   transports:[
  //     new winston.transports.File({filename:'/opt/log/www2/error.log',level:'error'})
  //   ]
  // });


  // useEffect(() => {
  //   const handleLoad = () => {
  //     navigator.geolocation.getCurrentPosition(position => {
  //       this.setState({
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude
  //       });
  //     });
  //   }
  //   window.addEventListener('load', this.handleLoad);

  //   return () => {
  //     window.removeEventListener('load');
  //   }
  // }, []);



  const handleOnSubmit = async (event) => {
    event.preventDefault();
    try {
      // const url = `http://api.openweathermap.org/data/2.5/forecast?lat=39.099724&lon=-94.578331&dt=1643803200&appid=064f9df742af57735a139558f2b11f11`
      // const url = 'http://api.openweathermap.org/data/3.0/onecall/timemachine?lat=39.099724&lon=-94.578331&dt=1643803200&appid=064f9df742af57735a139558f2b11f11';
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityState}&units=metric&appid=064f9df742af57735a139558f2b11f11`;
      const respone = await fetch(url);
      const result = await respone.json();
      console.log('result', result);
      if (result.cod === '200') {
        setfCity(result.city.name);
        setfCountry(result.city.country);
        var point = {};
        for (let i = 0; i < result.list.length; i++) {

          var dateTime = result.list[i].dt_txt.split(' ');
          var date = dateTime[0];
          var time = dateTime[1];

          if (point[date] === undefined) {
            point[date] = { temp: [], time: [] };
          }

          // point[date].push({ temp: result.list[i].main.temp, time: time });
          point[date].temp.push(result.list[i].main.temp);
          point[date].time.push(time.substring(0, time.length - 3));


        }
        setpoints(point);


      }
      else {
        throw 'faild';
      }
    }
    catch (error) {
      console.error(error.messaage);
    }

  }
  const handleOnCountryChange = (event) => {
    setCountry(event.target.value);
  }
  const handleOnCityChange = (event) => {
    setCity(event.target.value);
  }



  return (
    <div className='MainContainer'>
      <form className='form' onSubmit={handleOnSubmit}>
        <label>Country</label>
        <input type='text' placeholder='Enter Country' id='country' onChange={handleOnCountryChange} />
        <label>City</label>
        <input type='text' placeholder='Enter City' id='city' onChange={handleOnCityChange} />
        <input type="submit" value="Submit" />
      </form>
      <div className='WeatherHeader'>
        <h2>City : {fCity}</h2>
        <h3>Country : {fCountry}</h3>
      </div>


      <div className='WeatherCard' >
        {points && Object.entries(points).map((value, index) => {
          const date = value[0];
          const times = value[1].time;
          const temps = value[1].temp;
          return (
            <LineChart lables={times} datas={temps} date={date} key={index} />)

        })}
      </div>

    </div>

  );
}
export default MyApp;
