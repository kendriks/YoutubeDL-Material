import { Injectable } from '@angular/core';
import { PostsService } from '../posts.services';
import { MatDialog } from '@angular/material/dialog';
import { InputDialogComponent } from '../input-dialog/input-dialog.component';
import { EditCategoryDialogComponent } from '../dialogs/edit-category-dialog/edit-category-dialog.component';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { Category } from 'api-types';
import { EventEmitter } from '@angular/core';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root'
})
export class SettingsCategoryService {
  constructor(
    private postsService: PostsService,
    private dialog: MatDialog
  ) {}

  dropCategory(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.postsService.categories, event.previousIndex, event.currentIndex);
    this.postsService.updateCategories(this.postsService.categories).subscribe(res => {
    }, () => {
      this.postsService.openSnackBar($localize`Failed to update categories!`);
    });
  }

  openAddCategoryDialog(): void {
    const done = new EventEmitter<boolean>();
    const dialogRef = this.dialog.open(InputDialogComponent, {
      width: '300px',
      data: {
        inputTitle: 'Name the category',
        inputPlaceholder: 'Name',
        submitText: 'Add',
        doneEmitter: done
      }
    });

    done.subscribe((name: string) => {
      if (name) {
        this.postsService.createCategory(name).subscribe(res => {
          if (res['success']) {
            this.postsService.reloadCategories();
            dialogRef.close();
            const newCategory: Category = res['new_category'];
            this.openEditCategoryDialog(newCategory);
          }
        });
      }
    });
  }

  deleteCategory(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: $localize`Delete category`,
        dialogText: $localize`Would you like to delete ${category['name']}:category name:?`,
        submitText: $localize`Delete`,
        warnSubmitColor: true
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.postsService.deleteCategory(category['uid']).subscribe(res => {
          if (res['success']) {
            this.postsService.openSnackBar($localize`Successfully deleted ${category['name']}:category name:!`);
            this.postsService.reloadCategories();
          }
        }, () => {
          this.postsService.openSnackBar($localize`Failed to delete ${category['name']}:category name:!`);
        });
      }
    });
  }

  openEditCategoryDialog(category: Category): void {
    this.dialog.open(EditCategoryDialogComponent, {
      data: {
        category: category
      }
    });
  }
}
