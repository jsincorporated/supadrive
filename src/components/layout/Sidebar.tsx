import { Button } from "@/components/ui/button";
import { HardDrive, Users2, Star, Clock, Trash2 } from "lucide-react";
import { FileActions } from "../file/FileActions";

export function Sidebar() {
	return (
		<aside className="w-60 border-r p-4">
			<div className="space-y-2">
				<FileActions variant="dropdown" />
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
	);
}
