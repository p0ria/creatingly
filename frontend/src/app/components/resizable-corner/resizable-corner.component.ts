import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  viewChild,
} from '@angular/core';
import { Subject, fromEvent, sampleTime, takeUntil } from 'rxjs';
import { Placement, Point } from '../../types';

@Component({
  selector: 'app-resizable-corner',
  standalone: true,
  imports: [],
  templateUrl: './resizable-corner.component.html',
  styleUrl: './resizable-corner.component.scss',
})
export class ResizableCorner implements OnDestroy {
  @Input() placement: Placement;
  @Output() $resize = new EventEmitter<Point>();

  private mouseUp$ = new Subject<void>();
  destroyed$ = new Subject<void>();

  @HostListener('mousedown', ['$event'])
  onMouseDown(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.mouseUp$.next();

    fromEvent(document, 'mousemove')
      .pipe(
        sampleTime(50),
        takeUntil(this.mouseUp$),
        takeUntil(this.destroyed$)
      )
      .subscribe((e: MouseEvent) => {
        this.$resize.next({ x: e.clientX, y: e.clientY });
      });

    fromEvent(document, 'mouseup')
      .pipe(takeUntil(this.mouseUp$), takeUntil(this.destroyed$))
      .subscribe(() => {
        this.mouseUp$.next();
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
