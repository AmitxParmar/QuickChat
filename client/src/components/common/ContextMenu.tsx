import React, {
  type MouseEvent,
  type Dispatch,
  type SetStateAction,
  useEffect,
} from "react";

type Coordinates = {
  x: number;
  y: number;
};

type Options = { name: string; callback: () => void };

interface IContextMenu {
  options: Options[];
  coordinates: Coordinates;

  setContextMenu: Dispatch<SetStateAction<boolean>>;
}

const ContextMenu: React.FC<IContextMenu> = ({
  options,
  coordinates,
  setContextMenu,
}) => {
  const contextMenuRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement; // Cast to HTMLElement
      if (target.id !== "context-opener") {
        if (
          contextMenuRef.current &&
          !contextMenuRef.current.contains(target)
        ) {
          setContextMenu(false);
        }
      }
    };
    document.addEventListener(
      "click",
      handleClickOutside as unknown as EventListener
    );
    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside as unknown as EventListener
      );
    };
  }, []);

  const handleClick = (e: MouseEvent, callback: () => void) => {
    e.stopPropagation();
    setContextMenu(false);
    callback();
  };

  return (
    <div
      className={`bg-dropdown-background fixed py-2 z-[100] shadow-xl`}
      style={{
        top: coordinates.y,
        left: coordinates.x,
      }}
      ref={contextMenuRef}
    >
      <ul>
        {options.map(({ name, callback }) => (
          <li
            className="px-5 py-2 cursor-pointer hover:bg-background-default-hover"
            key={name}
            onClick={(e) => handleClick(e, callback)}
          >
            <span className="text-white">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
