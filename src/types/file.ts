export interface FileItem {
	id: number;
	name: string;
	path: string;
	size: number | null;
	created_at: string;
	updated_at: string | null;
	url: string | null;
	folder_id: number | null;
}
