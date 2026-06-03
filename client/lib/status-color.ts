export const getStatusColor =
  (status: string) => {
    switch (
      status.toLowerCase()
    ) {
      case "new":
        return "bg-blue-100 text-blue-700";

      case "contacted":
        return "bg-yellow-100 text-yellow-700";

      case "qualified":
        return "bg-purple-100 text-purple-700";

      case "proposal":
        return "bg-orange-100 text-orange-700";

      case "won":
        return "bg-green-100 text-green-700";

      case "lost":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };