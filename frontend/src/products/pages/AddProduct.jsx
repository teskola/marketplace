import { Alert } from "@mui/material";
import { useContext, useState } from "react";
import { useRef } from "react";
import { useMutation } from "react-query";
import { useHistory, useLocation, useParams } from "react-router-dom";
import Button from "../../shared/components/button/Button";
import Input from "../../shared/components/input/Input";
import LoadingSpinner from "../../shared/components/loadingspinner/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { createProduct, editProduct } from "../api/products";

const AddProduct = (props) => {

  let product = {
    id: null,
    title: null,
    description: null,
    image: null,
    price: null,
  };
  const location = useLocation();
  if (props.editMode) {
    const { handle } = useParams();
    const { title, description, image, price } = location.state;
    product.id = handle;
    product.title = title;
    product.description = description;
    product.image = image;
    product.price = price;
  }
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const titleRef = useRef();
  const imageRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const auth = useContext(AuthContext);
  const history = useHistory();

  const createProductMutation = useMutation({
    mutationFn: props.editMode ? editProduct : createProduct,    
    onSuccess: (data) => {
      setIsLoading(false);
      if (data.OK) {
        history.push("/");
      } else {
        setError(data.error);
      }
    },
  });

  const editProductSubmitHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    createProductMutation.mutate({
      id: product.id,
      title: titleRef.current.value==="" ? null : titleRef.current.value,
      image: imageRef.current.value==="" ? null : imageRef.current.value,
      description: descriptionRef.current.value==="" ? null : descriptionRef.current.value,
      price: priceRef.current.value,
      token: auth.token,
    })
  }

  const addProductSubmitHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    createProductMutation.mutate({
      title: titleRef.current.value,
      image: imageRef.current.value,
      description: descriptionRef.current.value,
      price: priceRef.current.value,
      token: auth.token,
    });   
  };

  if (isLoading)
    return (
      <div className="center">
        <LoadingSpinner/>
      </div>
    )

  return (
    
    <form className="product-form" onSubmit={props.editMode ? editProductSubmitHandler : addProductSubmitHandler}>
      {error &&  <Alert severity="error">{error}</Alert>}
      <Input defaultValue={product && product.title} id="title" ref={titleRef} type="text" label="Title" maxLength={60} required={!props.editMode}/>
      <Input
        defaultValue= {product && product.description}        
        id="description"
        ref={descriptionRef}
        type="text"
        label="Description"
        maxLength={255}
      />
      <Input defaultValue={product && product.image} id="image" ref={imageRef} type="url" label="Image" />
      <Input defaultValue={product && product.price} id="price" ref={priceRef} type="number" min={0} label="Price" required={!props.editMode}/>
      <Button id="add-product">{props.editMode ? "Confirm changes" : "Add product"}</Button>
    </form>
  );
};

export default AddProduct;
