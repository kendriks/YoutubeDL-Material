import { Injectable } from '@angular/core';
import { PostsService } from 'app/posts.services';
import { Observable } from 'rxjs';

interface LoginResponse {
  token?: string;
  user?: User;
  permissions?: Permissions;
  available_permissions?: Permissions;
}

interface RegisterResponse {
  user?: {
    name: string;
  };
}

interface User {
  uid?: string;
  name: string;
}

interface Permissions {
  [key: string]: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private postsService: PostsService) { }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.postsService.login(username, password);
  }

  register(username: string, password: string): Observable<RegisterResponse> {
    return this.postsService.register(username, password);
  }

  afterLogin(user: User, token: string, permissions: Permissions, availablePermissions: Permissions): void {
    this.postsService.afterLogin(user, token, permissions, availablePermissions);
  }

  isLoggedIn(): boolean {
    return this.postsService.isLoggedIn && localStorage.getItem('jwt_token') !== 'null';
  }

  isMultiUserMode(): boolean {
    return this.postsService.config['Advanced']['multi_user_mode'];
  }

  isRegistrationEnabled(): boolean {
    return this.postsService.config['Users'] && this.postsService.config['Users']['allow_registration'];
  }
}
