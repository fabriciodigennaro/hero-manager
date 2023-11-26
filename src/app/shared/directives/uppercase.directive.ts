import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appUppercase]',
})
export class UppercaseDirective {
  constructor() {}

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.value != null) {
      const inputValue = inputElement.value.toUpperCase();
      inputElement.value = inputValue;
    }
  }
}
