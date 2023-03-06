import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MarketDataService {
  constructor(private httpClient: HttpClient) {}

  getAssetData(assetName: string = 'PETR4.SA'): Observable<any> {
    return this.httpClient.get(
      `https://cors-anywhere.herokuapp.com/query1.finance.yahoo.com/v8/finance/chart/${assetName}?&interval=1d&range=1mo`
    );
  }
}
