import { Card } from "@/components/ui/card";

export const ListSkeleton = () => (
	<div className="space-y-2">
		{/* Header skeleton */}
		<div className="flex items-center space-x-4 rounded-lg p-2">
			<span className="w-8"></span>
			<span className="flex-1 h-4 bg-muted rounded animate-pulse"></span>
			<span className="w-24 h-4 bg-muted rounded animate-pulse"></span>
			<span className="w-40 h-4 bg-muted rounded animate-pulse"></span>
			<span className="w-8"></span>
		</div>

		{/* Items skeleton */}
		{Array.from({ length: 5 }).map((_, i) => (
			<div key={i} className="flex items-center space-x-4 rounded-lg p-2">
				<div className="w-8 h-5 bg-muted rounded animate-pulse" />
				<div className="flex-1 h-5 bg-muted rounded animate-pulse" />
				<div className="w-24 h-5 bg-muted rounded animate-pulse" />
				<div className="w-40 h-5 bg-muted rounded animate-pulse" />
				<div className="w-8 h-5 bg-muted rounded animate-pulse" />
			</div>
		))}
	</div>
);

export const GridSkeleton = () => (
	<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{Array.from({ length: 8 }).map((_, i) => (
			<Card key={i} className="p-4 space-y-3">
				<div className="flex items-center justify-between">
					<div className="w-5 h-5 bg-muted rounded animate-pulse" />
					<div className="w-8 h-8 bg-muted rounded animate-pulse" />
				</div>
				<div className="h-5 bg-muted rounded animate-pulse" />
				<div className="h-4 bg-muted rounded animate-pulse w-2/3" />
			</Card>
		))}
	</div>
);
