import { UserData } from "./UserData";

export class ResponseStatus {
  statusCode: number = 0;
  message: string = "";
  userData: UserData = new UserData();
}
