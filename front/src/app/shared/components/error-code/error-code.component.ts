import { Component, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'error-code',
  templateUrl: './error-code.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ErrorCodeComponent {
  @Input() code = '';
  @Input() title = '';
  @Input() message = '';
}
