import { ScrollArea } from "@/components/ui/scroll-area";
import { FileItem } from "@/types/file";
import { FolderItem } from "@/types/folder";
import { FileGridItem } from "./FileGridItem";
import { GridSkeleton } from "@/components/file-skeletons";

interface FileGridProps {
	files: (FileItem | FolderItem)[];
	isLoading: boolean;
	onItemClick: (item: FileItem | FolderItem) => void;
	onRefresh: () => void;
}

export function FileGrid({ files, isLoading, onItemClick, onRefresh }: FileGridProps) {
	if (isLoading) return <GridSkeleton />;

	return (
		<ScrollArea className="h-[calc(100vh-12rem)]">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{files.map((item) => (
					<FileGridItem key={`${"parent_id" in item ? "folder" : "file"}-${item.id}`} item={item} onClick={() => onItemClick(item)} onRefresh={onRefresh} />
				))}
			</div>
		</ScrollArea>
	);
}
