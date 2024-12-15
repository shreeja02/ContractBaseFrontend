import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IndustryService {

  apiEndPoint = environment.apiEndPoint;
  constructor(private _http: HttpClient) { }

  getAllIndustries() {
    return this._http.get(this.apiEndPoint + "industry");
  }

  getAllActiveIndustries() {
    return this._http.get(this.apiEndPoint + "industry/get/active");
  }

  addNewIndustry(industryForm: any) {
    return this._http.post(this.apiEndPoint + "industry", industryForm);
  }

  editIndustry(industryForm: any, id: any) {
    return this._http.put(this.apiEndPoint + `industry/${id}`, industryForm);
  }

  deleteIndustry(id: any) {
    return this._http.delete(this.apiEndPoint + `industry/${id}`);
  }

}
