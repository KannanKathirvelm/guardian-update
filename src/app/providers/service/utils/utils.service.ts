import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Device } from '@ionic-native/device/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GuardianUtilsService {

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(private device: Device, private platform: Platform) { }

  /**
   * @function isAndroid
   * This Method is used to find out the device is Android
   */
  public isAndroid() {
    const platform = this.device.platform;
    return platform === 'Android';
  }

  /**
   * @function isiOS
   * This Method is used to find out the device is iOS
   */
  public isiOS() {
    const platform = this.device.platform;
    return platform === 'iOS';
  }

  /**
   * @function isiOS
   * This Method is used to find out the device is Browser
   */
  public isBrowser() {
    const isCordova = this.isAndroid() || this.isiOS();
    const isDesktopOrMobile = this.platform.is('desktop') || this.platform.is('mobile');
    // isDevelopmentMode - for developer use(set true in environment to use);
    return !environment.isDevelopmentMode && (!isCordova && isDesktopOrMobile);
  }

  /**
   * @function customFadeInAnimation
   * This Method is used to add fade in animation
   */
  public customFadeInAnimation(element) {
    if (element) {
      const fadeClassesList = element.querySelectorAll('.fade-in-animate');
      let timeDelay = 0;
      fadeClassesList.forEach((fadeClass) => {
        timeDelay = timeDelay + 300;
        setTimeout(() => {
          fadeClass.classList.add('fade-in-animate-start');
        }, timeDelay);
      });
    }
  }
}
