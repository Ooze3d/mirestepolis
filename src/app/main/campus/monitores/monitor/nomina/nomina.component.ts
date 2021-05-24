import { Component, OnInit } from '@angular/core';
import { MonitorService } from 'src/app/monitor.service';
import { JornadaService } from 'src/app/jornada.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { CampusService } from 'src/app/campus.service';

@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.css']
})
export class NominaComponent implements OnInit {

  month:string = '';
  year:string = '';
  totalHoras:number = 0;
  salarioBase:number = 0.0;
  totalDevengado:number = 0.0;
  extra:number = 0.0;
  totalPercibir:number = 0.0;

  constructor(public campusService: CampusService, private userService: UserService, private route: ActivatedRoute, 
    public monitorService: MonitorService, public jornadaService:JornadaService) { }

  ngOnInit(): void {
    this.userService.checkLogin();
    this.route.params.subscribe((params) => {
      this.year = params['year'];
      this.month = params['month'];
    });

    this.totalHoras = this.jornadaService.getHorasMes();
    this.salarioBase = this.totalHoras*7;
    this.extra = (this.salarioBase*2)/14;
    this.totalDevengado = this.salarioBase+this.extra;
  }



  

}
