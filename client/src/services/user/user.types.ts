export type User = {
  id: number;
  avatar?: {
    url: string;
    path: string;
  };
  idMember: string;
  parentId: string;
  joinDate: Date;
  name: string;
  email: string;
  password: string;
  role: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  parent?: {
    id: number;
    name: string;
    idMember: number;
  };
};
