import { FileList } from "../file/FileList";
import { FileGrid } from "../file/FileGrid";
import { Button } from "@/components/ui/button";
import { List, LayoutGrid } from "lucide-react";
import type { FileItem } from "@/types/file";
import type { FolderItem } from "@/types/folder";

interface FileViewContainerProps {
	files: (FileItem | FolderItem)[];
	isLoading: boolean;
	viewMode: "grid" | "list";
	onViewModeChange: (mode: "grid" | "list") => void;
	onItemClick: (item: FileItem | FolderItem) => void;
}

export function FileViewContainer({ files, isLoading, viewMode, onViewModeChange, onItemClick }: FileViewContainerProps) {
	return (
		<main className="flex-1 p-6">
			{/* View mode toggle buttons */}
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-lg font-semibold">My Drive</h2>
				<div className="flex items-center space-x-2">
					<Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" onClick={() => onViewModeChange("list")}>
						<List className="h-5 w-5" />
					</Button>
					<Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => onViewModeChange("grid")}>
						<LayoutGrid className="h-5 w-5" />
					</Button>
				</div>
			</div>

			{viewMode === "list" ? (
				<FileList files={files} isLoading={isLoading} onItemClick={onItemClick} />
			) : (
				<FileGrid files={files} isLoading={isLoading} onItemClick={onItemClick} />
			)}
		</main>
	);
}
