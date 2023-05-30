import React, { useEffect, useState, useCallback } from 'react';

function WeatherDetails(props) {
  return (
    <div className='TodayWeather'>
      <div className='TodayColumn'>
        <div className='TodayRow'>
          <div>{props.city},{props.country}</div>
          <div>{props.dateTime}</div>
        </div>
        <div className='TodayRow' >
          <div className='TodayColumn' >
            <img src={`${props.imgUrl}${props.pointsValues.icon}@2x.png`} alt="Weather icon" />
          </div>
          <div className='TodayColumn' >
            <div>{props.pointsValues.maxtemp}&#8451;</div>
          </div>
          <div className='TodayColumn' >
            <div>{props.pointsValues.wheather}</div>
          </div>
        </div>
        <div className='TodayRow' >
          <div className='TodayColumn' >
            <div>wind speed</div>
            <div>{props.pointsValues.wind} km/j</div>
          </div>
          <div className='TodayColumn' >
            <div >humidity</div>
            <div>{props.pointsValues.humidity}%</div>
          </div>
        </div>



        {/* <div className='icontemp'>
          <img className='sidebyside' src={`${props.imgUrl}${props.pointsValues.icon}@2x.png`} alt="Weather icon" />
          <div className='sidebyside'>{props.pointsValues.maxtemp}&#8451;</div>
        </div>
        <div className='state'>{props.pointsValues.wheather}</div>
        <div className='windhumidityContainer'>
          <div className='sidebyside'>
            <div className='upandown'>wind speed</div>
            <div className='upandown'>{props.pointsValues.wind} km/j</div>
          </div>
          <div className='sidebyside'>
            <div className='upandown'>humidity</div>
            <div className='upandown'>{props.pointsValues.humidity}%</div>
          </div>
        </div> */}
      </div>
    </div>

  );
}
export default WeatherDetails;