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
  readonly users: User[];

  constructor() {
    this.users = users;
  }

  async findOne(username: string): Promise<User | undefined> {
    console.log(this.users);
    return Promise.resolve(
      this.users.find((user) => user.username === username),
    );
  }
}
