import { Buffer } from 'node:buffer';
import { buffer } from 'node:stream/consumers';

import test from 'ava';
import { pEvent } from 'p-event';
import PluginError from 'plugin-error';

import * as ErrorBindings from '../src/error-bindings.js';
import convertEncoding from '../index.js';

import Constants, {
	createFile,
	setUpFromLatin1Buffer,
	setUpFromLatin1Stream,
	setUpFromUTF8Buffer,
	setUpFromUTF8Stream,
} from './_helper.js';

const { LATIN1, UTF8 } = Constants;

test('throws on missing encoding', (t) => {
	t.throws(convertEncoding, {
		any: true,
		instanceOf: PluginError,
		message: ErrorBindings.missingEncoding,
	});
});

test('throws on unsupported encoding', (t) => {
	t.throws(
		() => {
			convertEncoding({ from: 'ahfkjdsahfk' });
		},
		{
			any: true,
			instanceOf: PluginError,
			message: new RegExp(`^${ErrorBindings.unsupportedEncoding}`),
		},
	);
});

// TODO spy on console.warn
// test.serial('warns on identical `from` and `to` options', (t) => {
// 	convertEncoding({ from: UTF8 });
// 	t.true(console.warn.calledOnce);
// 	// ErrorBindings.sameEncoding,
// });

// test.serial('warns on invalid `iconv` options', (t) => {
// 	convertEncoding({ iconv: 'somestring' });
// 	t.true(console.warn.calledOnce);
// 	// ErrorBindings.invalidIconvOptions,
// });

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
