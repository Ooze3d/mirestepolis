export class MonthYear {
    
    public month:number = 0;
    public year:number = 0;

    constructor(public full:string) {
        this.month = Number(full.substr(0,2));
        this.year = Number(full.substr(3,4));
    }
}