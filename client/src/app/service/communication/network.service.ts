import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../notification.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(private http: HttpClient, private notitifcationService: NotificationService, private authService: AuthService, private router: Router) { }

  makePostWithoutCredential(endpoint: string, body: object): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/' + endpoint, body)
      .pipe(
        catchError((err, obj) => {
          if (err.error) {
            this.notitifcationService.addMessage(err.error);
          } else {
            this.notitifcationService.addMessage("Unknown error");
          }
          return throwError(err);
        })
      );
  }

  makePostWithCredential(endpoint: string, body: object): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/' + endpoint, body, {headers: this.authService.getHttpHeaders()})
      .pipe(
        catchError((err, obj) => {
          if (err.status == 403) {
            this.authService.logout();
            this.notitifcationService.addMessage("You have been disconnected");
            this.router.navigate(['/login']);
          } else {
            if (err.error) {
              this.notitifcationService.addMessage(err.error);
            } else {
              this.notitifcationService.addMessage("Unknown error");
            }
          }
          return throwError(err);
        })
      );
  }

  makeGetWithCredential(endpoint: string): Observable<any> {
    return this.http.get(environment.baseApiUrl + '/' + endpoint, {headers: this.authService.getHttpHeaders()})
      .pipe(
        catchError((err, obj) => {
          if (err.status == 403) {
            this.notitifcationService.addMessage("You have been disconnected");
            this.router.navigate(['/login']);
          } else {
            if (err.error) {
              this.notitifcationService.addMessage(err.error);
            } else {
              this.notitifcationService.addMessage("Unknown error");
            }
          }
          return throwError(err);
        })
      );
  }


}
