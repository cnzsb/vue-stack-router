export interface IEventEmitter<T> {
  on<K extends keyof T>(type: K, listener: T[K]): void;
  off<K extends keyof T>(type: K, listener: T[K]): void;
  emit<K extends keyof T>(type: K, ...params: Parameters<T[K] extends (...args: any[]) => any ? T[K] : never>): void;
}

export enum RouteActionType {
  NONE = 'none',
  PUSH = 'push',
  POP = 'pop',
  REPLACE = 'replace'
}

export interface IRouteRecord {
  type: RouteActionType;
  id: string;
  path: string;
  state?: unknown;
}

export enum ViewEventType {
  WILL_APPEAR = 'willAppear',
  DID_APPEAR = 'didAppear',
  WILL_DISAPPEAR = 'willDisappear',
  DID_DISAPPEAR = 'didDisappear'
}
export interface IQuery {
  [k: string]: unknown;
}

export enum RouteEventType {
  CHANGE = 'change',
  DESTROY = 'destroy'
}
