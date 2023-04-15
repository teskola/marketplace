import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getProductsByUser } from "../../products/api/products";
import ProductsList from "../../products/components/ProductsList";
import LoadingSpinner from "../../shared/components/loadingspinner/LoadingSpinner";
import User from "../components/User";

const Profile = () => {
    const {handle} = useParams();    
    const {refetch, isLoading, error, data} = useQuery(["userProducts", handle], () =>
    getProductsByUser(handle));

    if (isLoading)
        return (
            <div className="center">
                <LoadingSpinner/>;
            </div>
        );
    if (error) return "An error has occured: " + error.message;

    return(
        <div>
            <User id={handle}/>
            <h3>Products</h3>
            <ProductsList items={data} update={refetch}/>
        </div>
    )

}

export default Profile;