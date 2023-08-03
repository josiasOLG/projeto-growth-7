import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';

@NgModule({
  imports: [
    MatListModule,
    // Adicione outros módulos do Angular Material aqui.
  ],
  exports: [
    MatListModule,
    // Certifique-se de exportar os módulos para que eles possam ser usados em outros lugares do seu aplicativo.
  ]
})
export class MaterialModule { }
