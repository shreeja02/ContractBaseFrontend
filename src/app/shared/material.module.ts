import { NgModule } from '@angular/core';
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
    declarations: [],
    imports: [MatTableModule, MatTabsModule],
    exports: [MatTableModule, MatTabsModule]

})
export class MaterialModule { }
