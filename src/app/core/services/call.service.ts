import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { PhoneCallAnswer } from '../models/phone-call-answer';
import { Location } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class CallService {
  private peerConnectionSubject = new BehaviorSubject<RTCPeerConnection>(this.openRTCConnection())
  audioService = new Audio();
  myStream !: MediaStream;
  videoTrack!: RTCRtpSender;
  constructor(private socketService: Socket,
    private modalService: NzModalService,
    private router: Router,
    private location: Location) {
  }


  registerOnPhoneCallEvent() {
    this.socketService.fromEvent<any>('phone.call').subscribe((phoneCallAnswer: PhoneCallAnswer) => {
      this.audioService.src = "../../../../assets/mp3/marimba.mp3";
      this.audioService.load();
      this.audioService.play();
      this.openPhoneRiggingModal(phoneCallAnswer);
    });

    this.peerConnection.onicecandidate = (ev: RTCPeerConnectionIceEvent) => {
      if (ev.candidate)
        this.socketService.emit('phone.new-ice-candidate', ev.candidate)
    }
    this.peerConnection.onnegotiationneeded = (ev) => {
      this.peerConnection.createOffer().then(d => this.peerConnection.setLocalDescription(d))
        .then(() => this.socketService.emit('phone.negociating', this.peerConnection.localDescription))
        .catch(e => console.log(e));
    }

    this.socketService.fromEvent<any>('phone.negociating').subscribe((sessionDescription: RTCSessionDescription) => {
      this.sendAnswer({ video: true, session: sessionDescription })
    })

    this.socketService.fromEvent<any>('phone.answer').subscribe((answer: RTCSessionDescriptionInit) => {
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    this.socketService.fromEvent('phone.new-ice-candidate').subscribe(async (message: any) => {
      const iceCandidat = new RTCIceCandidate(message);
      try { await this.peerConnection.addIceCandidate(iceCandidat); } catch (e) { }
    })
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

  async startCall(video = false, users_ids: Array<any> = []) {
    console.log(users_ids);
    this.peerConnection.onicecandidate = (ev: RTCPeerConnectionIceEvent) => {
      if (ev.candidate) {
        this.socketService.emit('phone.new-ice-candidate', ev.candidate)
      }
    }
    this.myStream = await this.getMediaStream(video);
    this.addTracksToPeerConnection(this.myStream);
    let sessionDescription: RTCSessionDescriptionInit = await this.peerConnection.createOffer();
    this.peerConnection.setLocalDescription(sessionDescription);
    console.log('Phone calling');
    this.socketService.emit('phone.calling', { session: sessionDescription, video, users_ids })
  }


  async sendAnswer(phoneCallAnswer: PhoneCallAnswer) {
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(phoneCallAnswer.session))
    const answer = await this.peerConnection.createAnswer();
    if (!this.myStream) {
      this.myStream = await this.getMediaStream(phoneCallAnswer.video);
      this.addTracksToPeerConnection(this.myStream);
    }
    this.peerConnection.setLocalDescription(answer)
    this.socketService.emit('phone.answer', answer);

  }

  async startScreenShare() {
    const stream = await this.getDisplayMediaStream();
    const screenTrack = stream.getVideoTracks()[0];
    if (this.videoTrack) {
      this.videoTrack.replaceTrack(screenTrack);
      try {
        this.videoTrack = this.peerConnection.addTrack(screenTrack, this.myStream)
      } catch (e) {
        this.myStream.getVideoTracks().forEach(track => track.enabled = true);
      }
    } else {
      console.log("no video track detected, set new ")
      this.addTracksToPeerConnection(stream)
    }
  }

  async stopScreenShare() {
    if (this.myStream) {
      this.myStream.getVideoTracks().forEach(track => {
        track.enabled = false;
      });
    }
  }

  public hangUp(): void {
    this.peerConnection.close();
    if (this.myStream) {
      this.myStream.getTracks().forEach(track => track.stop());
    }
    this.peerConnectionSubject.next(this.openRTCConnection());
    this.location.back()
  }

  async getMediaStream(video = false): Promise<MediaStream> {
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true, video: video ? {
          width: { ideal: 4096 },
          height: { ideal: 2160 },
          facingMode: "user",
        } : false
      });
    } catch (e) {
      stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
    }
    return stream;
  }

  async getDisplayMediaStream() {
    // @ts-ignore
    return await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
  }

  addTracksToPeerConnection(stream: MediaStream): void {
    stream.getTracks().forEach((track: MediaStreamTrack) => {
      this.videoTrack = this.peerConnection.addTrack(track, stream);
    });
  }


  public toggleMicrophone() {
    if (this.myStream)
      this.myStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
  }

  public toggleCamera() {
    if (this.myStream)
      this.myStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
  }

  public registerEvents(): void {

  }

  private openRTCConnection(): RTCPeerConnection {
    return new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:srv1.victordurand.fr",
          username: "visio",
          credential: "123+aze"
        }
      ]
    });
  }


  get peerConnection() {
    return this.peerConnectionSubject.getValue()
  }
}
