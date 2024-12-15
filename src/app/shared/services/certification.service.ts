import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CertificationService {
  apiEndPoint = environment.apiEndPoint;
  constructor(private _http: HttpClient) { }

  getAllCertifications() {
    return this._http.get(this.apiEndPoint + "Certifications");
  }

  addNewCertification(certificationForm: any) {
    return this._http.post(this.apiEndPoint + "Certifications", certificationForm);
  }

  editCertification(certificationForm: any, id: any) {
    return this._http.put(this.apiEndPoint + `Certifications/${id}`, certificationForm);
  }

  deleteCertification(id: any) {
    return this._http.delete(this.apiEndPoint + `Certifications/${id}`);
  }

  getCertificationByPosition(id: any) {
    return this._http.get(this.apiEndPoint + `Certifications/get/certificationByPosition/${id}`);
  }

}
