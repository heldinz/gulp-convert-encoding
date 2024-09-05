import { Buffer } from 'node:buffer';
import { buffer } from 'node:stream/consumers';

import test from 'ava';
import { PluginError } from 'gulp-plugin-extras';
import { pEvent } from 'p-event';
import sinon from 'sinon';

import * as ErrorBindings from '../dist/error-bindings.js';
import convertEncoding from '../dist/index.js';

import Constants, {
	createFile,
	setUpFromLatin1Buffer,
	setUpFromLatin1Stream,
	setUpFromUTF8Buffer,
	setUpFromUTF8Stream,
} from './_helper.js';

const { LATIN1, UTF8 } = Constants;

test.beforeEach((t) => {
	t.context.warn = console.warn;
	console.warn = sinon.spy();
});

test.afterEach((t) => {
	console.warn = t.context.warn;
});

test.serial('warns on identical `from` and `to` options', (t) => {
	convertEncoding({ from: UTF8 });
	t.true(console.warn.calledOnce);
	console.warn.calledWith(ErrorBindings.sameEncoding);
});

test.serial('warns on invalid `iconv` options', (t) => {
	convertEncoding({ from: LATIN1, iconv: 'somestring' });
	t.true(console.warn.calledOnce);
	console.warn.calledWith(ErrorBindings.invalidIconvOptions);
});

test('throws on missing encoding', (t) => {
	t.throws(convertEncoding, {
		any: true,
		instanceOf: PluginError,
		message: ErrorBindings.missingEncoding,
	});
});

const unsupportedEncoding = test.macro({
	exec(t, option, input) {
		t.throws(
			() => {
				convertEncoding({ [option]: input });
			},
			{
				any: true,
				instanceOf: PluginError,
				message: new RegExp(`^${ErrorBindings.unsupportedEncoding}`),
			},
		);
	},
	title(option) {
		return `throws on unsupported ${option} encoding`;
	},
});

for (let option of ['from', 'to']) {
	test(option, unsupportedEncoding, option, 'ahfkjdsahfk');
}

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
