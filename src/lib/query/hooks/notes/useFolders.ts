import { folderService } from "@src/services/folderService";
import { useQuery } from "@tanstack/react-query";

export const folderKeys = {
  all: ["folders"] as const,
  detail: (folderId: string) => [...folderKeys.all, "detail", folderId] as const,
};

export const useFolders = () => {
  return useQuery({
    queryKey: folderKeys.all,
    queryFn: () => folderService.getFolders(),
    staleTime: 30000,
  });
};
// TODO || DELETE
