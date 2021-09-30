import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { RoomModel } from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  constructor(private http : HttpClient) { }


  public list() : Observable<Array<RoomModel>> {
    return this.http.get(environment.apiUrl + "/my/rooms").pipe(map((res: any) => res.rooms));
  }

  public show(room_id : number) : Observable<RoomModel>{
    return this.http.get(environment.apiUrl + `/rooms/${room_id}`) as Observable<RoomModel>;
  }
}
