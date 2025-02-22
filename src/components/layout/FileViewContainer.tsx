import { FileList } from "../file/FileList";
import { FileGrid } from "../file/FileGrid";
import { Breadcrumb } from "../file/Breadcrumb";
import { EmptyState } from "../file/EmptyState";
import type { FileItem } from "@/types/file";
import type { FolderItem } from "@/types/folder";

interface FileViewContainerProps {
	files: (FileItem | FolderItem)[];
	isLoading: boolean;
	viewMode: "grid" | "list";
	currentPath: string;
	onViewModeChange: (mode: "grid" | "list") => void;
	onItemClick: (item: FileItem | FolderItem) => void;
	onNavigate: (index: number) => void;
	onRefresh: () => void;
}

export function FileViewContainer({ files, isLoading, viewMode, currentPath, onViewModeChange, onItemClick, onNavigate, onRefresh }: FileViewContainerProps) {
	return (
		<main className="flex-1 p-6">
			<Breadcrumb path={currentPath} viewMode={viewMode} onNavigate={onNavigate} onViewModeChange={onViewModeChange} />

			{!isLoading && files.length === 0 ? (
				<EmptyState currentPath={currentPath} />
			) : viewMode === "list" ? (
				<FileList files={files} isLoading={isLoading} onItemClick={onItemClick} onRefresh={onRefresh} />
			) : (
				<FileGrid files={files} isLoading={isLoading} onItemClick={onItemClick} onRefresh={onRefresh} />
			)}
		</main>
	);
}
