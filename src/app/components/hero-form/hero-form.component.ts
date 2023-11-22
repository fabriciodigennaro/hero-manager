import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeroesService } from 'src/app/services/heroes.service';

@Component({
  selector: 'app-hero-form',
  templateUrl: './hero-form.component.html',
  styleUrls: ['./hero-form.component.scss'],
})
export class HeroFormComponent {
  action: string = 'Create';
  form: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _herosService: HeroesService,
    private _router: Router
  ) {
    this.form = this._fb.group({
      name: ['', [Validators.required]],
      description: ['', Validators.required],
    });
  }

  isInvalidField(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!field && field.invalid && field.touched;
  }

  onSubmit() {
    if (this.form.valid) {
      this._herosService.createHero({
        id: 0,
        name: this.form.get('name')?.value,
        description: this.form.get('description')?.value,
      });
      this._router.navigate(['/']);
    }
  }
}
