import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(private router: Router, private authService : AuthService,
        private notificationService : NzNotificationService) { }

    async canActivate() {
        try {
            const result = await this.authService.populate();
            if (!result) {
              //this.notificationService.warning("Erreur authentification", "Cet espace n'est accessible qu'une fois authentifié")
              this.router.navigate(['']);
            }
            return result;
          } catch (error) {
            return false
          }
    }
}