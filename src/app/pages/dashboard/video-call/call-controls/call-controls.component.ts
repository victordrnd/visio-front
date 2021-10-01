import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CallService } from 'src/app/core/services/call.service';

@Component({
  selector: 'app-call-controls',
  templateUrl: './call-controls.component.html',
  styleUrls: ['./call-controls.component.scss']
})
export class CallControlsComponent implements OnInit, OnDestroy {

  isMuted: boolean = false;
  isCamera: boolean = false;
  isScreenSharing: boolean = false;
  @Output() onCameraToggled : EventEmitter<void> = new EventEmitter();
  constructor(public callService: CallService) { }


  ngOnDestroy(): void {
    this.callService.hangUp();
  }

  ngOnInit(): void {
  }

  toggleScreenSharing() {
    if (this.isScreenSharing){
      this.callService.stopScreenShare();
      this.isScreenSharing = false
    }
    else{
      this.callService.startScreenShare()
      this.isScreenSharing = true;
    }
  }

}
