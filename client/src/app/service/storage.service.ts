import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private static AUTH_TOKEN_KEY = 'authtoken';

  constructor() { }

  getToken() : String | null {
    return localStorage.getItem(StorageService.AUTH_TOKEN_KEY);
  }

  storeToken(token: string) : void {
    localStorage.setItem(StorageService.AUTH_TOKEN_KEY, token)
  }

  deleteToken() : void {
    localStorage.removeItem(StorageService.AUTH_TOKEN_KEY);
  }
}
