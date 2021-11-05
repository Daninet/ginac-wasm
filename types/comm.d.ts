export * from './functions';
export declare type GiNaCObject = {
    toBuf(buf: Uint8Array, index: number): number;
    toString(): string;
};
export declare const numeric: (value: string) => {
    value: string;
    toBuf(buf: Uint8Array, index: number): number;
    toString(): string;
};
export declare const symbol: (name: string) => {
    name: string;
    toBuf(buf: Uint8Array, index: number): number;
    toString(): string;
};
export declare const realsymbol: (name: string) => {
    name: string;
    toBuf(buf: Uint8Array, index: number): number;
    toString(): string;
};
export declare const possymbol: (name: string) => {
    name: string;
    toBuf(buf: Uint8Array, index: number): number;
    toString(): string;
};
export declare const idx: (value: GiNaCObject, dimension: GiNaCObject) => {
    value: GiNaCObject;
    dimension: GiNaCObject;
    toBuf(buf: Uint8Array, index: number): number;
    toString(): string;
};
export declare const wild: (id: number) => {
    value: number;
    toBuf(buf: Uint8Array, index: number): number;
    toString(): string;
};
export declare const lst: (items: GiNaCObject[]) => {
    items: GiNaCObject[];
    toBuf(buf: Uint8Array, index: number): number;
    toString(): string;
};
export declare const matrix: (rows: number, columns: number, items: GiNaCObject[]) => {
    rows: number;
    columns: number;
    items: GiNaCObject[];
    toBuf(buf: Uint8Array, index: number): number;
    toString(): string;
};
export declare const Pi: () => {
    toBuf(buf: Uint8Array, index: number): number;
    toString(): string;
};
export declare const Euler: () => {
    toBuf(buf: Uint8Array, index: number): number;
    toString(): string;
};
export declare const Catalan: () => {
    toBuf(buf: Uint8Array, index: number): number;
    toString(): string;
};
export declare const I: () => {
    toBuf(buf: Uint8Array, index: number): number;
    toString(): string;
};
export declare const ref: (refIndex: number) => {
    value: number;
    toBuf(buf: Uint8Array, index: number): number;
    toString(): string;
};
export declare const ex: (ex: GiNaCObject) => {
    value: GiNaCObject;
    toBuf(buf: Uint8Array, index: number): number;
    toString(): string;
};
export declare const parse: (value: string) => {
    value: string;
    toBuf(buf: Uint8Array, index: number): number;
    toString(): string;
};
export declare const unarchive: (arr: Uint8Array) => {
    value: Uint8Array;
    toBuf(buf: Uint8Array, index: number): number;
    toString(): string;
};
