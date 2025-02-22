import React, { useRef, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Button } from "../ui/button";
import { Upload, X } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandItem } from "@/components/ui/command";

interface UploadFileProps {
	folderId: number | null;
	folderPath: string;
	onUploadComplete: () => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ folderId, folderPath, onUploadComplete }) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [isUploading, setIsUploading] = useState(false);

	const handleFileSelect = (files: FileList | null) => {
		if (!files) return;
		setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		handleFileSelect(e.dataTransfer.files);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	const removeFile = (index: number) => {
		setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleUpload = async () => {
		setIsUploading(true);

		for (const file of selectedFiles) {
			const safeFileName = file.name.replace(/\s+/g, "_");
			const filePath = `${folderPath}${safeFileName}`;

			const { error: uploadError } = await supabase.storage.from("my-bucket").upload(filePath, file);

			if (uploadError) {
				console.error("Error uploading file:", uploadError, file.name);
				continue;
			}

			const { data } = supabase.storage.from("my-bucket").getPublicUrl(filePath);

			if (!data) {
				console.error("Error getting public URL for:", file.name);
				continue;
			}

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

		setIsUploading(false);
		setSelectedFiles([]);
		if (fileInputRef.current) fileInputRef.current.value = "";
		onUploadComplete();
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>Upload Files</DialogTitle>
			</DialogHeader>
			<div className="space-y-4">
				<div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center" onDrop={handleDrop} onDragOver={handleDragOver}>
					<Upload className="mx-auto h-8 w-8 text-muted-foreground/50" />
					<p className="mt-2 text-sm text-muted-foreground">Drag and drop files, or click to select</p>
					<Button variant="outline" className="mt-4" onClick={() => fileInputRef.current?.click()}>
						Select Files
					</Button>
				</div>

				{selectedFiles.length > 0 && (
					<div>
						<div className="space-y-2">
							<p className="text-sm font-medium">Selected Files:</p>
							<Command>
								<div className="max-h-40 overflow-y-auto space-y-2">
									{" "}
									{/* Removed p-1 */}
									{selectedFiles.map((file, index) => (
										<CommandItem key={index} className="flex items-center justify-between px-4 rounded-lg bg-muted/50 hover:bg-muted">
											<span className="text-sm truncate">{file.name}</span>
											<Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-8 w-8 p-0">
												<X className="h-4 w-4" />
											</Button>
										</CommandItem>
									))}
								</div>
							</Command>
						</div>
						<Button variant="outline" className="w-full mt-4" onClick={handleUpload} disabled={isUploading}>
							{isUploading ? "Uploading..." : "Upload Files"}
						</Button>
					</div>
				)}
			</div>
			<input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileSelect(e.target.files)} multiple />
		</>
	);
};

export default UploadFile;
