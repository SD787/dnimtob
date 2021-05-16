import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  messages:string[] = [];

  constructor() { }

  addMessage(message: string): void {
    this.messages.push(message);
  }

  removeMessage(index: number): void {
    this.messages.splice(index, 1);
  }

  reset(): void {
    this.messages = [];
  }
}
