import { Buffer } from 'node:buffer';
import { buffer } from 'node:stream/consumers';

import test from 'ava';
import { pEvent } from 'p-event';
import PluginError from 'plugin-error';

import Constants, {
	createFile,
	setUpFromLatin1Buffer,
	setUpFromLatin1Stream,
	setUpFromUTF8Buffer,
	setUpFromUTF8Stream,
} from './_helper.js';
import convertEncoding from './index.js';

const { LATIN1, UTF8 } = Constants;

test('throws on empty options', (t) => {
	t.throws(convertEncoding, {
		any: true,
		instanceOf: PluginError,
		message: 'At least one of `options.from` or `options.to` is required',
	});
});

test('throws on identical `from` and `to` options', (t) => {
	t.throws(
		() => {
			convertEncoding({ from: UTF8 });
		},
		{
			any: true,
			instanceOf: PluginError,
			message:
				'The `options.from` and `options.to` encodings must be different',
		},
	);
});

test('throws on non-object `iconv` option', (t) => {
	t.throws(
		() => {
			convertEncoding({ from: LATIN1, iconv: '' });
		},
		{
			any: true,
			instanceOf: PluginError,
			message: '`options.iconv` must be an object',
		},
	);
});

test('throws on empty `iconv` option', (t) => {
	t.throws(
		() => {
			convertEncoding({ from: LATIN1, iconv: {} });
		},
		{
			any: true,
			instanceOf: PluginError,
			message:
				'`options.iconv` must specify a value for one or both of the properties `decode` and `encode`',
		},
	);
});

test('throws on non-object `iconv.decode` option', (t) => {
	t.throws(
		() => {
			convertEncoding({ from: LATIN1, iconv: { decode: '' } });
		},
		{
			any: true,
			instanceOf: PluginError,
			message: '`options.iconv.decode` must be an object`',
		},
	);
});

test('throws on non-object `iconv.encode` option', (t) => {
	t.throws(
		() => {
			convertEncoding({ from: LATIN1, iconv: { encode: 4 } });
		},
		{
			any: true,
			instanceOf: PluginError,
			message: '`options.iconv.encode` must be an object`',
		},
	);
});

test('does not throw when only `iconv.decode` is missing', (t) => {
	t.notThrows(() => {
		convertEncoding({ from: LATIN1, iconv: { encode: {} } });
	});
});

test('does not throw when only `iconv.encode` is missing', (t) => {
	t.notThrows(() => {
		convertEncoding({ from: LATIN1, iconv: { decode: {} } });
	});
});

test('ignores null files', async (t) => {
	const stream = convertEncoding({ to: LATIN1 });
	const promise = pEvent(stream, 'data');

	stream.end(createFile({ contents: null }));

	const file = await promise;
	const actual = file.contents;
	const expected = null;

	t.is(actual, expected);
});

test(`converts a buffer from ${UTF8} to ${LATIN1}`, async (t) => {
	const { to, iconvLiteTo, vinylFile, expected } = setUpFromUTF8Buffer();

	const stream = convertEncoding({ to: iconvLiteTo });
	const promise = pEvent(stream, 'data');

	stream.end(vinylFile);

	const file = await promise;
	const contentsBuffer = Buffer.from(file.contents, to);
	const actual = contentsBuffer.toString(to);

	t.is(actual, expected);
});

test(`converts a buffer from ${LATIN1} to ${UTF8}`, async (t) => {
	const { to, iconvLiteFrom, vinylFile, expected } = setUpFromLatin1Buffer();

	const stream = convertEncoding({ from: iconvLiteFrom });
	const promise = pEvent(stream, 'data');

	stream.end(vinylFile);

	const file = await promise;
	const contentsBuffer = Buffer.from(file.contents, to);
	const actual = contentsBuffer.toString(to);

	t.is(actual, expected);
});

test(`converts a stream from ${UTF8} to ${LATIN1}`, async (t) => {
	const { to, iconvLiteTo, vinylFile, expected } = setUpFromUTF8Stream();

	const stream = convertEncoding({ to: iconvLiteTo });
	const promise = pEvent(stream, 'data');

	stream.end(vinylFile);

	const file = await promise;
	const contentsBuffer = await buffer(file.contents);
	const actual = contentsBuffer.toString(to);

	t.is(actual, expected);
});

test(`converts a stream from ${LATIN1} to ${UTF8}`, async (t) => {
	const { to, iconvLiteFrom, vinylFile, expected } = setUpFromLatin1Stream();

	const stream = convertEncoding({ from: iconvLiteFrom });
	const promise = pEvent(stream, 'data');

	stream.end(vinylFile);

	const file = await promise;
	const contentsBuffer = await buffer(file.contents);
	const actual = contentsBuffer.toString(to);

	t.is(actual, expected);
});
