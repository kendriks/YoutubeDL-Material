import { Injectable } from '@angular/core';
import { DatabaseFile } from '../../../api-types';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root'
})
export class FileSelectionService {

  addToSelection(selectedData: string[], selectedDataObjs: DatabaseFile[], value: DatabaseFile): void {
    selectedData.push(value.uid);
    selectedDataObjs.push(value);
  }

  removeFromSelection(
    selectedData: string[],
    selectedDataObjs: DatabaseFile[],
    uid: string
  ): void {
    const dataIndex = selectedData.indexOf(uid);
    if (dataIndex !== -1) selectedData.splice(dataIndex, 1);
    
    const objIndex = selectedDataObjs.findIndex(e => e.uid === uid);
    if (objIndex !== -1) selectedDataObjs.splice(objIndex, 1);
  }

  reorderSelection(
    selectedData: string[],
    selectedDataObjs: DatabaseFile[],
    previousIndex: number,
    currentIndex: number,
    reverseOrder: boolean
  ): void {
    if (reverseOrder) {
      previousIndex = selectedData.length - 1 - previousIndex;
      currentIndex = selectedData.length - 1 - currentIndex;
    }
    moveItemInArray(selectedData, previousIndex, currentIndex);
    moveItemInArray(selectedDataObjs, previousIndex, currentIndex);
  }

  removeSelectedFile(
    selectedData: string[],
    selectedDataObjs: DatabaseFile[],
    index: number,
    reverseOrder: boolean
  ): void {
    let actualIndex = index;
    if (reverseOrder) actualIndex = selectedData.length - 1 - index;
    selectedData.splice(actualIndex, 1);
    selectedDataObjs.splice(actualIndex, 1);
  }
}
