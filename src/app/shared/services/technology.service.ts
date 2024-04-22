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
    return this._http.get(this.apiEndPoint + "/Technology");
  }
}
