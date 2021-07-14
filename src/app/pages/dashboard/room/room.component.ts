import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Socket } from 'ngx-socket-io';
import { CallService } from 'src/app/core/services/call.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  constructor(private router : Router,
    private callService : CallService) { }

  ngOnInit(): void {
  
  }

 
  async startCall(video = false){
    await this.callService.startCall(video);
    this.callService.registerEvents();
    this.router.navigate(['/dashboard/video-call'], {state : {video : video}})
  }
}


