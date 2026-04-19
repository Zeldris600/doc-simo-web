import { api } from "./api";
import {
  CreateDeliveryDestinationDto,
  DeliveryDestination,
  StandardResponse,
  UpdateDeliveryDestinationDto,
} from "@/types/api";

export const DeliveryDestinationService = {
  listActive: async (params?: { country?: string }): Promise<DeliveryDestination[]> => {
    const response = await api.get<StandardResponse<DeliveryDestination[]>>(
      "/delivery-destinations/active",
      { params },
    );
    return response.data.data;
  },

  listAll: async (): Promise<DeliveryDestination[]> => {
    const response = await api.get<StandardResponse<DeliveryDestination[]>>(
      "/delivery-destinations",
    );
    return response.data.data;
  },

  getById: async (id: string): Promise<DeliveryDestination> => {
    const response = await api.get<StandardResponse<DeliveryDestination>>(
      `/delivery-destinations/${id}`,
    );
    return response.data.data;
  },

  create: async (data: CreateDeliveryDestinationDto): Promise<DeliveryDestination> => {
    const response = await api.post<StandardResponse<DeliveryDestination>>(
      "/delivery-destinations",
      data,
    );
    return response.data.data;
  },

  update: async (
    id: string,
    data: UpdateDeliveryDestinationDto,
  ): Promise<DeliveryDestination> => {
    const response = await api.patch<StandardResponse<DeliveryDestination>>(
      `/delivery-destinations/${id}`,
      data,
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete<StandardResponse<unknown>>(`/delivery-destinations/${id}`);
  },
};
