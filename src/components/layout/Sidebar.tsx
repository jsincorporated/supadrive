import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Plus, ChevronDown, HardDrive, Users2, Star, Clock, Trash2 } from "lucide-react";
import UploadFile from "../upload-file";
import CreateFolder from "../create-folder";

interface SidebarProps {
	currentFolderId: number | null;
	currentPath: string;
	onFileUpload: () => void;
	onFolderCreate: () => void;
}

export function Sidebar({ currentFolderId, currentPath, onFileUpload, onFolderCreate }: SidebarProps) {
	return (
		<aside className="w-60 border-r p-4">
			<div className="space-y-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="w-full justify-start">
							<Plus className="h-5 w-5" />
							<span className="ml-2">New</span>
							<ChevronDown className="ml-auto h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56" align="start">
						<UploadFile folderId={currentFolderId} folderPath={currentPath} onUploadComplete={onFileUpload} />
						<DropdownMenuSeparator />
						<CreateFolder parentId={currentFolderId} currentPath={currentPath} onFolderCreate={onFolderCreate} />
					</DropdownMenuContent>
				</DropdownMenu>

				<Button variant="ghost" className="w-full justify-start">
					<HardDrive className="mr-2 h-5 w-5" />
					My Drive
				</Button>
				<Button variant="ghost" className="w-full justify-start">
					<Users2 className="mr-2 h-5 w-5" />
					Shared with me
				</Button>
				<Button variant="ghost" className="w-full justify-start">
					<Star className="mr-2 h-5 w-5" />
					Starred
				</Button>
				<Button variant="ghost" className="w-full justify-start">
					<Clock className="mr-2 h-5 w-5" />
					Recent
				</Button>
				<Button variant="ghost" className="w-full justify-start">
					<Trash2 className="mr-2 h-5 w-5" />
					Trash
				</Button>
			</div>
		</aside>
	);
}
