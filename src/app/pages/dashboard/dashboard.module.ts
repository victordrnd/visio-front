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
import { CallControlsComponent } from './video-call/call-controls/call-controls.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@NgModule({
  declarations: [
    DashboardComponent,
    RoomComponent,
    VideoCallComponent,
    CallControlsComponent,
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
    NzCardModule,
    NzInputModule,
    NzEmptyModule,
    NzDropDownModule,
    ScrollingModule,
    NzAvatarModule,
    NzDividerModule
  ],
  bootstrap : [DashboardComponent]
})
export class DashboardModule { }
