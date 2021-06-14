import { Pipe, PipeTransform } from '@angular/core';
/*
 * Take a name and make it shorter by truncating the second name
 * and leaving out the second surname.
*/
@Pipe({ name: 'formatName' })
export class FormatNamePipe implements PipeTransform {
    transform(name: string): string {
        let parts: string[] = name.split(' ');
        let extra: string = '';
        if (parts.length > 1) {
            for (let i = 1; i < parts.length; i++) {
                extra += parts[i].slice(0, 1) + '.';
                if (i < parts.length - 1)
                    extra += ' ';
            }
        }
        let complete = parts[0]+ ' ' + extra;
        return complete;
    }
}