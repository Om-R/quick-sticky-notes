import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddNoteButtonProps {
  onAddNote: () => void;
}

const colors = ['yellow', 'pink', 'blue', 'green', 'orange'];

export const AddNoteButton = ({ onAddNote }: AddNoteButtonProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={onAddNote}
        size="lg"
        className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};

export { colors };