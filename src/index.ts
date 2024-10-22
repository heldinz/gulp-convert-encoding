import iconv from 'iconv-lite';
import { gulpPlugin, PluginError } from 'gulp-plugin-extras';

const pluginName = 'gulp-convert-encoding';
const UTF8 = 'utf8';

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

export const ErrorBindings = {
	missingEncoding:
		'Missing encoding: at least one of `options.from` or `options.to` is required',
	invalidIconvOptions:
		'Ignoring invalid option: `options.iconv` should be an object with `decode` and/or `encode` properties',
	sameEncoding:
		'Same encodings for `options.from` and `options.to`: are you sure?',
	unsupportedEncoding: 'Unsupported encoding',
};

export default function convertEncoding(options: Options) {
	options = {
		iconv: { decode: {}, encode: {} },
		...options,
	};

	if (!options.from && !options.to) {
		throw new PluginError(pluginName, ErrorBindings.missingEncoding);
	}

	const { from = UTF8, to = UTF8 } = options;

	if (!iconv.encodingExists(from)) {
		throw new PluginError(
			pluginName,
			`${ErrorBindings.unsupportedEncoding}: ${from}`,
		);
	}

	if (!iconv.encodingExists(to)) {
		throw new PluginError(
			pluginName,
			`${ErrorBindings.unsupportedEncoding}: ${to}`,
		);
	}

	if (from === to) {
		console.warn(`${pluginName}: ${ErrorBindings.sameEncoding}`);
	}

	let { iconv: iconvOptions } = options;
	if (typeof iconvOptions !== 'object') {
		console.warn(`${pluginName}: ${ErrorBindings.invalidIconvOptions}`);
		iconvOptions = {};
	}

	iconvOptions.decode ??= {};
	iconvOptions.encode ??= {};

	return gulpPlugin(
		pluginName,
		(file) => {
			if (file.isNull()) {
				return file;
			}

			if (file.isBuffer()) {
				const decodedContent = iconv.decode(
					file.contents,
					from,
					iconvOptions.decode,
				);
				file.contents = iconv.encode(decodedContent, to, iconvOptions.encode);
			}

			if (file.isStream()) {
				file.contents = file.contents
					.pipe(iconv.decodeStream(from, iconvOptions.decode))
					.pipe(iconv.encodeStream(to, iconvOptions.encode));
			}

			return file;
		},
		{
			supportsAnyType: true,
		},
	);
}
