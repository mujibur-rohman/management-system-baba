import axiosInitialize from "@/config/axios.config";
import { PaginationInterface } from "@/interface/pagination";

export const ORDER_PATHNAME = "/order";

const OrderService = {
  getOrders: async ({ limit = 10, page = 1, q, userId, month, year }: { limit?: number; page: number; q: string; userId?: string; year: string; month: string }) => {
    const res = await axiosInitialize.get<PaginationInterface<OrderTypes>>(ORDER_PATHNAME, {
      params: {
        limit,
        page,
        q,
        userId,
        month,
        year,
      },
    });
    return res.data;
  },
  getClosing: async ({ limit = 10, page = 1, q, userId, month, year }: { limit?: number; page: number; q: string; userId?: string; year: string; month: string }) => {
    const res = await axiosInitialize.get<PaginationInterface<ClosingType>>(`${ORDER_PATHNAME}/closing`, {
      params: {
        limit,
        page,
        q,
        userId,
        month,
        year,
      },
    });
    return res.data;
  },
  addClosing: async (payload: any) => {
    const res = await axiosInitialize.post<{
      message: string;
      data: ClosingType;
    }>(`${ORDER_PATHNAME}/closing`, payload);
    return res.data;
  },
  addOrder: async (payload: any) => {
    const res = await axiosInitialize.post<{
      message: string;
      data: OrderTypes;
    }>(`${ORDER_PATHNAME}`, payload);
    return res.data;
  },
  updateOrder: async ({ id, payload }: { id: number; payload: any }) => {
    const res = await axiosInitialize.put<{
      message: string;
    }>(`${ORDER_PATHNAME}/${id}`, payload);
    return res.data;
  },
  amountOrder: async ({ id, payload }: { id: number; payload: any }) => {
    const res = await axiosInitialize.put<{
      message: string;
    }>(`${ORDER_PATHNAME}/amount/${id}`, payload);
    return res.data;
  },
  confirmOrder: async ({ id, payload }: { id: number; payload: any }) => {
    const res = await axiosInitialize.post<{
      message: string;
    }>(`${ORDER_PATHNAME}/confirm/${id}`, payload);
    return res.data;
  },
  confirmClosing: async (id: number) => {
    const res = await axiosInitialize.post<{
      message: string;
    }>(`${ORDER_PATHNAME}/confirm-closing/${id}`);
    return res.data;
  },
  deleteOrder: async (id: number) => {
    const res = await axiosInitialize.delete<{
      message: string;
    }>(`${ORDER_PATHNAME}/${id}`);
    return res.data;
  },
  deleteClosing: async (id: number) => {
    const res = await axiosInitialize.delete<{
      message: string;
    }>(`${ORDER_PATHNAME}/closing/${id}`);
    return res.data;
  },
};

export default OrderService;
