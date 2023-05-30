import React, { useEffect, useState, useCallback } from 'react';
import './MyApp.css';
import LineChart from "./components/LineChart";
import Column from './components/Column';
import WeatherDetails from './components/WeatherDetails';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';





function MyApp() {
  const [isGps, setGps] = useState(false);
  const [cityState, setCity] = useState(undefined);
  const [Country, setCountry] = useState(null);
  const [fCity, setfCity] = useState(null);
  const [points, setpoints] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [clientPosition, setClientPosition] = useState(null);
  const [weekDays, setWeekDays] = useState(null);
  const imgUrl = 'http://openweathermap.org/img/wn/';

  const timeFormat = {
    hour12: false,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };
  const nowTime = new Date().toLocaleString('en-US', timeFormat);
  const [dateTime, setDateTime] = useState(nowTime);
  const apiKey = process.env.REACT_APP_API_KEY;

  // Fix Leaflet icon issue
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
  });

  useEffect(() => {
    if (clientPosition && isGps) {
      var lat = clientPosition.lat;
      var lng = clientPosition.lon;
      var url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;
      handleOnSubmit(url);
    }
    const handleLoad = () => {
      navigator.geolocation.getCurrentPosition(position => {
        setGps(true);
        setClientPosition({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      });
    }
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
    }
  }, [clientPosition]);



  const handleOnSubmit = useCallback(async (event) => {
    var url = '';
    setGps(false);
    if (event.preventDefault) {

      event.preventDefault();
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityState}&units=metric&appid=${apiKey}`;
    }
    else {
      url = event;
    }

    try {
      const respone = await fetch(url);
      const result = await respone.json();
      if (result.cod === '200') {
        setfCity(result.city.name);
        setCountry(result.city.country);
        setClientPosition(result.city.coord);
        var point = {};
        var currentDateTime = new Date();

        result.list.forEach(element => {
          var dateTime = element.dt_txt.split(' ');
          var date = dateTime[0];
          var time = dateTime[1];

          if (point[date] === undefined) {
            point[date] = {
              temp: [],
              time: [],
              wheather: element.weather[0].main,
              icon: element.weather[0].icon,
              wind: element.wind.speed,
              humidity: element.main.humidity,
              maxtemp: element.main.temp_max
            };
          }

          point[date].temp.push(element.main.temp);
          point[date].time.push(time.substring(0, time.length - 3));
          
          var currentHour = currentDateTime.getHours();
          var t = Number(time.substring(0, 2));
          if (currentHour % 3 === 0) {
            if (t === currentHour) {
              point[date].icon = element.weather[0].icon;
            }
          }
          else {
            if ((currentHour + 1) % 3 === 0) {
              if (t === currentHour + 1) {
                point[date].icon = element.weather[0].icon;
              }
            }
            else {
              if ((currentHour - 1) === t) {
                point[date].icon = element.weather[0].icon;
              }
            }
          }
        });
        setpoints(point);

      }
      else {
        console.error(`failed with error code: ${result}`);
        alert('city not found');
      }
    }
    catch (error) {
      console.error(error.messaage);
    }
    var weekDays = getWeekDays(currentDateTime);

    setWeekDays(weekDays);

  }, [cityState, clientPosition]);


  const getWeekDays = (currentDateTime) => {
    var baseDate = currentDateTime;
    baseDate.setDate(baseDate.getDate() + 1);
    var weekDays = [];
    weekDays.push('Today');
    for (let i = 0; i < 6; i++) {
      weekDays.push(baseDate.toLocaleDateString('en-US', { weekday: 'long' }));
      baseDate.setDate(baseDate.getDate() + 1);
    }
    return weekDays;
  }
  const handleOnCityChange = (event) => {
    setCity(event.target.value);
  }

  const handleOnClickDay = (index) => {
    let pointsValues = Object.values(points)[index];
    let pointsKeys = Object.keys(points)[index];

    if (index === 0) {//first button image
      setDateTime(nowTime);
    }
    else {
      let timeArrSize = pointsValues.time.length;
      const sTime = pointsKeys + 'T' + pointsValues.time[timeArrSize / 2];
      setDateTime(new Date(sTime).toLocaleString('en-US', timeFormat));
    }
    setImageIndex(index);
  }

  return (
    <div className='MainContainer'>
      <form className='form' onSubmit={handleOnSubmit}>
        <label>City</label>
        <input type='text' placeholder='Enter City' id='city' onChange={handleOnCityChange} />
        <input id='submitbt' type="submit" value="Submit" />
      </form>



      {points &&
        <div className='ButtomContainer'>
          <div className='LeftContainer'>
            <div className='TodayColumn'>
              <div className='TodayRow'>
                <WeatherDetails
                  city={fCity}
                  country={Country}
                  pointsValues={Object.values(points)[imageIndex]}
                  imgUrl={imgUrl}
                  dateTime={dateTime}
                />
              </div>
              <div className='TodayRow'>
                <MapContainer key={clientPosition.lat} center={[clientPosition.lat, clientPosition.lon]} zoom={10} scrollWheelZoom={false}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                  />
                  <Marker position={[clientPosition.lat, clientPosition.lon]} />
                </MapContainer>
              </div>
            </div>
          </div>

          <div className='RightContainer'>
            <div className='Graph'>
              < LineChart
                lables={Object.values(points)[imageIndex].time}
                datas={Object.values(points)[imageIndex].temp}
                date={Object.keys(points)[imageIndex]}
              />
            </div>
            <div className="Row">
              {Object.entries(points).map((value, index) => {
                return (
                  <Column
                    index={index}
                    weekDays={weekDays}
                    value={value}
                    imgUrl={imgUrl}
                    columnstyle={imageIndex}
                    handleOnClickDay={handleOnClickDay}
                    key={index}
                  />
                )
              })}
            </div>
          </div>
        </div>
      }
    </div>



  );
}


export default MyApp;


