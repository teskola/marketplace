import { useQuery } from "react-query"
import { getProductById, getProducts, getProductsByUser, searchProducts } from "../../products/api/products"

export const useProduct = (id, search) => {
    if (!id) {
        if (!search)        
            return useQuery(["allProducts"], getProducts);
        return useQuery(["searchProducts", search], () => searchProducts(search));
    }
    const isString = isNaN(id);
    if (isString)
        return useQuery(["userProducts", id], () => getProductsByUser(id));
    return useQuery(["specificProduct", id], () => getProductById(id));
}


