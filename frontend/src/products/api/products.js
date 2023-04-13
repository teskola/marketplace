export const getProducts = async () => {
    const res = await fetch(
      "http://localhost:5000/api/products"
    );
    return await res.json();
  };

export const getProductsByUser = async (id) => {
  const res = await fetch(
    "http://localhost:5000/api/products/users/" + id
  );
  return await res.json();
}

export const createProduct = async ({title, description, image, price, seller, token}) => {
  const res = await fetch(
    "http://localhost:5000/api/products", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({
        title,
        description,
        image,
        price,
        seller,
      })
    }
  );
  return await res.json();
}

export const deleteProduct = async ({id, token}) => {
  const res = await fetch(
    "http://localhost:5000/api/products/" + id,
    {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token
      }
    }
  );
  return await res.json();
}