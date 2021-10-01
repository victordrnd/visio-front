import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RoomModel } from 'src/app/core/models/room.model';
import { RoomsService } from 'src/app/core/services/rooms.service';
import { UserService } from 'src/app/core/services/user.service';
import { CreateRoomModalComponent } from '../components/create-room-modal/create-room-modal.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private roomService: RoomsService,
     private userService: UserService,
     private cdr: ChangeDetectorRef,
     private modalService : NzModalService) { }
  rooms: Array<RoomModel> = [];
  users: Array<any> = [];
  users_id: any;
  searchTerm: string | null = null;
  filteredRooms: Array<RoomModel> = [];
  ngOnInit(): void {
    this.fetchRooms();
  }


  async fetchRooms() {
    this.rooms = await this.roomService.list().toPromise();
    for (let i = 0; i < 100; i++) {
      let obj: RoomModel = {
        id: 1,
        picture: "",
        label: "test"
      }
      this.rooms.push(obj)
    }
    this.filteredRooms = Object.assign([], this.rooms);
    this.cdr.detectChanges();
  }



  openCreateRoomModal() {
    this.modalService.create({
      nzContent : CreateRoomModalComponent,
      nzTitle : "Démarrer une conversation",
      nzOnOk : (component) => {
        if(component.user_ids.length){
          
        }
      }
    })
  }


  onChange(value: any): void {
    this.filteredRooms = this.rooms.filter(room => room.label.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }


}
