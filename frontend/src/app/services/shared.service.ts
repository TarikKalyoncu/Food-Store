// shared.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  showUpdateButton: boolean = false;

  constructor() {}
}
