import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useContext } from "react";
import { useMutation, useQuery } from "react-query";
import Button from "../../shared/components/button/Button";
import LoadingSpinner from "../../shared/components/loadingspinner/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { getUser } from "../../users/api/users";
import { deleteProduct } from "../api/products";
import Seller from "./Seller";

const ProductItem = (props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const auth = useContext(AuthContext);
  const { isLoading, error, data } = useQuery(["userData", props.seller], () =>
    getUser(props.seller)
  );


const deleteClickHandler = () => {
  setIsDeleting(true);
  deleteProductMutation.mutate({
    id: props.id,
    token: auth.token,
  })
}

const deleteProductMutation = useMutation({
  mutationFn: deleteProduct,
  onSettled: (data) => {
    console.log(data);
    props.onDeleteClicked();
  },
  onError: (error) => {
    setIsDeleting(false);
    console.log(error)
  },
})

if (isDeleting)
  return (
    <div className="center">
      <p>Deleted.</p>
    </div>
  )

  if (error) return "An error has occurred: " + error.message;

  return (
    <Card key={props.id}>
      <CardActionArea>
        {props.image && <CardMedia
          sx={{ height: 140 }}
          image={props.image}
          title={props.title}
        />}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.title}
          </Typography>
          <Typography gutterBottom variant="body2" color="text.secondary">
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Box sx={{ m: 2 }} display="flex" justifyContent="space-between">
        {isLoading ? <LoadingSpinner/> : (auth.userId !== props.seller ? <Seller name={data.name} email={data.email} phone={data.phone}/> : <Button danger onClick={deleteClickHandler}>Delete</Button>)}
        <Typography variant="h6">{props.price}€</Typography>
      </Box>
    </Card>
  );
};

export default ProductItem;
