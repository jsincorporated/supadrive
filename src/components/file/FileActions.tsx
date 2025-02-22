import { Button } from "@/components/ui/button";
import { Plus, Upload, FolderPlus } from "lucide-react";
import { useFileActions } from "../providers/file-actions-provider";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface FileActionsProps {
	variant?: "dropdown" | "buttons";
}

export function FileActions({ variant = "dropdown" }: FileActionsProps) {
	const { showAction } = useFileActions();

	if (variant === "buttons") {
		return (
			<div className="flex items-center gap-4">
				<Button variant="outline" onClick={() => showAction("upload")}>
					<Upload className="mr-2 h-4 w-4" />
					Upload files
				</Button>
				<Button variant="outline" onClick={() => showAction("createFolder")}>
					<FolderPlus className="mr-2 h-4 w-4" />
					Create folder
				</Button>
			</div>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="w-full justify-start">
					<Plus className="h-5 w-5" />
					<span className="ml-2">New</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="start">
				<DropdownMenuItem onClick={() => showAction("upload")}>
					<Upload className="mr-2 h-4 w-4" />
					Upload files
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => showAction("createFolder")}>
					<FolderPlus className="mr-2 h-4 w-4" />
					Create folder
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
