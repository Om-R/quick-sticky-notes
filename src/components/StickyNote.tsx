import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface StickyNoteProps {
  id: string;
  content: string;
  x: number;
  y: number;
  color: string;
  onUpdate: (id: string, content: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
}

const colorMap = {
  yellow: "bg-note-yellow border-note-yellow-border",
  pink: "bg-note-pink border-note-pink-border",
  blue: "bg-note-blue border-note-blue-border",
  green: "bg-note-green border-note-green-border",
  orange: "bg-note-orange border-note-orange-border",
};

export const StickyNote = ({ 
  id, 
  content, 
  x, 
  y, 
  color, 
  onUpdate, 
  onDelete 
}: StickyNoteProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const noteRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'TEXTAREA' || 
        (e.target as HTMLElement).tagName === 'BUTTON') {
      return;
    }
    
    setIsDragging(true);
    const rect = noteRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    onUpdate(id, text, newX, newY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(id, text, x, y);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
    if (e.key === 'Escape') {
      setText(content);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={noteRef}
      className={`absolute w-48 h-48 ${colorMap[color as keyof typeof colorMap]} 
                  border-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow
                  cursor-move select-none ${isDragging ? 'z-50' : 'z-10'}`}
      style={{ left: x, top: y }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <div className="relative w-full h-full p-3 flex flex-col">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-1 right-1 w-6 h-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => onDelete(id)}
        >
          <X className="w-3 h-3" />
        </Button>
        
        <div className="flex-1 mt-4">
          {isEditing ? (
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="w-full h-full resize-none border-none bg-transparent p-0 focus:ring-0 text-sm"
              placeholder="Type your note..."
              autoFocus
            />
          ) : (
            <div className="w-full h-full overflow-hidden">
              <p className="text-sm whitespace-pre-wrap break-words">
                {content || "Double-click to edit"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};