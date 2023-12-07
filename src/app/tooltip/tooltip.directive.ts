import {
  ConnectedOverlayPositionChange,
  ConnectionPositionPair,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { Subject, fromEvent, takeUntil } from 'rxjs';
import {
  POSITION_MAP,
  TooltipPositionType,
  getPositionClass,
} from '../core/utils/overlay.utils';
import { NgxTooltipComponent } from './tooltip.component';

const DEFAULT_TOOLTIP_POSITIONS = [
  POSITION_MAP.bottom,
  POSITION_MAP.top,
  POSITION_MAP.right,
  POSITION_MAP.left,
];

@Directive({
  selector: '[ngxTooltip]',
  standalone: true,
})
export class NgxTooltipDirective implements OnInit, OnDestroy {
  private _destroy$ = new Subject<void>();
  private _isOpen = false;
  private _overlay = inject(Overlay);
  private _overlayRef?: OverlayRef;
  private _elementRef = inject(ElementRef);
  private _ngZone = inject(NgZone);
  private _tooltipPortal!: ComponentPortal<NgxTooltipComponent>;
  private _tooltipComponent!: NgxTooltipComponent;
  private _positions: ConnectionPositionPair[] = DEFAULT_TOOLTIP_POSITIONS;

  @Input() ngxTooltip!: string;
  @Input() panelClass: string = '';
  @Output() visibleChange = new EventEmitter<boolean>();

  private _getOverlayConfig() {
    const streategy = this._overlay
      .position()
      .flexibleConnectedTo(this._elementRef)
      .withPositions([...this._positions])
      .withFlexibleDimensions(false);

    streategy.positionChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe((change: ConnectedOverlayPositionChange) => {
        this._updateClassMap(change);
      });

    return new OverlayConfig({
      panelClass: ['ngx-tooltip-panel', this.panelClass],
      positionStrategy: streategy,
      scrollStrategy: this._overlay.scrollStrategies.reposition({
        scrollThrottle: 20,
      }),
    });
  }

  private _updateClassMap(change: ConnectedOverlayPositionChange) {
    const positionClass = getPositionClass(change);
    if (positionClass && this._tooltipComponent) {
      this._tooltipComponent.placementClass.set(
        positionClass as TooltipPositionType
      );
      this._tooltipComponent.detectChanges();
    }
  }

  ngOnInit(): void {
    this._initListener();
  }

  private _initListener() {
    this._ngZone.runOutsideAngular(() =>
      fromEvent(this._elementRef.nativeElement, 'mouseenter')
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => this._ngZone.run(() => this.show()))
    );
    this._ngZone.runOutsideAngular(() =>
      fromEvent(this._elementRef.nativeElement, 'mouseleave')
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => this._ngZone.run(() => this.hide()))
    );
  }

  show() {
    if (!this._tooltipPortal) {
      this._tooltipPortal = new ComponentPortal(NgxTooltipComponent);
    }

    if (!this._overlayRef) {
      this._overlayRef = this._overlay.create(this._getOverlayConfig());
    }

    if (this._overlayRef && !this._overlayRef.hasAttached()) {
      this._tooltipComponent = this._overlayRef?.attach(
        this._tooltipPortal
      ).instance;

      if (this._tooltipComponent) {
        this._tooltipComponent.title.set(this.ngxTooltip);
        this._tooltipComponent.detectChanges();
      }
    }
    this._initVisibleChange(true);
  }

  hide() {
    if (this._overlayRef && this._overlayRef.hasAttached()) {
      this._overlayRef?.detach();
      this._initVisibleChange(false);
    }
  }

  private _initVisibleChange(isVisible: boolean) {
    this._isOpen = isVisible;
    this.visibleChange.next(this._isOpen);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
