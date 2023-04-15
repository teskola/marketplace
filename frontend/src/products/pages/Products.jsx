import { useQuery } from "react-query";
import LoadingSpinner from "../../shared/components/loadingspinner/LoadingSpinner";
import ProductsList from "../components/ProductsList"
import {getProducts} from "../api/products"

const Products = () => {

  const updateUI = () => {
    refetch();
  }


    const {refetch, isLoading, error, data} = useQuery(
        "productsData", getProducts        
    );

    if (isLoading) return (
        <div className="center">
          <LoadingSpinner />;
        </div>
      );
    
    if (error) return "An error has occurred: " + error.message;
    
    return (
        <ProductsList items={data} update={updateUI}/>
    )
}

export default Products;