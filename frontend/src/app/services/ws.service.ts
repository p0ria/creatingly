import { EventEmitter, Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Id, UiElement, WsEvent } from '../types';
import { lowercaseFirstLetter } from '../common/utils';

@Injectable({
  providedIn: 'root',
})
export class WsService {
  socket = io(environment.wsUrl);
  connected$ = new BehaviorSubject(false);
  elChanged$ = new EventEmitter<UiElement>();
  currentState$ = new EventEmitter<Record<Id, UiElement>>();
  newEl$ = new EventEmitter<UiElement>();

  constructor() {
    this.socket.on('connect', () => {
      this.connected$.next(true);
    });

    this.socket.on('disconnect', () => {
      this.connected$.next(false);
    });

    Object.values(WsEvent).forEach((ev) =>
      this.socket.on(ev, (data) => {
        this[`${lowercaseFirstLetter(ev)}$`].emit(data);
      })
    );
  }

  emit(ev: WsEvent, el: UiElement) {
    this.socket.emit(ev, el);
  }
}
