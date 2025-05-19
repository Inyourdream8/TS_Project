
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Note, StatusHistory } from "@/types/application";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface ApplicationNotesProps {
  applicationId: string;
  notes: Note[];
  onNoteAdded: () => void;
}

export const ApplicationNotes = ({ applicationId, notes, onNoteAdded }: ApplicationNotesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    setIsSubmitting(true);
    try {
      await api.addNoteToApplication(applicationId, newNote);
      setNewNote("");
      onNoteAdded();
      toast({
        title: "Note added",
        description: "Your note has been added to the application."
      });
    } catch (error) {
      console.error("Failed to add note:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add note. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Notes & Comments</h2>
      </div>

      <div>
        <Textarea 
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
          className="min-h-[100px] mb-2"
          disabled={isSubmitting}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleAddNote}
            disabled={!newNote.trim() || isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Note"}
          </Button>
        </div>
      </div>

      <div className="space-y-3 mt-6">
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <Card key={note.id} className="p-3">
              <div className="flex justify-between items-start">
                <div className="font-medium text-sm">{note.created_by}</div>
                <div className="text-xs text-gray-500">{formatDate(note.created_at)}</div>
              </div>
              <p className="mt-2 text-sm whitespace-pre-wrap">{note.content}</p>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No notes yet</p>
        )}
      </div>
    </div>
  );
};
