"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Position = { x: number; y: number };
type Size = { width: number; height: number };

const DEFAULT_SIZE: Size = { width: 400, height: 520 };
const MIN_SIZE: Size = { width: 280, height: 220 };
const VIEWPORT_MARGIN = 12;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function useDraggableWindow(
  isVisible: boolean,
  options?: { defaultSize?: Size; minSize?: Size },
) {
  const defaultSize = options?.defaultSize ?? DEFAULT_SIZE;
  const minSize = options?.minSize ?? MIN_SIZE;

  const windowRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position | null>(null);
  const [size, setSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const initPosition = useCallback(() => {
    if (typeof window === "undefined") return;

    const toggleOffset = 88;
    setPosition({
      x: clamp(
        window.innerWidth - defaultSize.width - 24,
        VIEWPORT_MARGIN,
        window.innerWidth - defaultSize.width - VIEWPORT_MARGIN,
      ),
      y: clamp(
        window.innerHeight - defaultSize.height - toggleOffset,
        VIEWPORT_MARGIN,
        window.innerHeight - defaultSize.height - VIEWPORT_MARGIN,
      ),
    });
  }, [defaultSize.height, defaultSize.width]);

  useEffect(() => {
    if (isVisible && position === null) {
      initPosition();
    }
  }, [isVisible, position, initPosition]);

  const onDragStart = useCallback((event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest("button")) return;

    event.preventDefault();
    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return;

    dragOffset.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    setIsDragging(true);
  }, []);

  const onResizeStart = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      resizeStart.current = {
        x: event.clientX,
        y: event.clientY,
        width: size.width,
        height: size.height,
      };
      setIsResizing(true);
    },
    [size.height, size.width],
  );

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        const maxX =
          window.innerWidth - (windowRef.current?.offsetWidth ?? size.width) - VIEWPORT_MARGIN;
        const maxY =
          window.innerHeight - (windowRef.current?.offsetHeight ?? size.height) - VIEWPORT_MARGIN;

        setPosition({
          x: clamp(event.clientX - dragOffset.current.x, VIEWPORT_MARGIN, maxX),
          y: clamp(event.clientY - dragOffset.current.y, VIEWPORT_MARGIN, maxY),
        });
      }

      if (isResizing) {
        const deltaX = event.clientX - resizeStart.current.x;
        const deltaY = event.clientY - resizeStart.current.y;
        const maxWidth = window.innerWidth - (position?.x ?? VIEWPORT_MARGIN) - VIEWPORT_MARGIN;
        const maxHeight =
          window.innerHeight - (position?.y ?? VIEWPORT_MARGIN) - VIEWPORT_MARGIN;

        setSize({
          width: clamp(
            resizeStart.current.width + deltaX,
            minSize.width,
            maxWidth,
          ),
          height: clamp(
            resizeStart.current.height + deltaY,
            minSize.height,
            maxHeight,
          ),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, minSize.height, minSize.width, position?.x, position?.y, size.height, size.width]);

  return {
    windowRef,
    position,
    size,
    isDragging,
    isResizing,
    onDragStart,
    onResizeStart,
  };
}
