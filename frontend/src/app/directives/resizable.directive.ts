import {
  Directive,
  ElementRef,
  HostBinding,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Resizable } from '../components/resizable/resizable.component';
import { DesignerService } from '../services/designer.service';
import { Id, Placement } from '../types';

const MIN_GAP = 30;

@Directive({
  selector: '[resizable]',
  standalone: true,
})
export class ResizableDirective implements OnInit, OnDestroy {
  el = inject<ElementRef<HTMLDivElement>>(ElementRef);
  renderer = inject(Renderer2);
  vcr = inject(ViewContainerRef);
  designer = inject(DesignerService);
  id: Id;
  destroyed$ = new Subject<void>();

  @HostBinding('class')
  class = 'fixed';

  ngOnInit(): void {
    this.id = this.el.nativeElement.id;
    var resizableComponentRef = this.vcr.createComponent(Resizable);

    resizableComponentRef.instance.$resize
      .pipe(takeUntil(this.destroyed$))
      .subscribe((e) => this.onResize(e));

    this.renderer.appendChild(
      this.el.nativeElement,
      resizableComponentRef.location.nativeElement
    );
  }

  onResize({
    x,
    y,
    placement,
  }: {
    x: number;
    y: number;
    placement: Placement;
  }) {
    const { left, right, top, bottom } =
      this.el.nativeElement.getBoundingClientRect();

    if (placement.h == 'left') {
      const newLeft = Math.max(0, Math.min(x, right - MIN_GAP));
      const width = right - newLeft;
      this.designer.update(this.id, 'style', {
        left: `${newLeft}px`,
        width: `${width}px`,
      });
    } else {
      const width = Math.max(MIN_GAP, x - left);
      this.designer.update(this.id, 'style', {
        width: `${width}px`,
      });
    }

    if (placement.v == 'top') {
      const newTop = Math.max(0, Math.min(y, bottom - MIN_GAP));
      const height = bottom - newTop;
      this.designer.update(this.id, 'style', {
        top: `${newTop}px`,
        height: `${height}px`,
      });
    } else {
      const height = Math.max(MIN_GAP, y - top);
      this.designer.update(this.id, 'style', {
        height: `${height}px`,
      });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
