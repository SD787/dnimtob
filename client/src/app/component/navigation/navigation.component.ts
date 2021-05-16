import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from '../../service/auth-guard.service';
import { AuthService } from '../../service/auth.service';
import { NetworkService } from '../../service/communication/network.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router, private networkService: NetworkService) { }

  ngOnInit(): void {
  }

  logOut() : void {
    this.networkService.makeGetWithCredential('user/disconnect').subscribe(()=>{});
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
