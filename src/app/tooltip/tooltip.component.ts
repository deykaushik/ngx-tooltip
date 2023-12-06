import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { PositionType } from '../core/utils/overlay.utils';

@Component({
  standalone: true,
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NgxTooltipComponent {
  private _tooltipClassName = 'ngx-tooltip';
  private _cdr = inject(ChangeDetectorRef);

  title = signal<string>('');
  placementClass = signal<PositionType>('' as PositionType);
  classMap: { [key: string]: boolean } = {};

  updateStyle() {
    this.classMap = {
      [this._tooltipClassName]: true,
      [`${this._tooltipClassName}-placement-${this.placementClass()}`]: true,
    };
    this._cdr.detectChanges();
  }
}
