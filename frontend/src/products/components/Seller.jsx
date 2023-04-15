import { Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Seller = (props) => {
    return (
        <div>
        <Link underline="hover" component={RouterLink} to={"users/" + props.id}><Typography>{props.name}</Typography></Link>        
        <Typography variant="body2">{props.email}</Typography>
        <Typography variant="body2">{props.phone && props.phone}</Typography>
        </div>
    )
}

export default Seller;