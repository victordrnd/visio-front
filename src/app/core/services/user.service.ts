import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  connectedUsersList: Array<any> = []; 
  constructor(private http : HttpClient, private socket: SocketService) { 
    // this.registerUsersConnection();
  }


  list() : Observable<any>{
    return this.http.get(environment.apiUrl + "/users");
  }

  registerUsersConnection(): void {
    this.socket.onNewConnection().subscribe(res => {
      this.connectedUsersList = res;
    })
  }
}
