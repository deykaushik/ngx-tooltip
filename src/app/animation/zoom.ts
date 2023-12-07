import { animate, style, transition, trigger } from '@angular/animations';

export const zoom = trigger('zoom', [
  transition('void => active', [
    style({ opacity: 0, transform: 'scale(0.8)' }),
    animate('0.2s ease-in', style({ opacity: 1, transform: 'scale(1)' })),
  ]),
  transition('active => void', [
    style({ opacity: 1, transform: 'scale(1)' }),
    animate('0.2s ease-out', style({ opacity: 0, transform: 'scale(0.8)' })),
  ]),
]);
