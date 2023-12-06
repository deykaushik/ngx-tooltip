import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxTooltipModule } from '../tooltip/tooltip';
import { PositionType } from '../core/utils/overlay.utils';

@Component({
  selector: 'app-tooltip-demo',
  standalone: true,
  imports: [NgxTooltipModule],
  templateUrl: './tooltip-demo.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipDemoComponent {}
