import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toast: any = null;
  constructor(private toastCtrl: ToastController) { }

  presentToast(text: string): void {
    let toastData = {
      message: text,
      duration: 3000,
      position: 'top'
    }

    this.showToast(toastData);
  }

  presentClosableToast(text: string): void {
    let toastData = {
      message: text,
      showCloseButton: true,
      closeButtonText: 'X',
      position: 'top'
    };

    this.showToast(toastData);
  }

  private showToast(data: any): void {
    this.toast ? this.toast.dismiss() : false;
    this.toast = this.toastCtrl.create(data);
    this.toast.present();
  }
}
