"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { DeliveryDestinationService } from "@/services/delivery-destination.service";
import {
  ApiError,
  CreateDeliveryDestinationDto,
  DeliveryDestination,
  UpdateDeliveryDestinationDto,
} from "@/types/api";

const qk = {
  active: (country?: string) => ["delivery-destinations", "active", country ?? ""] as const,
  all: () => ["delivery-destinations", "all"] as const,
  one: (id: string) => ["delivery-destinations", id] as const,
};

export function useActiveDeliveryDestinations(
  params?: { country?: string },
  opt?: Omit<
    UseQueryOptions<DeliveryDestination[], ApiError>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: qk.active(params?.country),
    queryFn: () => DeliveryDestinationService.listActive(params),
    ...opt,
  });
}

export function useDeliveryDestinations(
  opt?: Omit<
    UseQueryOptions<DeliveryDestination[], ApiError>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: qk.all(),
    queryFn: () => DeliveryDestinationService.listAll(),
    ...opt,
  });
}

export function useDeliveryDestination(
  id: string,
  opt?: Omit<
    UseQueryOptions<DeliveryDestination, ApiError>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: qk.one(id),
    queryFn: () => DeliveryDestinationService.getById(id),
    enabled: !!id,
    ...opt,
  });
}

function invalidateDeliveryDestinations(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["delivery-destinations"] });
}

export function useCreateDeliveryDestination(
  opt?: UseMutationOptions<DeliveryDestination, ApiError, CreateDeliveryDestinationDto>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDeliveryDestinationDto) =>
      DeliveryDestinationService.create(data),
    ...opt,
    onSuccess: (data, ...rest) => {
      invalidateDeliveryDestinations(queryClient);
      opt?.onSuccess?.(data, ...rest);
    },
  });
}

export function useUpdateDeliveryDestination(
  opt?: UseMutationOptions<
    DeliveryDestination,
    ApiError,
    { id: string; data: UpdateDeliveryDestinationDto }
  >,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDeliveryDestinationDto }) =>
      DeliveryDestinationService.update(id, data),
    ...opt,
    onSuccess: (data, ...rest) => {
      invalidateDeliveryDestinations(queryClient);
      opt?.onSuccess?.(data, ...rest);
    },
  });
}

export function useDeleteDeliveryDestination(
  opt?: UseMutationOptions<void, ApiError, string>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => DeliveryDestinationService.delete(id),
    ...opt,
    onSuccess: (data, ...rest) => {
      invalidateDeliveryDestinations(queryClient);
      opt?.onSuccess?.(data, ...rest);
    },
  });
}
