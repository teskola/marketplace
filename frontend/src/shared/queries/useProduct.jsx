import { useQuery } from "react-query"
import { getProductById, getProducts, getProductsByUser } from "../../products/api/products"

export const useProduct = (id) => {
    if (!id)
        return useQuery(["allProducts"], getProducts)
    const isString = isNaN(id);
    if (isString)
        return useQuery(["userProducts", id], () => getProductsByUser(id));
    return useQuery(["specificProduct", id], () => getProductById(id));
}


