import React, { useEffect, useState, useCallback } from 'react';
import './MyApp.css';
import LineChart from "./components/LineChart";





function MyApp() {
  const [cityState, setCity] = useState(undefined);
  const [Country, setCountry] = useState(null);
  const [fCity, setfCity] = useState(null);
  const [points, setpoints] = useState(null);
  const [lineChart, setlineChart] = useState(null);
  const [currentWheater, setcurrentWheater] = useState(null);
  const [columnstyle, setColumnStyle] = useState(0);
  const [clientPosition, setClientPosition] = useState(null);
  const [weekDays, setWeekDays] = useState(null);
  const imgUrl = 'http://openweathermap.org/img/wn/';
  const timeFormat = { hour12: false, weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
  const formattedDate = new Date().toLocaleString('en-US', timeFormat);
  const apiKey = process.env.REACT_APP_API_KEY;





  const handleOnSubmit = useCallback(async (event) => {
    var url = '';
    if (event.preventDefault) {
      setClientPosition(null);
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
        var point = {};
        for (let i = 0; i < result.list.length; i++) {

          var dateTime = result.list[i].dt_txt.split(' ');
          var date = dateTime[0];
          var time = dateTime[1];

          if (point[date] === undefined) {
            point[date] = {
              temp: [],
              time: [],
              wheather: result.list[i].weather[0].main,
              icon: result.list[i].weather[0].icon,
              wind: result.list[i].wind.speed,
              humidity: result.list[i].main.humidity,
              maxtemp: result.list[i].main.temp_max
            };
          }

          point[date].temp.push(result.list[i].main.temp);
          point[date].time.push(time.substring(0, time.length - 3));
          var currentDateTime = new Date();
          var currentHour = currentDateTime.getHours();
          var t = Number(time.substring(0, 2));
          if (currentHour % 3 === 0) {
            if (t === currentHour) {
              point[date].icon = result.list[i].weather[0].icon;
            }
          }
          else {
            if ((currentHour + 1) % 3 === 0) {
              if (t === currentHour + 1) {
                point[date].icon = result.list[i].weather[0].icon;
              }
            }
            else {
              if ((currentHour - 1) === t) {
                point[date].icon = result.list[i].weather[0].icon;
              }
            }
          }
        }
        setpoints(point);

      }
      else {
        throw new Error(`failed with error code: ${result.code}`);
      }
    }
    catch (error) {
      console.error(error.messaage);
    }
    var weekDays = getWeekDays(currentDateTime);

    setWeekDays(weekDays);

  }, [cityState]);

  useEffect(() => {
    if (clientPosition) {
      var lat = clientPosition.lat;
      var lng = clientPosition.lng;
      var url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;
      handleOnSubmit(url);
    }
    const handleLoad = () => {
      navigator.geolocation.getCurrentPosition(position => {
        setClientPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
    }
  }, [clientPosition, handleOnSubmit]);
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
    const sTime = pointsKeys + 'T' + pointsValues.time[0];
    const dateTime = new Date(sTime).toLocaleString('en-US', timeFormat);

    setlineChart(<LineChart lables={pointsValues.time} datas={pointsValues.temp} date={pointsKeys} />);
    var currwheater = <div className='TodayWeather'>
      <div>{fCity},{Country}</div>
      <div className='date'>{dateTime}</div>
      <div className='icontemp'>
        <img className='sidebyside' src={`${imgUrl}${pointsValues.icon}@2x.png`} alt="Weather icon" />
        <div className='sidebyside'>{pointsValues.maxtemp}&#8451;</div>
      </div>
      <div className='state'>{pointsValues.wheather}</div>
      <div className='windhumidityContainer'>
        <div className='sidebyside'>
          <div className='upandown'>wind speed</div>
          <div className='upandown'>{pointsValues.wind} km/j</div>
        </div>
        <div className='sidebyside'>
          <div className='upandown'>humidity</div>
          <div className='upandown'>{pointsValues.humidity}%</div>
        </div>
      </div>
    </div>;
    setcurrentWheater(currwheater);
    setColumnStyle(index);
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
            {currentWheater || <div className='TodayWeather'>
              <div>{fCity},{Country}</div>
              <div className='date'>{formattedDate}</div>
              <div className='icontemp'>
                <img className='sidebyside' src={`${imgUrl}${Object.values(points)[0].icon}@2x.png`} alt="Weather icon" />
                <div className='sidebyside'>{Object.values(points)[0].maxtemp}&#8451;</div>
              </div>
              <div className='state'>{Object.values(points)[0].wheather}</div>
              <div className='windhumidityContainer'>
                <div className='sidebyside'>
                  <div className='upandown'>wind speed</div>
                  <div className='upandown'>{Object.values(points)[0].wind} km/j</div>
                </div>
                <div className='sidebyside'>
                  <div className='upandown'>humidity</div>
                  <div className='upandown'>{Object.values(points)[0].humidity}%</div>
                </div>
              </div>
            </div>
            }
          </div>

          <div className='RightContainer'>
            <div className='Graph'>
              {lineChart ||
                < LineChart lables={Object.values(points)[0].time} datas={Object.values(points)[0].temp} date={Object.keys(points)[0]} />
              }
            </div>
            <div className="Row">

              {Object.entries(points).map((value, index) => {
                return (
                  <div className="Column" style={index === columnstyle ? { border: "5px blue solid" } : null} key={index} onClick={() => handleOnClickDay(index)} >
                    <div>{weekDays[index]}</div>
                    <img className='colimg' src={`http://openweathermap.org/img/wn/${value[1].icon}@2x.png`} alt="Weather icon" />
                    <div>humidity</div>
                    <div>{value[1].humidity}%</div>
                  </div>)

              })}
            </div>
          </div>
        </div>
      }
    </div>



  );
}


export default MyApp;


