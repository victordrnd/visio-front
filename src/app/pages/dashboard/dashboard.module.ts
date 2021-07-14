import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { SharedModule } from 'src/app/shared/shared.module';
import { RoomComponent } from './room/room.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { FormsModule } from '@angular/forms';
import { SocketIoModule } from 'ngx-socket-io';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { VideoCallComponent } from './video-call/video-call.component';
@NgModule({
  declarations: [
    DashboardComponent,
    RoomComponent,
    VideoCallComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    SharedModule,
    NzButtonModule,
    NzSliderModule,
    SocketIoModule,
  ],
  bootstrap : [DashboardComponent]
})
export class DashboardModule { }
