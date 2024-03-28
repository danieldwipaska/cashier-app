import { responseStub, userStub } from '../test/stubs/user.stub';

export const UsersService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(responseStub(userStub())),
  findAll: jest.fn().mockResolvedValue(responseStub([userStub()])),
  findOne: jest.fn().mockResolvedValue(responseStub(userStub())),
  update: jest.fn().mockResolvedValue(responseStub(userStub())),
  remove: jest.fn().mockResolvedValue(responseStub(userStub())),
});
