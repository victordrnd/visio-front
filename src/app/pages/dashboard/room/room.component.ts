import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  @ViewChild('myVideo') video!: ElementRef;
  @ViewChild('template') template!: any;
  peerConnection!: RTCPeerConnection;

  constructor(private zone: NgZone,
    private socketService: Socket,
    private modalService: NzModalService) { }

  ngOnInit(): void {
    this.peerConnection = new RTCPeerConnection({

      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" }
      ]

    },
    );
    this.peerConnection.ontrack = (ev: any) => {
      console.log("new track received", ev.streams)
      this.video.nativeElement.srcObject = ev.streams[0];
    };
    


    this.socketService.fromEvent<any>('phone.call').subscribe((sessionDescription: RTCSessionDescriptionInit) => {
      console.log('phone call received');
      var audio = new Audio("../../../../assets/mp3/marimba.mp3");
      audio.play();
      this.modalService.info({
        nzTitle: "Phone call received",
        nzOkText: "Answer",
        nzCancelText: "Raccrocher",
        nzOnOk: () => {
          audio.pause()
          this.sendAnswer(sessionDescription);
        }
      })
    });
    this.socketService.fromEvent<any>('phone.answer').subscribe((answer: RTCSessionDescriptionInit) => {
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    this.socketService.fromEvent('phone.new-ice-candidate').subscribe(async (message: any) => {
      const iceCandidat = new RTCIceCandidate(message);
      try{
        await this.peerConnection.addIceCandidate(iceCandidat);
      }catch(e){
      }
    })
}

startCall(type: string) {
  this.peerConnection.onicecandidate = (ev: RTCPeerConnectionIceEvent) => {
    if (ev.candidate){
      this.socketService.emit('phone.new-ice-candidate', ev.candidate)
    }
  }
  this.peerConnection.oniceconnectionstatechange = () => console.log('ICE CONNECTION STATE: ', this.peerConnection.iceConnectionState);
  navigator.mediaDevices.getUserMedia({ audio: true, video: type == 'video' })
    .then(async (stream: MediaStream) => {
      stream.getTracks().forEach((track: MediaStreamTrack) => {
        this.peerConnection.addTrack(track);
      })
      let sessionDescription: RTCSessionDescriptionInit = await this.peerConnection.createOffer();
      this.peerConnection.setLocalDescription(sessionDescription);
      console.log("phone call emited");
      this.socketService.emit('phone.calling', sessionDescription)
    }).catch(err => {
      console.log("Erreur " + err);
    });

}


sendAnswer(sessionDescription: RTCSessionDescriptionInit) {
  this.peerConnection.setRemoteDescription(new RTCSessionDescription(sessionDescription)).then(async () => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(async (stream: MediaStream) => {
        stream.getTracks().forEach((track: MediaStreamTrack) => {
          this.peerConnection.addTrack(track, stream);
        });

        const answer = await this.peerConnection.createAnswer();
        this.peerConnection.setLocalDescription(answer)
        this.socketService.emit('phone.answer', answer);
      }).catch(err => {
        console.log("Erreur " + err);
      });

  })
  this.peerConnection.onicecandidate = (ev: RTCPeerConnectionIceEvent) => {
    if (ev.candidate){
      this.socketService.emit('phone.new-ice-candidate', ev.candidate)
    }
  }
}

}


