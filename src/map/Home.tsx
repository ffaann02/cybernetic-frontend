import { useGLTF } from "@react-three/drei"

export const Home = () => {
    const map = useGLTF('models/map.glb');

    return(
        <primitive object={map.scene} />
    )
}
useGLTF.preload('models/map.glb')