import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  apiEndPoint = environment.apiEndPoint;
  allCities!: any[];

  constructor(private _http: HttpClient) { }

  getAllCities() {
    if (this.allCities) {
      return of(this.allCities)
    }
    return this._http.get(this.apiEndPoint + "Cities")
      .pipe(map((data: any) => {
        if (data && data.success) {
          this.allCities = data.result;
          return this.allCities;
        }
        return null;
      }))
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

  getCitiesByProvince(id: any) {
    return this._http.get(this.apiEndPoint + `Cities/${id}`);
  }

}
