import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../../shared/components/loadingspinner/LoadingSpinner";
import { useProduct } from "../../shared/queries/useProduct";
import { useUser } from "../../shared/queries/useUser";
import moment from "moment";

const Product = () => {
  const { handle } = useParams();
  const {
    isLoading: productIsLoading,
    error,
    data: product,
  } = useProduct(handle);
  const userId = product?.seller;
  const { isIdle, isLoading: userLoading, data: user } = useUser(userId);

  if (productIsLoading)
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );

  if (error) return "An error has occured: " + error.message;

  return (
    <Card>
      {!!product.image && (
        <CardMedia
          sx={{ height: 500 }}
          image={product.image}
          title={product.title}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h4" component="div">
          {product.title}
        </Typography>
        <Typography gutterBottom variant="body" color="text.secondary">
          {product.description}
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          textAlign="start"
        >
          <table>
            <tbody>
              <tr>
                <th>added:</th>
                <td>{moment(product.created.slice(0, -1)).format("LLL")}</td>
              </tr>
              {product.updated !== product.created ? (
                <tr>
                  <th>edited:</th>
                  <td>{product.updated}</td>
                </tr>
              ) : null}
              <tr>
                <th>price: </th>
                <td>{product.price}€</td>
              </tr>
              <tr>
                <th>seller: </th>
                <td>
                  {isIdle || userLoading ? (
                    "Loading..."
                  ) : (
                    <Link to={"/users/" + user.id}>{user.name}</Link>
                  )}
                </td>
              </tr>
              <tr>
                <th>email: </th>
                <td>{isIdle || userLoading ? "" : user.email}</td>
              </tr>
              {isIdle || userLoading
                ? ""
                : !!user.phone && (
                    <tr>
                      <th>phone: </th>
                      <td>{user.phone}</td>
                    </tr>
                  )}
            </tbody>
          </table>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Product;
