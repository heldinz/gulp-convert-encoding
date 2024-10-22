import { Buffer } from 'node:buffer';
import { buffer } from 'node:stream/consumers';

import test from 'ava';
import { PluginError } from 'gulp-plugin-extras';
import { pEvent } from 'p-event';
import sinon from 'sinon';

import convertEncoding, { ErrorBindings } from '../dist/index.js';

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
	title(providedTitle) {
		return `throws on unsupported ${providedTitle} encoding`;
	},
});

for (let option of ['from', 'to']) {
	test(option, unsupportedEncoding, option, 'ahfkjdsahfk');
}

const convert = test.macro({
	async exec(t, input, expected) {
		const { isStream = false, pluginOptions, to, vinylFile } = input;

		const stream = convertEncoding(pluginOptions);
		const promise = pEvent(stream, 'data');

		stream.end(vinylFile);

		const file = await promise;
		const contentsBuffer = isStream
			? await buffer(file.contents)
			: Buffer.from(file.contents, to);
		const actual = contentsBuffer.toString(to);

		t.is(actual, expected);
	},
	title(_, { isStream, from, to }) {
		return `converts a ${isStream ? 'stream' : 'buffer'} from ${from} to ${to}`;
	},
});

const conversionTestCases = [
	{ ...setUpFromUTF8Buffer() },
	{ ...setUpFromLatin1Buffer() },
	{ ...setUpFromUTF8Stream() },
	{ ...setUpFromLatin1Stream() },
];
for (let testCase of conversionTestCases) {
	test(convert, testCase, testCase.expected);
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
