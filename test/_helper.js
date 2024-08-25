import { Buffer, transcode } from 'node:buffer';
import { Readable } from 'node:stream';

import Vinyl from 'vinyl';

const testString = 'äöüß';
const UTF8 = 'utf8';
const LATIN1 = 'latin1';
const LATIN1_ISO = 'iso-8859-1';

export function createFile({ contents }) {
	const file = new Vinyl({
		contents,
	});

	return file;
}

const setUp = ({ isFromLatin1 = false, isStream = false } = {}) => {
	let from = UTF8;
	let iconvLiteFrom = UTF8;
	let to = LATIN1;
	let iconvLiteTo = LATIN1_ISO;

	if (isFromLatin1) {
		from = LATIN1;
		iconvLiteFrom = LATIN1_ISO;
		to = UTF8;
		iconvLiteTo = UTF8;
	}

	const defaultBuffer = Buffer.from(testString);
	const fileContentsBuffer = isFromLatin1
		? transcode(defaultBuffer, to, from)
		: defaultBuffer;

	const fileContents = isStream
		? Readable.from(fileContentsBuffer)
		: fileContentsBuffer;

	return {
		from,
		to,
		iconvLiteFrom,
		iconvLiteTo,
		vinylFile: createFile({ contents: fileContents }),
		expected: testString,
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
