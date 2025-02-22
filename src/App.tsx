import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import {
	LayoutGrid,
	List,
	Upload,
	Star,
	Clock,
	Trash2,
	HardDrive,
	Users2,
	FileText,
	Image as ImageIcon,
	Video,
	Music,
	Search,
	MoreVertical,
	Folder,
	Plus,
	ChevronDown,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import UploadFile from "./components/upload-file";
import CreateFolder from "./components/create-folder";
import { format } from "date-fns";
import { ListSkeleton, GridSkeleton } from "@/components/file-skeletons";

interface FileItem {
	id: number;
	name: string;
	path: string;
	size: number | null;
	created_at: string;
	updated_at: string | null;
	url: string | null;
	folder_id: number | null;
}

interface FolderItem {
	id: number;
	name: string;
	created_at: string;
	parent_id: number | null;
}

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return format(date, "MMM d, yyyy 'at' h:mm a");
};

const formatFileSize = (bytes: number | null): string => {
	if (bytes === null) return "";

	const units = ["B", "KB", "MB", "GB", "TB"];
	let size = bytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${Math.round(size * 10) / 10} ${units[unitIndex]}`;
};

function App() {
	const [files, setFiles] = useState<(FileItem | FolderItem)[]>([]);
	const [currentPath, setCurrentPath] = useState("/");
	const [viewMode, setViewMode] = useState<"grid" | "list">("list");
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
	const [filteredFiles, setFilteredFiles] = useState<(FileItem | FolderItem)[]>([]);

	const fetchFiles = async () => {
		try {
			setIsLoading(true);

			// Fetch files for current folder
			const filesQuery = supabase.from("files").select("*").order("name");
			const { data: filesData, error: filesError } = await (currentFolderId === null ? filesQuery.is("folder_id", null) : filesQuery.eq("folder_id", currentFolderId));

			if (filesError) throw filesError;

			// Fetch folders for current folder
			const foldersQuery = supabase.from("folders").select("*").order("name");
			const { data: foldersData, error: foldersError } = await (currentFolderId === null
				? foldersQuery.is("parent_id", null)
				: foldersQuery.eq("parent_id", currentFolderId));

			if (foldersError) throw foldersError;

			// Combine files and folders
			const combinedData = [...(foldersData || []), ...(filesData || [])];
			setFiles(combinedData);
		} catch (error) {
			console.error("Error fetching files and folders:", error);
		} finally {
			setIsLoading(false);
		}
	};

	// Add this useEffect to monitor files state changes
	// useEffect(() => {
	// 	console.log("Updated files state:", files);
	// }, [files]);

	useEffect(() => {
		fetchFiles();
	}, [currentFolderId]);

	useEffect(() => {
		const filtered = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()));
		setFilteredFiles(filtered);
	}, [files, searchQuery]);

	const getFileIcon = (item: FileItem | FolderItem) => {
		// Check if item is a folder by checking for parent_id property
		if ("parent_id" in item) {
			return <Folder className="h-5 w-5" />;
		}

		const extension = item.path.split(".").pop()?.toLowerCase();
		if (!extension) return <HardDrive className="h-5 w-5" />;

		const imageExts = ["jpg", "jpeg", "png", "gif", "webp"];
		const videoExts = ["mp4", "mov", "avi", "webm"];
		const audioExts = ["mp3", "wav", "ogg"];

		if (imageExts.includes(extension)) return <ImageIcon className="h-5 w-5" />;
		if (videoExts.includes(extension)) return <Video className="h-5 w-5" />;
		if (audioExts.includes(extension)) return <Music className="h-5 w-5" />;
		return <FileText className="h-5 w-5" />;
	};

	const handleItemClick = (item: FileItem | FolderItem) => {
		// If it's a folder
		if ("parent_id" in item) {
			setCurrentFolderId(item.id);
			setCurrentPath(`${currentPath}${item.name}/`);
			return;
		}

		// If it's a file and has a URL, open it in a new tab
		if ("url" in item && item.url) {
			window.open(item.url, "_blank");
			return;
		}
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b">
				<div className="flex items-center px-6 py-3">
					<h1 className="text-2xl font-semibold">Supadrive</h1>
					<div className="ml-auto flex items-center space-x-4">
						<div className="relative w-96">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input placeholder="Search in Drive" className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
						</div>
						<ModeToggle />
						<Button variant="ghost" size="icon">
							<MoreVertical className="h-5 w-5" />
						</Button>
					</div>
				</div>
			</header>

			<div className="flex">
				{/* Sidebar */}
				<aside className="w-60 border-r p-4">
					<div className="space-y-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="w-full justify-start space-x-2">
									<Plus className="h-5 w-5" />
									<span>New</span>
									<ChevronDown className="ml-auto h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56" align="start">
								<UploadFile folderId={currentFolderId} folderPath={currentPath} onUploadComplete={fetchFiles} />
								<DropdownMenuSeparator />
								<CreateFolder parentId={currentFolderId} currentPath={currentPath} onFolderCreate={fetchFiles} />
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

				{/* Main Content */}
				<main className="flex-1 p-6">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-lg font-semibold">My Drive</h2>
						<div className="flex items-center space-x-2">
							<Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("list")}>
								<List className="h-5 w-5" />
							</Button>
							<Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("grid")}>
								<LayoutGrid className="h-5 w-5" />
							</Button>
						</div>
					</div>

					<ScrollArea className="h-[calc(100vh-12rem)]">
						{isLoading ? (
							viewMode === "list" ? (
								<ListSkeleton />
							) : (
								<GridSkeleton />
							)
						) : viewMode === "list" ? (
							<div className="space-y-1">
								{/* Add column headers */}
								<div className="flex items-center space-x-4 rounded-lg p-2 text-sm text-muted-foreground">
									<span className="flex-1">Name</span>
									<span className="w-24 text-left">Size</span>
									<span className="w-40 text-left">Created At</span>
									<span className="w-8"></span> {/* Space for menu */}
								</div>
								{/* Existing file list */}
								{filteredFiles.map((item) => (
									<div
										key={`${"parent_id" in item ? "folder" : "file"}-${item.id}`}
										className="flex items-center space-x-4 rounded-lg p-2 hover:bg-accent"
										onClick={() => handleItemClick(item)}
									>
										<span className="w-8">{getFileIcon(item)}</span>
										<span className="flex-1">{item.name}</span>
										{"size" in item && <span className="w-24 text-left text-sm text-muted-foreground">{formatFileSize(item.size)}</span>}
										<span className="w-40 text-left text-sm text-muted-foreground">{formatDate(item.created_at)}</span>
										<span className="w-8">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="icon">
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
										</span>
									</div>
								))}
							</div>
						) : (
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
								{filteredFiles.map((item) => (
									<div
										key={`${"parent_id" in item ? "folder" : "file"}-${item.id}`}
										className="group rounded-lg border p-4 hover:bg-accent"
										onClick={() => handleItemClick(item)}
									>
										<div className="mb-2 flex items-center justify-between">
											{getFileIcon(item)}
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="icon">
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
								))}
							</div>
						)}
					</ScrollArea>
				</main>
			</div>
		</div>
	);
}

export default App;
