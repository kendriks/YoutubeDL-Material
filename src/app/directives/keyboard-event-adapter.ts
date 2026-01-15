// Adapter that encapsulates all DOM event and manipulation logic
export class KeyboardEventAdapter {
  constructor(private domHandler: NumberInputDomHandler) {}

  // Handles keydown events - returns true if event should be prevented
  handleKeyDown(key: string, ctrlKey: boolean, metaKey: boolean, shiftKey: boolean): boolean {
    const isAllowedKey = this.isAllowedKey(key, ctrlKey, metaKey);
    return !isAllowedKey && !this.isValidNumberKey(key, shiftKey);
  }

  // Handles paste events - extracts and sets digits
  handlePaste(clipboardData: string): void {
    const { NumberInputUtils } = require('./number-input.utils');
    const pastedInput = NumberInputUtils.extractDigits(clipboardData);
    this.domHandler.setValue(pastedInput);
  }

  // Handles drop events - extracts and sets digits
  handleDrop(dragData: string): void {
    const { NumberInputUtils } = require('./number-input.utils');
    const textData = NumberInputUtils.extractDigits(dragData);
    this.domHandler.focus();
    this.domHandler.setValue(textData);
  }

  private isAllowedKey(key: string, ctrlKey: boolean, metaKey: boolean): boolean {
    const { NumberInputUtils } = require('./number-input.utils');
    return (
      NumberInputUtils.isNavigationOrClipboardKey(key) ||
      NumberInputUtils.isCtrlOrCmdClipboardAction(ctrlKey, metaKey, key)
    );
  }

  private isValidNumberKey(key: string, shiftKey: boolean): boolean {
    const { NumberInputUtils } = require('./number-input.utils');
    return NumberInputUtils.isValidNumberKey(key, shiftKey);
  }
}

// Import at the end to avoid circular dependency
import { NumberInputDomHandler } from './number-input-dom-handler';
