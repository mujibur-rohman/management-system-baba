import axiosInitialize from "@/config/axios.config";
import { User } from "./user.types";

export const USER_PATHNAME = "/users";

const UserService = {
  getAll: async () => {
    const res = await axiosInitialize.get<User[]>("/users");
    return res.data;
  },
  changeAvatar: async (formData: FormData) => {
    const res = await axiosInitialize.post<{
      message: string;
      data: {
        url: string;
        path: string;
      };
    }>("/users/avatar", formData);
    return res.data;
  },
  changeName: async (payload: { userId: string; name: string }) => {
    const res = await axiosInitialize.put<{
      message: string;
      data: {
        name: string;
      };
    }>(`/users/change-name/${payload.userId}`, { name: payload.name });
    return res.data;
  },
};

export default UserService;
