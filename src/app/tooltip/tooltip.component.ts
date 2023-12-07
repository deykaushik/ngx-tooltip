import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { TooltipPositionType } from '../core/utils/overlay.utils';

@Component({
  standalone: true,
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NgxTooltipComponent {
  private _cdr = inject(ChangeDetectorRef);

  title = signal<string>('');
  placementClass = signal<TooltipPositionType>('' as TooltipPositionType);

  detectChanges() {
    this._cdr.detectChanges();
  }
}
