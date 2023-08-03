import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaComponent } from './shared/components/lista/lista.component';


const routes: Routes = [
  { path: 'lista', component: ListaComponent },
  { path: '**', redirectTo: '/lista' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
