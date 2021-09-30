import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RoomModel } from 'src/app/core/models/room.model';
import { RoomsService } from 'src/app/core/services/rooms.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private roomService: RoomsService,private userService : UserService, private cdr: ChangeDetectorRef) { }
  rooms: Array<RoomModel> = [];
  users: Array<any> = [];
  users_id :any;
  filteredRooms : Array<RoomModel> = [];
  ngOnInit(): void {
    this.fetchRooms();
    this.fetchUsers();

  }


  async fetchRooms() {
    this.rooms = await this.roomService.list().toPromise();
    this.filteredRooms = Object.assign([], this.rooms);
    this.cdr.detectChanges();
  }


  async fetchUsers(){
    //this.users = await this.userService.list().toPromise()
  }

  onChange(value: string): void {
    this.filteredRooms = this.rooms.filter(room => room.label.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }


}
