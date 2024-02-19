import axiosInitialize from "@/config/axios.config";
import { PaginationInterface } from "@/interface/pagination";

export const MEMBER_PATHNAME = "/member";

const MemberService = {
  getMyMember: async ({ limit = 10, page = 1, q = "", type = "table" }: { limit?: number; page: number; q: string; type: "table" | "hierarchy" }) => {
    const res = await axiosInitialize.get<PaginationInterface<MemberTypesProfile>>(MEMBER_PATHNAME, {
      params: {
        limit,
        page,
        q,
        type,
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
