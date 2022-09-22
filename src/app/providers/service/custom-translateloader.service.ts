import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { TranslateLoader } from '@ngx-translate/core';
import { HttpService } from '@providers/apis/http';
import { LoadingService } from '@shared/providers/service/loader.service';
import { StorageService } from '@shared/providers/service/store.service';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class CustomTranslateLoader implements TranslateLoader {

  private namespace = 'api/guardian/v1/gd-users';

  constructor(
    private httpService: HttpService,
    private loaderService: LoadingService,
    private storageService: StorageService
  ) { }

  public getTranslation(lang: string) {
    const endpoint = `${this.namespace}/translation/labels`;
    const queryParams = {
      app_id: environment.TRANSLATION_APP_ID
    };
    if (lang) {
      queryParams['language'] = lang;
    }
    return new Observable((observer) => {
      this.loaderService.displayLoader();
      const translationKey = `translation_${lang}`;
      this.httpService.get(endpoint, queryParams).then((res) => {
        const translationLabels = res.data.translationLabels;
        this.storageService.setStorage(translationKey, translationLabels);
        observer.next(translationLabels);
        observer.complete();
      }, () => {
        this.storageService.getStorage(translationKey).then((translationLabels) => {
          observer.next(translationLabels);
          observer.complete();
        }).finally(() => {
          this.loaderService.dismissLoader();
        });
      }).finally(() => {
        this.loaderService.dismissLoader();
      });
    });
  }
}
