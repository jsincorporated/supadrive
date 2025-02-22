import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MoreVertical } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

interface HeaderProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
	return (
		<header className="border-b">
			<div className="flex items-center px-6 py-3">
				<h1 className="text-2xl font-semibold">Supadrive</h1>
				<div className="ml-auto flex items-center space-x-4">
					<div className="relative w-96">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input placeholder="Search in Drive" className="pl-8" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} />
					</div>
					<ModeToggle />
					<Button variant="ghost" size="icon">
						<MoreVertical className="h-5 w-5" />
					</Button>
				</div>
			</div>
		</header>
	);
}
