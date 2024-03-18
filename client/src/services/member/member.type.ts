import FeeTypes from "../order/fee.types";

type MemberTypesProfile = {
  id: number;
  avatar: {
    id: number;
    url: string;
  };
  idMember: string;
  name: string;
  parentId: number;
  role: string;
  joinDate: Date;
  children: MemberTypesProfile[];
  fee: FeeTypes[];
};

export default MemberTypesProfile;
