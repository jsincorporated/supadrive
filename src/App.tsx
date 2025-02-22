import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { FileViewContainer } from "@/components/layout/FileViewContainer";
import { useFiles } from "@/hooks/use-files";
import { useFileSearch } from "@/hooks/use-file-search";
import type { FileItem } from "@/types/file";
import type { FolderItem } from "@/types/folder";
import { FileActionsProvider } from "@/components/providers/file-actions-provider";

function App() {
	const [currentPath, setCurrentPath] = useState("/");
	const [viewMode, setViewMode] = useState<"grid" | "list">("list");
	const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
	const [pathToIdMap, setPathToIdMap] = useState<Record<string, number>>({});

	const { files, isLoading, fetchFiles } = useFiles(currentFolderId);
	const { searchQuery, setSearchQuery, filteredFiles } = useFileSearch(files);

	const handleItemClick = (item: FileItem | FolderItem) => {
		if ("parent_id" in item) {
			setCurrentFolderId(item.id);
			const newPath = `${currentPath}${item.name}/`;
			setCurrentPath(newPath);
			setPathToIdMap((prev) => ({
				...prev,
				[newPath]: item.id,
			}));
			return;
		}

		if ("url" in item && item.url) {
			window.open(item.url, "_blank");
		}
	};

	const handleBreadcrumbNavigate = (index: number) => {
		if (index === -1) {
			// Navigate to root
			setCurrentFolderId(null);
			setCurrentPath("/");
			return;
		}

		// Split path and reconstruct up to clicked segment
		const segments = currentPath.split("/").filter(Boolean);
		const newPath = "/" + segments.slice(0, index + 1).join("/") + "/";
		setCurrentPath(newPath);

		const newFolderId = pathToIdMap[newPath] || null;
		setCurrentFolderId(newFolderId);
	};

	return (
		<div className="min-h-screen bg-background">
			<FileActionsProvider currentFolderId={currentFolderId} currentPath={currentPath} onComplete={fetchFiles}>
				<Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
				<div className="flex">
					<Sidebar />
					<FileViewContainer
						files={filteredFiles}
						isLoading={isLoading}
						viewMode={viewMode}
						currentPath={currentPath}
						onViewModeChange={setViewMode}
						onItemClick={handleItemClick}
						onNavigate={handleBreadcrumbNavigate}
						onRefresh={fetchFiles}
					/>
				</div>
			</FileActionsProvider>
		</div>
	);
}

export default App;
