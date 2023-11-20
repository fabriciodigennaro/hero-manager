import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-hero-form',
  templateUrl: './hero-form.component.html',
  styleUrls: ['./hero-form.component.scss'],
})
export class HeroFormComponent {
  action: string = 'Create';
  heroName = new FormControl('', [Validators.required]);

  getErrorMessage() {
    if (this.heroName.hasError('required')) {
      return 'You must enter a value';
    }

    return this.heroName.hasError('heroName') ? 'Not a valid name' : '';
  }
}
