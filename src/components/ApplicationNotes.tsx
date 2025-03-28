
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Note, StatusHistory } from "@/types/application";

interface ApplicationNotesProps {
  notes: Note[];
  statusHistory: StatusHistory[];
  onAddNote: (note: string) => Promise<void>;
}

const ApplicationNotes = ({ notes, statusHistory, onAddNote }: ApplicationNotesProps) => {
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newNote.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onAddNote(newNote);
      setNewNote("");
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Combine notes and status history and sort by date
  const combinedHistory = [
    ...notes.map(note => ({
      id: note.id,
      type: "note" as const,
      content: note.note,
      created_at: note.created_at,
      created_by: note.created_by,
    })),
    ...statusHistory.map(status => ({
      id: status.id,
      type: "status" as const,
      content: `Status changed to ${status.status}`,
      notes: status.notes,
      created_at: status.created_at,
      created_by: status.created_by,
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-4">Add Note</h3>
        <div className="space-y-4">
          <Textarea
            placeholder="Enter a note about this application..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[100px]"
            disabled={isSubmitting}
          />
          <Button 
            onClick={handleSubmit}
            disabled={!newNote.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding note...
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Note
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-4">History</h3>
        
        {combinedHistory.length === 0 ? (
          <div className="p-6 text-center text-gray-500 border rounded-md">
            No notes or status changes yet
          </div>
        ) : (
          <div className="space-y-4">
            {combinedHistory.map((item) => (
              <div 
                key={`${item.type}-${item.id}`} 
                className={`p-4 rounded-md border ${
                  item.type === "status" ? "bg-blue-50 border-blue-100" : "bg-white"
                }`}
              >
                <div className="flex items-start">
                  <div className={`mt-1 p-2 rounded-full mr-3 ${
                    item.type === "status" ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    {item.type === "status" ? (
                      <Calendar className="h-4 w-4 text-blue-600" />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {item.type === "status" ? "Status Update" : "Note"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(item.created_at)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {item.created_by || "System"}
                      </p>
                    </div>
                    <p className="mt-2">{item.content}</p>
                    {item.type === "status" && item.notes && (
                      <p className="mt-1 text-gray-600 text-sm italic">{item.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationNotes;
