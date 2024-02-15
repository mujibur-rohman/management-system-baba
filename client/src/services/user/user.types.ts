export type User = {
  id: number;
  avatar?: {
    url: string;
    path: string;
  };
  idMember: string;
  name: string;
  email: string;
  password: string;
  role: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
};
