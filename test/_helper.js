import { Buffer, transcode } from 'node:buffer';
import { Readable } from 'node:stream';

import Vinyl from 'vinyl';

const LATIN1 = 'latin1';
const TEST_STRING = 'äöüß';
const UTF8 = 'utf8';

export function createFile({ contents }) {
	return new Vinyl({
		contents,
	});
}

const setUp = ({ isFromLatin1 = false, isStream = false } = {}) => {
	let from = UTF8;
	let to = LATIN1;
	let pluginOptions = { to: LATIN1 };

	if (isFromLatin1) {
		from = LATIN1;
		to = UTF8;
		pluginOptions = { from: LATIN1 };
	}

	const defaultBuffer = Buffer.from(TEST_STRING);
	const fileContentsBuffer = isFromLatin1
		? transcode(defaultBuffer, to, from)
		: defaultBuffer;

	const fileContents = isStream
		? Readable.from(fileContentsBuffer)
		: fileContentsBuffer;

	return {
		from,
		to,
		pluginOptions,
		vinylFile: createFile({ contents: fileContents }),
		expected: TEST_STRING,
		isStream,
	};
};

export const setUpFromUTF8Buffer = () => setUp();
export const setUpFromLatin1Buffer = () => setUp({ isFromLatin1: true });
export const setUpFromUTF8Stream = () => setUp({ isStream: true });
export const setUpFromLatin1Stream = () =>
	setUp({ isFromLatin1: true, isStream: true });

export default {
	LATIN1,
	UTF8,
};
