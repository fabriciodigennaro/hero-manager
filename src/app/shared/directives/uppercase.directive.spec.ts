import { UppercaseDirective } from './uppercase.directive';

describe('UppercaseDirective', () => {
  it('should create an instance', () => {
    const directive = new UppercaseDirective();
    expect(directive).toBeTruthy();
  });

  it('should not throw error if event target is not available', () => {
    const directive = new UppercaseDirective();

    const event = new Event('input');
    expect(() => directive.onInput(event)).not.toThrowError();
  });

  it('should do nothing if input value is null or undefined', () => {
    const directive = new UppercaseDirective();

    const inputElement: HTMLInputElement = document.createElement('input');
    inputElement.value = null as any;
    const event = new Event('input');
    directive.onInput(event);

    expect(inputElement.value).toBe('');
  });

  it('should not affect other events', () => {
    const directive = new UppercaseDirective();

    const inputElement: HTMLInputElement = document.createElement('input');
    inputElement.value = 'test';
    const event = new Event('change');
    directive.onInput(event);

    expect(inputElement.value).toEqual('test');
  });
});
