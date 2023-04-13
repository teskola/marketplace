import { Typography } from "@mui/material";

const Seller = (props) => {
    return (
        <div>
        <Typography>{props.name}</Typography>
        <Typography variant="body2">{props.email}</Typography>
        <Typography variant="body2">{props.phone && props.phone}</Typography>
        </div>
    )
}

export default Seller;