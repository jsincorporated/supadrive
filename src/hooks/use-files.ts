import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import type { FileItem } from "@/types/file";
import type { FolderItem } from "@/types/folder";

export function useFiles(currentFolderId: number | null) {
	const [files, setFiles] = useState<(FileItem | FolderItem)[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchFiles = async () => {
		try {
			setIsLoading(true);
			const filesQuery = supabase.from("files").select("*").order("name");
			const { data: filesData, error: filesError } = await (currentFolderId === null ? filesQuery.is("folder_id", null) : filesQuery.eq("folder_id", currentFolderId));

			if (filesError) throw filesError;

			const foldersQuery = supabase.from("folders").select("*").order("name");
			const { data: foldersData, error: foldersError } = await (currentFolderId === null
				? foldersQuery.is("parent_id", null)
				: foldersQuery.eq("parent_id", currentFolderId));

			if (foldersError) throw foldersError;

			const combinedData = [...(foldersData || []), ...(filesData || [])];
			setFiles(combinedData);
		} catch (error) {
			console.error("Error fetching files and folders:", error);
		} finally {
			setIsLoading(false);
		}
	};

	// Add this useEffect to trigger fetchFiles
	useEffect(() => {
		fetchFiles();
	}, [currentFolderId]); // Re-run when currentFolderId changes

	return { files, isLoading, fetchFiles };
}
