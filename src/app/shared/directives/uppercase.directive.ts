import { Directive, HostListener, NgModule } from '@angular/core';

@Directive({
  selector: '[appUppercase]',
})
export class UppercaseDirective {
  constructor() {}

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value.toUpperCase();
    inputElement.value = inputValue;
  }
}
