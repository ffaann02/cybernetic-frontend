import React, { ReactElement } from 'react';

interface SceneRouterProps {
  currentScene: string;
  children: React.ReactNode;
}

interface SceneProps {
    title: string;
    scene: React.ReactElement<any>;
  }

const SceneRouter: React.FC<SceneRouterProps> = ({ currentScene, children }) => {
  const renderScene = () => {
    const scene = React.Children.toArray(children).find(
      (child: any) => child.props.title === currentScene
    );
    return scene ? React.cloneElement(scene as ReactElement) : null;
  };

  return (
    <div className="h-screen">
      {renderScene()}
    </div>
  );
};

export default SceneRouter;

export const Scene: React.FC<SceneProps> = ({ scene }) => {
    return scene;
  };
