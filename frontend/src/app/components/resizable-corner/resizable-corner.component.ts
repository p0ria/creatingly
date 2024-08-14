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
import { Placement, ResizeEvent } from '../../types';

@Component({
  selector: 'app-resizable-corner',
  standalone: true,
  imports: [],
  templateUrl: './resizable-corner.component.html',
  styleUrl: './resizable-corner.component.scss',
})
export class ResizableCorner implements OnDestroy {
  @Input() placement: Placement;
  @Output() $resize = new EventEmitter<ResizeEvent>();

  private cornerRef = viewChild<ElementRef<HTMLDivElement>>('corner');
  private mouseDown$ = new Subject<void>();
  destroyed$ = new Subject<void>();

  @HostListener('mousedown', ['$event'])
  onMouseDown(e: MouseEvent) {
    fromEvent(document, 'mousemove')
      .pipe(
        sampleTime(50),
        takeUntil(this.mouseDown$),
        takeUntil(this.destroyed$)
      )
      .subscribe((e: MouseEvent) => {
        this.$resize.next({ x: e.clientX, y: e.clientY });
      });

    fromEvent(document, 'mouseup')
      .pipe(takeUntil(this.mouseDown$), takeUntil(this.destroyed$))
      .subscribe(() => {
        this.mouseDown$.next();
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
