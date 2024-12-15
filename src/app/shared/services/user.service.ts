import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiEndPoint = environment.apiEndPoint;
  constructor(private _http: HttpClient) { }

  getAllUsers() {
    return this._http.get(this.apiEndPoint + "Users");
  }

  getAllActiveContractorFromUser() {
    return this._http.get(this.apiEndPoint + "Users/get/contractors");
  }

  addNewUser(userForm: any) {
    return this._http.post(this.apiEndPoint + "Users", userForm);
  }

  editUser(userForm: any, id: any) {
    return this._http.put(this.apiEndPoint + `Users/${id}`, userForm);
  }

  deleteUser(id: any) {
    return this._http.delete(this.apiEndPoint + `Users/${id}`);
  }


}
