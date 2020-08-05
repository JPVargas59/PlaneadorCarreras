import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarreraComponent } from './carrera/carrera.component';
import { HomeComponent } from './home/home.component';
import { PlanComponent } from './plan/plan.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {FormsModule} from '@angular/forms';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService} from '@angular/fire/analytics';

@NgModule({
  declarations: [
    AppComponent,
    CarreraComponent,
    HomeComponent,
    PlanComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireAnalyticsModule,
        FormsModule
    ],
  providers: [
    ScreenTrackingService,
    UserTrackingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
