import {
  ConnectedOverlayPositionChange,
  ConnectionPositionPair,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ChangeDetectorRef,
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
import { POSITION_MAP, PositionType } from '../core/utils/overlay.utils';
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
  private _cdr = inject(ChangeDetectorRef);
  private _overlayRef?: OverlayRef;
  private _elementRef = inject(ElementRef);
  private _ngZone = inject(NgZone);
  private _tooltipPortal!: ComponentPortal<NgxTooltipComponent>;
  private _tooltipComponent!: NgxTooltipComponent;
  private _positions: ConnectionPositionPair[] = DEFAULT_TOOLTIP_POSITIONS;
  private _positionMap = POSITION_MAP;

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
        if (
          change.scrollableViewProperties.isOriginOutsideView &&
          this._overlayRef?.hasAttached()
        ) {
          this.hide();
        }
      });

    return new OverlayConfig({
      panelClass: ['ngx-tooltip-panel', this.panelClass],
      positionStrategy: streategy,
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
    });
  }

  private _updateClassMap(change: ConnectedOverlayPositionChange) {
    const { connectionPair } = change;
    for (const pos in this._positionMap) {
      const configConnectedPair = this._positionMap[pos as PositionType];
      if (
        configConnectedPair.originX === connectionPair.originX &&
        configConnectedPair.originY === connectionPair.originY &&
        configConnectedPair.overlayX === connectionPair.overlayX &&
        configConnectedPair.overlayX === connectionPair.overlayX
      ) {
        if (this._tooltipComponent) {
          this._tooltipComponent.placementClass.set(pos as PositionType);
          this._tooltipComponent.updateStyle();
        }
      }
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
