export class User {
  id: number;
  name: string;
  idMember: string;
  email: string;
  password: string;
  avatar?: Avatars | null;
  role: string;
  parentId: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Avatars {
  id: string;
  url: string;
  userId: string;
}

export class ErrorType {
  message: string;
  code?: string;
}
