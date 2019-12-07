import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'swapi',
  template: '<pre>{{ data$ | async | json }}</pre>',
})
export class SwapiComponent {
  data$: Observable<any>;
  constructor(private route: ActivatedRoute) {
    this.data$ = this.route.data;
  }
}
