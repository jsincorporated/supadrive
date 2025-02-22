import React, { createContext, useContext, useState } from "react";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import UploadFile from "../file/UploadFile";
import CreateFolder from "../file/CreateFolder";

type ActionType = "upload" | "createFolder" | null;

interface FileActionsContextType {
	showAction: (action: ActionType) => void;
	currentFolderId: number | null;
	currentPath: string;
	onComplete: () => void;
}

const FileActionsContext = createContext<FileActionsContextType | null>(null);

export function useFileActions() {
	const context = useContext(FileActionsContext);
	if (!context) throw new Error("useFileActions must be used within FileActionsProvider");
	return context;
}

interface FileActionsProviderProps {
	children: React.ReactNode;
	currentFolderId: number | null;
	currentPath: string;
	onComplete: () => void;
}

export function FileActionsProvider({ children, currentFolderId, currentPath, onComplete }: FileActionsProviderProps) {
	const [activeAction, setActiveAction] = useState<ActionType>(null);

	const showAction = (action: ActionType) => setActiveAction(action);

	return (
		<FileActionsContext.Provider
			value={{
				showAction,
				currentFolderId,
				currentPath,
				onComplete,
			}}
		>
			{children}
			<Dialog open={activeAction === "upload"} onOpenChange={() => setActiveAction(null)}>
				<DialogContent>
					<DialogDescription className="sr-only">Upload files to your drive</DialogDescription>
					<UploadFile
						folderId={currentFolderId}
						folderPath={currentPath}
						onUploadComplete={() => {
							onComplete();
							setActiveAction(null);
						}}
					/>
				</DialogContent>
			</Dialog>
			<Dialog open={activeAction === "createFolder"} onOpenChange={() => setActiveAction(null)}>
				<DialogContent>
					<DialogDescription className="sr-only">Create a new folder in your drive</DialogDescription>
					<CreateFolder
						parentId={currentFolderId}
						currentPath={currentPath}
						onFolderCreate={() => {
							onComplete();
							setActiveAction(null);
						}}
					/>
				</DialogContent>
			</Dialog>
		</FileActionsContext.Provider>
	);
}
