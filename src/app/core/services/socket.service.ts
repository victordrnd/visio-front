import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socketService: Socket) { }


  public init(user: any): void {
    console.log("test socket 1");
    this.socketService.on('connection', () => {
      console.log("test socket 2");
      this.socketService.emit('login', user);
    });

    this.socketService.emit('login', user);
  }

  public calling(roomId: string, sessionDescription: any): void {
      this.socketService.emit('phone.calling', roomId, sessionDescription);
  }

  public answer(roomId: string, answer: any): void  {
    this.socketService.emit('phone.answer', roomId, answer);
  }

  public listenCalling(): void {
    this.socketService.on('phone.calling', (sessionDescription: any) => {
      console.log('LISTEN_CALLING : ', sessionDescription);
    })
  }

}
