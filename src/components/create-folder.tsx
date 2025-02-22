import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { FolderPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CreateFolderProps {
	parentId: number | null;
	currentPath: string;
	onFolderCreate: () => void;
}

const CreateFolder: React.FC<CreateFolderProps> = ({ parentId, currentPath, onFolderCreate }) => {
	const [folderName, setFolderName] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!folderName.trim()) return;

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
			setIsOpen(false);
			onFolderCreate();
		} catch (error) {
			console.error("Error creating folder:", error);
		}
	};

	return (
		<>
			<DropdownMenuItem
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setIsOpen(true);
				}}
			>
				<FolderPlus className="mr-2 h-4 w-4" />
				<span>Folder</span>
			</DropdownMenuItem>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New Folder</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleCreate} className="space-y-4">
						<Input placeholder="Folder name" value={folderName} onChange={(e) => setFolderName(e.target.value)} autoFocus />
						<div className="flex justify-end space-x-2">
							<Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
								Cancel
							</Button>
							<Button type="submit">Create</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default CreateFolder;
