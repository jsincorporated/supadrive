import { ScrollArea } from "@/components/ui/scroll-area";
import { FileItem } from "@/types/file";
import { FolderItem } from "@/types/folder";
import { FileListItem } from "./FileListItem";
import { ListSkeleton } from "@/components/file-skeletons";

interface FileListProps {
	files: (FileItem | FolderItem)[];
	isLoading: boolean;
	onItemClick: (item: FileItem | FolderItem) => void;
	onRefresh: () => void;
}

export function FileList({ files, isLoading, onItemClick, onRefresh }: FileListProps) {
	if (isLoading) return <ListSkeleton />;

	return (
		<ScrollArea className="h-[calc(100vh-12rem)]">
			<div className="space-y-1">
				<div className="flex items-center space-x-4 rounded-lg p-2 text-sm text-muted-foreground">
					<span className="flex-1">Name</span>
					<span className="w-24 text-left">Size</span>
					<span className="w-40 text-left">Created At</span>
					<span className="w-8"></span> {/* Space for menu */}
				</div>
				{files.map((item) => (
					<FileListItem key={`${"parent_id" in item ? "folder" : "file"}-${item.id}`} item={item} onClick={() => onItemClick(item)} onRefresh={onRefresh} />
				))}
			</div>
		</ScrollArea>
	);
}
