import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Socket } from 'ngx-socket-io';
import { RoomModel } from 'src/app/core/models/room.model';
import { UserModel } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CallService } from 'src/app/core/services/call.service';
import { MessageService } from 'src/app/core/services/message.service';
import { RoomsService } from 'src/app/core/services/rooms.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, AfterViewInit {
  @ViewChild('messageList') messageList!: CdkVirtualScrollViewport;
  constructor(private router: Router,
    private callService: CallService,
    private activatedRoute: ActivatedRoute,
    private roomService: RoomsService,
    private messageService: MessageService,
    private authService: AuthService) { }


  room_id: number = 0;
  room: RoomModel | undefined;
  current_message = "";
  ngOnInit(): void {
    this.room_id = this.activatedRoute.snapshot.params.id;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.fetchRoom();
  }

  ngAfterViewInit(): void {
  }

  async fetchRoom() {
    this.room = await this.roomService.show(this.room_id).toPromise();
    this.scrollDown();
  }

  async startCall(video = false) {
    const users_ids = this.room!.users!.map(user_room => user_room.user_id);
    await this.callService.startCall(video, users_ids);
    this.router.navigate(['/dashboard/video-call'], { state: { video: video } })
  }

  async sendMessage() {
    console.log(this.current_message);
    if (this.current_message.length) {
      const obj = {
        room_id: this.room!.id,
        type: 'text',
        message: this.current_message
      }
      await this.messageService.send(obj).toPromise();
      this.current_message = "";
    }
  }


  private scrollDown() {
    //console.log(this.messageList.elementRef.nativeElement)
    this.messageList.scrollToIndex(this.room!.messages!.length - 1);
    setTimeout(() => {
      const items = document.getElementsByClassName("message_container");
      items[0].scrollIntoView();
    }, 10);
  }
}


