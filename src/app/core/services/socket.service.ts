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
    console.log("Init socket");
    this.socketService.emit('login', data.user);
  }

  public onNewConnection(): Observable<any> {
    return this.socketService.fromEvent<any>('new.user');
  }

  public calling(roomId: string, sessionDescription: any): void {
      this.socketService.emit('phone.calling', roomId, true,  sessionDescription);
  }

  public answer(roomId: string, answer: any): void  {
    this.socketService.emit('phone.answer', roomId, answer);
  }

  
  public listenCalling(): void {
    this.socketService.on('phone.calling', (sessionDescription: any) => {
      console.log('LISTEN_CALLING : ', sessionDescription);
    })
  }


  //Messages
  public sendMessage(obj : any){
    this.socketService.emit('message.new', obj);
  }

  public onNewMessage(): Observable<any>  {
    return this.socketService.fromEvent<any>('message.send');
  }

}
