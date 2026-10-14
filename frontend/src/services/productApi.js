import axios from "axios"

const productApi = axios.create({
  baseURL: "http://localhost:7777",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = async ({
  search = "",
  category = "",
  sort = "",
  page,
  limit,
} = {}) => {
  const params = {};

  if (search.trim()) {
    params.search = search.trim();
  }

  if (category) {
    params.category = category;
  }

  if (sort) {
    params.sort = sort;
  }

  if (page) {
    params.page = page;
  }

  if (limit) {
    params.limit = limit;
  }

  const response = await productApi.get("/products", {
    params,
  });

  return response.data;
};

export const getProductById = async (id) => {
  const response = await productApi.get(`/products/${id}`);

  return response.data;
};