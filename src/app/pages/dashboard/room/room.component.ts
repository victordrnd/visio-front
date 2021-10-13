import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { RoomModel } from 'src/app/core/models/room.model';
import { UserModel } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CallService } from 'src/app/core/services/call.service';
import { MessageService } from 'src/app/core/services/message.service';
import { RoomsService } from 'src/app/core/services/rooms.service';
import { SocketService } from 'src/app/core/services/socket.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, AfterViewInit {
  @ViewChild('messageList') messageList!: ElementRef;
  constructor(private router: Router,
    private callService: CallService,
    private activatedRoute: ActivatedRoute,
    private roomService: RoomsService,
    private messageService: MessageService,
    private authService: AuthService,
    private socketService: SocketService) { }

  current_user : any;
  room_id: number = 0;
  room: RoomModel | undefined;
  current_message = "";
  users_ids = [] as any;
  subscriptions: Array<Subscription> = [];
  ngOnInit(): void {
    this.room_id = this.activatedRoute.snapshot.params.id;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.fetchRoom();
    this.registerOnMessageSubscriber();
    this.current_user = this.authService.current_user;
  }

  ngAfterViewInit(): void {
  }

  async fetchRoom() {
    this.room = await this.roomService.show(this.room_id).toPromise();
    this.users_ids = this.room!.users!.map(user_room => user_room.user_id) as Array<any>;
    this.scrollDown();
  }

  async startCall(video = false) {
    await this.callService.startCall(video, this.users_ids);
    this.router.navigate(['/dashboard/video-call'], { state: { video: video } })
  }

  async sendMessage() {
    if (this.current_message.length) {
      const obj = {
        room_id: this.room!.id,
        type: 'text',
        message: this.current_message,
      }
      await this.messageService.send(obj).toPromise().then((res: any) => {
        console.log(res);
        const obj = {
          message: this.current_message,
          type: 'text',
          room_id: this.room!.id,
          user_id: res.user_id
        }
        this.socketService.sendMessage(obj);
        this.room?.messages?.unshift(obj);
        this.scrollDown();
      });
      this.current_message = "";
    }
  }


  registerOnMessageSubscriber() {
    this.socketService.onNewMessage().subscribe(obj => {
      this.room?.messages?.unshift(obj);
      this.scrollDown()
    })
  }


  private scrollDown() {
    this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight
    setTimeout(() => {
      const items = document.getElementsByClassName("message_container");
      items[0].scrollIntoView();
    }, 10);
  }
}


