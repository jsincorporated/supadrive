import { FileActions } from "./FileActions";

interface EmptyStateProps {
	currentPath: string;
}

export function EmptyState({ currentPath }: EmptyStateProps) {
	return (
		<div className="flex h-[calc(100vh-16rem)] flex-col items-center justify-center space-y-4">
			<div className="text-center">
				<h3 className="text-lg font-medium">{currentPath === "/" ? "No files or folders" : "This folder is empty"}</h3>
				<p className="text-sm text-muted-foreground">{currentPath === "/" ? "Upload files or create a folder to get started" : "Add files or folders to this location"}</p>
			</div>
			<FileActions variant="buttons" />
		</div>
	);
}
