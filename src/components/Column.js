
function Column(props) {
    return (
        <div className="Column" style={props.index === props.columnstyle ? { border: "5px blue solid" } : null} onClick={() => props.handleOnClickDay(props.index)} >
            <div>{props.weekDays[props.index]}</div>
            <img className='colimg' src={`${props.imgUrl}${props.value[1].icon}@2x.png`} alt="Weather icon" />
            <div>humidity</div>
            <div>{props.value[1].humidity}%</div>
        </div>
    );

}
export default Column;