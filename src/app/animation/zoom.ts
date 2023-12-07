import { animate, style, transition, trigger } from '@angular/animations';

export const zoom = trigger('zoom', [
  transition('void => active', [
    style({ opacity: 0, transform: 'scale(0.8)' }),
    animate(
      '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      style({ opacity: 1, transform: 'scale(1)' })
    ),
  ]),
]);
