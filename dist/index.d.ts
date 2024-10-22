import type { Options as IconvOptions } from 'iconv-lite';
export interface Iconv {
	decode?: IconvOptions;
	encode?: IconvOptions;
}
export interface Options {
	from?: string;
	to?: string;
	iconv?: Iconv;
}
export declare const ErrorBindings: {
	missingEncoding: string;
	invalidIconvOptions: string;
	sameEncoding: string;
	unsupportedEncoding: string;
};
export default function convertEncoding(
	options: Options,
): NodeJS.ReadableStream;
