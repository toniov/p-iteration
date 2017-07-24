declare module "p-iteration" {
  export const forEach: <T>(
    array: T[],
    callback: (currentValue: T, index: number, array: T[]) => void,
    thisArg?: any
  ) => Promise<void>;

  export const forEachSeries: <T>(
    array: T[],
    callback: (currentValue: T, index: number, array: T[]) => void,
    thisArg?: any
  ) => Promise<void>;

  export const map: <T, U>(
    array: T[],
    callback: (currentValue: T, index: number, array: T[]) => U | Promise<U>,
    thisArg?: any
  ) => Promise<U[]>;

  export const mapSeries: <T, U>(
    array: T[],
    callback: (currentValue: T, index: number, array: T[]) => U | Promise<U>,
    thisArg?: any
  ) => Promise<U[]>;

  export const find: <T>(
    array: T[],
    callback: (currentValue: T, index: number, array: T[]) => boolean | Promise<boolean>,
    thisArg?: any
  ) => Promise<T>;

  export const findSeries: <T>(
    array: T[],
    callback: (currentValue: T, index: number, array: T[]) => boolean | Promise<boolean>,
    thisArg?: any
  ) => Promise<T>;

  export var findIndex: <T>(
    array: T[],
    callback: (currentValue: T, index: number, array: T[]) => boolean | Promise<boolean>,
    thisArg?: any
  ) => Promise<number>;

  export var findIndexSeries: <T>(
    array: T[],
    callback: (currentValue: T, index: number, array: T[]) => boolean | Promise<boolean>,
    thisArg?: any
  ) => Promise<number>;

  export var some: <T>(
    array: T[],
    callback: (currentValue: T, index: number, array: T[]) => boolean | Promise<boolean>,
    thisArg?: any
  ) => Promise<boolean>;

  export var someSeries: <T>(
    array: T[],
    callback: (currentValue: T, index: number, array: T[]) => boolean | Promise<boolean>,
    thisArg?: any
  ) => Promise<boolean>;

  export var every: <T>(
    array: T[],
    callback: (currentValue: T, index: number, array: T[]) => boolean | Promise<boolean>,
    thisArg?: any
  ) => Promise<boolean>;

  export var everySeries: <T>(
    array: T[],
    callback: (currentValue: T, index: number, array: T[]) => boolean | Promise<boolean>,
    thisArg?: any
  ) => Promise<boolean>;

  export var filter: <T>(
    array: T[],
    callback: (currentValue: T, index: number, array: T[]) => boolean | Promise<boolean>,
    thisArg?: any
  ) => Promise<T[]>;

  export var filterSeries: <T>(
    array: T[],
    callback: (currentValue: T, index: number, array: T[]) => boolean | Promise<boolean>,
    thisArg?: any
  ) => Promise<T[]>;

  export var reduce: <T, U>(
    array: T[],
    callback: (accumulator: U, currentValue: T, currentIndex: number, array: T[]) => U | Promise<U>,
    initialValue?: U
  ) => Promise<U>;
}
