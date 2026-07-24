import { create } from "zustand";

type State = {
  token: string | null;
  setToken: (token:string)=>void;
  logout: ()=>void;
};

export const useAuthStore = create<State>((set)=>({
  token:null,

  setToken:(token)=>{
    localStorage.setItem("token", token);
    set({token});
  },

  logout:()=>{
    localStorage.removeItem("token");
    set({token:null});
  }
}));