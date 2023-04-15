import { Alert } from "@mui/material";
import { useContext, useState } from "react";
import { useRef } from "react";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import Button from "../../shared/components/button/Button";
import Input from "../../shared/components/input/Input";
import LoadingSpinner from "../../shared/components/loadingspinner/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { createProduct } from "../api/products";

const AddProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const titleRef = useRef();
  const imageRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();

  const auth = useContext(AuthContext);
  const history = useHistory();

  const createProductMutation = useMutation({
    mutationFn: createProduct,    
    onSuccess: (data) => {
      setIsLoading(false);
      if (data.OK) {
        console.log(data);
        history.push("/");
      } else {
        setError(data.error);
      }
    },
  });

  const productSubmitHandler = (event) => {
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
    
    <form className="product-form" onSubmit={productSubmitHandler}>
      {error &&  <Alert severity="error">{error}</Alert>}
      <Input id="title" ref={titleRef} type="text" label="Title" maxLength={60} required/>
      <Input
        id="description"
        ref={descriptionRef}
        type="text"
        label="Description"
        maxLength={255}
      />
      <Input id="image" ref={imageRef} type="url" label="Image" />
      <Input id="price" ref={priceRef} type="number" min={0} label="Price" required/>
      <Button id="add-product">Add product</Button>
    </form>
  );
};

export default AddProduct;
