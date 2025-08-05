import { useState, useCallback } from 'react';
import { StickyNote, Note } from '@/components/StickyNote';
import { AddNoteButton } from '@/components/AddNoteButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function getRandomPosition() {
  const padding = 50;
  const maxX = window.innerWidth - 200 - padding;
  const maxY = window.innerHeight - 200 - padding;
  
  return {
    x: Math.max(padding, Math.random() * maxX),
    y: Math.max(padding + 100, Math.random() * maxY), // +100 to avoid header
  };
}

const Index = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>('sticky-notes', []);

  const addNote = useCallback((color: 'yellow' | 'pink' | 'blue' | 'green' | 'orange') => {
    const newNote: Note = {
      id: generateId(),
      content: '',
      color,
      position: getRandomPosition(),
    };
    setNotes(prev => [...prev, newNote]);
  }, [setNotes]);

  const updateNote = useCallback((id: string, content: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, content } : note
    ));
  }, [setNotes]);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  }, [setNotes]);

  const updateNotePosition = useCallback((id: string, position: { x: number; y: number }) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, position } : note
    ));
  }, [setNotes]);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Cork board texture pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139, 69, 19, 0.4) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      />
      
      <AddNoteButton onAddNote={addNote} />
      
      {/* Welcome message when no notes */}
      {notes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4 text-foreground">Digital Sticky Notes</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Click a colored circle above to create your first note!
            </p>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Double-click notes to edit them</p>
              <p>• Drag notes around to organize</p>
              <p>• Click X to delete notes</p>
            </div>
          </div>
        </div>
      )}

      {/* Render all sticky notes */}
      {notes.map(note => (
        <StickyNote
          key={note.id}
          note={note}
          onUpdate={updateNote}
          onDelete={deleteNote}
          onPositionChange={updateNotePosition}
        />
      ))}
    </div>
  );
};

export default Index;