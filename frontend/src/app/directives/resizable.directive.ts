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
import { Placement } from '../types';

const MIN_GAP = 30;

@Directive({
  selector: '[resizable]',
  standalone: true,
})
export class ResizableDirective implements OnInit, OnDestroy {
  el = inject<ElementRef<HTMLDivElement>>(ElementRef);
  renderer = inject(Renderer2);
  vcr = inject(ViewContainerRef);
  designerService = inject(DesignerService);
  destroyed$ = new Subject<void>();

  @HostBinding('class')
  class = 'fixed';

  ngOnInit(): void {
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
    const id = this.el.nativeElement.id;
    const { left, right, top, bottom } =
      this.el.nativeElement.getBoundingClientRect();

    if (placement.h == 'left') {
      const newLeft = Math.min(x, right - MIN_GAP);
      const width = right - newLeft;
      this.designerService.update(id, 'style', {
        left: `${newLeft}px`,
        width: `${width}px`,
      });
    } else {
      const width = Math.max(MIN_GAP, x - left);
      this.designerService.update(id, 'style', {
        width: `${width}px`,
      });
    }

    if (placement.v == 'top') {
      const newTop = Math.min(y, bottom - MIN_GAP);
      const height = bottom - newTop;
      this.designerService.update(id, 'style', {
        top: `${newTop}px`,
        height: `${height}px`,
      });
    } else {
      const height = Math.max(MIN_GAP, y - top);
      this.designerService.update(id, 'style', {
        height: `${height}px`,
      });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
