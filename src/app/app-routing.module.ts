import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ActividadComponent } from './main/campus/calendario/actividad/actividad.component';
import { CalendarioComponent } from './main/campus/calendario/calendario.component';
import { EditarActividadComponent } from './main/campus/calendario/editar-actividad/editar-actividad.component';
import { CampusComponent } from './main/campus/campus.component';
import { NuevaInscripcionComponent } from './main/campus/inscripciones/nueva-inscripcion/nueva-inscripcion.component';
import { MonitorComponent } from './main/campus/monitores/monitor/monitor.component';
import { NominaComponent } from './main/campus/monitores/monitor/nomina/nomina.component';
import { MonitoresComponent } from './main/campus/monitores/monitores.component';
import { NuevoMonitorComponent } from './main/campus/monitores/nuevo-monitor/nuevo-monitor.component';
import { MainComponent } from './main/main.component';
import { NuevoComponent } from './main/nuevo/nuevo.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
    { path: '', redirectTo:'main', pathMatch: 'full'}, //Tries /main, but switches to /login if the user is not logged in
    { path: 'login', component: LoginComponent },
    { path: 'main', component: MainComponent}, //Campus list
    { path: 'main/campus/:idcampus', component: CampusComponent }, //Campus info by ID
    { path: 'main/campus/:idcampus/calendario', component: CalendarioComponent}, //Calendar by campus ID
    { path: 'main/campus/:idcampus/calendario/new', component: ActividadComponent}, //New activity by campus ID
    { path: 'main/campus/:idcampus/calendario/edit/:idactividad', component: EditarActividadComponent}, //Edit activity by ID
    { path: 'main/campus/:idcampus/monitores', component: MonitoresComponent}, //Monitor list
    { path: 'main/campus/:idcampus/monitores/:dni', component: MonitorComponent}, //Monitor info by ID
    { path: 'main/campus/:idcampus/monitores/:dni/nomina/:year/:month', component: NominaComponent}, //Paycheck by DNI, year and month
    { path: 'main/campus/:idcampus/monitor/nuevo', component: NuevoMonitorComponent}, //New monitor
    { path: 'main/campus/:idcampus/inscripcion/nueva', component: NuevaInscripcionComponent}, //New atendee
    { path: 'main/nuevo', component: NuevoComponent }, //New campus
    { path: 'register', component: RegisterComponent } //New user
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}