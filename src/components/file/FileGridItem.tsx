import { FileItem } from "@/types/file";
import { FolderItem } from "@/types/folder";
import { Separator } from "@/components/ui/separator";
import { FileIcon } from "./FileIcon";
import { formatDate } from "@/utils/formatDate";
import { formatFileSize } from "@/utils/formatFileSize";
import { FileActionsMenu } from "./FileActionsMenu";

interface FileGridItemProps {
	item: FileItem | FolderItem;
	onClick: () => void;
}

export function FileGridItem({ item, onClick }: FileGridItemProps) {
	return (
		<div className="group rounded-lg border p-4 hover:bg-accent" onClick={onClick}>
			<div className="mb-2 flex items-center justify-between">
				<FileIcon item={item} />
				<FileActionsMenu item={item} />
			</div>
			<p className="font-medium">{item.name}</p>
			<div className="mt-1 flex items-center text-sm text-muted-foreground">
				<span>{formatDate(item.created_at)}</span>
				{"size" in item && item.size && (
					<>
						<Separator orientation="vertical" className="mx-2 h-4" />
						<span>{formatFileSize(item.size)}</span>
					</>
				)}
			</div>
		</div>
	);
}
