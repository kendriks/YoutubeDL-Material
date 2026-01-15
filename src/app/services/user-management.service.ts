import { Injectable } from '@angular/core';
import { PostsService } from 'app/posts.services';
import { Observable } from 'rxjs';
import { User } from 'api-types';

interface UsersResponse {
  users: User[];
}

interface Role {
  name: string;
  permissions: string[];
}

interface RolesResponse {
  roles: Role[];
}

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(private postsService: PostsService) { }

  getUsers(): Observable<UsersResponse> {
    return this.postsService.getUsers();
  }

  getRoles(): Observable<RolesResponse> {
    return this.postsService.getRoles();
  }

  changeUser(userObj: User): Observable<{success: boolean}> {
    return this.postsService.changeUser(userObj);
  }

  deleteUser(userUid: string): Observable<{success: boolean}> {
    return this.postsService.deleteUser(userUid);
  }

  findUserByUid(users: User[], userUid: string): User | null {
    return users.find(user => user.uid === userUid) || null;
  }

  findUserIndex(users: User[], userUid: string): number {
    return users.findIndex(user => user.uid === userUid);
  }

  sortUsersByName(users: User[]): User[] {
    return [...users].sort((a, b) => a.name.localeCompare(b.name));
  }

  cloneUsers(users: User[]): User[] {
    return users.map(user => JSON.parse(JSON.stringify(user)));
  }
}
