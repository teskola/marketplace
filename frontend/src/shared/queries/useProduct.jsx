import { useQuery } from "react-query"
import { getProducts, getProductsByUser } from "../../products/api/products"

export const useProduct = (id) => {
    if (!id)
        return useQuery(["allProducts"], getProducts)
    return useQuery(["userProducts", id], () => getProductsByUser(id))
}


