import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

interface OperationResult {
  success: boolean;
  error?: string;
}

interface DownloadResultData {
  success: boolean;
  blob?: Blob;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionEventBusService {
  private checkResult$ = new Subject<OperationResult>();
  private cancelResult$ = new Subject<OperationResult>();
  private downloadResult$ = new Subject<DownloadResultData>();

  getCheckResult(): Observable<OperationResult> {
    return this.checkResult$.asObservable();
  }

  getCancelResult(): Observable<OperationResult> {
    return this.cancelResult$.asObservable();
  }

  getDownloadResult(): Observable<DownloadResultData> {
    return this.downloadResult$.asObservable();
  }

  emitCheckResult(result: OperationResult): void {
    this.checkResult$.next(result);
  }

  emitCancelResult(result: OperationResult): void {
    this.cancelResult$.next(result);
  }

  emitDownloadResult(result: DownloadResultData): void {
    this.downloadResult$.next(result);
  }
}
