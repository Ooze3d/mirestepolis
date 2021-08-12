export class MonthYear {
    
    public month:number = 0;
    public year:number = 0;

    constructor(public full:string) {
        this.month = Number(full.split('/')[0]); 
        this.year = Number(full.split('/')[1]);
    }
}