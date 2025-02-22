import { FileItem } from "@/types/file";
import { FolderItem } from "@/types/folder";
import { FILE_EXTENSIONS } from "@/constants/file-types";
import { Folder, HardDrive, FileText, Image as ImageIcon, Video, Music } from "lucide-react";

interface FileIconProps {
	item: FileItem | FolderItem;
	className?: string;
}

export function FileIcon({ item, className = "h-5 w-5" }: FileIconProps) {
	if ("parent_id" in item) {
		return <Folder className={className} />;
	}

	const extension = item.path.split(".").pop()?.toLowerCase();
	if (!extension) return <HardDrive className={className} />;

	if (FILE_EXTENSIONS.IMAGE.includes(extension)) return <ImageIcon className={className} />;
	if (FILE_EXTENSIONS.VIDEO.includes(extension)) return <Video className={className} />;
	if (FILE_EXTENSIONS.AUDIO.includes(extension)) return <Music className={className} />;
	return <FileText className={className} />;
}
