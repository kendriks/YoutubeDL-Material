import { Injectable } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { EventEmitter } from '@angular/core';
import { Task } from 'api-types';

@Injectable({
  providedIn: 'root'
})
export class ClipboardHandlerService {

  constructor(private clipboard: Clipboard) { }

  copyErrorToClipboard(task: Task, emitter: EventEmitter<boolean>): void {
    emitter.subscribe((done: boolean) => {
      if (done) {
        this.clipboard.copy(task.error);
      }
    });
  }
}
