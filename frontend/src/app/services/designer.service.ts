import { inject, Injectable } from '@angular/core';
import { nanoid } from 'nanoid';
import { BehaviorSubject } from 'rxjs';
import { getStyleForShape, isObj, now } from '../common/utils';
import { Id, Shape, UiElement, WsEvent } from '../types';
import { WsService } from './ws.service';

@Injectable({
  providedIn: 'root',
})
export class DesignerService {
  state$ = new BehaviorSubject<Record<Id, UiElement>>({});
  private ws = inject(WsService);

  constructor() {
    this.ws.currentState$.subscribe((state) => this.state$.next(state));

    this.ws.newEl$.subscribe((el) => {
      this.state$.next({
        ...this.state$.value,
        [el.id]: el,
      });
    });

    this.ws.elChanged$.subscribe((el) => {
      if (this.state$.value[el.id].updatedAt < el.updatedAt) {
        this.state$.next({
          ...this.state$.value,
          [el.id]: el,
        });
      }
    });
  }

  add(shape: Shape) {
    const el = {
      id: nanoid(),
      style: getStyleForShape(shape),
      updatedAt: now(),
    } as UiElement;

    this.state$.next({
      ...this.state$.value,
      [el.id]: el,
    });

    this.ws.emit(WsEvent.NewEl, el);
  }

  update<K extends keyof UiElement | ''>(id: Id, prop: K, update: Update<K>) {
    const updatedAt = now();
    const el = this.state$.value[id];
    const updatedEl =
      prop == ''
        ? {
            ...el,
            ...(update as any),
            updatedAt,
          }
        : {
            ...el,
            [prop]: isObj(update)
              ? {
                  ...el[prop as any],
                  ...(update as any),
                }
              : update,
            updatedAt,
          };

    this.state$.next({
      ...this.state$.value,
      [id]: updatedEl,
    });

    this.ws.emit(WsEvent.ElChanged, updatedEl);
  }
}

type Update<K extends keyof UiElement | ''> = K extends ''
  ? Partial<UiElement>
  : K extends keyof UiElement
  ? UiElement[K] extends object
    ? Partial<UiElement[K]>
    : UiElement[K]
  : never;
