import create from "zustand";

const useStore = create(
    (set: any) => (
        {
            target: null,
            setTarget: (target: any) => set({ target }),
            viewMode: "3D",
            setViewMode: (viewMode: string) => set({ viewMode })
        }
    )
)

export default useStore