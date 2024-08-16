import iconv from 'iconv-lite';
import { gulpPlugin } from 'gulp-plugin-extras';
import PluginError from 'plugin-error';

const pluginName = 'gulp-convert-encoding';
const UTF8 = 'utf8';

export default function gulpConvertEncoding(options) {
	options = { ...options };

	if (!options.from && !options.to) {
		throw new PluginError(pluginName, {
			message: 'At least one of `options.from` or `options.to` is required',
		});
	}

	const {
		from = UTF8,
		to = UTF8,
		iconv: iconvOptions = { decode: {}, encode: {} },
	} = options;

	if (from === to) {
		throw new PluginError(pluginName, {
			message:
				'The `options.from` and `options.to` encodings must be different',
		});
	}

	if (typeof iconvOptions !== 'object') {
		throw new PluginError(pluginName, {
			message: '`options.iconv` must be an object',
		});
	}

	// TODO sort out this mess with JS properties... just switch to TS?
	if (
		typeof iconvOptions.decode !== 'object' &&
		typeof iconvOptions.encode !== 'object'
	) {
		throw new PluginError(pluginName, {
			message:
				'`options.iconv` must specify a value for one or both of the properties `decode` and `encode`',
		});
	}

	if (iconvOptions.decode && typeof iconvOptions.decode !== 'object') {
		throw new PluginError(pluginName, {
			message: '`options.iconv.decode` must be an object`',
		});
	}
	iconvOptions.decode ??= {};

	if (iconvOptions.encode && typeof iconvOptions.encode !== 'object') {
		throw new PluginError(pluginName, {
			message: '`options.iconv.encode` must be an object`',
		});
	}
	iconvOptions.encode ??= {};

	return gulpPlugin(
		pluginName,
		(file) => {
			if (file.isBuffer()) {
				const content = iconv.decode(file.contents, from, iconvOptions.decode);
				file.contents = iconv.encode(content, to, iconvOptions.encode);
			}

			if (file.isStream()) {
				file.contents = file.contents
					.pipe(iconv.decodeStream(from, iconvOptions.decode))
					.pipe(iconv.encodeStream(to, iconvOptions.encode));
			}

			return file;
		},
		{ supportsAnyType: true },
	);
}
