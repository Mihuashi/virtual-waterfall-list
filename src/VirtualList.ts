import { throttle } from './utils';
export interface BaseItem {
  y: number;
  height: number;
}
export type Item<T> = BaseItem & T;

export type ItemsObj<T> = { topItems: Item<T>[], bottomItems: Item<T>[] };

export default class VirtualList<T = {}> {
  private topItems: Item<T>[] = [];
  private bottomItems: Item<T>[] = [];
  private offsetTop: number = 0;
  dom: HTMLElement;
  viewItems: Item<T>[] = [];
  listener: () => void;
  cbs: { [x: string]: Function[] } = {};

  constructor(dom: HTMLElement, {
    topItems,
    bottomItems,
  }: ItemsObj<T>) {
    this.dom = dom;
    this.topItems = topItems;
    this.bottomItems = bottomItems;
    this.initOffsetTop();

    this.listener = throttle(this._listener, 100);
    window.addEventListener('scroll', this.listener.bind(this));
    this._listener();
  }

  initOffsetTop() {
    let el = this.dom;
    let top = el.offsetTop;
    while (el.offsetParent) {
      el = el.offsetParent as HTMLElement;
      top += el.offsetTop;
    }
    this.offsetTop = top;
  }

  setItems({
    topItems,
    bottomItems,
  }: ItemsObj<T>) {
    this.topItems = topItems;
    this.bottomItems = bottomItems;
    this._listener();
  }

  _listener() {
    const y = this.offsetTop - window.pageYOffset
    let startY;
    const { innerHeight } = window;
    if (y < 0) startY = -y;
    else if (y < innerHeight) startY = 0;
    else startY = innerHeight - y;
    const endY = innerHeight - y;
    const bottomItems = this.getViewItem(this.bottomItems, startY, endY);
    const topItems = this.getViewItem(this.topItems, startY, endY);
    this.viewItems = Array.from(
      new Set([
        ...bottomItems,
        ...topItems,
      ]));
    this.emit('change', this.viewItems);
  }

  /**
   * get items array between startY and endY
   * @param {Item<T>[]} items
   * @param {number} startY
   * @param {number} endY
   * @return {*}  {Item<T>[]}
   * @memberof VirtualList
   */
  getViewItem(items: Item<T>[], startY: number, endY: number): Item<T>[] {
    let fromIndex = 0;
    let endIndex = items.length - 1;
    let index: number;

    if (items.length === 0) return [];
    if (items.length <= 2) {
      return items;
    }
    // find out whether these items in the viewport
    while (true) {
      index = Math.floor((fromIndex + endIndex) / 2);
      // fromIndex will not be same with endIndex. Because if fromIndex equals to endIndex then previous index equals to endIndex or fromIndex
      if (index === fromIndex && fromIndex === endIndex - 1) return [];
      const direction = this.getItemDirection(items[index], startY, endY);
      if (direction === -1) fromIndex = index;
      else if (direction === 1) endIndex = index;
      else break;
    }

    for (let i = index; i >= 0; i-=1) {
      if (this.getItemDirection(items[i], startY, endY) === 0) {
        fromIndex = i;
      } else {
        break;
      }
    }
    for (let i = index; i < items.length; i+=1) {
      if (this.getItemDirection(items[i], startY, endY) === 0) {
        endIndex = i;
      } else {
        break;
      }
    }

    return items.slice(fromIndex, endIndex + 1);
  }

  /**
   * check whether the item is in the viewport
   * @param {Item<T>} item item to be checked
   * @param {number} startY container startY
   * @param {number} endY container endY
   * @return {*} -1: above, 0: in, 1: below
   * @memberof VirtualList
   */
  getItemDirection(item: Item<T>, startY: number, endY: number) {
    if (item.height + item.y < startY - 200) return -1;
    if (item.y > endY + 200) return 1;
    return 0;
  }

  clear() {
    this.topItems = [];
    this.bottomItems = [];
    this.viewItems = [];
  }

  on(name: string, cb: Function) {
    if (this.cbs[name]) this.cbs[name].push(cb);
    else this.cbs[name] = [cb];
  }

  emit(name: string, ...args: any[]) {
    if (this.cbs[name]) this.cbs[name].forEach(cb => cb(...args));
  }
}

