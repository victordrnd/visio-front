import { Component, OnInit } from '@angular/core';
import { CallService } from 'src/app/core/services/call.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private callService : CallService) { }

  ngOnInit(): void {
    this.callService.registerOnPhoneCallEvent();
  }

}
