import { useQuery } from "react-query";
import { getProductsByUser } from "../../products/api/products";
import ProductsList from "../../products/components/ProductsList";
import LoadingSpinner from "../../shared/components/loadingspinner/LoadingSpinner";

const Profile = (props) => {
    const {isLoading, error, data} = useQuery(["userProducts", props.id], () =>
    getProductsByUser(props.id));

    if (isLoading)
        return (
            <div className="center">
                <LoadingSpinner/>;
            </div>
        );
    if (error) return "An error has occured: " + error.message;

    return(
        <div>
            <h2>{props.name}</h2>
            <ProductsList items={data}/>
        </div>
    )

}

export default Profile;