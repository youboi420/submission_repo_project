const [sliderValue, setSliderValue] = React.useState([0, Number.MAX_SAFE_INTEGER]);
const [maxSliderValue, setSliderValue] = React.useState([0, Number.MAX_SAFE_INTEGER]);
function valuetext(value) {
    return `${value}°C`;
  }

  const marks = [
    {
      value: 0,
      label: "0's'",
    },
    {
      value: maxSliderValue,
      label: maxSliderValue + "'s'",
    },
  ];
<Slider
              getAriaLabel={() => 'Temperature'}
              getAriaValueText={valuetext}
              defaultValue={[0, ]}
              valueLabelDisplay="auto"
              onChange={handleSliderChange}
              marks={marks}
            />
const handleSliderChange = (event, newValue) => {
  setSliderValue(newValue);
};