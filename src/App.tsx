import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { FileViewContainer } from "@/components/layout/FileViewContainer";
import { useFiles } from "@/hooks/use-files";
import { useFileSearch } from "@/hooks/use-file-search";
import type { FileItem } from "@/types/file";
import type { FolderItem } from "@/types/folder";

function App() {
	const [currentPath, setCurrentPath] = useState("/");
	const [viewMode, setViewMode] = useState<"grid" | "list">("list");
	const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);

	const { files, isLoading, fetchFiles } = useFiles(currentFolderId);
	const { searchQuery, setSearchQuery, filteredFiles } = useFileSearch(files);

	const handleItemClick = (item: FileItem | FolderItem) => {
		if ("parent_id" in item) {
			setCurrentFolderId(item.id);
			setCurrentPath(`${currentPath}${item.name}/`);
			return;
		}

		if ("url" in item && item.url) {
			window.open(item.url, "_blank");
		}
	};

	return (
		<div className="min-h-screen bg-background">
			<Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
			<div className="flex">
				<Sidebar currentFolderId={currentFolderId} currentPath={currentPath} onFileUpload={fetchFiles} onFolderCreate={fetchFiles} />
				<FileViewContainer files={filteredFiles} isLoading={isLoading} viewMode={viewMode} onViewModeChange={setViewMode} onItemClick={handleItemClick} />
			</div>
		</div>
	);
}

export default App;
