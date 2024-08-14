import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Id, UiElement, WsEvent } from '../types';
import { isObj } from '../common/utils';
import { WsService } from './ws.service';

@Injectable({
  providedIn: 'root',
})
export class DesignerService {
  private _state$ = new BehaviorSubject<Record<Id, UiElement>>({});
  private ws = inject(WsService);

  constructor() {
    this.ws.currentState$.subscribe((state) => this._state$.next(state));
    this.ws.elChanged$.subscribe((elChanged) => {
      if (this._state$.value[elChanged.id].updatedAt < elChanged.updatedAt) {
        this._state$.next({
          ...this._state$.value,
          [elChanged.id]: elChanged,
        });
      }
    });
  }

  get state$() {
    return this._state$.asObservable();
  }

  update<K extends keyof UiElement | ''>(id: Id, prop: K, update: Update<K>) {
    const updatedAt = +new Date();
    const el = this._state$.value[id];
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

    this._state$.next({
      ...this._state$.value,
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
