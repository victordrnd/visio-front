import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Socket } from 'ngx-socket-io';
import { CallService } from 'src/app/core/services/call.service';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss']
})
export class VideoCallComponent implements OnInit {
  @ViewChild('myVideo') video!: ElementRef;
  @ViewChild('videoFallback') videoFallback!: ElementRef;
  peerConnection!: RTCPeerConnection;
  hideVideo = false;
  constructor(private socketService: Socket,
    private callService : CallService,
    private route : ActivatedRoute) { }

  async ngOnInit(): Promise<any> {
    this.peerConnection = this.callService.peerConnection;

    
    this.peerConnection.ontrack = (ev: any) => {
      this.video.nativeElement.srcObject = ev.streams[0];
    };
   
    const stream = await this.callService.getMediaStream(true);
    this.videoFallback.nativeElement.srcObject = stream;
  }

  toggleCamera(){
    this.hideVideo = !this.hideVideo;
  }
}
