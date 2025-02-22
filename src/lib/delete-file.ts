import { supabase } from "@/supabaseClient";
import { FileItem } from "@/types/file";
import { FolderItem } from "@/types/folder";

async function deleteStorageFile(path: string) {
	const { error } = await supabase.storage.from("files").remove([path]);

	if (error) throw error;
}

async function getAllChildItems(folderId: number): Promise<{ files: FileItem[]; folders: FolderItem[] }> {
	// Get all files in this folder
	const { data: files, error: filesError } = await supabase.from("files").select("*").eq("folder_id", folderId);

	if (filesError) throw filesError;

	// Get all subfolders
	const { data: folders, error: foldersError } = await supabase.from("folders").select("*").eq("parent_id", folderId);

	if (foldersError) throw foldersError;

	return {
		files: files || [],
		folders: folders || [],
	};
}

async function deleteFolderRecursive(folderId: number) {
	try {
		// Get all items in this folder
		const { files, folders } = await getAllChildItems(folderId);

		// Recursively delete all subfolders
		for (const folder of folders) {
			await deleteFolderRecursive(folder.id);
		}

		// Delete all files in this folder from storage
		for (const file of files) {
			if (file.path) {
				await deleteStorageFile(file.path);
			}
		}

		// Delete all files from database
		if (files.length > 0) {
			const { error: filesDeleteError } = await supabase.from("files").delete().eq("folder_id", folderId);

			if (filesDeleteError) throw filesDeleteError;
		}

		// Finally delete the folder itself
		const { error: folderDeleteError } = await supabase.from("folders").delete().eq("id", folderId);

		if (folderDeleteError) throw folderDeleteError;
	} catch (error) {
		console.error("Error in recursive folder deletion:", error);
		throw error;
	}
}

export async function deleteItem(item: FileItem | FolderItem) {
	try {
		if ("parent_id" in item) {
			// Delete folder and all its contents
			await deleteFolderRecursive(item.id);
		} else {
			// Delete file from storage if it has a path
			if (item.path) {
				await deleteStorageFile(item.path);
			}

			// Delete file from database
			const { error } = await supabase.from("files").delete().eq("id", item.id);

			if (error) throw error;
		}

		return { success: true };
	} catch (error) {
		console.error("Error deleting item:", error);
		return { success: false, error };
	}
}
