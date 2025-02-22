import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { FileItem } from "@/types/file";
import { FolderItem } from "@/types/folder";

interface FileActionsMenuProps {
	item: FileItem | FolderItem;
}

export function FileActionsMenu({ item }: FileActionsMenuProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
					<MoreVertical className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem>Share</DropdownMenuItem>
				<DropdownMenuItem>Download</DropdownMenuItem>
				<DropdownMenuItem>Rename</DropdownMenuItem>
				<DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
