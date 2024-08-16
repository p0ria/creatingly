import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  OnDestroy,
} from '@angular/core';
import { fromEvent, sampleTime, Subject, takeUntil } from 'rxjs';
import { DesignerService } from '../services/designer.service';
import { Id, Point } from '../types';

@Directive({
  selector: '[draggable]',
  standalone: true,
})
export class DraggableDirective implements AfterViewInit, OnDestroy {
  el = inject<ElementRef<HTMLDivElement>>(ElementRef);
  mouseUp$ = new Subject<void>();
  designer = inject(DesignerService);
  id: Id;
  _dragStart: Point;
  destroyed$ = new Subject<void>();

  get dragStart(): Point {
    return this._dragStart;
  }
  set dragStart(e: MouseEvent) {
    this._dragStart = { x: e.clientX, y: e.clientY };
  }

  @HostBinding('class')
  class = 'cursor-move';

  @HostListener('mousedown', ['$event'])
  onMouseDown(e: MouseEvent) {
    e.preventDefault();
    this.mouseUp$.next();
    this.dragStart = e;

    fromEvent(document, 'mousemove')
      .pipe(
        sampleTime(50),
        takeUntil(this.mouseUp$),
        takeUntil(this.destroyed$)
      )
      .subscribe((e: MouseEvent) => {
        const { left, top, width, height } =
          this.el.nativeElement.getBoundingClientRect();
        const diffX = e.clientX - this.dragStart.x;
        const diffY = e.clientY - this.dragStart.y;

        const newLeft = Math.min(
          Math.max(0, left + diffX),
          window.innerWidth - width
        );
        const newTop = Math.min(
          Math.max(0, top + diffY),
          window.innerHeight - height
        );

        this.dragStart = e;
        this.designer.updateEl(this.id, 'style', {
          left: `${newLeft}px`,
          top: `${newTop}px`,
        });
      });

    fromEvent(document, 'mouseup')
      .pipe(takeUntil(this.mouseUp$), takeUntil(this.destroyed$))
      .subscribe(() => {
        this.mouseUp$.next();
      });
  }

  ngAfterViewInit(): void {
    this.id = this.el.nativeElement.id;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
