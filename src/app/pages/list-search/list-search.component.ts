import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
  Observable,
} from 'rxjs';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CeilPipe } from '../../shared/ceil.pipe';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-list-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CeilPipe],
  templateUrl: './list-search.component.html',
  styleUrls: ['./list-search.component.css'],
})
export class ListSearchComponent implements OnInit {
  searchCtrl = new FormControl<string>('', { nonNullable: true });

  product$!: Observable<{ items: Product[]; total: number }>;

  constructor(
    private svc: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService
  ) {}
  pageSize = 10;

  ngOnInit(): void {
    const search$ = this.searchCtrl.valueChanges.pipe(
      startWith(this.searchCtrl.value),
      debounceTime(300),
      distinctUntilChanged()
    );

    const params$ = this.route.queryParamMap.pipe(
      startWith(this.route.snapshot.queryParamMap)
    );

    this.product$ = combineLatest([
      search$,
      params$,
      this.settingsService.settings$,
    ]).pipe(
      switchMap(([term, params, settings]) => {
        const page = Number(params.get('page')) || 1;
        const sortParam = params.get('sort') || '';
        return this.svc.getPage(term, page, settings.itemsPerPage, sortParam);
      })
    );
  }

  get currentPage(): number {
    return Number(this.route.snapshot.queryParamMap.get('page')) || 1;
  }

  updatePage(page: number) {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  updateSort(field: string) {
    const raw = this.route.snapshot.queryParamMap.get('sort') || '';
    const [curField, curDir = 'asc'] = raw.split(',');
    const dir = curField === field && curDir === 'asc' ? 'desc' : 'asc';
    this.router.navigate([], {
      queryParams: { sort: `${field},${dir}` },
      queryParamsHandling: 'merge',
    });
  }
}
