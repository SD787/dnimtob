import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  logoutSubject: Subject<void> = new Subject();

  constructor(public storageService: StorageService) { }

  isAuthenticated(): boolean {
    return !!this.storageService.getToken();
  }

  logInWithToken(token: string): void {
    this.storageService.storeToken(token);
  }

  logout(): void {
    this.storageService.deleteToken();
    this.logoutSubject.next();
  }

  getHttpHeaders(): any {
    return {'authorization': 'bearer ' + this.storageService.getToken()};
  }
}
