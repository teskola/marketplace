const {
  describe,
  test,
  expect,
  afterAll,
  beforeAll,
} = require("@jest/globals");
const supertest = require("supertest");
const connection = require("../db/pool");
const app = require("../app");

describe("GET products endpoint", () => {
  test("should return 200", (done) => {
    supertest(app).get("/api/products").expect(200).end(done);
  });

  test("should return all products", async () => {
    const response = await supertest(app)
      .get("/api/products")
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          title: "swan rest",
          seller: "test-user-id",
        }),
        expect.objectContaining({
          id: 2,
          title: "extended spider rest",
          seller: "test-user-id",
        }),
        expect.objectContaining({
          id: 3,
          title: "rest",
          seller: "test-user-id",
        }),
      ])
    );
  });

  test("should return 200 if item by id was found", (done) => {
    supertest(app).get("/api/products/1").expect(200).end(done);
  });

  test("should return 200 and json if the item by id was found", async () => {
    const response = await supertest(app)
      .get("/api/products/1")
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: 1,
        title: "swan rest",
        image: "https://cdn.shopify.com/s/files/1/0502/5307/0504/products/swanneckplusshaft_grande.jpg?v=1612899650",
        description: "Good old swan rest.",
        price: 150,
        seller: "test-user-id",
      })
    );
  });

  test("should return 404 if id doesn't exist", async () => {
    const response = await supertest(app)
      .get("/api/products/2348743829")
      .set("Accept", "application/json");

    expect(response.status).toEqual(404);
  });

  test("should return array of products by user", async () => {
    const response = await supertest(app)
      .get("/api/products/users/test-user-id")
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          title: "swan rest",
          seller: "test-user-id",
        }),
        expect.objectContaining({
          id: 2,
          title: "extended spider rest",
          seller: "test-user-id",
        }),
        expect.objectContaining({
          id: 3,
          title: "rest",
          seller: "test-user-id",
        }),
      ])
    );
  });

  test("should find product by title", async () => {
    const response = await supertest(app)
      .get("/api/products/search/?text=extended spider rest")
      .set("Accept", "application/json");
    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 2,
          title: "extended spider rest",
          seller: "test-user-id",
        }),
      ])
    );
  });
});

describe("POST product without credentials", () => {
  test("should not create product without credentials", async () => {
    const product = {
      title: "test",
      price: 0,
    };
    const response = supertest(app)
      .post("api/products")
      .set("Accept", "application/json")
      .set("Content", "application/json")
      .set("Authorization", "Bearer " + "fake_token")
      .send(product);
    await expect(response).rejects.toThrow("connect ECONNREFUSED");
  });
});

describe("POST product with credentials", () => {
  const loggedInUser = {
    id: "",
    email: "",
    token: "",
  };

  beforeAll(async () => {
    const karl = {
      name: "Karl Marx",
      email: "marx@communism.org",
      password: "password123",
      phone: "050123123",
    };

    const response = await supertest(app)
      .post("/api/users/signup")
      .set("Accept", "application/json")
      .set("Content", "application/json")
      .send(karl);
    loggedInUser.id = response.body.id;
    loggedInUser.email = response.body.email;
    loggedInUser.token = response.body.token;
  });

  afterAll(async () => {
    connection.query("DELETE FROM users WHERE email=?", ["marx@communism.org"]);
  });

  test("should create new product", async () => {
    const product = {
      title: "The Communist manifesto",
      image:
        "https://kbimages1-a.akamaihd.net/043c4f46-7d2c-43b2-9270-b87acf1a1db7/1200/1200/False/the-communist-manifesto-a-to-z-classics.jpg",
      description:
        "The Communist Manifesto, is a political pamphlet written by German philosophers Karl Marx and Friedrich Engels.",
      price: 25,
    };

    const response = await supertest(app)
      .post("/api/products")
      .set("Accept", "application/json")
      .set("Content", "application/json")
      .set("Authorization", "Bearer " + loggedInUser.token)
      .send(product);

    expect(response.status).toEqual(201);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.product.id).toBeTruthy();
    expect(response.body.product.title).toEqual("The Communist manifesto");
    expect(response.body.product.price).toEqual(25);
  });

  test("no title", async () => {
    const product = {
      image:
        "https://kbimages1-a.akamaihd.net/043c4f46-7d2c-43b2-9270-b87acf1a1db7/1200/1200/False/the-communist-manifesto-a-to-z-classics.jpg",
      description:
        "The Communist Manifesto, is a political pamphlet written by German philosophers Karl Marx and Friedrich Engels.",
      price: 25,
    };

    const response = await supertest(app)
      .post("/api/products")
      .set("Accept", "application/json")
      .set("Content", "application/json")
      .set("Authorization", "Bearer " + loggedInUser.token)
      .send(product);

    expect(response.status).toEqual(400);
  });

  test("image not an url", async () => {
    const product = {
      title: "The Communist manifesto",
      image: "the-communist-manifesto-a-to-z-classics.jpg",
      description:
        "The Communist Manifesto, is a political pamphlet written by German philosophers Karl Marx and Friedrich Engels.",
      price: 25,
    };
    const response = await supertest(app)
      .post("/api/products")
      .set("Accept", "application/json")
      .set("Content", "application/json")
      .set("Authorization", "Bearer " + loggedInUser.token)
      .send(product);

    expect(response.status).toEqual(400);
  });

  test("price negative", async () => {
    const product = {
      title: "The Communist manifesto",
      price: -25,
    };
    const response = await supertest(app)
      .post("/api/products")
      .set("Accept", "application/json")
      .set("Content", "application/json")
      .set("Authorization", "Bearer " + loggedInUser.token)
      .send(product);

    expect(response.status).toEqual(400);
  });

  test("price not integer", async () => {
    const product = {
      title: "The Communist manifesto",
      price: 24.99,
    };
    const response = await supertest(app)
      .post("/api/products")
      .set("Accept", "application/json")
      .set("Content", "application/json")
      .set("Authorization", "Bearer " + loggedInUser.token)
      .send(product);

    expect(response.status).toEqual(400);
  });
});

describe("UPDATE and DELETE product", () => {
  const loggedInUser = {
    id: "",
    email: "",
    token: "",
  };
  const otherUser = {
    id: "",
    email: "",
    token: "",
  };

  let productId;

  beforeAll(async () => {
    const george = {
      name: "George Harrison",
      email: "george.harrison@domain.com",
      password: "password123",
    };

    const response = await supertest(app)
      .post("/api/users/signup")
      .set("Accept", "application/json")
      .set("Content", "application/json")
      .send(george);
    otherUser.id = response.body.id;
    otherUser.email = response.body.email;
    otherUser.token = response.body.token;

    const john = {
      name: "John Lennon",
      email: "john.lennon@domain.com",
      password: "password123",
    };

    const res = await supertest(app)
      .post("/api/users/signup")
      .set("Accept", "application/json")
      .set("Content", "application/json")
      .send(john);
    loggedInUser.id = res.body.id;
    loggedInUser.email = res.body.email;
    loggedInUser.token = res.body.token;

    const product = {
      title: "Sgt. Peppers Lonely Hearts Club Band",
      image:
        "https://i.discogs.com/JNbAKGFjLM_LrPZVRlNtWlYTgpUwXTZcqbC5okuCP-M/rs:fit/g:sm/q:90/h:590/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQ5OTQ5/Ny0xNDU2MDQ3Mzgz/LTk0ODkuanBlZw.jpeg",
      description:
        "Sgt. Pepper's Lonely Hearts Club Band is the eighth studio album by the English rock band the Beatles.",
      price: 40,
    };

    await supertest(app)
      .post("/api/products")
      .set("Accept", "application/json")
      .set("Content", "application/json")
      .set("Authorization", "Bearer " + loggedInUser.token)
      .send(product);

    const products = await supertest(app)
      .get("/api/products/users/" + loggedInUser.id)
      .set("Accept", "application/json");

    productId = products.body[0].id;
  });

  test("should not be able to delete other users products", async () => {
    await supertest(app)
      .delete("/api/products/" + productId)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + otherUser.token);

    const response = await supertest(app)
      .get("/api/products/" + productId)
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
  });

  /*   test("update price only", async () => {
    const data = {
      price: 10,
    }
    await supertest(app)
    .put("/api/products/" + productId)
    .set("Accept", "application/json")
    .set("Authorization", "Bearer " + loggedInUser.token)
    .send(data);
    
    const response = await supertest(app)
    .get("/api/products/" + productId)
    .set("Accept", "application/json");
    expect(response.body).toEqual(
      expect.objectContaining({        
        title: "Sgt. Peppers Lonely Hearts Club Band",
        image: "https://i.discogs.com/JNbAKGFjLM_LrPZVRlNtWlYTgpUwXTZcqbC5okuCP-M/rs:fit/g:sm/q:90/h:590/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQ5OTQ5/Ny0xNDU2MDQ3Mzgz/LTk0ODkuanBlZw.jpeg",
        description:
        "Sgt. Pepper's Lonely Hearts Club Band is the eighth studio album by the English rock band the Beatles.",
        price: 10,
      })
    );

  }) */

  test("update all fields", async () => {
    const data = {
      title: "Sgt. Peppers",
      description: "English rock",
      price: 75,
      image:
        "https://classicalbumsundays.com/wp-content/uploads/2012/05/Beatles-USE_20092h.jpg",
    };
    await supertest(app)
      .put("/api/products/" + productId)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + loggedInUser.token)
      .send(data);

    const response = await supertest(app)
      .get("/api/products/" + productId)
      .set("Accept", "application/json");
    expect(response.body).toEqual(
      expect.objectContaining({
        title: "Sgt. Peppers",
        image:
          "https://classicalbumsundays.com/wp-content/uploads/2012/05/Beatles-USE_20092h.jpg",
        description: "English rock",
        price: 75,
      })
    );
  });

  test("should be able to delete own products", async () => {
    await supertest(app)
      .delete("/api/products/" + productId)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + loggedInUser.token);

    const response = await supertest(app)
      .get("/api/products/" + productId)
      .set("Accept", "application/json");

    expect(response.status).toEqual(404);
  });

  afterAll(async () => {
    connection.query("DELETE FROM users WHERE email=? OR email=?", [
      "john.lennon@domain.com",
      "george.harrison@domain.com",
    ]);
  });
});
