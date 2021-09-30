import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-create-room-modal',
  templateUrl: './create-room-modal.component.html',
  styleUrls: ['./create-room-modal.component.scss']
})
export class CreateRoomModalComponent implements OnInit {

  constructor(private userService: UserService) { }
  users: Array<any> = [];

  user_ids : Array<number> =  []
  ngOnInit(): void {
    this.fetchUsers();
  }

  async fetchUsers() {
    this.users = await this.userService.list().toPromise()
  }
}
