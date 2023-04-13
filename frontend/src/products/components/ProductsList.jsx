import { Grid } from "@mui/material";
import ProductItem from "./ProductItem";

const ProductsList = (props) => {

  

  return (
    <div>
      <Grid container spacing={2}>
        {props.items.map((product) => (
          <Grid key={product.id} item xs={4}>
            <ProductItem 
            id={product.id}
            image={product.image}
            title={product.title}
            description={product.description}
            price={product.price}
            seller={product.seller}
             />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ProductsList;