interface BaseItem {
    width: number;
    height: number;
    x: number;
    y: number;
    padding?: number;
}
export interface BaseInitItem {
    width: number;
    height: number;
    _width?: number;
    _height?: number;
    padding?: number;
    widthPercent?: number;
    marginY?: number;
    marginX?: number;
    x?: number;
    y?: number;
}
declare type Item<T> = BaseItem & T;
declare type InitItem<T> = BaseInitItem & T;
interface Options {
    width: number;
    maxHeight?: number;
    defaultItemSize: {
        height: number;
        width: number;
    };
}
export default class Waterfall<P = {}> {
    width: number;
    height: number;
    topItems: Item<P>[];
    bottomItems: Item<P>[];
    initItems: InitItem<P>[];
    nowRow: Item<P>[];
    isFirstLine: boolean;
    options: Options;
    defaultItemSize: {
        height: number;
        width: number;
    };
    get nowRowWidth(): number;
    get nowRowMinBottomItem(): Item<{}> | Item<P>;
    constructor(items: InitItem<P>[], options: Options);
    handleItemsSizeError(items: InitItem<P>[]): InitItem<P>[];
    add(items: InitItem<P>[]): Item<P>[];
    calculateItemAndToItems(items: InitItem<P>[]): Item<P>[];
    calculateItem(initItem: InitItem<P>): Item<P>;
    clear(): void;
    calculateAll(): void;
}
export {};
