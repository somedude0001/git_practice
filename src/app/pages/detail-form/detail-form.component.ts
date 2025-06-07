import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';

@Component({
  selector: 'app-detail-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './detail-form.component.html',
  styleUrl: './detail-form.component.css',
})
export class DetailFormComponent {
  @Output() save = new EventEmitter<Partial<Product>>();
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    price: new FormControl(0, [Validators.min(0), Validators.required]),
    inStock: new FormControl(0, [Validators.min(0), Validators.required]),
  });
  submit() {
    if (this.form.valid) {
      const formValues = this.form.value;
      const submitData = {
        name: formValues.name ?? '',
        price: Number(formValues.price),
        inStock: Number(formValues.inStock),
      };
      this.save.emit(submitData);
    } else {
      console.log('Form is invalid.');
    }
  }
}
