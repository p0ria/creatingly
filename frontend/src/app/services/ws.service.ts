import { EventEmitter, Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import {
  DocsListData,
  DocStateData,
  ElChangedData,
  Id,
  NewElData,
  UiElement,
  WsEvent,
} from '../types';
import { lowercaseFirstLetter } from '../common/utils';

@Injectable({
  providedIn: 'root',
})
export class WsService {
  socket = io(environment.wsUrl, {
    protocols: ['websocket'],
  });
  connected$ = new BehaviorSubject(false);
  docsList$ = new EventEmitter<DocsListData>();
  docState$ = new EventEmitter<DocStateData>();
  elChanged$ = new EventEmitter<ElChangedData>();
  newEl$ = new EventEmitter<NewElData>();

  constructor() {
    this.socket.on('connect', () => {
      this.connected$.next(true);
    });

    this.socket.on('disconnect', () => {
      this.connected$.next(false);
    });

    Object.values(WsEvent)
      .filter((ev) => Object.hasOwn(this, `${lowercaseFirstLetter(ev)}$`))
      .forEach((ev) =>
        this.socket.on(ev, (data) => {
          this[`${lowercaseFirstLetter(ev)}$`]?.emit(data);
        })
      );
  }

  emit(ev: WsEvent, data: any) {
    this.socket.emit(ev, data);
  }
}
