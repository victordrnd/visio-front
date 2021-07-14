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
  private peerConnectionSubject = new BehaviorSubject<RTCPeerConnection>(this.openRTCConnection())
  audioService = new Audio();
  myStream !: MediaStream;
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
        this.router.navigate(['/dashboard/video-call'], { state: { video: phoneCallAnswer.video } })
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
    this.myStream = await this.getMediaStream(video);
    this.addTracksToPeerConnection(this.myStream);
    let sessionDescription: RTCSessionDescriptionInit = await this.peerConnection.createOffer();
    this.peerConnection.setLocalDescription(sessionDescription);
    this.socketService.emit('phone.calling', { session: sessionDescription, video })
  }

  async sendAnswer(phoneCallAnswer: PhoneCallAnswer) {
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(phoneCallAnswer.session))
    this.myStream = await this.getMediaStream(phoneCallAnswer.video);
    this.addTracksToPeerConnection(this.myStream);
    const answer = await this.peerConnection.createAnswer();
    this.peerConnection.setLocalDescription(answer)
    this.socketService.emit('phone.answer', answer);
    this.peerConnection.onicecandidate = (ev: RTCPeerConnectionIceEvent) => {
      if (ev.candidate)
        this.socketService.emit('phone.new-ice-candidate', ev.candidate)
    }
  }

  public hangUp() : void{
    this.peerConnection.close();
    this.myStream.getTracks().forEach(track => track.stop());
    this.peerConnectionSubject.next(this.openRTCConnection());
    history.back();
  }

  async getMediaStream(video = false): Promise<MediaStream> {
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true, video: video ? {
          width: { ideal: 4096 },
          height: { ideal: 2160 },
          facingMode: "environment"
        } : false
      });
    } catch (e) {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    }
    return stream;
  }


  addTracksToPeerConnection(stream: MediaStream): void {
    stream.getTracks().forEach((track: MediaStreamTrack) => {
      this.peerConnection.addTrack(track, stream);
    });
  }


  public toggleMicrophone(){
    this.myStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
  }

  public toggleCamera(){
      this.myStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
  }

  public registerEvents(): void {
    this.socketService.fromEvent<any>('phone.answer').subscribe((answer: RTCSessionDescriptionInit) => {
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    this.socketService.fromEvent('phone.new-ice-candidate').subscribe(async (message: any) => {
      const iceCandidat = new RTCIceCandidate(message);
      try { await this.peerConnection.addIceCandidate(iceCandidat); } catch (e) { }
    })
  }

  private openRTCConnection() : RTCPeerConnection{
    return new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
      ]
    });
  }


  get peerConnection() {
    return this.peerConnectionSubject.getValue()
  }
}
