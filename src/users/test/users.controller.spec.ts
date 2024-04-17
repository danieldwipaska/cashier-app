// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersController } from '../users.controller';
// import { UsersService } from '../users.service';
// import { User } from '../entities/user.entity';
// import { responseStub, userStub } from './stubs/user.stub';
// import Response from 'src/interfaces/response.interface';

// jest.mock('../users.service');

// describe('UsersController', () => {
//   let controller: UsersController;
//   let service: UsersService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UsersController],
//       providers: [UsersService],
//     }).compile();

//     controller = module.get<UsersController>(UsersController);
//     service = module.get<UsersService>(UsersService);
//     jest.clearAllMocks();
//   });

//   describe('find a user', () => {
//     describe('when findOne is called', () => {
//       let response: Response<User>;

//       beforeEach(async () => {
//         response = await controller.findOne(userStub().id);
//       });

//       test('it should call usersService', () => {
//         expect(service.findOne).toHaveBeenCalledWith(userStub().id);
//       });

//       test('it should return user response', () => {
//         expect(response).toEqual(responseStub(userStub()));
//       });
//     });
//   });
// });
