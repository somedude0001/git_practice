import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { DetailFormComponent } from '../detail-form/detail-form.component';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [CommonModule, DetailFormComponent],
  templateUrl: './detail-page.component.html',
  styleUrl: './detail-page.component.css',
})
export class DetailPageComponent {
  constructor(private productService: ProductService) {}
  savedProductName: string | null = null;
  handleSave(product: Partial<Product>) {
    this.productService.save(product).subscribe((saved) => {
      console.log('Saved product:', saved);
      this.savedProductName = saved.name;
    });
  }
}
