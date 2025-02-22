import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { FileItem } from "@/types/file";
import { FolderItem } from "@/types/folder";
import { deleteItem } from "@/lib/delete-file";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FileActionsMenuProps {
	item: FileItem | FolderItem;
	onDelete?: () => void;
}

export function FileActionsMenu({ item, onDelete }: FileActionsMenuProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		setIsDeleting(true);
		const { success } = await deleteItem(item);
		setIsDeleting(false);
		if (success) {
			setShowDeleteDialog(false);
			onDelete?.();
		}
	};

	return (
		<>
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
					<DropdownMenuItem
						className="text-destructive"
						onClick={(e) => {
							e.stopPropagation();
							setShowDeleteDialog(true);
						}}
					>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete {item.name}
							{!("url" in item) && " and all its contents"}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={(e) => {
								e.stopPropagation();
								handleDelete();
							}}
							disabled={isDeleting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isDeleting ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
