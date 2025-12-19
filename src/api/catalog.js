import { http } from "./http";

export const CatalogApi = {
  getCategories: async () => (await http.get("/api/categories")).data,
  getBrands: async () => (await http.get("/api/brands")).data,
  getParts: async (params) => (await http.get("/api/parts", { params })).data,
  getPart: async (id) => (await http.get(`/api/parts/${id}`)).data,
};
