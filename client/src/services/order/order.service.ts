import axiosInitialize from "@/config/axios.config";
import { PaginationInterface } from "@/interface/pagination";

export const ORDER_PATHNAME = "/order";

const OrderService = {
  getOrders: async ({ limit = 10, page = 1 }: { limit?: number; page: number }) => {
    const res = await axiosInitialize.get<PaginationInterface<OrderTypes>>(ORDER_PATHNAME, {
      params: {
        limit,
        page,
      },
    });
    return res.data;
  },
  addOrder: async (payload: any) => {
    const res = await axiosInitialize.post<{
      message: string;
      data: OrderTypes;
    }>(`${ORDER_PATHNAME}`, payload);
    return res.data;
  },
};

export default OrderService;
