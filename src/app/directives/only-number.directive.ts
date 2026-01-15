// https://stackoverflow.com/a/58535434/8088021

import { Directive, HostListener, Renderer2 } from '@angular/core';
import { NumberInputUtils } from './number-input.utils';

@Directive({
  selector: '[onlyNumber]'
})
export class OnlyNumberDirective {
  constructor(private renderer: Renderer2) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const isAllowedKey =
      NumberInputUtils.isNavigationOrClipboardKey(event.key) ||
      NumberInputUtils.isCtrlOrCmdClipboardAction(event.ctrlKey, event.metaKey, event.key);

    if (isAllowedKey) {
      return;
    }

    if (!NumberInputUtils.isValidNumberKey(event.key, event.shiftKey)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const pastedInput = NumberInputUtils.extractDigits(
      event.clipboardData?.getData('text/plain') || ''
    );
    this.setInputValue(input, pastedInput);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const textData = NumberInputUtils.extractDigits(
      event.dataTransfer?.getData('text') || ''
    );
    this.renderer.setProperty(input, 'focus', true);
    this.setInputValue(input, textData);
  }

  private setInputValue(input: HTMLInputElement, value: string): void {
    this.renderer.setProperty(input, 'value', value);
    this.renderer.dispatchEvent(input, new Event('input', { bubbles: true }));
  }
}