import { Component, EventEmitter, Output } from '@angular/core';
import { ResizableCorner } from '../resizable-corner/resizable-corner.component';
import { Placement, Point } from '../../types';

@Component({
  selector: 'app-resizable',
  standalone: true,
  imports: [ResizableCorner],
  templateUrl: './resizable.component.html',
  styleUrl: './resizable.component.scss',
})
export class Resizable {
  @Output() $resize = new EventEmitter<
    {
      placement: Placement;
    } & Point
  >();

  PLACEMENTS: Placement[] = [
    { h: 'left', v: 'top' },
    { h: 'left', v: 'bottom' },
    {
      h: 'right',
      v: 'top',
    },
    { h: 'right', v: 'bottom' },
  ];
}
