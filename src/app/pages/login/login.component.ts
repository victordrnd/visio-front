import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: any;
  passwordVisible : boolean = false;
  loading = true;
  constructor(private fb: FormBuilder, private authService: AuthService,
    private router: Router,
    private notificationService: NzNotificationService) {}

  async ngOnInit() {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      remember: [true]
    });
    this.loading = false;
  }

  async attempsLogin() {
    await this.authService.attemptAuth(this.form.value)
      .toPromise()
      .then(() => {
        this.router.navigate(['/dashboard']);
      }).catch(() => {
        this.notificationService.error("Erreur", "Les identifiants ne sont pas reconnus");
      });
  }



  get email() {
    return this.form.controls.email
  }

  get password() {
    return this.form.controls.password
  }

}
