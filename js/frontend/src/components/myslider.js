const [sliderValue, setSliderValue] = React.useState([0, Number.MAX_SAFE_INTEGER]);
function valuetext(value) {
    return `${value}°C`;
  }

  const marks = [
    {
      value: 0,
      label: '0°C',
    },
    {
      value: 20,
      label: '20°C',
    },
    {
      value: 37,
      label: '37°C',
    },
    {
      value: 100,
      label: '100°C',
    },
  ];
<Slider
              getAriaLabel={() => 'Temperature'}
              getAriaValueText={valuetext}
              defaultValue={[0, Number.MAX_SAFE_INTEGER]}
              valueLabelDisplay="auto"
              onChange={handleSliderChange}
              marks={marks}
            />
const handleSliderChange = (event, newValue) => {
  setSliderValue(newValue);
};