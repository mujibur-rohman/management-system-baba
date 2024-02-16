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
};
