import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
export const fadeInOutAnimation =
  trigger('fadeInOutAnimation', [
    state('*', style({
      opacity: 1
    })),
    transition(':enter', [
      style({
        opacity: 0
      }),
      animate('300ms ease-in', style({
        opacity: 1
      }))
    ]),
    transition(':leave', [
      style({
        opacity: 1
      }),
      animate('300ms ease-out', style({
        opacity: 0
      }))
    ]),
  ]);
