import { Box, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Seller = (props) => {
    return (
        <Box 
        textAlign="end"
        >
        <Link underline="hover" component={RouterLink} to={"users/" + props.id}><Typography>{props.name}</Typography></Link>        
        <Typography variant="body2">{props.email}</Typography>
        <Typography variant="body2">{props.phone && props.phone}</Typography>
        </Box>
    )
}

export default Seller;