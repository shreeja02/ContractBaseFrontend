import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  apiEndPoint = environment.apiEndPoint;
  constructor(private _http: HttpClient) { }

  getAllCities() {
    return this._http.get(this.apiEndPoint + "Cities");
  }

  addNewCity(cityForm: any) {
    return this._http.post(this.apiEndPoint + "Cities", cityForm);
  }

  editCity(cityForm: any, id: any) {
    return this._http.put(this.apiEndPoint + `Cities/${id}`, cityForm);
  }

  deleteCity(id: any) {
    return this._http.delete(this.apiEndPoint + `Cities/${id}`);
  }

}
