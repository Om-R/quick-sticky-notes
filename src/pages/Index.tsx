import { useState } from "react";
import { StickyNote } from "@/components/StickyNote";
import { AddNoteButton, colors } from "@/components/AddNoteButton";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface Note {
  id: string;
  content: string;
  x: number;
  y: number;
  color: string;
}

const Index = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>("sticky-notes", []);

  const addNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      content: "",
      x: Math.random() * (window.innerWidth - 200),
      y: Math.random() * (window.innerHeight - 200),
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (id: string, content: string, x: number, y: number) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, content, x, y } : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {notes.map((note) => (
        <StickyNote
          key={note.id}
          id={note.id}
          content={note.content}
          x={note.x}
          y={note.y}
          color={note.color}
          onUpdate={updateNote}
          onDelete={deleteNote}
        />
      ))}
      <AddNoteButton onAddNote={addNote} />
    </div>
  );
};

export default Index;
