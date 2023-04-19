export const getProducts = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/products`
    );
    return await res.json();
  };

export const getPriceRange = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/products/range`
  );
  return await res.json();
}

export const getProductsByUser = async (id) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/products/users/${id}`
  );
  return await res.json();
}

export const getProductById = async (id) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/products/${id}`
  );
  return await res.json();
}

export const createProduct = async ({title, description, image, price, token}) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/products`, {
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
      })
    }
  );
  return await res.json();
}

export const editProduct = async ({id, title, description, image, price, token}) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/products/${id}`, {
      method: 'PUT',
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
      })
    }
  );
  return await res.json();
}

export const searchProducts = async (search) => {    
  let query = "";
  if (search.text)
    query += search.text;
  if (search.range && search.range[0])
    query += `&min=${search.range[0]}`;
  if (search.range && search.range[1])
    query += `&max=${search.range[1]}`;
  console.log(query);
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/products/search/?text=${query}`
  );
  return await res.json();
}

export const deleteProduct = async ({id, token}) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/products/${id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token
      }
    }
  );
  return await res.json();
}