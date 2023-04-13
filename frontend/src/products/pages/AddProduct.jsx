import { useContext } from "react";
import { useRef } from "react";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import Button from "../../shared/components/button/Button";
import Input from "../../shared/components/input/Input";
import { AuthContext } from "../../shared/context/auth-context";
import { createProduct } from "../api/products";

const AddProduct = () => {
  const titleRef = useRef();
  const imageRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();

  const auth = useContext(AuthContext);
  const history = useHistory();

  const createProductMutation = useMutation({
    mutationFn: createProduct,
  });

  const productSubmitHandler = (event) => {
    event.preventDefault();
    createProductMutation.mutate({
      title: titleRef.current.value,
      image: imageRef.current.value,
      description: descriptionRef.current.value,
      price: priceRef.current.value,
      token: auth.token,
      seller: auth.userId,
    });
    history.push("/");
  };

  return (
    <form className="product-form" onSubmit={productSubmitHandler}>
      <Input id="title" ref={titleRef} type="text" label="Title" />
      <Input
        id="description"
        ref={descriptionRef}
        type="text"
        label="Description"
      />
      <Input id="image" ref={imageRef} type="text" label="Image" />
      <Input id="price" ref={priceRef} type="number" label="Price" />
      <Button id="add-product">Add product</Button>
    </form>
  );
};

export default AddProduct;
