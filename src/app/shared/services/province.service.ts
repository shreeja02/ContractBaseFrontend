import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {
  apiEndPoint = environment.apiEndPoint;
  allProvinces!: any[];

  constructor(private _http: HttpClient) { }

  getAllProvinces() {
    if (this.allProvinces) {
      return of(this.allProvinces);
    }
    return this._http.get(this.apiEndPoint + "Provinces")
      .pipe(map((data: any) => {
        if (data && data.success) {
          this.allProvinces = data.result;
          return this.allProvinces;
        }
        return null;
      }))
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
