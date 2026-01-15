import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryPropertyService, PropertyOption } from 'app/services/category-property.service';
import { CategoryManagementService, Category } from 'app/services/category-management.service';

@Component({
  selector: 'app-edit-category-dialog',
  templateUrl: './edit-category-dialog.component.html',
  styleUrls: ['./edit-category-dialog.component.scss']
})
export class EditCategoryDialogComponent implements OnInit {
  updating = false;
  original_category: Category;
  category: Category;
  propertyOptions: PropertyOption[];
  comparatorOptions: PropertyOption[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoryPropertyService: CategoryPropertyService,
    private categoryManagementService: CategoryManagementService
  ) {
    this.propertyOptions = this.categoryPropertyService.getPropertyOptions();
    this.comparatorOptions = this.categoryPropertyService.getComparatorOptions();
    
    if (this.data?.category) {
      this.original_category = this.data.category;
      this.category = this.categoryManagementService.cloneCategory(this.original_category);
    }
  }

  ngOnInit(): void { }

  addNewRule(): void {
    this.categoryManagementService.addRuleToCategory(this.category);
  }

  saveClicked(): void {
    this.updating = true;
    this.categoryManagementService.updateCategory(this.category).subscribe(
      () => this.handleSaveSuccess(),
      err => this.handleSaveError(err)
    );
  }

  private handleSaveSuccess(): void {
    this.updating = false;
    this.original_category = this.categoryManagementService.cloneCategory(this.category);
  }

  private handleSaveError(err: unknown): void {
    this.updating = false;
    console.error(err);
  }

  categoryChanged(): boolean {
    return this.categoryManagementService.categoriesAreEqual(this.category, this.original_category);
  }

  swapRules(index1: number, index2: number): void {
    this.categoryManagementService.swapRules(this.category, index1, index2);
  }

  removeRule(index: number): void {
    this.categoryManagementService.removeRuleFromCategory(this.category, index);
  }
}
