import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socketService: Socket) { }


  public init(data: any): void {
    console.log(data);
    console.log("Init socket");
    this.socketService.emit('login', data.user);
  }

  public onNewConnection(): Observable<any> {
    return this.socketService.fromEvent<any>('new.user');
  }

  public calling(roomId: string, sessionDescription: any): void {
      this.socketService.emit('phone.calling', roomId, sessionDescription);
  }

  public answer(roomId: string, answer: any): void  {
    this.socketService.emit('phone.answer', roomId, answer);
  }

  public newMessage(): void  {
    this.socketService.on('message.send', (message: string, type: string) => {
      console.log('New message ', message, type);
    });
  }

  public listenCalling(): void {
    this.socketService.on('phone.calling', (sessionDescription: any) => {
      console.log('LISTEN_CALLING : ', sessionDescription);
    })
  }

}
