import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CreateFolderProps {
	parentId: number | null;
	currentPath: string;
	onFolderCreate: () => void;
}

const CreateFolder: React.FC<CreateFolderProps> = ({ parentId, currentPath, onFolderCreate }) => {
	const [folderName, setFolderName] = useState("");
	const [isCreating, setIsCreating] = useState(false);

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!folderName.trim()) return;

		setIsCreating(true);
		try {
			const { error } = await supabase.from("folders").insert([
				{
					name: folderName.trim(),
					parent_id: parentId,
					created_at: new Date().toISOString(),
				},
			]);

			if (error) throw error;

			setFolderName("");
			onFolderCreate();
		} catch (error) {
			console.error("Error creating folder:", error);
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>Create New Folder</DialogTitle>
			</DialogHeader>
			<form onSubmit={handleCreate} className="space-y-4">
				<div className="space-y-2">
					<Input
						placeholder="Enter folder name"
						value={folderName}
						onChange={(e) => setFolderName(e.target.value)}
						autoFocus
						className={cn(
							"focus-visible:ring-1",
							"focus-visible:ring-gray-400 dark:focus-visible:ring-gray-600",
							"focus-visible:ring-offset-0",
							"border-gray-200 dark:border-gray-700"
						)}
					/>
					<p className="text-sm text-muted-foreground">Create a new folder in {currentPath === "/" ? "My Drive" : currentPath}</p>
				</div>
				<div className="flex justify-end space-x-2">
					<Button type="submit" variant="outline" className="hover:bg-accent" disabled={isCreating}>
						{isCreating ? "Creating..." : "Create Folder"}
					</Button>
				</div>
			</form>
		</>
	);
};

export default CreateFolder;
