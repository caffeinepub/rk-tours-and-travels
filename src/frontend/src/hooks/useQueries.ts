import { useQuery } from "@tanstack/react-query";
import { Region, type TourPackage } from "../backend";
import { useActor } from "./useActor";

export function usePackagesByRegion(region: Region | null) {
  const { actor, isFetching } = useActor();

  return useQuery<TourPackage[]>({
    queryKey: ["tourPackages", region],
    queryFn: async () => {
      if (!actor) return [];
      if (region === null) {
        await actor.seedTourPackages();
        return actor.getAllTourPackages();
      }
      return actor.getPackagesByRegion(region);
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export type { TourPackage };
export { Region };
