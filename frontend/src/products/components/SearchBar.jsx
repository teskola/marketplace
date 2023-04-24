import { Box, Grid, Slider } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Input from "../../shared/components/input/Input";
import Button from "../../shared/components/button/Button";
import { useHistory } from "react-router-dom";
const SearchBar = (props) => {
  const history = useHistory();
  const [value, setValue] = useState([
    props.search ? props.search.range[0] : props.min,
    props.search ? props.search.range[1] : props.max,
  ]);

  useEffect(() => {
    if (props.clear) {
      setValue([props.min, props.max]);
      textRef.current.value = "";
    }
  }, [props.clear]);

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

  const onSearchSubmit = (event) => {
    event.preventDefault();
    props.onSearch(textRef.current.value, value)
    history.push("/search");
  };

  return (
    <form onSubmit={onSearchSubmit}>
      <Box sx={{ m: 5 }}>
        <Grid
          container
          columnSpacing={10}
          style={{ display: "flex" }}
          alignItems="stretch"
        >
          <Grid item xs={12} md={3}>
            <Box>
              <Input
                ref={textRef}
                defaultValue={props.search && props.search.text}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
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
          </Grid>
          <Grid item xs={12} md={3}>            
              <Button
                type="submit"                
              >
                Search
              </Button>            
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};
export default SearchBar;
