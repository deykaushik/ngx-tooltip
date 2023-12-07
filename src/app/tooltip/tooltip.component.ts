import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { zoom } from '../animation/zoom';
import { TooltipPositionType } from '../core/utils/overlay.utils';

@Component({
  standalone: true,
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
  animations: [zoom],
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NgxTooltipComponent {
  private _cdr = inject(ChangeDetectorRef);

  isVisible = signal<boolean>(false);
  title = signal<string>('');
  placementClass = signal<TooltipPositionType>('' as TooltipPositionType);

  detectChanges() {
    this._cdr.detectChanges();
  }
}
