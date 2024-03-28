import Response from 'src/interfaces/response.interface';
import { User } from 'src/users/entities/user.entity';

export const userStub = (): User => {
  return {
    id: 'id',
    username: 'daniel',
    password: 'password',
    createdAt: 123,
    updatedAt: 123,
  };
};

export const responseStub = (user: User | User[]): Response<User | User[]> => {
  return {
    statusCode: 200,
    message: 'OK',
    data: user,
  };
};
