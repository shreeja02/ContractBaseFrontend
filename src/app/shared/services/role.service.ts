import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  apiEndPoint = environment.apiEndPoint;
  constructor(private _http: HttpClient) { }

  getAllRoles() {
    return this._http.get(this.apiEndPoint + "Roles");
  }

  getAllActiveRoles() {
    return this._http.get(this.apiEndPoint + "Roles/active");
  }

  addNewRole(roleForm: any) {
    return this._http.post(this.apiEndPoint + "Roles", roleForm);
  }

  editRole(roleForm: any, id: any) {
    return this._http.put(this.apiEndPoint + `Roles/${id}`, roleForm);
  }

  deleteRole(id: any) {
    return this._http.delete(this.apiEndPoint + `Roles/${id}`);
  }
}
