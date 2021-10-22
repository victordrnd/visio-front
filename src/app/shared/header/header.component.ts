import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { RoomModel } from 'src/app/core/models/room.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CallService } from 'src/app/core/services/call.service';
import { RoomsService } from 'src/app/core/services/rooms.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(
    private authService : AuthService,
    private socketService : SocketService,
    private roomService : RoomsService,
    private router : Router,
    private callService : CallService,
    private notificationService : NzNotificationService) { }
 
    subscriptions : Array<Subscription> = [];
    room : RoomModel | undefined;
    users_ids : Array<number> = [];
  ngOnInit(): void {
    const sb = this.roomService.currentRoom.pipe(distinctUntilChanged()).subscribe(room => {
      this.room = room;
      this.users_ids = this.room!.users!.map(user_room => user_room.user_id) as Array<any>;
    })
    this.subscriptions.push(sb);
  }


  reconnect(){
    this.socketService.init({user : this.authService.current_user});
  }

  disconnect(){
    this.authService.purgeAuth();
    this.router.navigate(['']);
    this.notificationService.success('Succès',"Vous avez été déconnecté avec succès");
  }


  async startCall(video = false) {
    await this.callService.startCall(video, this.users_ids);
    this.router.navigate(['/dashboard/video-call'], { state: { video: video } })
  }


  ngOnDestroy(): void {
   this.subscriptions.map(sb => sb.unsubscribe())
  }
}
