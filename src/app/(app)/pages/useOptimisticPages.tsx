
import { type Page, type CompletePage } from "@/lib/db/schema/pages";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Page>) => void;

export const useOptimisticPages = (
  pages: CompletePage[],
  
) => {
  const [optimisticPages, addOptimisticPage] = useOptimistic(
    pages,
    (
      currentState: CompletePage[],
      action: OptimisticAction<Page>,
    ): CompletePage[] => {
      const { data } = action;

      

      const optimisticPage = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticPage]
            : [...currentState, optimisticPage];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticPage } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticPage, optimisticPages };
};
