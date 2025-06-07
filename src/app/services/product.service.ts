import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs';
import { Product } from '../models/product';

interface PagedResult<T> {
  items: T[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private localCache: Product[] = [];

  /** following is created only to simulate creating unique IDs for products*/
  private generateId(): number {
    const ids = this.localCache.map((p) => p.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }

  /** previously made a mistake on url address */
  private url = 'assets/products.json';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    if (this.localCache.length) {
      return of(this.localCache);
    } else {
      return this.http.get<Product[]>(this.url).pipe(
        map((products) => {
          this.localCache = [...products];
          return this.localCache;
        })
      );
    }
  }
  getPage(
    searchTerm: string,
    page: number,
    pageSize: number,
    sort: string
  ): Observable<PagedResult<Product>> {
    return this.getAll().pipe(
      map((list) => {
        let filtered = list.filter((p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sort) {
          const [field, dir] = sort.split(',');
          const validFields = ['id', 'name', 'price', 'inStock', 'createdAt'];
          const validDirs = ['asc', 'desc'];

          if (validFields.includes(field) && validDirs.includes(dir)) {
            filtered = [...filtered].sort((a, b) => {
              const aVal = (a as any)[field];
              const bVal = (b as any)[field];
              const comp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
              return dir === 'desc' ? -comp : comp;
            });
          }
        } else {
          console.warn(`Invalid sort parameters : ${sort}.`);
        }

        const total = filtered.length;
        const start = (page - 1) * pageSize;
        const items = filtered.slice(start, start + pageSize);
        return { items, total };
      })
    );
  }

  save(product: Partial<Product>): Observable<Product> {
    const newProduct: Product = {
      id: this.generateId(),
      name: product.name ?? '',
      price: product.price ?? 0,
      inStock: product.inStock ?? 0,
      createdAt: new Date().toISOString(),
    };

    this.localCache.push(newProduct);
    return of(newProduct);
  }
}
