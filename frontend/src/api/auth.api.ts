import { api } from "./client";

export type Rol = "tecnico" | "coordinador";
export type User = { id: number; username: string; rol: Rol };
export type LoginResp = { token: string; user: User };

export async function loginApi(username: string, password: string) {
  const { data } = await api.post<LoginResp>("/auth/login", { username, password });
  return data;
}
