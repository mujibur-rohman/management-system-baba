import axiosInitialize from "@/config/axios.config";

export const DASHBOARD_PATHNAME = "/dashboard";

const DashboardService = {
  get: async (path: string) => {
    const res = await axiosInitialize.get(`${DASHBOARD_PATHNAME}/${path}`);
    return res.data;
  },
};

export default DashboardService;
