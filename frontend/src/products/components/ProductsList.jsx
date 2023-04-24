import { Grid } from "@mui/material";
import ProductItem from "./ProductItem";

const ProductsList = (props) => {

  if (props.items.length === 0) {
    return (
      <p>No products</p>
    )
  }


  return (
    <div>
      <Grid container spacing={2} alignItems="stretch">
        {props.items.map((product) => (
          <Grid key={product.id} item style={{display: 'flex'}} xs={12} md={6} lg={4}>
            <ProductItem 
            id={product.id}
            image={product.image}
            title={product.title}
            description={product.description}
            price={product.price}
            seller={product.seller}      
            onDeleteClicked={props.update}   
            created={product.created}
             />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ProductsList;