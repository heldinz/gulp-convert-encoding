import iconv from 'iconv-lite';
import { gulpPlugin, PluginError } from 'gulp-plugin-extras';
import * as ErrorBindings from './error-bindings.js';
const pluginName = 'gulp-convert-encoding';
const UTF8 = 'utf8';
export default function convertEncoding(options) {
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
