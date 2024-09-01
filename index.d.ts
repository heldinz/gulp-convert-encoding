import File from 'vinyl';

declare module 'gulp-plugin-extras' {
	export function gulpPlugin(
		name: string,
		onFile: (file: File) => File,
		options?: Options,
	): Buffer | NodeJS.ReadableStream | null;
}
