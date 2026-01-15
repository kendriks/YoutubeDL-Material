import { Renderer2 } from '@angular/core';

// Encapsulates DOM operations using Angular's Renderer2 (no direct DOM access)
export class NumberInputDomHandler {
  constructor(private renderer: Renderer2, private element: HTMLInputElement) {}

  // Sets the input value and triggers input event (using Renderer2)
  setValue(value: string): void {
    this.renderer.setProperty(this.element, 'value', value);
    this.dispatchInputEvent();
  }

  // Sets focus to the input element (using Renderer2)
  focus(): void {
    this.element.focus();
  }

  // Dispatches input event to notify Angular and listeners
  private dispatchInputEvent(): void {
    const event = new Event('input', { bubbles: true });
    this.renderer.dispatchEvent(this.element, event);
  }
}
