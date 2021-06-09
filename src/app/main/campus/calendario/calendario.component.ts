import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CampusService } from 'src/app/campus.service';
import { fabric } from 'fabric';
import { _MatRadioGroupBase } from '@angular/material/radio';
import { ActividadService } from 'src/app/actividad.service';
import { Actividad } from 'src/app/actividad.model';
import { UserService } from 'src/app/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MonitorService } from 'src/app/monitor.service';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})

export class CalendarioComponent implements OnInit, AfterViewInit, OnDestroy {

  canvas!: any;
  x: number = 0;
  y: number = 0;
  horas: { text: string, color: string }[] = [ //
    { text: '08:00-09:00', color: 'rgba(254,207,57,0.5)' },
    { text: '09:00-10:00', color: 'rgba(254,207,57,0.3)' },
    { text: '10:00-11:00', color: 'rgba(254,207,57,0.5)' },
    { text: '11:00-12:00', color: 'rgba(254,207,57,0.3)' },
    { text: '12:00-13:00', color: 'rgba(254,207,57,0.5)' },
    { text: '13:00-14:00', color: 'rgba(254,207,57,0.3)' },
    { text: '14:00-15:00', color: 'rgba(254,207,57,0.5)' }];
  yellowFull: string = 'rgba(254,207,57,1)';
  yellowTrans: string = 'rgba(254,207,57,0.3)';
  blueGrad: string[] = ['rgba(33, 150, 243, 0.4)', 'rgba(33, 150, 243, 0.6)', 'rgba(33, 150, 243, 0.8)', 'rgba(33, 150, 243, 1)'];
  colorText: string = 'darkorange';

  constructor(public campusService: CampusService, public monitorService: MonitorService, public actividadService: ActividadService, public userService: UserService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    this.userService.checkLogin();
    this.canvas = new fabric.Canvas('myCanvas');
    if (localStorage.getItem('fechaAct')) {
      this.actividadService.fecha = new Date(localStorage.getItem('fechaAct')!); //Capture localStorage date from previous views
    } else {
      localStorage.setItem('fechaAct', this.actividadService.fecha.toISOString());
    }
    this.route.params.subscribe((params) => {
      let id = params['idcampus'];
      if (this.campusService.campus.idcampus != id) { //Checks the url and changes the campus attribute in the service if needed
        this.campusService.getCampus(id);
      } else {
        this.drawCalendar();
      }
    });
  }

  ngAfterViewInit(): void {
    this.campusService.getCampusListener().subscribe(() => {
      this.campusService.getGruposListener().subscribe(() => {
        this.monitorService.getMonitorList();
        this.drawCalendar();
        this.actividadService.getActividadList(); //These two lines are duplicated, but they're needed since they're called in two different moments in time, depending on the page load
        this.actividadService.getActividadListListener().subscribe(list => {
          try {
            this.drawActividades(list);
          } catch (e: any) { } //this.canvas appears as NULL inside the subscription but the method works
        });
      });
    });
    this.actividadService.getActividadList();
    this.actividadService.getActividadListListener().subscribe(list => {
      try {
        this.drawActividades(list);
      } catch (e: any) { }
    });
  }

  diaAnt() { //Changes the date to previous day and reloads the activities array
    if (!(this.actividadService.fecha instanceof Date)) //DatePicker causes the attribute to lose the Date type
      this.actividadService.fecha = new Date(this.actividadService.fecha);
    this.actividadService.fecha = new Date(this.actividadService.fecha.setDate(this.actividadService.fecha.getDate() - 1));
    this.cleanRedraw();
  }

  diaPost() { //Changes the date to next day and reloads the activities array
    if (!(this.actividadService.fecha instanceof Date))
      this.actividadService.fecha = new Date(this.actividadService.fecha);
    this.actividadService.fecha = new Date(this.actividadService.fecha.setDate(this.actividadService.fecha.getDate() + 1));
    this.cleanRedraw();
  }

  cleanRedraw() { //Clears the calendar of previous activities and draws the new list
    while (this.canvas.getObjects().length > 42) {
      this.canvas.remove(this.canvas.item(this.canvas.getObjects().length - 1));
    }
    this.actividadService.getActividadList();
    this.actividadService.getActividadListListener().subscribe(list => {
      try {
        this.drawActividades(list);
      } catch (e: any) { }
    });
    localStorage.setItem('fechaAct', this.actividadService.fecha.toISOString());
  }

  drawActividades(list: Actividad[]) { //Once the calendar is visible, we can draw each activity from the list
    list.forEach(act => {
      let left: number = this.calculaLeft(act);
      let top: number = this.calculaTop(act);
      let height: number = this.calculaHeight(act);
      this.canvas.add(new fabric.Rect({
        selectable: false,
        top: top,
        left: left,
        width: 150,
        height: height,
        rx: 4,
        ry: 4,
        fill: act.color,
        stroke: this.yellowFull,
        strokeWidth: 1,
        hoverCursor: 'pointer'
      }).on('mousedown', (event) => {
        this.router.navigate(['/main/campus/' + this.campusService.campus.idcampus + '/calendario/edit/' + act.idactividad]);
      }));

      //In case the activity name has more than 20 characters

      let newName: string;
      if (act.nombre.length > 20)
        newName = act.nombre.substr(0, 20) + '...';
      else
        newName = act.nombre;
      this.canvas.add(new fabric.Text(newName, {
        selectable: false,
        originX: 'center',
        originY: 'center',
        top: top + height / 2,
        left: left + 75,
        width: 100,
        fontFamily: 'Poppins',
        fontSize: 12,
        fontWeight: 'bold',
        fill: 'DarkSlateGrey',
        textAlign: 'center'
      }));
    });
  }

  calculaLeft(act: Actividad): number { //Different horizontal positions depending on the group
    let left: number = 0;

    switch (act.idgrupo.substr(-3, 3)) {
      case 'inf':
        left = 100;
        break;
      case 'gr1':
        left = 250;
        break;
      case 'gr2':
        left = 400;
        break;
      case 'gr3':
        left = 550;
        break;
    }
    return left;
  }

  calculaTop(act: Actividad): number { //Set distance from the top, depending on the time each activity starts
    let horaini: number = Number(act.fechaini.substr(11, 2));
    let minini: number = Number(act.fechaini.substr(14, 2));
    return 45 + ((horaini - 8) * 60) + minini;
  }

  calculaHeight(act: Actividad): number { //The difference between start and end times gives us the size for the box
    let horaini: number = Number(act.fechaini.substr(11, 2));
    let minini: number = Number(act.fechaini.substr(14, 2));
    let horafin: number = Number(act.fechafin.substr(11, 2));
    let minfin: number = Number(act.fechafin.substr(14, 2));
    return ((horafin - horaini) * 60) + (minfin - minini);
  }

  drawCajaHora(x: number, y: number, color: string) { //Left boxes with the hours
    return new fabric.Rect({
      selectable: false,
      top: y,
      left: x,
      width: 100,
      height: 60,
      rx: 4,
      ry: 4,
      fill: color,
      stroke: this.yellowFull,
      strokeWidth: 1
    });
  }

  drawTextHora(x: number, y: number, text: string) { //Hour text
    return new fabric.Text(text, {
      selectable: false,
      originX: 'center',
      originY: 'center',
      top: y + 30,
      left: x + 50,
      width: 100,
      fontFamily: 'Poppins',
      fontSize: 12,
      fontWeight: 'bold',
      fill: this.colorText,
      textAlign: 'center'
    })
  }

  drawGrupos(canvas: any, x: number, y: number, nombreGrupo: string, color: string) { //Set of boxes and text for each group
    canvas.add(new fabric.Rect({
      selectable: false,
      top: y,
      left: x,
      width: 150,
      height: 40,
      rx: 4,
      ry: 4,
      fill: color,
      stroke: this.blueGrad[3],
      strokeWidth: 1
    }));
    canvas.add(new fabric.Text(nombreGrupo, {
      selectable: false,
      originX: 'center',
      originY: 'center',
      top: y + 20,
      left: x + 75,
      width: 150,
      fontFamily: 'Poppins',
      fontSize: 12,
      fontWeight: 'bold',
      fill: 'white',
      textAlign: 'center'
    }));
    canvas.add(new fabric.Rect({
      selectable: false,
      top: y + 40,
      left: x,
      width: 150,
      height: 60,
      rx: 4,
      ry: 4,
      fill: this.yellowTrans,
      stroke: this.yellowFull,
      strokeWidth: 1
    }));
    canvas.add(new fabric.Text('Aula Matinal', {
      selectable: false,
      originX: 'center',
      originY: 'center',
      top: y + 70,
      left: x + 75,
      width: 150,
      fontFamily: 'Poppins',
      fontSize: 12,
      fontWeight: 'bold',
      fill: this.colorText,
      textAlign: 'center'
    }));
    canvas.add(new fabric.Rect({
      selectable: false,
      top: y + 100,
      left: x,
      width: 150,
      height: 300,
      rx: 4,
      ry: 4,
      fill: 'white',
      stroke: this.yellowFull,
      strokeWidth: 1
    }));
    canvas.add(new fabric.Rect({
      selectable: false,
      top: y + 400,
      left: x,
      width: 150,
      height: 60,
      rx: 4,
      ry: 4,
      fill: this.yellowTrans,
      stroke: this.yellowFull,
      strokeWidth: 1
    }));
    canvas.add(new fabric.Text('Campus Wait', {
      selectable: false,
      originX: 'center',
      originY: 'center',
      top: y + 430,
      left: x + 75,
      width: 150,
      fontFamily: 'Poppins',
      fontSize: 12,
      fontWeight: 'bold',
      fill: this.colorText,
      textAlign: 'center'
    }));
  }

  drawCalendar() { //Main method to draw the whole calendar
    this.x = 0;
    this.y = 45;
    //Hour boxes
    for (let i = 0; i < 7; i++) {
      this.canvas.add(this.drawCajaHora(this.x, this.y, this.horas[i].color));
      this.canvas.add(this.drawTextHora(this.x, this.y, this.horas[i].text));
      this.y += 60;
    }
    //Groups
    this.x = 100;
    this.y = 5;
    for (let i = 0; i < 4; i++) {
      this.drawGrupos(this.canvas, this.x, this.y, this.campusService.gruposList[i].nombre, this.blueGrad[i]);
      this.x += 150;
    }
  }

  ngOnDestroy(): void {
    this.canvas = null;
    /*this.campusService.getCampusListener().unsubscribe();
    this.campusService.getGruposListener().unsubscribe();
    this.actividadService.getActividadListListener().unsubscribe();*/
  }

}
