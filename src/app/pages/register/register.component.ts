import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup | any;
  passwordVisible = false;
  constructor(private fb: FormBuilder, private authService: AuthService,
    private router: Router) { }

  async ngOnInit() {
    this.form = this.fb.group({
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      confirmPassword: [null, Validators.required],
      remember: [true]
    },
      {
        validator: this.MustMatch('password', 'confirmPassword')
      });


  }

  async register() {
    const user: any = await this.authService.addUser(this.form.value)
      .toPromise()
      .then(() => {
        this.router.navigate(['/dashboard/home'])
      });
  }


  get firstname() {
    return this.form.controls.firstname
  }
  get lastname() {
    return this.form.controls.lastname
  }

  get email() {
    return this.form.controls.email
  }

  get password() {
    return this.form.controls.password
  }
  get confirmPassword() {
    return this.form.controls.confirmPassword
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
}
