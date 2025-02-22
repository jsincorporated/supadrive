import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { List, LayoutGrid } from "lucide-react";

interface BreadcrumbProps {
	path: string;
	viewMode: "grid" | "list";
	onNavigate: (index: number) => void;
	onViewModeChange: (mode: "grid" | "list") => void;
}

export function Breadcrumb({ path, viewMode, onNavigate, onViewModeChange }: BreadcrumbProps) {
	const segments = path.split("/").filter(Boolean);

	return (
		<div className="mb-4 flex items-center justify-between">
			<div className="flex items-center space-x-1 text-sm text-muted-foreground">
				<Button variant="ghost" className="h-auto p-1 hover:text-foreground" onClick={() => onNavigate(-1)}>
					My Drive
				</Button>
				{segments.map((segment, index) => (
					<div key={index} className="flex items-center">
						<ChevronRight className="h-4 w-4" />
						<Button variant="ghost" className="h-auto p-1 hover:text-foreground" onClick={() => onNavigate(index)}>
							{segment}
						</Button>
					</div>
				))}
			</div>
			<div className="flex items-center space-x-2">
				<Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" onClick={() => onViewModeChange("list")}>
					<List className="h-5 w-5" />
				</Button>
				<Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => onViewModeChange("grid")}>
					<LayoutGrid className="h-5 w-5" />
				</Button>
			</div>
		</div>
	);
}
