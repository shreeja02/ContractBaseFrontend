import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {
  apiEndPoint = environment.apiEndPoint;
  constructor(private _http: HttpClient) { }

  getAllProvinces() {
    return this._http.get(this.apiEndPoint + "Provinces");
  }

  getAllActiveProvinces() {
    return this._http.get(this.apiEndPoint + "Provinces/get/active");
  }

  addNewProvince(provinceForm: any) {
    return this._http.post(this.apiEndPoint + "Provinces", provinceForm);
  }

  editProvince(provinceForm: any, id: any) {
    return this._http.put(this.apiEndPoint + `Provinces/${id}`, provinceForm);
  }

  deleteProvince(id: any) {
    return this._http.delete(this.apiEndPoint + `Provinces/${id}`);
  }
}
