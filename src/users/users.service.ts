import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;
const users: User[] = [
  {
    userId: 1,
    username: 'john',
    password: 'changeme',
  },
  {
    userId: 2,
    username: 'maria',
    password: 'guess',
  },
];

@Injectable()
export class UsersService {
  constructor(readonly users) {
    this.users = users;
  }

  async findOne(username: string): Promise<User | undefined> {
    return Promise.resolve(
      this.users.find((user) => user.username === username),
    );
  }
}
