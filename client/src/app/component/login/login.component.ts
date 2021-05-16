import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FadeAnimation } from '../../animation/FadeAnimation';
import { UserService } from '../../service/communication/user.service';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [FadeAnimation]
})
export class LoginComponent implements OnInit {

  mail = '';
  password = '';
  password2 = '';
  askSecondPassword = false;

  constructor(private userService: UserService, private notificationService: NotificationService, private router: Router) { }

  ngOnInit(): void {
  }

  login(): void {
    this.notificationService.reset();
    this.validInformation(() => {
      this.userService.connect(this.mail, this.password, () => {
        this.router.navigate(['/']);
        this.clear();
      });
    });
  }

  preSignIn(): void {
    this.notificationService.reset();
    this.validInformation(() => {
      this.askSecondPassword = true;
    });
  }
  
  signIn(): void {
    this.notificationService.reset();
    if (this.password != this.password2) {
      this.notificationService.addMessage("Passwords does not match");
      this.askSecondPassword = false;
      this.password = '';
      this.password2 = '';
      return;
    }
    this.userService.signIn(this.mail, this.password, () => {
      this.router.navigate(['/']);
      this.clear();
    }, () =>{
      this.clear();
    });
  }

  clear(): void {
    this.mail = '';
    this.password = '';
    this.password2 = '';
    this.askSecondPassword = false;
  }

  private validInformation(next:() => any) {
    if (this.mail == null || this.mail.length == 0) {
      this.notificationService.addMessage("Missing E-mail, please provide it");
      return;
    }
    if (this.password == null || this.password.length == 0) {
      this.notificationService.addMessage("Missing Password, please provide it");
      return;
    }
    const regexEmail = /^\S+@\S+\.\S+$/gi;
    if (!this.mail.match(regexEmail)) {
      this.notificationService.addMessage("E-mail is not valid");
      return;
    }
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/
    if (!this.password.match(regexPassword)) {
      this.notificationService.addMessage("Password is not strong enough. It must contains at least 1 lowercase character, 1 uppercase character, 1 numeric character and be 8 character or longer");
      return;
    }
    next();
  }

}
