import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import { PhoneCallAnswer } from '../models/phone-call-answer';

@Injectable({
  providedIn: 'root'
})
export class CallService {
  private peerConnectionSubject = new BehaviorSubject<RTCPeerConnection>(new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      {
        urls: 'turn:relay.backups.cz',
        credential: 'webrtc',
        username: 'webrtc'
      },
    ]
  }))
  audioService = new Audio();
  constructor(private socketService: Socket,
    private modalService: NzModalService,
    private router: Router) {
  }


  registerOnPhoneCallEvent() {
    this.socketService.fromEvent<any>('phone.call').subscribe((phoneCallAnswer: PhoneCallAnswer) => {
      this.audioService.src = "../../../../assets/mp3/marimba.mp3";
      this.audioService.load();
      this.audioService.play();
      this.openPhoneRiggingModal(phoneCallAnswer);
    });
  }


  openPhoneRiggingModal(phoneCallAnswer: PhoneCallAnswer): void {
    const modalRef = this.modalService.info({
      nzTitle: "Phone call received",
      nzOkText: "Answer",
      nzCancelText: "Raccrocher",
      nzOnOk: async () => {
        this.audioService.pause()
        this.router.navigate(['/dashboard/video-call'], {state : {video : phoneCallAnswer.video}})
        await this.sendAnswer(phoneCallAnswer);
      },
      nzOnCancel: () => {
        this.audioService.pause();
        modalRef.close();
      }
    })
  }

  async startCall(video = false) {
    this.peerConnection.onicecandidate = (ev: RTCPeerConnectionIceEvent) => {
      if (ev.candidate) {
        this.socketService.emit('phone.new-ice-candidate', ev.candidate)
      }
    }
    const stream: MediaStream = await this.getMediaStream(video);
    this.addTracksToPeerConnection(stream);
    let sessionDescription: RTCSessionDescriptionInit = await this.peerConnection.createOffer();
    this.peerConnection.setLocalDescription(sessionDescription);
    this.socketService.emit('phone.calling', {session : sessionDescription, video})
  }

  async sendAnswer(phoneCallAnswer: PhoneCallAnswer) {
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(phoneCallAnswer.session))
    const stream = await this.getMediaStream(phoneCallAnswer.video);
    this.addTracksToPeerConnection(stream);
    const answer = await this.peerConnection.createAnswer();
    this.peerConnection.setLocalDescription(answer)
    this.socketService.emit('phone.answer', answer);
    this.peerConnection.onicecandidate = (ev: RTCPeerConnectionIceEvent) => {
      if (ev.candidate)
        this.socketService.emit('phone.new-ice-candidate', ev.candidate)
    }
  }

  async getMediaStream(video = false): Promise<MediaStream> {
    return await navigator.mediaDevices.getUserMedia({ audio: true, video });
  }


  addTracksToPeerConnection(stream: MediaStream): void {
    stream.getTracks().forEach((track: MediaStreamTrack) => {
      this.peerConnection.addTrack(track, stream);
    });
  }


  public registerEvents() : void{
    this.socketService.fromEvent<any>('phone.answer').subscribe((answer: RTCSessionDescriptionInit) => {
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    this.socketService.fromEvent('phone.new-ice-candidate').subscribe(async (message: any) => {
      const iceCandidat = new RTCIceCandidate(message);
      try { await this.peerConnection.addIceCandidate(iceCandidat); } catch (e) { }
    })
  }

  get peerConnection() {
    return this.peerConnectionSubject.getValue()
  }
}
