import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddNoteButtonProps {
  onAddNote: (color: 'yellow' | 'pink' | 'blue' | 'green' | 'orange') => void;
}

const colors = [
  { name: 'yellow', label: 'Yellow', bgClass: 'bg-note-yellow' },
  { name: 'pink', label: 'Pink', bgClass: 'bg-note-pink' },
  { name: 'blue', label: 'Blue', bgClass: 'bg-note-blue' },
  { name: 'green', label: 'Green', bgClass: 'bg-note-green' },
  { name: 'orange', label: 'Orange', bgClass: 'bg-note-orange' },
] as const;

export function AddNoteButton({ onAddNote }: AddNoteButtonProps) {
  return (
    <div className="fixed top-6 left-6 z-50">
      <div className="bg-card rounded-lg shadow-lg p-4 border">
        <h3 className="text-sm font-medium mb-3 text-foreground">Add New Note</h3>
        <div className="flex gap-2">
          {colors.map((color) => (
            <Button
              key={color.name}
              variant="ghost"
              size="sm"
              className={`w-10 h-10 p-0 rounded-full ${color.bgClass} hover:scale-110 transition-transform duration-200`}
              onClick={() => onAddNote(color.name)}
              title={`Add ${color.label} note`}
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}