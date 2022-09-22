import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { pullDownAnimation } from '@shared/animations/pull-down';
import { pullUpAnimation } from '@shared/animations/pull-up';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  // -------------------------------------------------------------------------
  // Properties

  public isModalOpened: boolean;

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(private modalCtrl: ModalController) { }

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @function open
   * This method is used to open modal
   */
  public async open(component, props, className?, enterAnimation?, leaveAnimation?) {
    this.isModalOpened = true;
    const modal = await this.modalCtrl.create({
      component,
      cssClass: className,
      componentProps: props,
      enterAnimation: enterAnimation ? enterAnimation : pullUpAnimation,
      leaveAnimation: leaveAnimation ? leaveAnimation : pullDownAnimation
    });
    await modal.present();
    return new Promise((resolve, reject) => {
      modal.onDidDismiss().then((response) => {
        resolve(response);
      });
    });
  }

  /**
   * @function dismiss
   * This method is used to dismiss modal
   */
  public dismiss(context?) {
    if (this.isModalOpened) {
      this.modalCtrl.dismiss(context);
      this.isModalOpened = false;
    }
  }
}
