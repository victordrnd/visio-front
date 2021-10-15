import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RoomModel } from 'src/app/core/models/room.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { RoomsService } from 'src/app/core/services/rooms.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { UserService } from 'src/app/core/services/user.service';
import { CreateRoomModalComponent } from '../components/create-room-modal/create-room-modal.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private roomService: RoomsService,
     private authService: AuthService,
     private cdr: ChangeDetectorRef,
     private modalService : NzModalService,
     private socketService : SocketService) { }
  rooms: Array<RoomModel> = [];
  users: Array<any> = [];
  users_id: any;
  searchTerm: string | null = null;
  filteredRooms: Array<RoomModel> = [];
  ngOnInit(): void {
    this.fetchRooms();

    this.socketService.onRoomCreated().subscribe(() => {
      this.fetchRooms();
    })

    this.socketService.onNewMessage().subscribe(obj => {
      this.fetchRooms();
    })
  }


  async fetchRooms() {
    this.rooms = await this.roomService.list().toPromise();
    this.authService.current_user.rooms = this.rooms;
    this.filteredRooms = Object.assign([], this.rooms);
    this.cdr.detectChanges();
  }



  openCreateRoomModal() {
    this.modalService.create({
      nzContent : CreateRoomModalComponent,
      nzTitle : "Démarrer une conversation",
      nzOnOk : (component) => {
        if(component.user_ids.length){
          this.roomService.store(component.user_ids).toPromise().then(res => {
            //Send to users socket
            this.socketService.createRoom(component.user_ids);
            this.fetchRooms();
          });
        }
      }
    })
  }


  onChange(value: any): void {
    this.filteredRooms = this.rooms.filter(room => room.label.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  registerOnMessageSubscriber() {
    
  }


}
