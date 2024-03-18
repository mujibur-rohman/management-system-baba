import axiosInitialize from "@/config/axios.config";
import { PaginationInterface } from "@/interface/pagination";
import MemberTypesProfile from "./member.type";

export const MEMBER_PATHNAME = "/member";

const MemberService = {
  getMyMember: async ({
    limit = 10,
    page = 1,
    q = "",
    type = "table",
    month,
    year,
  }: {
    limit?: number;
    page: number;
    q: string;
    type: "table" | "hierarchy" | "table-sign";
    year?: string;
    month?: string;
  }) => {
    const res = await axiosInitialize.get<PaginationInterface<MemberTypesProfile>>(MEMBER_PATHNAME, {
      params: {
        limit,
        page,
        q,
        type,
        month,
        year,
      },
    });
    return res.data;
  },
  addMember: async (payload: any) => {
    const res = await axiosInitialize.post<{
      message: string;
      data: {
        name: string;
        idMember: number;
      };
    }>(`${MEMBER_PATHNAME}/register`, payload);
    return res.data;
  },
  deleteMember: async (id: string) => {
    const res = await axiosInitialize.delete<{
      message: string;
    }>(`${MEMBER_PATHNAME}/${id}`);
    return res.data;
  },
  getMemberById: async (id: string) => {
    const res = await axiosInitialize.get<MemberTypesProfile>(`${MEMBER_PATHNAME}/${id}`);
    return res.data;
  },
  resetPassword: async (id: string, password: string) => {
    const res = await axiosInitialize.post<{
      message: string;
    }>(`${MEMBER_PATHNAME}/reset-password/${id}`, {
      password,
    });
    return res.data;
  },
};

export default MemberService;
