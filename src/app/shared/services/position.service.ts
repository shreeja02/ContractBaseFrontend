import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  apiEndPoint = environment.apiEndPoint;
  constructor(private _http: HttpClient) { }

  getAllPositions() {
    return this._http.get(this.apiEndPoint + "Positions");
  }

  getAllActivePositions() {
    return this._http.get(this.apiEndPoint + "Positions/get/active");
  }

  addNewPosition(positionForm: any) {
    return this._http.post(this.apiEndPoint + "Positions", positionForm);
  }

  editPosition(positionForm: any, id: any) {
    return this._http.put(this.apiEndPoint + `Positions/${id}`, positionForm);
  }

  deletePosition(id: any) {
    return this._http.delete(this.apiEndPoint + `Positions/${id}`);
  }

}
