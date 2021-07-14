import { Component, OnDestroy, OnInit } from '@angular/core';
import { CallService } from 'src/app/core/services/call.service';

@Component({
  selector: 'app-call-controls',
  templateUrl: './call-controls.component.html',
  styleUrls: ['./call-controls.component.scss']
})
export class CallControlsComponent implements OnInit, OnDestroy {

  constructor(public callService : CallService) { }
  ngOnDestroy(): void {
    this.callService.hangUp();
  }

  ngOnInit(): void {
  }
  

}
