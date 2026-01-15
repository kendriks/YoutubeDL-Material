// Pure utility functions for number input validation (no DOM dependencies)
export class NumberInputUtils {
  // Navigation keys that should be allowed in number inputs
  private static readonly NAVIGATION_KEYS = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste'
  ];

  private static readonly DIGITS_ONLY_REGEX = /\D/g;

  // Checks if key is a navigation or clipboard action (pure data check)
  static isNavigationOrClipboardKey(key: string): boolean {
    return NumberInputUtils.NAVIGATION_KEYS.includes(key);
  }

  // Checks if Ctrl/Cmd + A/C/V/X combination is pressed (pure data check)
  static isCtrlOrCmdClipboardAction(ctrlKey: boolean, metaKey: boolean, key: string): boolean {
    const isCtrlAction = ctrlKey && ['a', 'c', 'v', 'x'].includes(key);
    const isCmdAction = metaKey && ['a', 'c', 'v', 'x'].includes(key);
    return isCtrlAction || isCmdAction;
  }

  // Extracts digits only from a string (pure string transformation)
  static extractDigits(input: string): string {
    return input.replace(NumberInputUtils.DIGITS_ONLY_REGEX, '');
  }

  // Validates if key is numeric and shift is not pressed (pure data validation)
  static isValidNumberKey(key: string, shiftKey: boolean): boolean {
    const numericValue = Number(key);
    const isNumber = !isNaN(numericValue);
    return !shiftKey && isNumber;
  }
}
