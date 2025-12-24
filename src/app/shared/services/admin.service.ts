import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  apiEndPoint = environment.apiEndPoint;
  private currentContractor: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private _http: HttpClient) { }

  public get currentContractor$() {
    return this.currentContractor.asObservable();
  }

  public setContractor(data: any) {
    this.currentContractor.next(data);
  }

  getAllContractors() {
    return this._http.get(this.apiEndPoint + "Admin");
  }

  getContractor(userId: string) {
    return this._http.get(this.apiEndPoint + "Admin/" + userId);
  }

  saveContractor(contractorForm: any) {
    return this._http.post(this.apiEndPoint + "Admin", contractorForm);
  }

  editContractor(contractorForm: any, id: any) {
    return this._http.put(this.apiEndPoint + `Admin/${id}`, contractorForm)
      .pipe(map((data: any) => {
        if (data && data.success) {
          this.setContractor(contractorForm);
        }
        return data;
      }));
  }

  deleteContractor(id: any) {
    return this._http.delete(this.apiEndPoint + `Admin/${id}`);
  }

  getAllContractorsFromUser() {
    return this._http.get(this.apiEndPoint + `Users/get/Admin`);
  }

  getContractorById(id: string) {
    return this._http.get(this.apiEndPoint + "Admin/" + id);
  }

  getContractorByUserId(userId: string) {
    return this._http.get(this.apiEndPoint + "Admin/user/" + userId);
  }
}
