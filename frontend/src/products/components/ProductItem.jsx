import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useContext } from "react";
import { useMutation } from "react-query";
import { useLocation, Link } from "react-router-dom";
import Button from "../../shared/components/button/Button";
import LoadingSpinner from "../../shared/components/loadingspinner/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useUser } from "../../shared/queries/useUser";
import { deleteProduct } from "../api/products";
import Seller from "./Seller";
import moment from "moment";

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
      <CardActions>
        <Seller
          id={props.seller}
          name={data.name}
          email={data.email}
          phone={data.phone}
        />
      </CardActions>
    );
  }

  return (
    <Card>
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
        <Box sx={{ m: 1 }}>
          <Typography variant="h6">{props.price}€</Typography>
          <Typography variant="body2">{moment(props.created).fromNow()}</Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default ProductItem;
