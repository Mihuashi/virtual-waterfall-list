export interface BaseItem {
    y: number;
    height: number;
}
export declare type Item<T> = BaseItem & T;
export declare type ItemsObj<T> = {
    topItems: Item<T>[];
    bottomItems: Item<T>[];
};
export default class VirtualList<T = {}> {
    private topItems;
    private bottomItems;
    private offsetTop;
    dom: HTMLElement;
    viewItems: Item<T>[];
    listener: () => void;
    cbs: {
        [x: string]: Function[];
    };
    constructor(dom: HTMLElement, { topItems, bottomItems, }: ItemsObj<T>);
    initOffsetTop(): void;
    setItems({ topItems, bottomItems, }: ItemsObj<T>): void;
    _listener(): void;
    /**
     * get items array between startY and endY
     * @param {Item<T>[]} items
     * @param {number} startY
     * @param {number} endY
     * @return {*}  {Item<T>[]}
     * @memberof VirtualList
     */
    getViewItem(items: Item<T>[], startY: number, endY: number): Item<T>[];
    /**
     * check whether the item is in the viewport
     * @param {Item<T>} item item to be checked
     * @param {number} startY container startY
     * @param {number} endY container endY
     * @return {*} -1: above, 0: in, 1: below
     * @memberof VirtualList
     */
    getItemDirection(item: Item<T>, startY: number, endY: number): 1 | -1 | 0;
    clear(): void;
    on(name: string, cb: Function): void;
    emit(name: string, ...args: any[]): void;
}
