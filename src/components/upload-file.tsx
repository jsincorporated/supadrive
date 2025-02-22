import React, { useRef } from "react";
import { supabase } from "../supabaseClient";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { FilePlus } from "lucide-react";

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
		console.log("Triggering file input click");
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log("File change event triggered");
		const files = e.target.files;
		if (!files || files.length === 0) {
			console.log("No files selected");
			return;
		}
		console.log(`Selected ${files.length} files`);

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
			<input ref={fileInputRef} type="file" multiple onChange={handleFileChange} style={{ display: "none" }} id="fileInput" onClick={(e) => e.stopPropagation()} />
			<DropdownMenuItem onClick={handleClick}>
				<FilePlus className="mr-2 h-4 w-4" />
				<span>File</span>
			</DropdownMenuItem>
		</>
	);
};

export default UploadFile;
