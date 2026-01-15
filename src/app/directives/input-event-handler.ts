// Command pattern: adapter returns instructions instead of executing DOM operations
export interface EventHandlerCommand {
  preventDefault: boolean;
  action?: () => void;
}

export class InputEventHandler {
  constructor(private domHandler: NumberInputDomHandler) {}

  handleKeyDown(key: string, ctrlKey: boolean, metaKey: boolean, shiftKey: boolean): EventHandlerCommand {
    const { NumberInputUtils } = require('./number-input.utils');
    const isAllowedKey =
      NumberInputUtils.isNavigationOrClipboardKey(key) ||
      NumberInputUtils.isCtrlOrCmdClipboardAction(ctrlKey, metaKey, key);

    if (isAllowedKey) {
      return { preventDefault: false };
    }

    const shouldPrevent = !NumberInputUtils.isValidNumberKey(key, shiftKey);
    return { preventDefault: shouldPrevent };
  }

  handlePaste(pastedText: string): EventHandlerCommand {
    const { NumberInputUtils } = require('./number-input.utils');
    const pastedInput = NumberInputUtils.extractDigits(pastedText);
    return {
      preventDefault: true,
      action: () => this.domHandler.setValue(pastedInput)
    };
  }

  handleDrop(dragText: string): EventHandlerCommand {
    const { NumberInputUtils } = require('./number-input.utils');
    const textData = NumberInputUtils.extractDigits(dragText);
    return {
      preventDefault: true,
      action: () => {
        this.domHandler.focus();
        this.domHandler.setValue(textData);
      }
    };
  }
}

// Import at the end to avoid circular dependency
import { NumberInputDomHandler } from './number-input-dom-handler';
