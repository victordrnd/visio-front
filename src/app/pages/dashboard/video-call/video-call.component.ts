import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Socket } from 'ngx-socket-io';
import { CallService } from 'src/app/core/services/call.service';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss']
})
export class VideoCallComponent implements OnInit, OnDestroy {
  @ViewChild('myVideo') video!: ElementRef;
  @ViewChild('videoFallback') videoFallback!: ElementRef;
  peerConnection!: RTCPeerConnection;
  hideVideo = false;
  isAudio : boolean = true;
  stream : MediaStream | undefined;
  constructor(private socketService: Socket,
    private callService : CallService,
    private route : ActivatedRoute) { }


  async ngOnInit(): Promise<any> {
    this.peerConnection = this.callService.peerConnection;

    
    this.peerConnection.ontrack = (ev: any) => {
      this.isAudio = ev.track.kind =="audio";
      this.video.nativeElement.srcObject = ev.streams[0];
    };
   
    this.stream = await this.callService.getMediaStream(true);
    this.videoFallback.nativeElement.srcObject = this.stream;
    this.videoFallback.nativeElement.muted = true
  }

  toggleCamera(){
    this.hideVideo = !this.hideVideo;
  }

  ngOnDestroy(): void {
    this.stream?.getTracks().forEach((track : MediaStreamTrack) => {
        track.stop();
    });
    this.callService.hangUp();
  }
}
