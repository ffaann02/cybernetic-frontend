import React, { ReactElement, useContext, useEffect } from "react";
import { GameContext } from "../contexts/GameContext";

interface SceneRouterProps {
  children: React.ReactNode;
}

interface SceneProps {
  title: string;
  scene: React.ReactElement<any>;
  waitLoadingScene?: boolean;
}

const SceneRouter: React.FC<SceneRouterProps> = ({ children }) => {
  const { currentScene, setGameState } = useContext(GameContext);
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

  return <div className="h-screen relative">{renderScene()}</div>;
};

export default SceneRouter;

export const Scene: React.FC<SceneProps> = ({ scene }) => {
  return scene;
};
