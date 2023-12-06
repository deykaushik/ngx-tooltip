import { OverlayModule } from '@angular/cdk/overlay';
import { NgxTooltipComponent } from './tooltip.component';
import { NgxTooltipDirective } from './tooltip.directive';

export const NgxTooltipModule = [
  NgxTooltipDirective,
  NgxTooltipComponent,
  OverlayModule,
];
