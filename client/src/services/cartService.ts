import api from "./api";
import { Cart } from "../types";

interface AddToCartPayload {
  productId: string;
  quantity: number;
  size: string;
  color?: string;
}

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await api.get("/cart");
    return response.data.data;
  },

  addItem: async (payload: AddToCartPayload): Promise<Cart> => {
    const response = await api.post("/cart/items", payload);
    return response.data.data;
  },

  updateItem: async (itemId: string, quantity: number): Promise<Cart> => {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data.data;
  },

  removeItem: async (itemId: string): Promise<Cart> => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data.data;
  },

  clearCart: async (): Promise<Cart> => {
    const response = await api.delete("/cart");
    return response.data.data;
  }
};
