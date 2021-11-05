import { PrintOptions } from './binding';
import * as GiNaCFactory from './comm';
export declare const initGiNaC: (wasmPath: string) => Promise<(arr: GiNaCFactory.GiNaCObject[] | GiNaCFactory.GiNaCObject, opts?: PrintOptions) => import("./binding").PrintOutput[]>;
export declare const getFactory: () => typeof GiNaCFactory;
