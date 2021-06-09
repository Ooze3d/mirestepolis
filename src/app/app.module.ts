import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon'; 
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select'; 
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list'; 
import { MatDividerModule } from '@angular/material/divider'; 
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { UserInterceptor } from './user-interceptor';
import { MatDialogServiceModule } from 'dialog-service';
import { MatTableModule } from '@angular/material/table';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from "@angular/material-moment-adapter";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './main/header/header.component';
import { CampusComponent } from './main/campus/campus.component';
import { NuevoComponent } from './main/nuevo/nuevo.component';
import { RegisterComponent } from './register/register.component';
import { MonitoresComponent } from './main/campus/monitores/monitores.component';
import { NuevoMonitorComponent } from './main/campus/monitores/nuevo-monitor/nuevo-monitor.component';
import { MonitorComponent } from './main/campus/monitores/monitor/monitor.component';
import { PersonalComponent } from './main/campus/monitores/personal/personal.component';

import { UserService } from './user.service';
import { CampusService } from './campus.service';
import { MonitorService } from './monitor.service';
import { JornadaService } from './jornada.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NominaComponent } from './main/campus/monitores/monitor/nomina/nomina.component';
import { CalendarioComponent } from './main/campus/calendario/calendario.component';
import { ActividadComponent } from './main/campus/calendario/actividad/actividad.component';
import { ActividadService } from './actividad.service';
import { EditarActividadComponent } from './main/campus/calendario/editar-actividad/editar-actividad.component';
import { InscripcionesComponent } from './main/campus/inscripciones/inscripciones.component';
import { NuevaInscripcionComponent } from './main/campus/inscripciones/nueva-inscripcion/nueva-inscripcion.component';
import { InscripcionService } from './inscripcion.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    HeaderComponent,
    CampusComponent,
    NuevoComponent,
    RegisterComponent,
    MonitoresComponent,
    MonitorComponent,
    NuevoMonitorComponent,
    PersonalComponent,
    NominaComponent,
    CalendarioComponent,
    ActividadComponent,
    EditarActividadComponent,
    InscripcionesComponent,
    NuevaInscripcionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatDatepickerModule,
    MatListModule,
    MatDividerModule,
    MatDialogServiceModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatTableModule,
    MatMomentDateModule,
    MatAutocompleteModule,
    MatRadioModule
  ],
  providers: [CampusService, 
    UserService, 
    MonitorService,
    JornadaService,
    ActividadService,
    InscripcionService,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: HTTP_INTERCEPTORS, useClass: UserInterceptor, multi: true },
    { provide: Window, useValue: window }],
  bootstrap: [AppComponent]
})
export class AppModule { }
