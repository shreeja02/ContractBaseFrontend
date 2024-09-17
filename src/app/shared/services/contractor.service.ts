import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractorService {
  apiEndPoint = environment.apiEndPoint;
  constructor(private _http: HttpClient) { }

  getAllContractors() {
    return this._http.get(this.apiEndPoint + "Contractors");
  }

  addNewContractor(contractorForm: any) {
    return this._http.post(this.apiEndPoint + "Contractors", contractorForm);
  }

  editContractor(contractorForm: any, id: any) {
    return this._http.put(this.apiEndPoint + `Contractors/${id}`, contractorForm);
  }

  deleteContractor(id: any) {
    return this._http.delete(this.apiEndPoint + `Contractors/${id}`);
  }

  getAllContractorsFromUser() {
    return this._http.delete(this.apiEndPoint + `Users/get/contractors`);
  }
}
