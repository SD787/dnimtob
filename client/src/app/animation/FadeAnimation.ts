import { trigger, transition, style, animate, query } from '@angular/animations';

export const FadeAnimation = trigger('FadeAnimation', [
  transition(':enter', [
    style({ opacity: 0 }), animate('500ms', style({ opacity: 1 }))]
  )
]);