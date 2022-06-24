import { AfterViewInit, Component, OnDestroy, OnInit, ɵSWITCH_COMPILE_INJECTABLE__POST_R3__ } from '@angular/core';
import { MonitorService } from 'src/app/monitor.service';
import { JornadaService } from 'src/app/jornada.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { CampusService } from 'src/app/campus.service';
import { Subject } from 'rxjs';
import { reduce, takeUntil } from 'rxjs/operators';
import { MonthYear } from 'src/app/monthyear.model';
import { fabric } from 'fabric';
import { Group } from 'fabric/fabric-impl';

@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.css']
})
export class NominaComponent implements OnInit, AfterViewInit, OnDestroy {

  canvas!: any;
  dni: string = '';
  month: string = '';
  year: string = '';
  totalHoras: number = 0;
  salarioBase: number = 0.0;
  totalDevengado: number = 0.0;
  extra: number = 0.0;
  totalPercibir: number = 0.0;
  destroyed: Subject<void> = new Subject<void>();

  constructor(public campusService: CampusService, private userService: UserService, private route: ActivatedRoute,
    public monitorService: MonitorService, public jornadaService: JornadaService) { }

  ngOnInit(): void { //Paychecks are dynamically generated based on the list of days worked for each month
    this.userService.checkLogin();
    this.canvas = new fabric.Canvas('myCanvas');
    this.route.params.pipe(takeUntil(this.destroyed)).subscribe((params) => { //Monitor DNI gets extracted from the url
      this.year = params['year'];
      this.month = params['month'];
      this.dni = params['dni'];
      let id = params['idcampus'];
      if (this.campusService.campus.idcampus != id) { //In case the page is refreshed, the campus ID is also captured and used to check the service
        this.campusService.getCampus(id);
        this.campusService.getCampusList();
        this.campusService.getCampusListener().pipe(takeUntil(this.destroyed)).subscribe(campus => {
          this.monitorService.getMonitorList();
          this.jornadaService.monthyear = this.month + '/' + this.year;
          this.jornadaService.mes = new MonthYear(this.jornadaService.monthyear);
        });
      }
    });

    this.monitorService.getMonitor(this.dni); //The monitor gets loaded into the service using the DNI
    this.monitorService.getMonitorListener().pipe(takeUntil(this.destroyed)).subscribe(() => {
      this.jornadaService.getJornadasMes(this.jornadaService.mes.year, this.jornadaService.mes.month);
    })
  }

  ngAfterViewInit(): void {
    this.jornadaService.getJornadasListListener().pipe(takeUntil(this.destroyed)).subscribe(() => {
      this.totalHoras = this.jornadaService.getHorasMes();
      this.salarioBase = this.totalHoras * 7;
      this.extra = (this.salarioBase * 2) / 14;
      this.totalDevengado = this.salarioBase + this.extra;
      this.drawNomina();
    });
  }

  drawNomina() {
    
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

}