import { format } from "date-fns";

export const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return format(date, "MMM d, yyyy 'at' h:mm a");
};
