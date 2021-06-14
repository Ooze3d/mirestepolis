import { Pipe, PipeTransform } from '@angular/core';
/*
 * Take one surname and leave the rest
*/
@Pipe({ name: 'formatSurName' })
export class FormatSurNamePipe implements PipeTransform {
    transform(name: string): string {
        let parts: string[] = name.split(' ');
        return parts[0];
    }
}