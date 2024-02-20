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
};

export default ProductService;
