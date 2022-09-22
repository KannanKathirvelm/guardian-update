import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SortPipe } from '@pipes/sort-pipes';

const PIPES = [SortPipe];

@NgModule({
  declarations: [PIPES],
  exports: [PIPES],
  imports: [
    CommonModule
  ]
})
export class ApplicationPipesModule { }
