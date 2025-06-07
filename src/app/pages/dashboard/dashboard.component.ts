import { Component, OnInit } from '@angular/core';
import { Observable, shareReplay, map } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { NgFor, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  product$!:  Observable<Product[]>;
  totalCount$!:  Observable<number>;
  lowStockCount$!:  Observable<number>;
  recent$!: Observable<Product[]>; 


  constructor(private sv: ProductService) {}

  ngOnInit () {
    this.product$ = this.sv.getAll().pipe(shareReplay(1));
    this.totalCount$ = this.product$.pipe(map(p => p.length));
    this.lowStockCount$ = this.product$.pipe(map(list => list.filter(p => p.inStock < 5).length));
    this.recent$ = this.product$.pipe(map(list => [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3)));



  }
}
