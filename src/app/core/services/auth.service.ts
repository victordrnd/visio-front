import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { distinctUntilChanged, map, catchError } from "rxjs/operators";
import { SocketService } from "../../../app/core/services/socket.service"
import { Router } from '@angular/router';
import { UserModel } from '../models/user.model';
import { UserService } from './user.service';
import { RoomsService } from './rooms.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  current_user: any;
  public currentUser = new Subject;

  private isAuthenticatedSubject = new BehaviorSubject<any>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient,
    private router : Router,
    private socketService: SocketService,
    private roomService : RoomsService) {}

  async populate() {
    if (this.getToken()) {
      try {
        const res: any = await this.http
          .get(`${environment.apiUrl}/auth/current`)
          .toPromise();
        this.setAuth({user : res});
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
    this.current_user = user;
    if(!this.current_user.rooms){
      this.current_user.rooms = await this.roomService.list().toPromise()
    }
    this.socketService.init({user});
    this.currentUser.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  attemptAuth(credentials : any): any {
    return this.http.post(`${environment.apiUrl}/auth/login`, credentials).pipe(
      map((res: any) => {
        this.setAuth(res);
        this.socketService.init(res);
        console.log("TESTTT", res);
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
    this.currentUser.next(null);
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
