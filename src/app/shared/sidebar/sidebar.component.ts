import { Component, OnInit } from '@angular/core';
import { RoomModel } from 'src/app/core/models/room.model';
import { RoomsService } from 'src/app/core/services/rooms.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private roomService : RoomsService) { }
  rooms : Array<RoomModel> = [];
  ngOnInit(): void {
    this.fetchRooms();
  }


  async fetchRooms(){
    this.rooms = await this.roomService.list().toPromise();
  }

}
