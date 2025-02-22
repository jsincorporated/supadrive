import { FileItem } from "@/types/file";
import { FolderItem } from "@/types/folder";
import { FileIcon } from "./FileIcon";
import { formatDate } from "@/utils/formatDate";
import { formatFileSize } from "@/utils/formatFileSize";
import { FileActionsMenu } from "./FileActionsMenu";

interface FileListItemProps {
	item: FileItem | FolderItem;
	onClick: () => void;
}

export function FileListItem({ item, onClick }: FileListItemProps) {
	return (
		<div className="flex items-center space-x-4 rounded-lg p-2 hover:bg-accent" onClick={onClick}>
			<span className="w-8">
				<FileIcon item={item} />
			</span>
			<span className="flex-1">{item.name}</span>
			{"size" in item && <span className="w-24 text-left text-sm text-muted-foreground">{formatFileSize(item.size)}</span>}
			<span className="w-40 text-left text-sm text-muted-foreground">{formatDate(item.created_at)}</span>
			<span className="w-8">
				<FileActionsMenu item={item} />
			</span>
		</div>
	);
}
