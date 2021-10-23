import { Pipe, PipeTransform } from '@angular/core';
import { RoomModel } from '../models/room.model';
import { AuthService } from '../services/auth.service';

@Pipe({
  name: 'roomTitle'
})
export class RoomTitlePipe implements PipeTransform {

  public constructor(private authService : AuthService){

  }

  transform(room: RoomModel | undefined, ...args: unknown[]): string {
    const users = room?.users?.filter(user => user.id != this.authService.current_user.id);
    return users?.map(el => el.firstname + " "+ el.lastname).join(", ") as string;
  }

}
