import { useState, useEffect } from "react";
import type { FileItem } from "@/types/file";
import type { FolderItem } from "@/types/folder";

export function useFileSearch(files: (FileItem | FolderItem)[]) {
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredFiles, setFilteredFiles] = useState<(FileItem | FolderItem)[]>(files);

	useEffect(() => {
		const filtered = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()));
		setFilteredFiles(filtered);
	}, [files, searchQuery]);

	return {
		searchQuery,
		setSearchQuery,
		filteredFiles,
	};
}
