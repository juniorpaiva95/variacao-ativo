import { Component } from '@angular/core';
import * as moment from 'moment';
import { get } from 'lodash';
import { MarketDataService } from '../services/market-data.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

interface VariationResponse {
  meta: any;
  timestamp: Array<number>;
  indicators: {
    quote: Array<{
      open: Array<number>;
      close: Array<number>;
      volume: Array<number>;
      high: Array<number>;
      low: Array<number>;
    }>;
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public loading: boolean = false;
  public assetName: string = 'PETR4.SA';

  public assetVariationList: VariationResponse = {
    meta: {},
    timestamp: [],
    indicators: {
      quote: [{ open: [], close: [], volume: [], high: [], low: [] }],
    },
  };

  constructor(
    private marketDataService: MarketDataService,
    private notificationService: NzNotificationService
  ) {}

  /**
   * @description Carrega as informações através da api do yahoo;
   * @memberof AppComponent
   */
  public loadData() {
    this.loading = true;
    this.marketDataService.getAssetData(this.assetName).subscribe(
      (data) => {
        this.assetVariationList = data.chart.result[0];
        console.log(this.assetVariationList);
      },
      (err) => {
        this.loading = false;
        console.log(err);
        this.notificationService.create(
          'error',
          err?.error?.chart?.error?.code,
          err?.error?.chart?.error?.description
        );
      },
      () => (this.loading = false)
    );
  }

  /**
   * @description Recupera a informação baseada no path
   * @param {string} propertyPath
   * @return {*}  {(string | number)}
   * @memberof AppComponent
   */
  public getPropertyValue(propertyPath: string): any {
    return get(this.assetVariationList, propertyPath);
  }

  public formatDateFromUnix(unixTimestamp: number): string {
    return moment.unix(unixTimestamp).format('DD/MM/YYYY');
  }

  public formatMoney(value: string) {
    return `R$ ${Number(value).toFixed(2)}`;
  }

  /**
   * @description Calcula a variação de d-1
   * @param {number} oldValue
   * @param {number} currentValue
   * @return {*}
   * @memberof AppComponent
   */
  public calculateVariationD1(oldValue: number, currentValue: number) {
    return (((oldValue - currentValue) / oldValue) * 100).toFixed(2);
  }

  public getClassRedOrGreen(value: string): string {
    if (Number(value) < 0) return 'text-red';
    else if (Number(value) > 0) return 'text-green';
    return '';
  }
}
