import { Injectable } from '@angular/core';
import * as sha1 from 'crypto-js/sha1';
import { AuthService } from '../auth.service';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private networkService: NetworkService, private authService: AuthService) { }

  connect(mail: string, password: string, next: ()=>void): void {
    const cryptedPassword = sha1(password).toString();
    this.networkService.makePostWithoutCredential('user/connect', {'mail': mail, 'password': cryptedPassword})
    .subscribe((obj) => {
      if (obj.token) {
        this.authService.logInWithToken(obj.token);
        next();
      }
    });
  }

  disconnect(next: ()=>void): void {
    this.networkService.makeGetWithCredential('user/disconnect')
    .subscribe((obj) => {
        next();
    });
  }

  signIn(mail: string, password: string, next: ()=>void, err: ()=>void): void {
    const cryptedPassword = sha1(password).toString();
    this.networkService.makePostWithoutCredential('user/create', {'mail': mail, 'password': cryptedPassword})
    .subscribe((obj) => {
      if (obj.token) {
        this.authService.logInWithToken(obj.token);
        next();
      }
    }, () => {
      err();
    });
  }

}
