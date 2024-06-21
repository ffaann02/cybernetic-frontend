import React, { ReactElement, useContext, useEffect } from "react";
import { GameContext } from "../contexts/GameContext";

interface SceneRouterProps {
  currentScene: string;
  children: React.ReactNode;
}

interface SceneProps {
  title: string;
  scene: React.ReactElement<any>;
}

const SceneRouter: React.FC<SceneRouterProps> = ({
  currentScene,
  children,
}) => {
  const { setGameState } = useContext(GameContext);
  useEffect(()=>{
    const mapSceneList = React.Children.toArray(children).map(
      (child: any) => child.props.title
    );
    if (mapSceneList) {
      if (setGameState) {
        setGameState((prevState) => ({ ...prevState, sceneList: mapSceneList }));
      }
    }
  },[children])
  const renderScene = () => {
    const scene = React.Children.toArray(children).find(
      (child: any) => child.props.title === currentScene
    );
    return scene ? React.cloneElement(scene as ReactElement) : null;
  };

  return <div className="h-screen">{renderScene()}</div>;
};

export default SceneRouter;

export const Scene: React.FC<SceneProps> = ({ scene }) => {
  return scene;
};
