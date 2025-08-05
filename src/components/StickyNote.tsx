import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Note {
  id: string;
  content: string;
  color: 'yellow' | 'pink' | 'blue' | 'green' | 'orange';
  position: { x: number; y: number };
}

interface StickyNoteProps {
  note: Note;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
}

const colorClasses = {
  yellow: 'bg-note-yellow text-note-yellow-foreground',
  pink: 'bg-note-pink text-note-pink-foreground', 
  blue: 'bg-note-blue text-note-blue-foreground',
  green: 'bg-note-green text-note-green-foreground',
  orange: 'bg-note-orange text-note-orange-foreground',
};

export function StickyNote({ note, onUpdate, onDelete, onPositionChange }: StickyNoteProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'TEXTAREA' || (e.target as HTMLElement).tagName === 'BUTTON') {
      return;
    }
    
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    };
    
    onPositionChange(note.id, newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Attach global mouse events when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(note.id, e.target.value);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`
        absolute w-48 h-48 p-4 rounded-md cursor-move select-none
        transition-all duration-200 ease-out
        ${colorClasses[note.color]}
        ${isDragging ? 'scale-105 z-50' : 'hover:scale-102 z-10'}
        shadow-[var(--shadow-note)] hover:shadow-[var(--shadow-note-hover)]
      `}
      style={{
        left: note.position.x,
        top: note.position.y,
        transform: isDragging ? 'rotate(-2deg)' : 'rotate(-1deg)',
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-1 right-1 w-6 h-6 p-0 hover:bg-black/10"
        onClick={() => onDelete(note.id)}
      >
        <X className="w-3 h-3" />
      </Button>
      
      {isEditing ? (
        <textarea
          value={note.content}
          onChange={handleContentChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full bg-transparent border-none outline-none resize-none text-sm placeholder:text-current/60 mt-4"
          placeholder="Type your note..."
          autoFocus
        />
      ) : (
        <div className="w-full h-full overflow-hidden text-sm mt-4 whitespace-pre-wrap break-words">
          {note.content || 'Double-click to edit...'}
        </div>
      )}
    </div>
  );
}