import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ReservaComponent } from './reserva/reserva.component';
import { AppRoutingModule } from './app-routing.module'

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,      // Para formularios reactivos
    AppRoutingModule
  ],
  providers: []
})
export class AppModule { }
