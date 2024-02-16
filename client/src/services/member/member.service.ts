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
};

export default MemberService;
