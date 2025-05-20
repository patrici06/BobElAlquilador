// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservaComponent } from './reserva/reserva.component';

const routes: Routes = [
  { path: 'reservar', component: ReservaComponent },
  { path: '', redirectTo: '/reservar', pathMatch: 'full' },
  { path: '**', redirectTo: '/reservar' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
