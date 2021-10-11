import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private authService : AuthService,
    private socketService : SocketService) { }

  ngOnInit(): void {
  }


  reconnect(){
    this.socketService.init({user : this.authService.current_user});
    
  }
}
