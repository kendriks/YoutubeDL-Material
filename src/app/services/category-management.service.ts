import { Injectable } from '@angular/core';
import { PostsService } from 'app/posts.services';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Category {
  rules: Rule[];
  [key: string]: any;
}

export interface Rule {
  preceding_operator: string;
  property: string;
  comparator: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryManagementService {

  constructor(private postsService: PostsService) { }

  cloneCategory(category: Category): Category {
    return JSON.parse(JSON.stringify(category));
  }

  createNewRule(): Rule {
    return {
      preceding_operator: 'or',
      property: 'fulltitle',
      comparator: 'includes',
      value: ''
    };
  }

  addRuleToCategory(category: Category): void {
    category.rules.push(this.createNewRule());
  }

  removeRuleFromCategory(category: Category, index: number): void {
    category.rules.splice(index, 1);
  }

  swapRules(category: Category, index1: number, index2: number): void {
    [category.rules[index1], category.rules[index2]] = [category.rules[index2], category.rules[index1]];
  }

  categoriesAreEqual(cat1: Category, cat2: Category): boolean {
    return JSON.stringify(cat1) === JSON.stringify(cat2);
  }

  updateCategory(category: Category): Observable<any> {
    return this.postsService.updateCategory(category).pipe(
      tap(() => this.postsService.reloadCategories())
    );
  }
}
