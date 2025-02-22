import React, { useRef } from "react";
import { supabase } from "../supabaseClient";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface UploadFileProps {
	folderId: number | null;
	folderPath: string;
	onUploadComplete: () => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ folderId, folderPath, onUploadComplete }) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		// Convert FileList to Array for easier handling
		const filesArray = Array.from(files);

		// Upload each file
		for (const file of filesArray) {
			const safeFileName = file.name.replace(/\s+/g, "_");
			const filePath = `${folderPath}${safeFileName}`;

			// Upload to Supabase Storage
			const { error: uploadError } = await supabase.storage.from("my-bucket").upload(filePath, file);

			if (uploadError) {
				console.error("Error uploading file:", uploadError, file.name);
				continue;
			}

			// Get public URL
			const { data } = supabase.storage.from("my-bucket").getPublicUrl(filePath);

			if (!data) {
				console.error("Error getting public URL for:", file.name);
				continue;
			}

			// Insert file metadata
			const { error: dbError } = await supabase.from("files").insert([
				{
					name: file.name,
					path: filePath,
					folder_id: folderId,
					size: file.size,
					url: data.publicUrl,
				},
			]);

			if (dbError) {
				console.error("Error inserting file record:", dbError, file.name);
			}
		}

		// Clear input and notify completion
		if (fileInputRef.current) fileInputRef.current.value = "";
		onUploadComplete();
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>Upload Files</DialogTitle>
			</DialogHeader>
			<div className="space-y-4">
				<div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center">
					<Upload className="mx-auto h-8 w-8 text-muted-foreground/50" />
					<p className="mt-2 text-sm text-muted-foreground">Drag and drop files, or click to select</p>
					<Button variant="outline" className="mt-4" onClick={() => fileInputRef.current?.click()}>
						Select Files
					</Button>
				</div>
			</div>
			<input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} multiple />
		</>
	);
};

export default UploadFile;
