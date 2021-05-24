import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CampusService } from 'src/app/campus.service';
import { fabric } from 'fabric';
import { _MatRadioGroupBase } from '@angular/material/radio';
import { FormControl, FormGroup } from '@angular/forms';
import { ActividadService } from 'src/app/actividad.service';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit, AfterViewInit {

  canvas : any;
  x:number = 0;
  y:number = 0;
  horas:{text:string, color:string}[] = [
    {text: '08:00-09:00', color:'rgba(254,207,57,0.5)'},
    {text: '09:00-10:00', color: 'rgba(254,207,57,0.3)'},
    {text: '10:00-11:00', color: 'rgba(254,207,57,0.5)'},
    {text: '11:00-12:00', color: 'rgba(254,207,57,0.3)'},
    {text: '12:00-13:00', color: 'rgba(254,207,57,0.5)'},
    {text: '13:00-14:00', color: 'rgba(254,207,57,0.3)'},
    {text: '14:00-15:00', color: 'rgba(254,207,57,0.5)'}];
  yellowFull:string = 'rgba(254,207,57,1)';
  yellowTrans:string = 'rgba(254,207,57,0.3)';
  blueGrad:string[] = ['rgba(33, 150, 243, 0.4)','rgba(33, 150, 243, 0.6)','rgba(33, 150, 243, 0.8)','rgba(33, 150, 243, 1)']; 
  colorText:string = 'darkorange';

  calendarForm = new FormGroup({ //Necesario para la actualización dinámica del formulario
    dia: new FormControl(this.actividadService.fecha)
  });

  constructor(public campusService:CampusService, public actividadService:ActividadService, private window:Window) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.canvas = new fabric.Canvas('myCanvas');
    this.drawCalendar();
  }

  drawCajaHora(x:number, y:number, color:string) {
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

  drawTextHora(x:number, y:number, text:string) {
    return new fabric.Text(text, {
      selectable: false,
      originX: 'center',
      originY: 'center',
      top: y+30,
      left: x+50,
      width: 100,
      fontFamily: 'Poppins',
      fontSize: 12,
      fontWeight: 'bold',
      fill: this.colorText,
      textAlign: 'center'
    })
  }

  drawGrupos(canvas:any, x:number, y:number, nombreGrupo:string, color:string) {
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
      top: y+20,
      left: x+75,
      width: 150,
      fontFamily: 'Poppins',
      fontSize: 12,
      fontWeight: 'bold',
      fill: 'white',
      textAlign: 'center'
    }));
    canvas.add(new fabric.Rect({
      selectable: false,
      top: y+40,
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
      top: y+70,
      left: x+75,
      width: 150,
      fontFamily: 'Poppins',
      fontSize: 12,
      fontWeight: 'bold',
      fill: this.colorText,
      textAlign: 'center'
    }));
    canvas.add(new fabric.Rect({
      selectable: false,
      top: y+100,
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
      top: y+400,
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
      top: y+430,
      left: x+75,
      width: 150,
      fontFamily: 'Poppins',
      fontSize: 12,
      fontWeight: 'bold',
      fill: this.colorText,
      textAlign: 'center'
    }));
  }

  drawCalendar() {
    this.x = 0;
    this.y = 45;
    //Cajas horas
    for(let i=0;i<7;i++) {
      this.canvas.add(this.drawCajaHora(this.x, this.y, this.horas[i].color));
      this.canvas.add(this.drawTextHora(this.x, this.y, this.horas[i].text));
      this.y+=60;
    }
    //Grupos
    this.x = 100;
    this.y = 5;
    for(let i=0;i<4;i++) {
      this.drawGrupos(this.canvas, this.x, this.y, this.campusService.gruposList[i].nombre, this.blueGrad[i]);
      this.x += 150;
    }
  }

  resizeCanvas(event:UIEvent) {
    //TODO resize algorithm
  }

}
