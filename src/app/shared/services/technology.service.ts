import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {
  apiEndPoint = environment.apiEndPoint;
  constructor(private _http: HttpClient) { }

  getAllTechologies() {
    return this._http.get(this.apiEndPoint + "Technologies");
  }

  addNewTechnology(technologyForm: any) {
    return this._http.post(this.apiEndPoint + "Technologies", technologyForm);
  }

  editTechnology(technologyForm: any, id: any) {
    return this._http.put(this.apiEndPoint + `Technologies/${id}`, technologyForm);
  }

  deleteTechnology(id: any) {
    return this._http.delete(this.apiEndPoint + `Technologies/${id}`);
  }
}
