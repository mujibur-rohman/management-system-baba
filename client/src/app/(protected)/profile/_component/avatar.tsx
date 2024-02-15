import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuth from "@/hooks/useAuth";
import UserService from "@/services/user/user.service";
import { Edit2Icon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function AvatarProfile() {
  const user = useAuth();

  const changeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files) {
        const selectedPhoto = e.target.files[0];
        const formData = new FormData();
        formData.append("avatar", selectedPhoto);
        formData.append("userId", user!.user!.id.toString());
        const res = await UserService.changeAvatar(formData);
        user!.updateSession({
          ...user!.user!,
          avatar: {
            path: res.data.path,
            url: res.data.url,
          },
        });
      }
    } catch (error: any) {
      if (error?.response?.data) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error(error.message);
    }
  };
  return (
    <Avatar className="w-20 h-20 relative">
      <AvatarImage src={user?.user?.avatar?.url} alt="avatar" />
      <AvatarFallback className="text-4xl">{user?.user?.name.charAt(0)}</AvatarFallback>
      <div className="absolute left-0 right-0 bottom-0 h-6 bg-black/50 flex justify-center items-center">
        <Edit2Icon className="w-4 h-4" />
      </div>
      <label htmlFor="avatar" className="absolute z-10 inset-0 cursor-pointer"></label>
      <input id="avatar" type="file" className="hidden" onChange={changeAvatar} accept="image/*" />
    </Avatar>
  );
}

export default AvatarProfile;
