import axiosInitialize from "@/config/axios.config";
import { PaginationInterface } from "@/interface/pagination";

const PRODUCT_PATHNAME = "/product";

const ProductService = {
  getAll: async ({ limit = 10, page = 1, q = "", type = "baru" }: { limit?: number; page: number; q: string; type: string }) => {
    const res = await axiosInitialize.get<PaginationInterface<ProductTypes>>(PRODUCT_PATHNAME, {
      params: {
        limit,
        page,
        q,
        type,
      },
    });
    return res.data;
  },
  updateStock: async ({ id, stock }: { id: number; stock: number }) => {
    const res = await axiosInitialize.put<{ message: string }>(`${PRODUCT_PATHNAME}/${id}/stock`, {
      stock,
    });
    return res.data;
  },
  generate: async () => {
    const res = await axiosInitialize.post<{ message: string }>(`${PRODUCT_PATHNAME}/generate`);
    return res.data;
  },
};

export default ProductService;
