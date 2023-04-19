import { Box, Slider } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Input from "../../shared/components/input/Input";
import Button from "../../shared/components/button/Button";
import { Link } from "react-router-dom";
const SearchBar = (props) => {
  const [value, setValue] = useState([
    props.search ? props.search.range[0] : props.min,
    props.search ? props.search.range[1] : props.max,
  ]);

  useEffect(() => {
    if (props.clear) {
        setValue([props.min, props.max]); 
        textRef.current.value = "";
    }
  }, [props.clear])


  const textRef = useRef();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const marks = [
    {
      value: props.min,
      label: valuetext(props.min),
    },
    {
      value: props.max,
      label: valuetext(props.max),
    },
  ];

  function valuetext(value) {
    return `${value}€`;
  }

  return (
    <Box
      sx={{ m: 5 }}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Input ref={textRef} defaultValue={props.search && props.search.text}/>
      <Box sx={{ width: 400, px: 10, pt: 1 }}>
        <Slider
          size="small"
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          marks={marks}
          min={props.min}
          max={props.max}
        />
      </Box>
      <Link to="/search">
        <Button onClick={() => props.onSearch(textRef.current.value, value)}>
          Search
        </Button>
      </Link>
    </Box>
  );
};
export default SearchBar;
