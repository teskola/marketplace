import LoadingSpinner from "../../shared/components/loadingspinner/LoadingSpinner";
import ProductsList from "../components/ProductsList"
import { useProduct } from "../../shared/queries/useProduct";

const Products = () => {
  
    
    const {refetch, isLoading, error, data} = useProduct();

    if (isLoading) return (
        <div className="center">
          <LoadingSpinner />
        </div>
      );
    
    if (error) return "An error has occurred: " + error.message;
    
    return (
        <ProductsList items={data} update={refetch}/>
    )
}

export default Products;