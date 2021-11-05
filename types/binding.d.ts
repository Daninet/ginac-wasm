import { GiNaCObject } from './comm';
export interface PrintOptions {
    input?: string;
    string?: boolean;
    latex?: boolean;
    tree?: boolean;
    archive?: boolean;
    json?: boolean;
}
declare type ObjectType = 'symbol' | 'constant' | 'numeric' | 'add' | 'mul' | 'ncmul' | 'power' | 'pseries' | 'function' | 'lst' | 'matrix' | 'relational' | 'indexed' | 'tensor' | 'idx' | 'varidx' | 'spinidx' | 'wildcard' | 'unknown';
declare type NumberSubtype = 'integer' | 'rational' | 'real' | 'cinteger' | 'crational';
declare type RelationOp = '==' | '!=' | '<' | '<=' | '>' | '>=';
export interface JSONObj {
    type: ObjectType;
    subtype?: NumberSubtype;
    name?: string;
    value?: string;
    cols?: number;
    rows?: number;
    op?: RelationOp;
    children?: JSONObj[];
}
export interface PrintOutput {
    input?: string;
    string?: string;
    latex?: string;
    tree?: string;
    archive?: Uint8Array;
    json?: JSONObj;
    error?: string;
}
export declare const getBinding: (wasmPath: string) => Promise<{
    print: (exs: GiNaCObject[], opts: PrintOptions) => PrintOutput[];
}>;
export {};
