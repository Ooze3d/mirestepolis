import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CampusService } from 'src/app/campus.service';
import { fabric } from 'fabric';
import { _MatRadioGroupBase } from '@angular/material/radio';
import { ActividadService } from 'src/app/actividad.service';
import { Actividad } from 'src/app/actividad.model';
import { UserService } from 'src/app/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit, AfterViewInit {

  canvas: any;
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

  constructor(public campusService: CampusService, public actividadService: ActividadService, public userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userService.checkLogin();
    this.canvas = new fabric.Canvas('myCanvas');
    this.route.params.subscribe((params) => { //Extraemos el DNI de la url
      let id = params['idcampus'];
      if (this.campusService.campus.idcampus != id) { //Comprueba la url y vuelve a cargar el idcampus si lo pierde por recarga de la página
        this.campusService.getCampus(id);
      } else {
        this.drawCalendar();
      }
    });
  }

  ngAfterViewInit(): void {
    this.campusService.getCampusListener().subscribe(() => {
      this.campusService.getGruposListener().subscribe(() => {
        this.drawCalendar();
      });
    });
    this.actividadService.getActividadList();
    this.actividadService.getActividadListListener().subscribe(list => {
      this.drawActividades(list);
    });
  }

  diaAnt() { //Cambia a día anterior y carga el array de actividades
    this.actividadService.fecha = new Date(this.actividadService.fecha.setDate(this.actividadService.fecha.getDate() - 1));
    this.cleanRedraw();
  }

  diaPost() { //Cambia a día posterior y carga el array de actividades
    this.actividadService.fecha = new Date(this.actividadService.fecha.setDate(this.actividadService.fecha.getDate() + 1));
    this.cleanRedraw();
  }

  cleanRedraw() { //Limpia actividades, carga las del nuevo día y vuelve a pintarlas
    console.log(this.actividadService.fecha+', redrawing...');
    while (this.canvas.getObjects().length > 42) {
      this.canvas.remove(this.canvas.item(this.canvas.getObjects().length - 1));
    }
    this.actividadService.getActividadList();
    this.actividadService.getActividadListListener().subscribe(list => {
      this.drawActividades(list);
    });
  }

  drawActividades(list: Actividad[]) { //Una vez que el calendario está dibujado, añadimos las distintas actividades
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
        alert(act.idactividad);
      }));

      //En caso de que el nombre de la actividad tenga más de 20 caracteres

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

  calculaLeft(act: Actividad): number { //Cálculo de la posición horizontal de la actividad
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

  calculaTop(act: Actividad): number { //Cálculo de la posición vertical de la actividad
    let horaini: number = Number(act.fechaini.substr(11, 2));
    let minini: number = Number(act.fechaini.substr(14, 2));
    return 45 + ((horaini - 8) * 60) + minini;
  }

  calculaHeight(act: Actividad): number { //Cálculo del tamaño mediante la duración
    let horaini: number = Number(act.fechaini.substr(11, 2));
    let minini: number = Number(act.fechaini.substr(14, 2));
    let horafin: number = Number(act.fechafin.substr(11, 2));
    let minfin: number = Number(act.fechafin.substr(14, 2));
    return ((horafin - horaini) * 60) + (minfin - minini);
  }

  drawCajaHora(x: number, y: number, color: string) { //Dibuja una caja lateral con la hora
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

  drawTextHora(x: number, y: number, text: string) { //Escribe la hora en la caja lateral
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

  drawGrupos(canvas: any, x: number, y: number, nombreGrupo: string, color: string) { //Dibuja una caja de grupo por coordenadas
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

  drawCalendar() { //Usa las funciones anteriores para dibujar el calendario completo
    this.x = 0;
    this.y = 45;
    //Cajas horas
    for (let i = 0; i < 7; i++) {
      this.canvas.add(this.drawCajaHora(this.x, this.y, this.horas[i].color));
      this.canvas.add(this.drawTextHora(this.x, this.y, this.horas[i].text));
      this.y += 60;
    }
    //Grupos
    this.x = 100;
    this.y = 5;
    for (let i = 0; i < 4; i++) {
      this.drawGrupos(this.canvas, this.x, this.y, this.campusService.gruposList[i].nombre, this.blueGrad[i]);
      this.x += 150;
    }
  }

  resizeCanvas(event: UIEvent) {
    //TODO resize algorithm
  }

}
