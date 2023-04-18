import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { useMutation } from "react-query";
import { useLocation, Link } from "react-router-dom";
import Button from "../../shared/components/button/Button";
import LoadingSpinner from "../../shared/components/loadingspinner/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useUser } from "../../shared/queries/useUser";
import { deleteProduct } from "../api/products";
import Seller from "./Seller";
import moment from 'moment';

const ProductItem = (props) => {
  const location = useLocation();
  const [isDeleting, setIsDeleting] = useState(false);
  const auth = useContext(AuthContext);
  const { isLoading, error, data } = useUser(props.seller); 

  const deleteClickHandler = () => {
    setIsDeleting(true);
    deleteProductMutation.mutate({
      id: props.id,
      token: auth.token,
    });
  };

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSettled: (data) => {
      console.log(data);
      props.onDeleteClicked();
    },
    onError: (error) => {
      setIsDeleting(false);
      console.log(error);
    },
  });

  if (isDeleting)
    return (
      <div className="center">
        <p>Deleted.</p>
      </div>
    );

  if (error) return "An error has occurred: " + error.message;

  let seller = <div></div>;

  if (!!data && location.pathname === "/") {
    seller = (
      <Seller
        id={props.seller}
        name={data.name}
        email={data.email}
        phone={data.phone}
      />
    );
  }

  return (
    <Card style={{width: "100%", display: "flex", justifyContent: 'space-between', flexDirection: "column"}}>
      <CardActionArea component={Link} to={"/products/id/" + props.id}>
        {!!props.image && (
          <CardMedia
            sx={{ height: 140 }}
            image={props.image}
            title={props.title}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.title}
          </Typography>
          <Typography gutterBottom variant="body2" color="text.secondary">
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Box
        sx={{ m: 1 }}
        display="flex"
        justifyContent="space-between"
        alignItems="end"
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : auth.userId !== props.seller ? (
          seller
        ) : (
          <Button danger onClick={deleteClickHandler}>
            Delete
          </Button>
        )}
        <Box>
          <Typography variant="h6">{props.price}€</Typography>
          <Typography variant="body2">
            {moment(props.created).fromNow()}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default ProductItem;
