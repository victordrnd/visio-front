import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Socket } from 'ngx-socket-io';
import { RoomModel } from 'src/app/core/models/room.model';
import { CallService } from 'src/app/core/services/call.service';
import { RoomsService } from 'src/app/core/services/rooms.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  constructor(private router : Router,
    private callService : CallService,
    private activatedRoute : ActivatedRoute,
    private roomService : RoomsService) { }

  room_id : number = 0;
  room : RoomModel | undefined;
  ngOnInit(): void {
    this.room_id = this.activatedRoute.snapshot.params.id;
    this.fetchRoom()
  }


  async fetchRoom(){
    this.room = await this.roomService.show(this.room_id).toPromise();
  }
 
  async startCall(video = false){
    await this.callService.startCall(video);
    
    this.router.navigate(['/dashboard/video-call'], {state : {video : video}})
  }
}


