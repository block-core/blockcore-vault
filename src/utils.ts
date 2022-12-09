export function sleep(durationInMillisecond: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, durationInMillisecond));
}
