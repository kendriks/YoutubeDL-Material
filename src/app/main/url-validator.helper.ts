import { Injectable } from '@angular/core';

/**
 * Classe extraída para gerenciar validação e processamento de URLs
 */
@Injectable({
  providedIn: 'root'
})
export class UrlValidatorHelper {

  private readonly URL_REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  
  validateURL(str: string): boolean {
    const re = new RegExp(this.URL_REGEX);
    return re.test(str);
  }

  parseURLArray(url_str: string): Array<string> {
    let lines = url_str.split('\n');
    lines = lines.filter(line => line);
    return lines;
  }

  isMultipleURLs(url_str: string): boolean {
    return this.parseURLArray(url_str).length > 1;
  }

  isPlaylistURL(url: string): boolean {
    return url.includes('playlist');
  }
}
