import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ActividadComponent } from './main/campus/calendario/actividad/actividad.component';
import { CalendarioComponent } from './main/campus/calendario/calendario.component';
import { CampusComponent } from './main/campus/campus.component';
import { MonitorComponent } from './main/campus/monitores/monitor/monitor.component';
import { NominaComponent } from './main/campus/monitores/monitor/nomina/nomina.component';
import { MonitoresComponent } from './main/campus/monitores/monitores.component';
import { NuevoMonitorComponent } from './main/campus/monitores/nuevo-monitor/nuevo-monitor.component';
import { MainComponent } from './main/main.component';
import { NuevoComponent } from './main/nuevo/nuevo.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
    { path: '', component: MainComponent }, //Intenta ir a Main y si no está logueado, va a login
    { path: 'login', component: LoginComponent },
    { path: 'main', component: MainComponent }, //Ver lista de campus
    { path: 'main/campus/:idcampus', component: CampusComponent }, //Ver campus por ID
    { path: 'main/campus/:idcampus/calendario', component: CalendarioComponent}, //Ver campus por ID
    { path: 'main/campus/:idcampus/calendario/new', component: ActividadComponent}, //Ver campus por ID
    { path: 'main/campus/:idcampus/monitores', component: MonitoresComponent}, //Ver lista de monitores
    { path: 'main/campus/:idcampus/monitores/:dni', component: MonitorComponent}, //Ver monitor por ID
    { path: 'main/campus/:idcampus/monitores/:dni/nomina/:year/:month', component: NominaComponent}, //Ver nómina por DNI, año y mes
    { path: 'main/campus/:idcampus/monitor/nuevo', component: NuevoMonitorComponent}, //Nuevo monitor
    { path: 'main/nuevo', component: NuevoComponent }, //Nuevo campus
    { path: 'register', component: RegisterComponent } //Nuevo usuario
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}