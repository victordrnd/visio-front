export interface RoomModel{
    id : number,
    label : string,
    picture : string,
    messages? : Array<any>;
    users? : Array<any>;
}