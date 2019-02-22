import { IRouteRecord, RouteActionType } from '../../interface/common';
import { IDriverEvent, IRouterDriver, RouteDriverEventType } from '../../interface/driver';
import EventEmitter from '../../lib/EventEmitter';
import idMarker from './idMarker';
interface IHistoryRouteState {
  __routeState: {
    id: number;
    state: unknown;
  };
}
enum Mode {
  history = 'history',
  hash = 'hash'
}
export interface IWebDriverOptions {
  mode: Mode;
}

export default class BrowserDriver extends EventEmitter<IDriverEvent> implements IRouterDriver {
  private currentId: number = 0;
  private mode = Mode.hash;
  constructor(options?: IWebDriverOptions) {
    super();
    if (options) {
      this.mode = options.mode;
    }
  }

  public receiverReady() {
    this.initRouter();
    this.initListener();
  }

  public push(path: string, state?: unknown): void {
    const id = idMarker();
    window.history.pushState({ __routeState: { id, state } } as IHistoryRouteState, '', this.getUrl(path));
    this.handleRouteChange(RouteActionType.PUSH, id, path, state);
  }

  public pop(): void {
    window.history.back();
  }

  public replace(path: string, state?: unknown): void {
    const id = idMarker();
    window.history.replaceState({ __routeState: { id, state } } as IHistoryRouteState, '', this.getUrl(path));
    this.handleRouteChange(RouteActionType.REPLACE, id, path, state);
  }

  private handleRouteChange(type: RouteActionType, id: number, path: string, state: unknown) {
    this.currentId = id;
    const route: IRouteRecord = { id: String(id), path, state, type };
    this.emit(RouteDriverEventType.CHANGE, route);
  }

  /**
   * 初始化
   *
   * @private
   * @memberof WebRouterDriver
   */
  private initListener() {
    window.addEventListener('popstate', e => {
      const historyState = e.state as IHistoryRouteState | null;
      const routeState = historyState && historyState.__routeState;
      if (routeState) {
        const { id, state } = routeState;
        const path = this.getCurrentPath();
        const type = id > this.currentId ? RouteActionType.PUSH : RouteActionType.POP;
        this.handleRouteChange(type, id, path, state);
      } else {
        const path = this.getCurrentPath();
        const id = idMarker();
        window.history.replaceState({ __routeState: { id } } as IHistoryRouteState, '', this.getUrl(path));
        this.handleRouteChange(RouteActionType.PUSH, id, path, undefined);
      }
    });
  }

  private initRouter() {
    const path = this.getCurrentPath() || '/';
    const id = idMarker();
    window.history.replaceState({ __routeState: { id } } as IHistoryRouteState, '', this.getUrl(path));
    this.handleRouteChange(RouteActionType.NONE, id, path, undefined);
  }

  private getCurrentPath() {
    const url = new URL(window.location.href);
    if (this.mode === Mode.hash) {
      return this.getPath(new URL(`x:${url.hash.replace(/^#/, '')}`));
    }
    return this.getPath(url);
  }

  private getPath(url: URL) {
    return url.pathname + url.search;
  }

  private getUrl(path: string) {
    return this.mode === Mode.hash ? `#${path}` : path;
  }
}