import { NgModule } from '@angular/core';
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';

let materialModules = [
    MatDialogModule,
    MatTableModule,
    MatTabsModule,
    MatIconModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatChipsModule,
    MatToolbarModule
]
@NgModule({
    declarations: [],
    imports: [...materialModules],
    exports: [...materialModules]

})
export class MaterialModule { }
