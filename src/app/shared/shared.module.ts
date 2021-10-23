import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { HeaderComponent } from './header/header.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { RouterModule } from '@angular/router';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CreateRoomModalComponent } from './components/create-room-modal/create-room-modal.component'
import { RoomTitlePipe } from '../core/pipes/room-title.pipe';
@NgModule({
  declarations: [
    SidebarComponent,
    HeaderComponent,
    CreateRoomModalComponent,
    RoomTitlePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    NzMenuModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzEmptyModule,
    NzAvatarModule,
    NzDividerModule,
    NzInputModule,
    RouterModule,
    NzCommentModule,
    NzSelectModule,
    NzAutocompleteModule,
    ScrollingModule,
  ],
  exports : [SidebarComponent,HeaderComponent, NzIconModule, RoomTitlePipe],
  entryComponents : [CreateRoomModalComponent]
})
export class SharedModule { }
