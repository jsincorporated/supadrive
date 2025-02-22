export const formatFileSize = (bytes: number | null): string => {
	if (bytes === null) return "";

	const units = ["B", "KB", "MB", "GB", "TB"];
	let size = bytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${Math.round(size * 10) / 10} ${units[unitIndex]}`;
};
