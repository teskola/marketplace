import { Alert } from "@mui/material";
import { useContext, useRef, useState } from "react";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import Button from "../../shared/components/button/Button";
import Input from "../../shared/components/input/Input";
import LoadingSpinner from "../../shared/components/loadingspinner/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { editProduct } from "../api/products";

const EditItem = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const titleRef = useRef();
  const imageRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const auth = useContext(AuthContext);
  const history = useHistory();

  const [title, setTitle] = useState(props.title);
  const [description, setDescription] = useState(props.description);
  const [image, setImage] = useState(props.image);
  const [price, setPrice] = useState(props.price);
  const [changesMade, setChangesMade] = useState(false);

  const updateProductMutation = useMutation({
    mutationFn: editProduct,
    onSuccess: (data) => {
      setIsLoading(false);
      if (data.OK) {
        setTitle(data.product.title);
        setDescription(data.product.description);
        setImage(data.product.image);
        setPrice(data.product.price);
        history.goBack();
        props.onEdit();
      } else {
        setError(data.error);
      }
    },
  });

  const submitHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    updateProductMutation.mutate({
      id: props.id,
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
        <LoadingSpinner />
      </div>
    );

  return (
    <form className="product-form" onSubmit={submitHandler}>
      {error && <Alert severity="error">{error}</Alert>}
      <Input
        defaultValue={title}
        value={title}
        id="title"
        ref={titleRef}
        type="text"
        label="Title"
        maxLength={60}
        onChange={() => setChangesMade(true)}
        required
      />
      <Input
        defaultValue={description}
        value={description}
        id="description"
        ref={descriptionRef}
        type="text"
        label="Description"
        maxLength={255}
        onChange={() => setChangesMade(true)}
      />
      <Input
        defaultValue={image}
        value={image}
        id="image"
        ref={imageRef}
        type="url"
        label="Image"
        onChange={() => setChangesMade(true)}
      />
      <Input
        defaultValue={price}
        value={price}
        id="price"
        ref={priceRef}
        type="number"
        min={0}
        label="Price"
        onChange={() => setChangesMade(true)}
        required
      />
        <Button id="confirmBtn" disabled={!changesMade}>
          Confirm changes
        </Button>
    </form>
  );
};

export default EditItem;
