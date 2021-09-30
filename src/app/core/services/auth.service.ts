import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { distinctUntilChanged, map, catchError } from "rxjs/operators";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<any>({});
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new BehaviorSubject<any>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient,
    private router : Router) {}

  async populate() {
    if (this.getToken()) {
      try {
        const res: any = await this.http
          .get(`${environment.apiUrl}/auth/current`)
          .toPromise();
        this.setAuth(res);
        this.isAuthenticatedSubject.next(true);
        return true;
      } catch (error) {
        this.purgeAuth();
        this.isAuthenticatedSubject.next(false);
        return false;
      }
    } else {
      this.purgeAuth();
      return false;
    }
  }

  async setAuth({ user, token }: any) {
    if (token) {
      this.saveToken(token);
    }
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  attemptAuth(credentials : any): any {
    return this.http.post(`${environment.apiUrl}/auth/login`, credentials).pipe(
      map((res: any) => {
        this.setAuth(res);
        return res;
      }),
      catchError(this.formatErrors)
    );
  }

  addUser(user: any): any {
    return this.http.post(`${environment.apiUrl}/auth/register`, user);
  }

  purgeAuth() {
    this.destroyToken();
    this.currentUserSubject.next({});
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login'])
  }

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  saveToken(token: string) {
    localStorage.setItem("token", token);
  }

  destroyToken() {
    localStorage.removeItem("token");
  }
}
