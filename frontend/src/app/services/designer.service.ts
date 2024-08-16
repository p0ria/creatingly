import { inject, Injectable } from '@angular/core';
import { nanoid } from 'nanoid';
import { BehaviorSubject, filter, skip } from 'rxjs';
import { getStyleForShape, isObj, now } from '../common/utils';
import {
  DocName,
  DocsListData,
  DocStateData,
  ElChangedData,
  Id,
  NewElData,
  Shape,
  SwitchDocData,
  UiElement,
  WsEvent,
} from '../types';
import { WsService } from './ws.service';

@Injectable({
  providedIn: 'root',
})
export class DesignerService {
  docsList$ = new BehaviorSubject<DocName[]>([]);
  currentDoc$ = new BehaviorSubject<DocName>('');
  state$ = new BehaviorSubject<Record<Id, UiElement>>({});
  private ws = inject(WsService);

  constructor() {
    this.ws.docsList$.subscribe((data: DocsListData) =>
      this.docsList$.next(data)
    );

    this.ws.docState$.subscribe((data: DocStateData) => {
      this.currentDoc$.next(data.doc);
      this.state$.next(data.state);
    });

    this.ws.newEl$.subscribe(({ el }) => {
      this.state$.next({
        ...this.state$.value,
        [el.id]: el,
      });
    });

    this.ws.elChanged$.subscribe(({ el }) => {
      if (this.state$.value[el.id]?.updatedAt < el.updatedAt) {
        this.state$.next({
          ...this.state$.value,
          [el.id]: el,
        });
      }
    });

    this.docsList$
      .pipe(
        skip(1),
        filter((docs) => !docs?.length)
      )
      .subscribe(() => this.currentDoc$.next(''));
  }

  addDoc(doc: DocName) {
    this.ws.emit(WsEvent.NewDoc, doc);
  }

  switchDoc(doc: DocName) {
    this.ws.emit(WsEvent.SwitchDoc, doc as SwitchDocData);
  }

  addEl(shape: Shape) {
    const el = {
      id: nanoid(),
      style: getStyleForShape(shape),
      updatedAt: now(),
    } as UiElement;

    this.state$.next({
      ...this.state$.value,
      [el.id]: el,
    });

    this.ws.emit(WsEvent.NewEl, {
      doc: this.currentDoc$.value,
      el,
    } as NewElData);
  }

  updateEl<K extends keyof UiElement | ''>(id: Id, prop: K, update: Update<K>) {
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

    this.ws.emit(WsEvent.ElChanged, {
      doc: this.currentDoc$.value,
      el: updatedEl,
    } as ElChangedData);
  }
}

type Update<K extends keyof UiElement | ''> = K extends ''
  ? Partial<UiElement>
  : K extends keyof UiElement
  ? UiElement[K] extends object
    ? Partial<UiElement[K]>
    : UiElement[K]
  : never;
