import LoadingSpinner from "../../shared/components/loadingspinner/LoadingSpinner";
import ProductsList from "../components/ProductsList"
import { useProduct } from "../../shared/queries/useProduct";
import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getPriceRange } from "../api/products";

const Products = (props) => {
  
  const [search, setSearch] = useState(null);
  const {refetch, isLoading: loadingProduct, error: errorProduct, data: products} = useProduct(null, search);
  const {isLoading: loadingRange, error: errorRange, data: range} = useQuery("priceRange", getPriceRange);

  useEffect (() => {
    if (props.clear) {
      setSearch(null);
    }
  }, [props.clear])


  const searchProducts = (text, range) => {    
    setSearch({
      text: text,
      range: range,
    })
  }

  const resultString = () => {
    if (!search)
      return null;
    if (search.text && search.text !== "") {
      return <p>Search results for {search.text}, {search.range[0]}-{search.range[1]}€</p>
    }    
  }
    

    if (loadingProduct || loadingRange) return (
        <div className="center">
          <LoadingSpinner />
        </div>
      );
    
    if (errorProduct || errorRange) return "An error has occurred: " + error.message;
    
    return (
      <div>
        <SearchBar clear={props.clear} search={search} min={range[0].min} max={range[0].max} onSearch={searchProducts}/>
        {resultString()}
        <ProductsList items={products} update={refetch}/>
      </div>
    )
}

export default Products;